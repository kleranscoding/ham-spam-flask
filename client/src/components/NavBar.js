import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';

import { logoutUser } from '../actions/auth';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  brandButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    background: '#0036ff',
  },
};


class NavBar extends React.Component {
  
  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render () {
    const { classes } = this.props;
    const { isAuth } = this.props.auth;
    
    const loginLinks = (
      <Grid item>
        <Button color="inherit" component={Link} to="/profile">Profile</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" onClick={this.onLogout} >Logout</Button>
      </Grid>
    );

    const logoutLinks = (
      <Grid item>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/signin">Sign in</Button>
        <Button color="inherit" component={Link} to="/register">Register</Button>
      </Grid>
    );

    return (
      <div className={classes.root}>
      
        <AppBar position="static" style={styles.appBar}>
          <Toolbar>
            <Grid justify="space-between" container>
              {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton> */}
              <Grid item>
                <Button color="inherit" component={Link} to="/">
                <Typography variant="h5" color="inherit" >
                  {this.props.title}
                </Typography>
                </Button>
              </Grid>
              { isAuth ? loginLinks : logoutLinks }
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(withStyles(styles)(NavBar)));