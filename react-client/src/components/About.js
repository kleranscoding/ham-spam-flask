import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


export default class About extends Component {
  render() {
    return (
      <>
      <Card style={{width: '80%', margin: '10px auto', padding: 10}}>
        <CardContent>
          <Typography component="h3" variant="h5"> ABOUT </Typography>
          <p>
            Spam messages are annoying and filtering them is even more annoying.
          </p>
          <p>
            Ham-Spam-Flask is a light-weighted demo application that combines web development and Naive Bayes Classifier to classify SMS text as "HAM" or "SPAM".
            Trained with the <a href="https://archive.ics.uci.edu/ml/datasets/sms+spam+collection" target="_blank" rel="noopener noreferrer">
              SMS Spam Collection dataset</a>, 
            the machine learning model is created as a Python object and runs on the Flask server.
          </p>

          <Button style={{backgroundColor: 'rgb(21, 102, 237)'}}
            component={Link} to="/classify">
            <Typography style={{color: 'white', padding: '10px'}}
              component="h4" variant="h5">
              Get started
            </Typography>
          </Button>

          <p>
            For more details, visit <a href="https://github.com/kleranscoding/ham-spam-flask" target="_blank" rel="noopener noreferrer"> here </a>
          </p>
         </CardContent>
       </Card>
      </>
    );
  }
}
