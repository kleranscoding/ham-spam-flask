import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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
    background: 'white',
    //height: '100vh',
    paddingBottom: 40,
    paddingTop: 40,
  },
};

class About extends Component {
  render() {
    return (
      <Card style={{width: '50%', margin: '0 auto', padding: 20}}>
        <CardContent>
          <Typography component="h3" variant="h5"> ABOUT </Typography>
          <p>
            Spam messages are annoying and filtering them is even more annoying.
          </p>
          <p>
            Ham-Spam-Flask is a light-weighted demo application that combines web development and Naive Bayes Classifier to classify SMS text as "HAM" or "SPAM".
            Using the <a href="https://archive.ics.uci.edu/ml/datasets/sms+spam+collection" target="_blank" rel="noopener noreferrer">
              SMS Spam Collection dataset</a> from <a href="https://archive.ics.uci.edu/ml/index.php" target="_blank" rel="noopener noreferrer">UCI Machine Learning Repository</a>, 
            a simple Naive Bayes Classifier is created as a Python object running on the Flask server.
          </p>
          <p>
            For more details, visit <a href="https://github.com/kleranscoding/ham-spam-flask" target="_blank" rel="noopener noreferrer"> here </a>
          </p>
        </CardContent>
      </Card>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <About />
      </React.Fragment>
    );
  }
}

class ClassifyContainer extends Component {
  render() {
    return (
      <React.Fragment>
        <MainContent />
      </React.Fragment>
    );
  }
}

const Footer = () => {
  return (
    <div>
      Powered by React
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
          <NavBar title={"Ham-Spam-Flask"}/>
        </header>
        
        <div className="main" style={styles['app-main']}>
          <Switch>
            <Route path="/profile" component={ Profile } />
            <Route path="/about" component={ About } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/classify" component={ ClassifyContainer } />
            <Route exact path="/register" component={ SignUp } />
            <Route exact path="/signin" component={ SignIn } />
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
