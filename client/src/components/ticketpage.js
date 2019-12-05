import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTicket } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';


class TicketPage extends Component {
    state = {
        errors: {}
    }

    componentDidMount() {
         const { id } = this.props.match.params;
         this.props.getTicket(id)
    }


    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    onSubmit = async (e) => {
        
    }

    render() {
        const details = this.props.ticket.tickets
        return (
            <Form>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={details.title} />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' defaultValue={details.description} onChange={this.onChange} placeholder="Enter ticket description" />
            </Form.Group>
            <Form.Group controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control type="text" defaultValue={((details || {}).customer || {}).name} onChange={this.onChange} />
            </Form.Group>
            <Form.Group controlId="customerContact">
                <Form.Label>Customer Contact</Form.Label>
                <Form.Control type="text" defaultValue={((details || {}).customer || {}).contact} onChange={this.onChange} />
            </Form.Group>
            <Form.Group controlId="author">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={((details || {}).author || {}).name}  />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            </Form>
        )
    }
}

TicketPage.propTypes = {
    getTicket: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    ticket: state.ticket
});

export default connect(mapStateToProps, { getTicket })(TicketPage)