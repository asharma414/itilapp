import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { activate } from '../actions/authActions';

class ActivatedScreen extends Component {

    async componentDidMount() {
      await this.props.activate(window.location.pathname.substring(8));
    }
    render() {
        const { errors } = this.props;
        if (errors.emailnotfound) {
            return(
                <div>Account does not exist</div>
            )
        }
        else {
        return (
            <div>
                Your account has been activated!
            </div>
        )
        }
    }
}

ActivatedScreen.propTypes = {
    errors: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
    });

export default connect(mapStateToProps, { activate })(ActivatedScreen)