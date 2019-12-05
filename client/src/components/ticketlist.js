import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class TicketList extends Component {
    componentDidMount() {
        this.props.getTickets();
    }

    showDetails = (path) => {
        this.props.history.push(path);
    }

    render() {
        const { tickets } = this.props.ticket;
        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>Description</td>
                            <td>Status</td>
                            <td>Open?</td>
                            <td>Author</td> 
                            <td>Created Date</td>
                            <td>Last Modified</td>
                        </tr>
                    </thead>
                    <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket._id} onClick={() => this.showDetails(`/tickets/${ticket._id}`)}>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.status}</td>
                                <td>{(ticket.open === true) ? 'Open' : 'Closed'}</td>
                                <td>{ticket.author.name}</td>
                                <td>{ticket.createdAt.substring(0,19)}</td>
                                <td>{ticket.updatedAt.substring(0,19)}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

TicketList.propTypes = {
    getTickets: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    ticket: state.ticket
});

export default connect(mapStateToProps, { getTickets })(withRouter(TicketList))