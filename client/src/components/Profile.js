import React from 'react';
//import axios from 'axios';

class Profile extends React.Component {

  componentWillMount = () => {
    console.log("will mount")
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

export default Profile;