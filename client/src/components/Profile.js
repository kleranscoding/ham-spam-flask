import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import store from '../store';
import { setCurrentUser } from  '../actions/auth';

const backURL = 'http://localhost:8088'
class Profile extends React.Component {

  state = {
    username: "",
    saved_texts: [],
  };

  componentWillMount () {
    if (!localStorage.token) {
      console.log("no token! redirecting...")
      this.props.history.push("/");
      return;
    } 

    const config = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token",""),
        "Content-Type": "application/json",
      }
    };

    axios.get(backURL+'/api/users/profile',{},config)
    .then(res => {
      console.log(res.data)

    })
    .catch(err => {
      console.log(err.response);
    });
  }
  
  render() {
    
    return (
      <div>
        Profile
      </div>
    );
  }
}

export default withRouter(Profile);