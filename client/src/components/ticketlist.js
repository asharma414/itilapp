import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/ticketActions';
import Pagination from './pagination';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import moment from 'moment';

class TicketList extends Component {

    state = {
        currentPage: 1,
        ticketsPerPage: 10
    }

    componentDidMount() {
        this.props.getTickets('', '');
    }

    showDetails = (path) => {
        this.props.history.push(path);
    }

    paginate = (pageNumber) => {
        this.setState({currentPage: pageNumber})
    }

    render() {
        const { page } = this.props.match.params;
        const { tickets } = this.props.ticket;
        const limit = Math.ceil(tickets.length/this.state.ticketsPerPage);
        const { loading } = this.props.ticket;
        const indexOfLastTicket = this.state.currentPage * this.state.ticketsPerPage;
        const indexOfFirstTicket = indexOfLastTicket - this.state.ticketsPerPage;
        const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket)
        if (loading === true) {
            return (
                <div className='container'>
                    <LoadingScreen />
                </div>
            )
        } else if (tickets.length < 1 || (page < 1 || page > limit)) {
            return (
                <div>
                    No results found or invalid page number
                </div>
            )
        } else {
            return (
                <div className='container'>
                    <Table className='my-4' bordered hover responsive='md'>
                        <thead>
                            <tr>
                                <th>Ticket #</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>State</th>
                                <th>Author</th> 
                                <th>Assigned To</th>
                                <th>Created</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentTickets.map(ticket => (
                            <tr className='ticket' key={ticket._id} onClick={() => this.showDetails(`/ticket/${ticket._id}`)}>
                                    <td>{ticket.number}</td>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description.substring(0, 25)}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.open ? 'Open' : 'Closed'}</td>
                                    <td>{ticket.author.name}</td>
                                    <td>{ticket.assignedTo.name}</td>
                                    <td>{moment(ticket.createdAt).format('lll')}</td>
                                    <td>{moment(ticket.updatedAt).format('lll')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination ticketsPerPage={this.state.ticketsPerPage} totalTickets={tickets.length} currentPage={this.state.currentPage} paginate={this.paginate}/>
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