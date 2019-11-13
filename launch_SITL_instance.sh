#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -I|--instance)
    INSTANCE="$2"
    shift # past argument
    shift # past value
    ;;
    -s|--speed)
    SPEED="$2"
    shift # past argument
    shift # past value
    ;;
    -l|--location)
    LOCATION="$2"
    shift # past argument
    shift # past value
    ;;
    -L|--custom-location)
    CUSTOM_LOCATION="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

echo $INSTANCE
if [ -z ${INSTANCE+x} ]; then echo "Instance number required"; exit 0; fi

if [ -z ${SPEED+x} ]; then SPEED=1; fi

if [ ! -z ${CUSTOM_LOCATION+x} ]; then LOCAITON_STRING="--custom-location=${CUSTOM_LOCATION}"; 
elif [ ! -z ${LOCATION+x} ]; then LOCAITON_STRING="--location=${LOCATION}"; 
else LOCAITON_STRING=""
fi

SITL_LAUNCH_STRING="pm2 start sim_vehicle.py --name=sitl${INSTANCE} --\
  --vehicle=ArduCopter \
  --use-dir=.sitl \
  --no-mavproxy \
  --no-extra-ports \
  --no-rebuild \
  --wipe-eeprom \
  --instance=${INSTANCE} \
  --speedup=${SPEED} \
  ${LOCAITON_STRING}"

let MASTER_PORT=$((5760+$INSTANCE*10))

MAVPROXY_LAUNCH_STRING="pm2 start mavproxy.py --name mavproxy${INSTANCE} --\
	--master=tcp:0.0.0.0:${MASTER_PORT} \
	--out=tcpin:0.0.0.0:$((MASTER_PORT+4)) \
  --out=tcpin:0.0.0.0:$((MASTER_PORT+5)) \
  --out=tcpin:0.0.0.0:$((MASTER_PORT+6)) \
  --out=udpin:0.0.0.0:$((MASTER_PORT+7)) \
  --out=udpin:0.0.0.0:$((MASTER_PORT+8)) \
  --out=udpin:0.0.0.0:$((MASTER_PORT+9)) \
	--daemon"

exec $SITL_LAUNCH_STRING &
nc -z 0.0.0.0 5780


#sleep 2
#exec $MAVPROXY_LAUNCH_STRING &