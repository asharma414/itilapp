import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { logoutUser } from "../actions/authActions";
import { getTickets } from '../actions/ticketActions';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Navigation extends Component {

    state = {
        term: ''
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
        await this.props.history.push('/tickets');
        this.props.getTickets(this.state.term)
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <Navbar bg='light' expand='lg'>
                <Navbar.Brand href='/'>ITIL App</Navbar.Brand>
                <Navbar.Toggle className={ isAuthenticated === true ? '' : 'd-none'} aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto'>
                    <Form className={ isAuthenticated === true ? '' : 'd-none' } onSubmit={this.onSubmit} inline>
                    <Form.Control id='term' onChange={this.onChange} type="text" placeholder="Search" className='mr-sm-2' />
                    <Button type='submit' variant='outline-success'>Search</Button>
                    </Form>
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none' } href='/tickets'>Home</Nav.Link>
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none' } href='/new'>New Ticket</Nav.Link>
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none' } href='' onClick={this.onLogoutClick}>Logout</Nav.Link>
                    </Nav>
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
