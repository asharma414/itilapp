import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/ticketActions';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import LoadingScreen from './loadingscreen';

class TicketList extends Component {
    componentDidMount() {
        this.props.getTickets('');
    }

    showDetails = (path) => {
        this.props.history.push(path);
    }

    render() {
        const { tickets } = this.props.ticket;
        const { loading } = this.props.ticket;
        if (loading === true) {
            return (
                <div className='container'>
                    <LoadingScreen />
                </div>
            )
        } else if (tickets.length < 1) {
            return (
                <div>
                    No results found
                </div>
            )
        } else {
            return (
                <div className='container'>
                    <Table className='my-4' striped bordered hover responsive='md'>
                        <thead>
                            <tr>
                                <td>Title</td>
                                <td>Description</td>
                                <td>Status</td>
                                <td>Open?</td>
                                <td>Author</td> 
                                <td>Assigned To</td>
                                <td>Created</td>
                                <td>Last Modified</td>
                            </tr>
                        </thead>
                        <tbody>
                        {tickets.map(ticket => (
                            <tr className='ticket' key={ticket._id} onClick={() => this.showDetails(`/tickets/${ticket._id}`)}>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.status}</td>
                                    <td>{(ticket.open === true) ? 'Open' : 'Closed'}</td>
                                    <td>{ticket.author.name}</td>
                                    <td>{ticket.assignedTo.name}</td>
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
}

TicketList.propTypes = {
    getTickets: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    ticket: state.ticket
});

export default connect(mapStateToProps, { getTickets })(withRouter(TicketList))