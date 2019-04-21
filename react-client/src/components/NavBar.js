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
  brandLogo: {
    fontFamily: 'Luckiest Guy, cursive'
  },
  appBar: {
    // background: '#1566ed',
    background: '#191946',
  },
  navBarButton: {
    fontFamily: 'Alegreya Sans, sans-serif'
  }
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
        <Button style={styles.navBarButton} color="inherit" component={Link} to="/profile">Profile</Button>
        <Button style={styles.navBarButton} color="inherit" component={Link} to="/classify">Classify</Button>
        <Button style={styles.navBarButton} color="inherit" onClick={this.onLogout} >Logout</Button>
      </Grid>
    );

    const logoutLinks = (
      <Grid item>
        <Button style={styles.navBarButton} color="inherit" component={Link} to="/classify">Classify</Button>
        <Button style={styles.navBarButton} color="inherit" component={Link} to="/signin">Sign in</Button>
        <Button style={styles.navBarButton} color="inherit" component={Link} to="/register">Register</Button>
      </Grid>
    );

    return (
      <div className={classes.root}>
      
        <AppBar position="static" style={styles.appBar}>
          <Toolbar>
            <Grid justify="space-between" container>
              <Grid item>
                <Button color="inherit" component={Link} to="/">
                <Typography variant="h5" color="inherit" 
                // style={styles.brandLogo}
                >
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