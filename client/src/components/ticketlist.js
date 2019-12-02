import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/ticketActions';
import PropTypes from 'prop-types';

class TicketList extends Component {

    componentDidMount() {
        this.props.getTickets();
    }

    render() {
        const { tickets } = this.props.ticket;
        return (
            <table>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Description</td>
                        <td>Created Date</td>
                        <td>Last Modified</td>
                    </tr>
                </thead>
                <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket._id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>{ticket.createdAt.substring(0,19)}</td>
                        <td>{ticket.updatedAt.substring(0,19)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

TicketList.propTypes = {
   getTickets: PropTypes.func.isRequired,
   ticket: PropTypes.object.isRequired 
}

const mapStateToProps = (state) => ({
    ticket: state.ticket
});

export default connect(mapStateToProps, { getTickets })(TicketList)