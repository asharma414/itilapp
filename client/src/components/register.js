import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions';
import { Button, Form } from 'react-bootstrap';
import classnames from 'classnames';


class Register extends Component {
    constructor() {
        super();
        this.state = {
          name: "",
          email: "",
          password: "",
          password2: "",
          errors: {}
        };
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
              password2: this.state.password
        };
            
        this.props.registerUser(newUser, this.props.history)
        };

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control value={this.state.name} onChange={this.onChange} type='text' placeholder='Enter name' />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control value={this.state.email} onChange={this.onChange} type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control value={this.state.password} onChange={this.onChange} type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="password2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control value={this.state.password2} onChange={this.onChange} type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )
    }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
) (withRouter(Register));