import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { logoutUser } from "../actions/authActions";
import PropTypes from 'prop-types';

class Navigation extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
      };

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">ITIL App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none'} href="/tickets">Home</Nav.Link>
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none'} href="/tickets/create">New Ticket</Nav.Link>
                    <Nav.Link className={ isAuthenticated === true ? '' : 'd-none'} href='' onClick={this.onLogoutClick}>Logout</Nav.Link>
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

export default connect(mapStateToProps, { logoutUser })(Navigation)
