import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { loginUser } from '../../actions/auth';

class SignIn extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '', 
      errors: {}
    };
  }

  componentWillMount () {
    if (localStorage.getItem('token')) {
      this.props.history.push('/');
    }
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    console.log(user);
    this.props.loginUser(user, this.props.history);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  render() {
    
    const { errors } = this.state;

    return(
      <div className="container" style={{ marginTop: '50px', width: '700px'}}>
          <h2 style={{marginBottom: '40px'}}>Sign in here!</h2>
          <form onSubmit={ this.handleSubmit }>
              <div className="form-group">
                  <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  name="email"
                  onChange={ this.handleInputChange }
                  value={ this.state.email }
                  />
              </div>
              <div className="form-group">
                  <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  name="password"
                  onChange={ this.handleInputChange }
                  value={ this.state.password }
                  />
              </div>

              { errors.message && (<div>{ errors.message }</div>)}

              <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                      Sign in
                  </button>
              </div>
          </form>
      </div>
    );
  }
}

SignIn.propTypes = {
  loginUser: PropTypes.func.isRequired,
};
  
const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(withRouter(SignIn));