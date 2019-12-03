import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/ticketActions';
import PropTypes from 'prop-types';

class TicketList extends Component {
    static propTypes = {
        getTickets: PropTypes.func.isRequired,
        ticket: PropTypes.object.isRequired,
        //isAuthenticated: PropTypes.bool
    };

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
                        <td>{ticket.createdAt}</td>
                        <td>{ticket.updatedAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

const mapStateToProps = (state) => ({
    ticket: state.ticket,
    //isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getTickets })(TicketList)