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
        sortedTickets: null,
        currentPage: 1,
        ticketsPerPage: 10,
        ascend: null
    }

    componentDidMount() {
        if (this.props.location.pathname === '/mytickets') {
            this.props.getTickets('', this.props.user)
        } else {
            this.props.getTickets('', '');
        }
    }

    showDetails = (path) => {
        this.props.history.push(path);
    }

    paginate = (pageNumber) => {
        this.setState({currentPage: pageNumber})
    }

    sortTickets = (e) => {
        document.querySelectorAll('.arrow').forEach(span => span.style.display = 'none')
        if (this.state.ascend) {
            let sorted = this.props.ticket.tickets.sort((a,b) => {
                if (typeof a[`${e.target.id}`] === 'string') {
                    return (b[`${e.target.id}`].localeCompare(a[`${e.target.id}`]))
                } else if (e.target.id === 'assignedTo') {
                    return (b.assignedTo.name.localeCompare(a.assignedTo.name))
                } else if (e.target.id === 'author') {
                    return (b.author.name.localeCompare(a.author.name))
                } else if (e.target.id === 'open') {
                    return (b.open ? 'open' : 'closed').localeCompare(a.open ? 'open' : 'closed')
                }
            })
            e.currentTarget.children[1].style.display = ''
            this.setState({sortedTickets: sorted, ascend: false })
        } else {
        let sorted = this.props.ticket.tickets.sort((a,b) => {
            if (typeof a[`${e.target.id}`] === 'string') {
                return (a[`${e.target.id}`].localeCompare(b[`${e.target.id}`]))
            } else if (e.target.id === 'assignedTo') {
                return (a.assignedTo.name.localeCompare(b.assignedTo.name))
            } else if (e.target.id === 'author') {
                return (a.author.name.localeCompare(b.author.name))
            } else if (e.target.id === 'open') {
                return (a.open ? 'open' : 'closed').localeCompare(b.open ? 'open' : 'closed')
            }
        })
        e.target.children[0].style.display = ''
        this.setState({sortedTickets: sorted, ascend: true })
    }
    }

    render() {
        const { page } = this.props.match.params;
        let tickets = (this.state.sortedTickets ? this.state.sortedTickets : this.props.ticket.tickets)
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
                                <th className='ticket' id='title' onClick={this.sortTickets}>Title<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                                <th className='ticket' id='description' onClick={this.sortTickets}>Description<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                                <th className='ticket' id='status' onClick={this.sortTickets}>Status<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                                <th className='ticket' id='open' onClick={this.sortTickets}>State<span className='arrow' style={{display: 'none'}}>↓</span><span className='arrow' style={{display: 'none'}}>↑</span></th>
                                <th className='ticket' id='author' onClick={this.sortTickets}>Author<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th> 
                                <th className='ticket' id='assignedTo' onClick={this.sortTickets}>Assigned To<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                                <th className='ticket' id='createdAt' onClick={this.sortTickets}>Created<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                                <th className='ticket' id='updatedAt' onClick={this.sortTickets}>Last Modified<span className='arrow' style={{display: 'none'}}>↑</span><span className='arrow' style={{display: 'none'}}>↓</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentTickets.map(ticket => (
                            <tr className='ticket' key={ticket._id} onClick={() => this.showDetails(`/ticket/${ticket._id}`)}>
                                    <td>{ticket.number}</td>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description.length > 25 ? ticket.description.substring(0, 25) : ticket.description}</td>
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