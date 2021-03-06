import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { logoutUser } from "../actions/authActions";
import { getTickets } from '../actions/ticketActions';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Navigation extends Component {

    state = {
        term: '',
    }

    myTickets = async () => {
        const user = this.props.auth.user.name
        await this.props.getTickets('', user);
        this.clearState();
    }

    renderHome = async () => {
        await this.props.getTickets('', '')
        this.clearState();
    }

    clearState = () => {
        this.setState({term: ''})
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    onSubmit = async (e) => { 
        e.preventDefault();
        await this.props.history.push('/tickets/1');
        this.props.getTickets(this.state.term, '');
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <Navbar bg='light' expand='lg'>
                <Navbar.Brand href='/'>ITIL App</Navbar.Brand>
                <Navbar.Toggle className={ isAuthenticated === true ? '' : 'd-none' } aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto'>
                        <Form className={ isAuthenticated === true ? '' : 'd-none' } onSubmit={this.onSubmit} inline>
                            <Form.Control id='term' value={this.state.term} onChange={this.onChange} type="text" placeholder="Search" className='mr-sm-2' />
                            <Button type='submit' variant='outline-success'>Search</Button>
                        </Form>
                        <Link className={ isAuthenticated === true ? 'nav-link' : 'd-none' } onClick={this.renderHome} to='/tickets'>Home</Link>
                        <Link className={ isAuthenticated === true ? 'nav-link' : 'd-none' } onClick={this.clearState} to='/new'>New Ticket</Link>
                        <Link className={ isAuthenticated === true ? 'nav-link' : 'd-none' } onClick={this.myTickets}  to='/tickets'>My Tickets</Link>
                        <Nav.Link className={ isAuthenticated === true ? '' : 'd-none' } onClick={this.onLogoutClick}>Logout</Nav.Link>
                    </Nav>
                    <span className={this.props.auth.user.name ? 'navbar-text' : ''}>{this.props.auth.user.name ? this.props.auth.user.name : null}</span>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

Navigation.propTypes = {
    auth: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, getTickets })(withRouter(Navigation))
