import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';

import './styles/App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import store from './store';
import { setCurrentUser } from './actions/auth';
import MainContent from './components/MainContent';


const styles = {
  'app-main': {
    background: '#5d769b',
    height: '600px',
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
      <React.Fragment>
        <MainContent />
      </React.Fragment>
    );
  }
}

if (localStorage.getItem('token')) {
  store.dispatch(setCurrentUser(localStorage.getItem('token')));
}

class App extends Component {

  state = {
    modalSignin: false,
    modalRegister: false,
  }

  toggle = (modalName) => {

   }

  render() {

    return (
      <div className="App">
        <header>
          <NavBar title={"Ham-Spam-Flask"}/>
        </header>
        
        <div className="main" style={styles['app-main']}>
          <Switch>
            <Route path="/profile" component={ Profile } />
            <Route path="/about" component={ About } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/register" component={ SignUp } />
            <Route exact path="/signin" component={ SignIn } />
          </Switch>
        </div>

        <Modal open={this.state.modalSignin} >

        </Modal>

      </div>
    );
  }
}

export default App;
