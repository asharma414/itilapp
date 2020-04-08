import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';


class Login extends Component {
        state = {
          email: '',
          password: ''
        };

      componentDidMount() {
        this.props.clearErrors();
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push('/tickets');
        }
      }
      
      static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.auth.isAuthenticated) {
          nextProps.clearErrors();
          nextProps.history.push('/tickets'); // push user to dashboard when they login
        };
        return null;
      }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
      };
    onSubmit = e => {
        e.preventDefault();
    const userData = {
          email: this.state.email,
          password: this.state.password,
        };
        this.props.loginUser(userData);
      };

    render() {
        const { errors } = this.props;
        return (
            <div className='container mt-4'>
              <p className='text-center'>Don't have an account? <Link to='/register'>Register</Link></p>
              <div className='d-flex justify-content-center'>
                  <Form onSubmit={this.onSubmit}>
                  <Form.Group controlId='email'>
                      <Form.Label>Email address</Form.Label>
                      <span className='text-danger'>     {errors.email}{errors.emailnotfound}</span>
                      <Form.Control value={this.state.email} onChange={this.onChange} type='email' error={errors.email} autoComplete='email' placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <span className='text-danger'>     {errors.password}{errors.passwordincorrect}</span>
                      <Form.Control onChange={this.onChange} type='password' error={errors.password} autoComplete='current-password' placeholder="Password" />
                  </Form.Group>
                  <Button variant="primary" type="submit">Login</Button>
                  <span className='text-danger'>      {errors.activated}</span>
                </Form>
              </div>
          </div>
        )
    }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { clearErrors, loginUser }
)(Login);