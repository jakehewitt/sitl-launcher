import React from "react";
import { useAuth0 } from "../utils/react-auth0-spa";

import { makeStyles } from '@material-ui/core/styles';
import {Container, Toolbar, Button, MenuItem, Menu, Avatar} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: "flex-end",
  },
  avatar: {
    margin: 10,
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose()
    logout()
  }

  return (
    <>
      <Container>
        <Toolbar className={classes.root}>
          {!isAuthenticated && <Button color="inherit" onClick={() => loginWithRedirect({})}>Log in</Button>}
          {isAuthenticated && (
            <div>
              <Avatar
                alt={user.name}
                src={user.picture}
                className={classes.avatar}
                onClick={handleMenu}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"/>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right',}}
                open={open}
                onClose={handleClose}
              >
                {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Container>
    </>
  );
};

export default NavBar;