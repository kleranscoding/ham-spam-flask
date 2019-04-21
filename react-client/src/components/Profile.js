import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core';

import { fetchTexts, deleteText } from '../actions/texts';

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

function ascTimeComparator(a,b) {
  const timeA = a.date_modified, timeB = b.date_modified;
  let comparison = 0;
  if (timeA > timeB) {
    comparison = 1;
  } else if (timeA < timeB) {
    comparison = -1;
  }
  return comparison;
}

function descTimeComparator(a,b) {
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
    sortAsc: true,
    anchorEl: null,
  };

  onDeleteText = (textId) => {

    const config = setHeader();

    this.props.deleteText(textId, config);
    

  }

  sortTextByTime = (isAsc, saved_texts) => {
    if (isAsc) {
      if (!this.state.sortAsc) {
        saved_texts.sort(ascTimeComparator);
        this.setState({ 
          sortAsc: true });
      }
    } else {
      if (this.state.sortAsc) {
        saved_texts.sort(descTimeComparator);
        this.setState({ 
          sortAsc: false });
      }
      
    }
    this.handleClose();
  } 


  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  componentWillMount () {
    if (!localStorage.token) {
      this.props.history.push("/");
      return;
    } 

    const config = setHeader();

    this.props.fetchTexts(config);
    
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  
  render() {
    
    const { classes } = this.props;
    const { saved_texts, username } = this.props.profile;
    
    let saved_texts_list = saved_texts.map((text,index) => {
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
            Hi, {username}!
          </Typography>
          <p> your saved texts : {saved_texts.length } </p>
          
          <div className="profile menu">
            <Button component={Link} to="/classify"
              style={{backgroundColor: 'rgb(21, 102, 237)', color: 'white', margin: '10px'}}
            >
              Classify Text
            </Button>

            <Button onClick={this.handleClick}
              style={{backgroundColor: 'rgb(21, 102, 237)', color: 'white', margin: '10px'}}
              aria-owns={this.state.anchorEl ? 'sort-menu' : undefined}
              aria-haspopup="true" 
            >
              Sort Results by
            </Button>

            <Menu open={Boolean(this.state.anchorEl)} onClose={this.handleClose}
              id="sort-menu" anchorEl={this.state.anchorEl}
            >
              <MenuItem disabled style={{backgroundColor: 'white', color: 'rgb(21, 102, 237)'}}>
                Sort Results by 
              </MenuItem>
              <MenuItem 
                onClick={()=>this.sortTextByTime(true, saved_texts)}
              >
                Time (Ascending)
              </MenuItem>
              <MenuItem 
                onClick={()=>this.sortTextByTime(false, saved_texts)}
              >
                Time (Descending)
              </MenuItem>
            </Menu>
          </div>

          {saved_texts_list }
        </List>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchTexts: PropTypes.func.isRequired,
  deleteText: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  profile: state.profile,
});

export default withRouter(connect(mapStateToProps, { fetchTexts, deleteText })(withStyles(styles)(Profile)));