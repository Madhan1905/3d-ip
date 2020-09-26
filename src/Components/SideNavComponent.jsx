import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import TimelineIcon from '@material-ui/icons/Timeline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import './Styles.css';
import { Link } from 'react-router-dom';
import AuthenticationService from '../Services/AuthenticationService';
import { logOutUser } from '../Services/FirebaseService';

const drawerWidth = '15vw';
const SideNavComponent = (props) => {
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <AppBar position="absolute" className={!open ? props.classes.appBar : props.classes.appBarShift}>
        <Toolbar className='toolbar'>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            style={open ? { display: 'none' } : { marginRight: 25 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className='title'>
            {props.title}
          </Typography>
          <Link to="/login">
            <ExitToAppIcon 
              onClick={() => {
                logOutUser(AuthenticationService.getUserId()).then(() => {
                  AuthenticationService.removeUserToken();
                })
              }} 
              style = {{color:"white"}}
            />
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{ paper: open ? props.classes.drawerPaper : props.classes.drawerPaperClose }}
        open={open}
      >
        <div className={props.classes.toolbarIcon}>
          <img
            className='logo-image'
            src={require('../Images/full-logo.png')}
            alt="loginImage"
            style={{ contain: "auto", width: '50%', height: "60%" }}
          />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <Link to='/dashboard' style={{ textDecoration: 'none', color: 'black' }}>
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            {(AuthenticationService.getUserId() === "arun@if.com" || AuthenticationService.getUserId() === "mg_vel@if.com") &&
              <Link to='/users' style={{ textDecoration: 'none', color: 'black' }}>
                <ListItem button>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
              </Link>}
            <Link to="/analytics" style={{ textDecoration: 'none', color: 'black' }}>
              <ListItem button>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>
            </Link>
          </div>
        </List>
      </Drawer>
    </>
  );
}

const Styles = theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: '100vh',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    position: 'relative',
    overflowX: 'hidden',
    height: '100vh',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    paddingLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  }
});

export default withStyles(Styles)(SideNavComponent);