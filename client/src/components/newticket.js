import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap';

export default class NewTicket extends Component {
    state = {
        redirect: false,
        title: '',
        description: ''
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        const newTicket = {
            title: this.state.title,
            description: this.state.description
        }
        try{
            const response = await fetch('/tickets/create', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newTicket)});
            this.props.history.push('/tickets');
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={this.onChange} value={this.state.title} placeholder="Enter ticket title" />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' onChange={this.onChange} value={this.state.description} placeholder="Enter ticket description" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
        )
    }
}