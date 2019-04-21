import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core';

import store from '../store';
import { setCurrentUser } from  '../actions/auth';
import { backURL } from '../validation/constants';

const resultLabelFont = 'Luckiest Guy, cursive';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  resultLabel: {
    fontFamily: resultLabelFont
  },
});

function ascCompare(a,b) {
  const timeA = a.date_modified, timeB = b.date_modified;
  let comparison = 0;
  if (timeA > timeB) {
    comparison = 1;
  } else if (timeA < timeB) {
    comparison = -1;
  }
  return comparison;
}

function descCompare(a,b) {
  const timeA = a.date_modified, timeB = b.date_modified;
  let comparison = 0;
  if (timeA > timeB) {
    comparison = -1;
  } else if (timeA < timeB) {
    comparison = 1;
  }
  return comparison;
}

function setHeader() {
  const config = {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token",""),
      "Content-Type": "application/json",
    }
  };
  return config;
}

class Profile extends React.Component {

  state = {
    username: "",
    saved_texts: [],
    sortAsc: false,
  };

  onDeleteText = (textId) => {
    console.log(textId)

    const config = setHeader();

    axios.delete(backURL+'/api/text/'+textId,config)
    .then(res => {
      console.log(res.data)
      const deleteId = res.data.data._id, deleteText = res.data.data.text;
      let updatedTexts = this.state.saved_texts.filter(text=>{
        return text._id !== deleteId
      });
      this.setState({
        saved_texts: updatedTexts,
      });
    })
    .catch(err => {
      console.log(err.response);
    });

  }

  componentWillMount () {
    if (!localStorage.token) {
      console.log("no token! redirecting...")
      this.props.history.push("/");
      return;
    } 

    const config = setHeader();

    axios.get(backURL+'/api/users/profile',config)
    .then(res => {
      console.log(res.data)
      this.setState({
        username: res.data.data.username,
        saved_texts: res.data.data.saved_texts,
      });
    })
    .catch(err => {
      console.log(err.response);
    });
  }
  
  render() {
    
    const { classes } = this.props;

    //this.state.saved_texts.sort(descCompare);

    let saved_texts_list = this.state.saved_texts.map((text,index) => {
        return (
        <div key={index}>
          <Divider />
          <ListItem >
            <span
              style={{
                margin: 10, fontSize: 20, 
                color: text.label === 'HAM' ? '#96521e' : '#ff1100',
                fontFamily: resultLabelFont,
                textAlign: 'center',
            }}>
            {text.label}
            </span>
            
            <ListItemText style={{width: 400}}>
              <p>{text.text}</p>
              <p style={{fontSize: 10}}>saved at {text.date_modified}</p>
            </ListItemText>

            <Button onClick={()=>this.onDeleteText(text._id)}
              style={{color: '#ff0000', fontSize: 36}} >
              <DeleteIcon />
            </Button>
            
          </ListItem>
          
        </div>
        );
    });

    return (
      <List className={classes.root} style={{margin: '0 auto'}}>
          <Typography component="h1" variant="h3"
            style={{height: 50, backgroundColor: '#ffffff'}}>
            Hi, {this.state.username}!
          </Typography>
          <p> your saved texts : {this.state.saved_texts.length } </p>
          {saved_texts_list }
        </List>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Profile));