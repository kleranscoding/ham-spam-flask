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

const backURL = "http://localhost:8088";

const styles = theme => ({
  card: {
    maxWidth: 750,
    minHeight: 200,
  },
  media: {
    objectFit: 'cover',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class MainContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_text_input: "",
      result: "",
      img_type: "",
      resultModal: false,
      errors: {}
    }
  }

  handleTextChange = (e) => {
    this.setState({ 
      user_text_input: e.target.value, 
      errors: {} 
    });
  }

  handleModal = (openModal) => {
    this.setState({ resultModal: openModal });
  }

  saveText = () => {

  }

  submitText = () => {
    console.log(this.state.user_text_input)
    this.setState({
      result: "", img_type: "",
    });
    if (!this.state.user_text_input) {
      this.setState({errors: {"message": "text is empty"}});
      return;
    }
    this.setState({ 
      errors: {} 
    });
    axios.post(backURL+'/api/classify', 
    {text: this.state.user_text_input})
    .then(res => {
      let label = res.data.data.label;
      let img_src = 'http://localhost:3000/static';
      if (label === "SPAM") {
        img_src += '/assets/spam.png';
      } else if (label === "HAM") {
        img_src += '/assets/ham.png';
      }
      this.setState({
        result: label,
        img_type: img_src,
        resultModal: true, 
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
              Test your text is Spam or Ham!
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
          </CardContent>
          
          {errors.message && <Typography component="h6" variant="h6">{errors.message}</Typography>}
          
          <CardActions style={{justifyContent: "flex-end"}}>
            <Button size="small" color="primary" 
              style={{backgroundColor: '#dee9f9'}}
              onClick={this.submitText}>
              HAM or SPAM ?
            </Button>
          </CardActions>
        </Card>
        { this.state.img_type && this.state.result &&
        <Modal open={this.state.resultModal} onClose={()=>this.handleModal(false)}>
        <Card>
          <img className={classes.media}
              style={{
                width: 100, height: 100, 
                justifyContent: 'center', marginTop: 10,
              }}
              src={this.state.img_type} /> 
          <Typography component="h2" variant="h6">
                Your text is 
                <span 
                  style={{
                    marginLeft: 10, marginRight: 10, 
                    color: this.state.result === 'HAM' ? '#96521e' : '#ff1100', 
                    fontWeight: 700, fontSize: 32,
                }}>
                  {this.state.result}
                </span>
                !
              </Typography>
              {isAuth ? 
                <Button onClick={this.saveText} 
                  style={{
                    backgroundColor: '#dee9f9', marginBottom: 10,
                }}>
                  Save Result
                </Button> : 
                <Button disabled={true}>
                  Sign in to save result!
                </Button>
              }
        </Card>
        </Modal>}
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