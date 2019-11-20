import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Select, FormControl, MenuItem, TextField, Checkbox, Button, Paper} from '@material-ui/core';

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

const StartInstance = () => {
  const classes = useStyles();
  const [location, setLocation] = useState('');
  const [checked, setChecked] = useState(false);

  return (
    <Paper className={classes.root}>
      <div className={classes.row}>
        <Typography className={classes.label}>Label</Typography>
        <TextField
          className={classes.textField}
          id="label"
          label=""
          margin="normal"
        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Location</Typography>
        <FormControl className={classes.formControl}>
          <Select
            labelId="location-label"
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <Typography className={classes.or}>or</Typography>
        <TextField
          className={classes.textField}
          id="latitude"
          label="Latitude"
          margin="normal"
        />
        <TextField
          className={classes.textField}
          id="longitude"
          label="Longitude"
          margin="normal"
        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Speed up</Typography>
        <TextField
          className={classes.numField}
          id="speed"
          margin="normal"
          defaultValue="1"
          type="number"
          inputProps={{ min: "1", max: "10", step: "1" }}
        />
      </div>
      <div className={classes.row}>
        <Typography className={classes.label}>Use FOS</Typography>
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          value="checked"
        />
        <Typography className={classes.label}>(warning: this will replace & restart the current FOS instance)</Typography>
      </div>
      <div className={classes.row}>
        <Button variant="contained" color="primary" className={classes.button}>
          Start
        </Button>
      </div>
    </Paper>
  );
};

export default StartInstance;