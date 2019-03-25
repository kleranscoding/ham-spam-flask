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
    background: '#4b94c1',
    height: '100vh',
  },
};

class About extends Component {
  render() {
    return (
      <Card style={{width: '50%', margin: '0 auto', padding: 20}}>
        <CardContent>
          <Typography component="h3" variant="h5"> ABOUT </Typography>
          <p>
            One of the famous applications of Naive Bayes classiers is in spam filtering for e-mail.
          </p>
          <p>  
            Ham-Spam-Flask is a mini project that combines web development and machine learning model, specifically Naive Bayes Classifier.
            For this machine learning model, we assume each text occurrance is independent of each other. 
            Based on that we calculate the joint probability for each label SPAM and HAM.
          </p>
          <p>
            Using the <a href="https://archive.ics.uci.edu/ml/datasets/sms+spam+collection" target="_blank">
              SMS Spam Collection dataset</a> from <a href="https://archive.ics.uci.edu/ml/index.php" target="_blank">UCI Machine Learning Repository</a>, 
            we create a simple Naive Bayes Classifier as a Python object running on the Flask server.
          </p>
          <p>
            For more details, visit <a href="https://github.com/kleranscoding/ham-spam-flask" target="_blank"> here </a>
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
        <MainContent />
      </React.Fragment>
    );
  }
}

const Footer = () => {
  return (
    <div>
      2019 Ham-Spam-Flask
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
        <Footer />
      </div>
      
    );
  }
}

export default App;
