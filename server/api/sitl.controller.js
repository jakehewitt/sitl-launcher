const fs = require('fs');
const { createInterface } = require('readline');
const { once } = require('events');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { format } = require('date-fns')
const { verify } = require('../config/auth')
const { isValidCoordinate } = require('../lib/isValidCoordinate')

const getAvailableIndex = (instances) => {
  let index = 0
  while(true){
    if (!instances.hasOwnProperty(++index)) return index
  }
}

exports.getInstances = async (req) => {
  const state = req.store.getState()
  return state.instances
}

exports.startInstance = async (req) => {
  const state = req.store.getState()

  const { label, speed, location, customLocation, fos } = req.body
  const index = fos ? 0 : getAvailableIndex(state.instances)
  const instance = {
    index,
    label: (label && label !== '') ? label : `sitl${index}`,
    location: (customLocation && isValidCoordinate(customLocation))
      ? `${customLocation.lat},${customLocation.lon}`
      : (location && location !== '') ? location : 'Airfield',
    speed: (Number.isInteger(speed) && speed >= 1 && speed <= 10) ? speed : 1,
    created: format(new Date(), 'd MMM yy HH:mm')
  }

  const locationString = (customLocation && isValidCoordinate(customLocation))
    ? `--custom-location=${instance.location},0,0`
    : `--location=${instance.location}`

  let sitlLaunchString=`pm2 start sim_vehicle.py --name=sitl${instance.index} --\
  --vehicle=ArduCopter \
  --use-dir=.sitl \
  --no-mavproxy \
  --no-extra-ports \
  --no-rebuild \
  --wipe-eeprom \
  --instance=${instance.index} \
  --speedup=${instance.speed} \
  ${locationString}`

  const { stderr } = await exec(sitlLaunchString);

  if (stderr){
    await exec(`pm2 delete sitl${instance.index}`)
    throw Error('Failed to start SITL instance')
  } else {
    await req.store.setState({
      instances: { [instance.index]: instance }
    })
    if (index === 0){
      //TODO: restart flight-stack
    }
    return `SITL instance ${instance.index} started`
  }
}

exports.stopInstance = async (req) => {
  const state = req.store.getState()

  const { index } = req.body
  if (!Number.isInteger(index)) throw Error('Instance index is required')

  const instance = state.instances[index]
  if (!instance) throw Error('Instance not found')

  let sitlStopString=`pm2 delete sitl${instance.index}`
  const { stdout, stderr } = await exec(sitlStopString);

  if (stderr){
    throw Error('Failed to delete SITL instance')
  } else {
    await req.store.setState({instances:{ [index]: null }})
    return `SITL instance ${instance.label} deleted`
  }
}

exports.restartInstance = async (req) => {
  const state = req.store.getState()

  const { index } = req.body
  if (!Number.isInteger(index)) throw Error('Instance index is required')

  const instance = state.instances[index]
  if (!instance) throw Error('Instance not found')

  let sitlStopString=`pm2 restart sitl${instance.index}`
  const { stdout, stderr } = await exec(sitlStopString);

  if (stderr){
    throw Error('Failed to restart SITL instance')
  } else {
    return `SITL instance ${instance.label} restarted`
  }
}

exports.loadLocations = async (req) => {
  const FILENAME = 'locations.txt'
  const locations = {}

  // Check if file exists
  try {
    await fs.promises.access(FILENAME);
  } catch (error) {
    throw error
  }

  // Read file line-by-line
  const fileStream = fs.createReadStream(FILENAME)
  const rl = createInterface({ input: fileStream });

  rl.on('line', (line) => {
    if (line.includes('#')) return;
    const [index, lat, lon, alt, heading] = line.split(/[=,]+/)
    locations[index] = {lat, lon, alt, heading}
  });
  await once(rl, 'close');

  return locations
}