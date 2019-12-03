import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newTicket } from '../actions/ticketActions';
import { Form, Button } from 'react-bootstrap';

class NewTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            title: '',
            description: ''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.title.length > 0 && this.state.description.length > 0){
            const newTicket = {
                title: this.state.title,
                description: this.state.description
            }
            await this.props.newTicket(newTicket);
            this.props.history.push('/tickets');
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

export default connect(null, { newTicket })(NewTicket)