import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import store from './store';
import { setCurrentUser } from './actions/auth';


const styles = {
  'app-main': {
    background: '#eeeeee',
    height: '75vh',
  },
};

class About extends Component {
  render() {
    return (
      <div> About </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div> Home </div>
    );
  }
}

if (localStorage.getItem('token')) {
  store.dispatch(setCurrentUser(localStorage.getItem('token')));
}

class App extends Component {

  render() {

    return (
      <div className="App" style={styles['app-main']}>
        <header>
          <NavBar title={"Ham-Spam-Flask"}/>
        </header>
        
        <div className="main">
          <Switch>
            <Route path="/profile" component={ Profile } />
            <Route path="/about" component={ About } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/register" component={ SignUp } />
            <Route exact path="/signin" component={ SignIn } />
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
