import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Select, FormControl, MenuItem, TextField, Checkbox, Button, Paper} from '@material-ui/core';
import {useAuth0} from "../utils/react-auth0-spa";
import {useMessage} from "../utils/message";
import {useLocationList, useApi} from "../utils/hooks";
import Loading from "./Loading";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 16,
    marginBottom: 32,
    padding: 16,
    width: '100%',
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    minHeight: 64,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  label: {
    minWidth: 100,
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  numField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 50
  },
  or: {
    margin: theme.spacing(1)
  }
}));

const StartInstance = (props) => {
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();
  const message = useMessage()
  const {locationList} = useLocationList()
  const {fetchData} = useApi()
  const {setInstanceList} = props.instances


  const [state, setState] = useState({
    label: '',
    location: '',
    customLocation: { lat: '', lon: ''},
    fos: false,
    speed: 1
  })

  const handleSubmit = async (form) => {
    try {
      message.info("Starting Instance")
      const token = await getTokenSilently();
      const response = await fetch('/api/sitl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      })
      const {error, data} = await response.json();
      if (error) message.error(error)
      else message.success(data)
      const refresh = await fetchData('/api/sitl')
      setInstanceList(refresh)
    } catch (error) {
      console.error(error)
      message.error('Server error')
    }
  }

  if (!locationList) return <Loading variant='component'/>

  return (
    <Paper className={classes.root}>
      <div className={classes.row}>
        <Typography className={classes.label}>Label</Typography>
        <TextField
          className={classes.textField}
          id="label"
          label=""
          margin="normal"
          onChange={(event) => setState({...state, label: event.target.value})}
        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Location</Typography>
        <FormControl className={classes.formControl}>
          <Select
            labelId="location-label"
            id="location"
            value={state.location}
            onChange={(event) => setState({...state, location: event.target.value})}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {Object.keys(locationList).map(location => (
              <MenuItem key={location} value={location}>{location}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography className={classes.or}>or</Typography>
        <TextField
          className={classes.textField}
          id="latitude"
          label="Latitude"
          margin="normal"
          value={state.customLocation.lat}
          onChange={(event) => setState({
            ...state,
            customLocation: {
              ...state.customLocation,
              lat: event.target.value
            }
          })}
        />
        <TextField
          className={classes.textField}
          id="longitude"
          label="Longitude"
          margin="normal"
          value={state.customLocation.lon}
          onChange={(event) => setState({
            ...state,
            customLocation: {
              ...state.customLocation,
              lon: event.target.value
            }
          })}        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Speed up</Typography>
        <TextField
          className={classes.numField}
          id="speed"
          margin="normal"
          type="number"
          inputProps={{ min: "1", max: "10", step: "1" }}
          value={state.speed}
          onChange={(event) => setState({...state, speed: event.target.value})}
        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Use FOS</Typography>
        <Checkbox
          checked={state.fos}
          onChange={(event) => setState({...state, fos: event.target.checked})}
          value="checked"
        />
        <Typography className={classes.label}>(warning: this will replace & restart the current FOS instance)</Typography>
      </div>
      <div className={classes.row}>
        <Button variant="contained" color="primary" className={classes.button} onClick={() => handleSubmit(state)}>
          Start
        </Button>
      </div>
    </Paper>
  );
};

export default StartInstance;