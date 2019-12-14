import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newTicket } from '../actions/ticketActions';
import { findUser } from '../actions/userActions';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';

class NewTicket extends Component {
    state = {
        title: '',
        status: 'New',
        description: '',
        customerName: '',
        customerContact: '',
        assignedTo: '',
        errors: {}
    }

    componentDidMount() {
        this.props.findUser();
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    ticketSubmit = async (e) => {
        e.preventDefault();
        const { users } = this.props.user;
        //convert user list into array and verify if typed value exists
        let userArr = users.map(user => user.name);
        if (userArr.includes(this.state.assignedTo)){
            //get index of assignedTo in userArr and use to find User ID
            let assignedToIndex = userArr.indexOf(this.state.assignedTo)
            const { user } = this.props.auth;
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
                    },
                    assignedTo: {
                        id: users[assignedToIndex]._id,
                        name: this.state.assignedTo
                    }
                }
                await this.props.newTicket(newTicket);
                this.props.history.push('/tickets');
            }
        } else {
            alert('Invalid assigned to user')
        }
    }

    render() {
        const { users } = this.props.user;
        return (
            <div>
                <datalist id='datalist1'>
                {
                    users.map(user => (
                        <option key={user._id} value={user.name}></option>
                ))}
                </datalist>
                <Form className='my-4' onSubmit={this.ticketSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type='text' onChange={this.onChange} value={this.state.title} required placeholder="Ticket Title" />
                    </Form.Group>
                    <Form.Group controlId="assignedTo">
                        <Form.Label>Assigned To</Form.Label>
                        <Form.Control  list='datalist1' type='text' value={this.state.assignedTo} onChange={this.onChange} required placeholder='Assign ticket to user' />
                    </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="customerName">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Customer's Name" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="customerContact">
                            <Form.Label>Customer Contact</Form.Label>
                            <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Customer's Contact Info" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='status'>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as='select' value={this.state.newStatus} onChange={this.onChange}>
                                <option>New</option>
                                <option>Awaiting Customer Feedback</option>
                                <option>In Progress</option>
                                <option>Cancelled</option>
                                <option>Resolved</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as='textarea' value={this.state.description} onChange={this.onChange} required placeholder="Ticket description" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
        )
    }
}

NewTicket.propTypes = {
    auth: PropTypes.object.isRequired,
    newTicket: PropTypes.func.isRequired,
    findUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.user
});

export default connect(mapStateToProps, { newTicket, findUser })(NewTicket)