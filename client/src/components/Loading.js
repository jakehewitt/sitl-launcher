import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import loading from "../assets/loading.svg";

const useStyles = makeStyles(theme => ({
  full: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.palette.background.default,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  component: props => ({
    display: 'flex',
    justifyContent: props.align || 'center',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.default
  })
}));

const Loading = (props) => {
  const classes = useStyles(props);
  const style = (props.variant && classes[props.variant]) ? classes[props.variant] : classes.full
  return (
    <div className={style}>
      <img src={loading} alt="Loading" />
    </div>
  )
};

export default Loading;
