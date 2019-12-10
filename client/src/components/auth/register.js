import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../../actions/authActions';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';


class Register extends Component {
    constructor() {
        super();
        this.state = {
          name: '',
          email: '',
          password: '',
          password2: '',
          errors: {}
        };
      }

    componentDidMount() {
      // If logged in and user navigates to Register page, should redirect them to dashboard
      if (this.props.auth.isAuthenticated) {
        this.props.history.push('/tickets');
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.errors) {
        this.setState({
          errors: nextProps.errors
        });
      }
    }
  
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
      };
    onSubmit = e => {
        e.preventDefault();
        
        const newUser = {
              name: this.state.name,
              email: this.state.email,
              password: this.state.password,
              password2: this.state.password2
        };
            
        this.props.registerUser(newUser, this.props.history);
        };

    render() {
        const { errors } = this.state;
        return (
          <div className='container mt-4'>
            <p className='text-center'>Already have an account? <Link to='/login'>Login</Link></p>
            <div class='d-flex justify-content-center'>
              <Form onSubmit={this.onSubmit}>
              <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <span className='text-danger'>      {errors.name}</span>
                  <Form.Control value={this.state.name} onChange={this.onChange} type='text' error={errors.name} placeholder='Enter name' />
              </Form.Group>
              <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <span className='text-danger'>      {errors.email}</span>
                  <Form.Control value={this.state.email} onChange={this.onChange} type="email" error={errors.email} placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <span className='text-danger'>      {errors.password}</span>
                  <Form.Control value={this.state.password} onChange={this.onChange} type="password" error={errors.password} placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="password2">
                  <Form.Label>Confirm Password</Form.Label>
                  <span className='text-danger'>      {errors.password2}</span>
                  <Form.Control value={this.state.password2} onChange={this.onChange} type="password" error={errors.password2} placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit" onSubmit={this.onSubmit}>Register</Button>
              </Form>
            </div>
          </div>
        )
    }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));