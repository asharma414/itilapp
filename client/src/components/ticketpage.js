import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTicket } from '../actions/ticketActions';
import { returnErrors } from '../actions/errorActions';
import PropTypes from 'prop-types';
import { Form, Button, Table } from 'react-bootstrap';


class TicketPage extends Component {
    state = {
        status: '',
        created: '',
        open: '',
        updated: '',
        title: '',
        description: '',
        customerName: '',
        customerContact: '',
        author: '',
        newStatus: '',
        newOpen: '',
        errors: {}
    }

    componentDidMount() {
         const { id } = this.props.match.params;
         //this.props.getTicket(id)
         axios
         .get(`/tickets/${id}`)
         .then(res => 
            this.setState({
                title: res.data.title,
                status: res.data.status,
                newStatus: res.data.status,
                open: (res.data.open === true) ? 'Open' : 'Closed',
                newOpen: (res.data.open === true) ? 'Open' : 'Closed',
                created: res.data.createdAt,
                updated: res.data.updatedAt,
                description: res.data.description,
                customerName: ((res.data || {}).customer || {}).name,
                customerContact: ((res.data || {}).customer || {}).contact,
                author: ((res.data || {}).author || {}).name
            })
         )
         .catch(err => 
            console.log(err)
        );
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const updatedTicket = {
            description: this.state.description,
            customer: {
                name: this.state.customerName,
                contact: this.state.customerContact
            },
            status: this.state.newStatus,
            open: (this.state.newOpen === 'Open') ? true : false
        }
        await this.props.updateTicket(id, updatedTicket);
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>Status</td>
                            <td>Open?</td>
                            <td>Author</td> 
                            <td>Created Date</td>
                            <td>Last Modified</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.title}</td>
                            <td>{this.state.status}</td>
                            <td>{(this.state.open === 'Open') ? 'Open' : 'Closed'}</td>
                            <td>{this.state.author}</td>
                            <td>{this.state.created.substring(0,19)}</td>
                            <td>{this.state.updated.substring(0,19)}</td>
                        </tr>
                    </tbody>
                </Table>
                <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as='textarea' value={this.state.description} onChange={this.onChange} placeholder="Enter ticket description" />
                </Form.Group>
                <Form.Group controlId='newStatus'>
                    <Form.Label>Status</Form.Label>
                    <Form.Control as='select' value={this.state.newStatus} onChange={this.onChange}>
                        <option>New</option>
                        <option>Awaiting Customer Feedback</option>
                        <option>In Progress</option>
                        <option>Cancelled</option>
                        <option>Resolved</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='newOpen'>
                    <Form.Label>State</Form.Label>
                    <Form.Control as='select' value={this.state.newOpen} onChange={this.onChange}>
                        <option>Open</option>
                        <option>Closed</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="customerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Enter Customer's Name" />
                </Form.Group>
                <Form.Group controlId="customerContact">
                    <Form.Label>Customer Contact</Form.Label>
                    <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Enter Customer's Contact Info" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>
        )
    }
}

TicketPage.propTypes = {
    updateTicket: PropTypes.func.isRequired
}

export default connect(null, { returnErrors, updateTicket })(TicketPage)