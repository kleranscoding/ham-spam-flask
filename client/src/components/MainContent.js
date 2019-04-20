import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import spam from '../assets/spam.png';
import ham from '../assets/ham.png';

const backURL = "http://localhost:8088";

const resultLabelFont = 'Luckiest Guy, cursive';

const styles = theme => ({
  card: {
    maxWidth: 750,
    minHeight: '50vh',
    margin: '20px 10px',
  },
  media: {
    objectFit: 'cover',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  resultLabel: {
    fontFamily: resultLabelFont
  },
});

class MainContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_text_input: "",
      result: "",
      img_type: "",
      didModify: false,
      canSubmit: false,
      save_message: "",
      errors: {}
    }
  }

  handleTextChange = (e) => {
    this.setState({ 
      user_text_input: e.target.value,
      didModify: true,
      canSubmit: e.target.value !== "",
      errors: {} 
    });
  }

  saveText = () => {
    const body = {
      text: this.state.user_text_input,
      label: this.state.result,
    };
    const config = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token",""),
        "Content-Type": "application/json",
      }
    };

    axios.post(backURL+'/api/text/new', body, config)
    .then(res => {
      console.log(res.data)
      this.setState({
        didModify: true,
        save_message: res.data.message,
      });
    })
    .catch(err => {
      console.log(err.response)
    });
  }

  submitText = () => {
    
    this.setState({
      result: "", img_type: "", didModify: false, save_message: "",
    });

    if (!this.state.user_text_input) {
      this.setState({errors: {"message": "text is empty"}});
      return;
    }
    this.setState({ errors: {} });

    axios.post(backURL+'/api/classify', {text: this.state.user_text_input})
    .then(res => {
      let label = res.data.data.label;
      let img_src = "";
      if (label === "SPAM") {
        img_src = spam;
      } else if (label === "HAM") {
        img_src = ham;
      }
      this.setState({
        result: label, img_type: img_src, 
      })
    })
    .catch(err => {
      console.log(err.response)
    });
  }


  render() {

    const { classes } = this.props;
    const { errors } = this.state;
    const { isAuth } = this.props.auth;
    
    return (
      <div style={{width: '50%', margin: '0 auto'}}>
        <Card className={classes.card} >

          <CardContent >
            <Typography gutterBottom component="h3" variant="h5" >
              Check your text message is Spam or Ham!
            </Typography>
            
            <TextField
              id="user_input_text"
              onChange={this.handleTextChange}
              label="Your text goes here"
              className={classes.textField}
              fullWidth multiline={true} rows={4} cols={6}
              rowsMax={8} margin="normal" variant="outlined"
              required
            />

            <Typography component="p">
              e.g. Congratulations ur awarded $500 &rArr; 
              <span
                style={{
                  margin: 10, color: '#ff0000', fontSize: 20, 
                  fontFamily: resultLabelFont,
              }}>
                SPAM
              </span>
            </Typography>

          </CardContent>
          
          {errors.message && 
            <Typography component="h6" variant="h6">
              {errors.message}
            </Typography>
          }
          
          <CardActions style={{justifyContent: "flex-end"}}>
            <Button size="small" color="primary" 
              style={{
                fontSize: 18,
                backgroundColor: !this.state.canSubmit ? '#dee9f9' : '#3e6ab2', 
                color: !this.state.canSubmit ? '#8f939b' : '#ffffff',
                fontFamily: 'Alegreya Sans, sans-serif'}}
              onClick={this.submitText}
              disabled={!this.state.canSubmit}>
              HAM or SPAM ?
            </Button>
          </CardActions>
        </Card>

        { this.state.img_type && this.state.result &&
        <Card style={{marginTop: 25}}>
          <img className={classes.media}
              style={{
                width: 100, height: 100, 
                justifyContent: 'center', marginTop: 10,
              }}
              src={this.state.img_type} alt={this.state.img_type.toLowerCase()}/> 
          <Typography component="h2" variant="h6">
                Your text is 
                <span 
                  style={{
                    marginLeft: 10, marginRight: 10, 
                    color: this.state.result === 'HAM' ? '#96521e' : '#ff1100', 
                    fontWeight: 700, fontSize: 32,
                    fontFamily: resultLabelFont,
                }}>
                  {this.state.result}
                </span>
                !
              </Typography>
              {isAuth ? 
                <Button onClick={this.saveText} disabled={this.state.didModify}
                  style={{
                    backgroundColor: '#dee9f9', marginBottom: 10,
                }}>
                  Save Result
                </Button> : 
                <Button disabled={true}>
                  Sign in to save result!
                </Button>
              }
              { this.state.save_message && 
                <Typography component="h4" variant="h6">
                  { this.state.save_message }
                </Typography>
              }
        </Card>}
      </div>
    );
  }
}

MainContent.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(MainContent));