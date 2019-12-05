import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newTicket } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

class NewTicket extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            status: '',
            description: '',
            customerName: '',
            customerContact: ''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    onSubmit = async (e) => {
        const { user } = this.props.auth;
        e.preventDefault();
        if (this.state.title.length > 0 && this.state.description.length > 0){
            const newTicket = {
                title: this.state.title,
                description: this.state.description,
                status: this.state.status,
                customer: {
                    name: this.state.customerName,
                    contact: this.state.customerContact
                },
                author: {
                    id: user.id,
                    name: user.name
                }
            }
            await this.props.newTicket(newTicket);
            this.props.history.push('/tickets');
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
            <Form.Group controlId='title'>
                <Form.Label>Title</Form.Label>
                <Form.Control type='text' onChange={this.onChange} value={this.state.title} placeholder="Enter ticket title" />
            </Form.Group>
            <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' onChange={this.onChange} value={this.state.description} placeholder="Enter ticket description" />
            </Form.Group>
            <Form.Group controlId='status'>
                <Form.Label>Status</Form.Label>
                <Form.Control as='select' onChange={this.onChange}>
                    <option>New</option>
                    <option>Awaiting Customer Feedback</option>
                    <option>In Progress</option>
                    <option>Cancelled</option>
                    <option>Resolved</option>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId='customerName'>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Enter Customer's Name" />
            </Form.Group>
            <Form.Group controlId='customerContact'>
                <Form.Label>Customer Contact</Form.Label>
                <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Enter Customer's Contact Info" />
            </Form.Group>
            <Button variant='primary' type='submit'>
                Submit
            </Button>
            </Form>
        )
    }
}

NewTicket.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { newTicket })(NewTicket)