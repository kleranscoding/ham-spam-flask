import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import store from '../store';
import { setCurrentUser } from  '../actions/auth';


class Profile extends React.Component {

  componentWillMount () {
    if (!localStorage.token) {
      console.log("no token! redirecting...")
      this.props.history.push("/");
    }
  }
  
  render() {
    
    console.log(localStorage);
    console.log("render")

    return (
      <div>
        Profile
      </div>
    );
  }
}

export default withRouter(Profile);