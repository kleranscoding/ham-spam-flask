import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';

import './styles/App.css';
import NavBar from './components/NavBar';
import About from './components/About';
import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import store from './store';
import { setCurrentUser } from './actions/auth';
import ClassifyContainer from './components/ClassifyContainer';

const styles = {
  'app-main': {
    // background: 'white',
    // minHeight: '75vh',
    // paddingBottom: 40,
    // paddingTop: 40,
    margin: '50px 10px',
  },
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    // background: '#1566ed',
    background: '#191946',
    padding: '10px 0',
    color: 'white'
  },
  brandLogo: {
    fontFamily: 'Luckiest Guy, cursive'
  },
};

const brandTitle = <><span style={styles.brandLogo}>HAM-SPAM</span>-<span>FLASK</span></>

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <About />
      </React.Fragment>
    );
  }
}

const Footer = () => {
  return (
    <div style={styles.footer}>
      {brandTitle}
    </div>
  );
}

if (localStorage.getItem('token')) {
  store.dispatch(setCurrentUser(localStorage.getItem('token')));
}

class App extends Component {

  state = {
    modalSignin: false,
    modalRegister: false,
  }

  render() {

    return (
      <div className="App">
        <header>
          <NavBar title={brandTitle}/>
        </header>
        
        <div className="main" style={styles['app-main']}>
          <Switch>
            <Route path="/profile" component={ Profile } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/classify" component={ ClassifyContainer } />
            <Route exact path="/register" component={ SignUp } />
            <Route exact path="/signin" component={ SignIn } />
            <Redirect to="/" />
          </Switch>
        </div>

        <Modal open={this.state.modalSignin} >

        </Modal>

        <Footer />
      </div>
      
    );
  }
}

export default App;
