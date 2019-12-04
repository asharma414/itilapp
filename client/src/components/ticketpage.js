import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTicket } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

class TicketPage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
         const { id } = this.props.match.params;
         this.props.getTicket(id)
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    render() {
        // const details = this.props.ticket.tickets;
        // console.log(details)
        // this.state.title = details.title;
        // this.state.description = details.description;
        // this.state.customer = details.customer;
        // this.state.author = details.author;
        // this.state.comments = details.comments;
        return (
            <Form>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={this.onChange} value={this.state.title} placeholder="Enter ticket title" />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' onChange={this.onChange} value={this.state.description} placeholder="Enter ticket description" />
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