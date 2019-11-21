import React, { useState, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from '@material-ui/core/IconButton';
import { amber, green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

export const MessageContext = React.createContext();
export const useMessage = () => useContext(MessageContext);

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
  success: {
    margin: theme.spacing(1),
    backgroundColor: green[600],
  },
  error: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    margin: theme.spacing(1),
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  text: {
    marginTop: 3
  },
}));

export const MessageProvider = ({children}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    open: false,
    variant: 'error',
    message: null,
    duration: 3000
  });
  const { open, variant, message, duration } = state;
  let Icon = variantIcon[variant];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setState({ ...state, open: false, message: null });
  };

  const setMessage = variant => (message = '', duration = 3000) => {
    if (open) setState({ ...state, open: false });
    setState({ ...state, open: true, variant, message, duration})
  }

  const success = setMessage('success')
  const warning = setMessage('warning')
  const error = setMessage('error')
  const info = setMessage('info')

  return (
    <MessageContext.Provider value={{
      success,
      warning,
      error,
      info
    }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
      >
        <SnackbarContent
          className={classes[variant]}
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classes.iconVariant} />
              <span className={classes.text}>{message}</span>
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        />
      </Snackbar>
      {children}
    </MessageContext.Provider>
  );
}
