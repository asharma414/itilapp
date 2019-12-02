import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';


export default class Login extends Component {
    constructor() {
        super();
        this.state = {
          email: "",
          password: "",
          errors: {}
        };
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
    console.log(newUser);
      };

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control value={this.state.email} onChange={this.onChange} type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control value={this.state.password} onChange={this.onChange} type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )
    }
}
