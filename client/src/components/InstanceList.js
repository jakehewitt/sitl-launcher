import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import useInstanceList from "../hooks/useInstanceList";
import Loading from "./Loading";

const BASE = 5760
const calculatePorts = index => ([BASE+index*10, BASE+index*10+2, BASE+index*10+3])
const portsToString = ports => JSON.stringify(ports, null, 1).replace(/\[|\]/gi, "")

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 16,
    marginBottom: 32,
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  button: {
    marginRight: theme.spacing(1)
  },
}));

export default function SimpleTable(){
  const classes = useStyles();
  const instanceList = useInstanceList()
  console.log(instanceList)

  if (instanceList === null) return <Loading variant='component'/>

  const instances = []
  for (const [, value] of Object.entries(instanceList)) {
    instances.push(value)
  }

  console.log(instances)

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Speed</TableCell>
            <TableCell>Ports</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instances.map(instance => (
            <TableRow key={instance.index}>
              <TableCell>{instance.index}</TableCell>
              <TableCell>{instance.label}</TableCell>
              <TableCell>{instance.location}</TableCell>
              <TableCell>{instance.speed}</TableCell>
              <TableCell>{portsToString(calculatePorts(instance.index))}</TableCell>
              <TableCell>{instance.created}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" className={classes.button}>Restart</Button>
                <Button variant="contained" color="secondary" className={classes.button}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}