import React from "react";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const palettes = {
  default: {
    type: 'dark'
  },
  material: {
    type: 'dark',
    primary: {main: "#BB86FC"},
    secondary: {main: "#03DAC6"},
    error: {main: "#CF6679"},
  },
  mui: {
    type: 'dark',
    primary: {main: "#90caf9"},
    secondary: {main: "#f48fb1"},
  }
}

const theme = createMuiTheme({
  palette: palettes.mui
});

const ThemeWrapper = (props) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
)

export default ThemeWrapper;

