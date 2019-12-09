import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newTicket } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';

class NewTicket extends Component {
    state = {
        title: '',
        status: 'New',
        description: '',
        customerName: '',
        customerContact: ''
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    ticketSubmit = async (e) => {
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
            <Form className='my-4' onSubmit={this.ticketSubmit}>
            <Row>
                <Col>
                    <Form.Group controlId="customerName">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Enter Customer's Name" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="customerContact">
                        <Form.Label>Customer Contact</Form.Label>
                        <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Enter Customer's Contact Info" />
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
                <Form.Control as='textarea' value={this.state.description} onChange={this.onChange} placeholder="Enter ticket description" />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
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