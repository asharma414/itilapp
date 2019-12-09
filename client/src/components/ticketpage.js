import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTicket } from '../actions/ticketActions';
import { returnErrors } from '../actions/errorActions';
import { addComment } from '../actions/commentActions';
import PropTypes from 'prop-types';
import { Form, Button, Table } from 'react-bootstrap';
import moment from 'moment';


class TicketPage extends Component {
    state = {
        status: '',
        created: '',
        open: '',
        updated: '',
        title: '',
        description: '',
        customerName: '',
        customerContact: '',
        author: '',
        newStatus: '',
        newOpen: '',
        comments:  [],
        loading: false,
        commentText: '',
        commentToggle: false,
        errors: {}
    }

    componentDidMount() {
        this.setState({ loading: true })
        const { id } = this.props.match.params;
         //this.props.getTicket(id)
        axios
            .get(`/tickets/${id}`)
            .then(res => 
                this.setState({
                    title: res.data.title,
                    status: res.data.status,
                    newStatus: res.data.status,
                    open: (res.data.open === true) ? 'Open' : 'Closed',
                    newOpen: (res.data.open === true) ? 'Open' : 'Closed',
                    created: res.data.createdAt,
                    updated: res.data.updatedAt,
                    description: res.data.description,
                    customerName: ((res.data || {}).customer || {}).name,
                    customerContact: ((res.data || {}).customer || {}).contact,
                    comments: res.data.comments,
                    author: ((res.data || {}).author || {}).name,
                    loading: false
                })
            )
            .catch(err => 
                console.log(err)
        );
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    ticketSubmit = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const updatedTicket = {
            description: this.state.description,
            customer: {
                name: this.state.customerName,
                contact: this.state.customerContact
            },
            status: this.state.newStatus,
            open: (this.state.newOpen === 'Open') ? true : false
        }
        await this.props.updateTicket(id, updatedTicket);
        window.location.reload(false);
    }

    commentSubmit = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const userId = this.props.auth.user.id;
        const username = this.props.auth.user.name;
        const newComment = {
            text: this.state.commentText,
            author: {
                id: userId,
                name: username
            }
        }
        await this.props.addComment(id, newComment);
        window.location.reload(false);
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div>Loading...</div>
            )
        } else {
            return (
                <div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <td>Title</td>
                                <td>Status</td>
                                <td>Open?</td>
                                <td>Author</td> 
                                <td>Created Date</td>
                                <td>Last Modified</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.title}</td>
                                <td>{this.state.status}</td>
                                <td>{(this.state.open === 'Open') ? 'Open' : 'Closed'}</td>
                                <td>{this.state.author}</td>
                                <td>{this.state.created.substring(0,19)}</td>
                                <td>{this.state.updated.substring(0,19)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Form onSubmit={this.ticketSubmit}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' value={this.state.description} onChange={this.onChange} placeholder="Enter ticket description" />
                    </Form.Group>
                    <Form.Group controlId='newStatus'>
                        <Form.Label>Status</Form.Label>
                        <Form.Control as='select' value={this.state.newStatus} onChange={this.onChange}>
                            <option>New</option>
                            <option>Awaiting Customer Feedback</option>
                            <option>In Progress</option>
                            <option>Cancelled</option>
                            <option>Resolved</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='newOpen'>
                        <Form.Label>State</Form.Label>
                        <Form.Control as='select' value={this.state.newOpen} onChange={this.onChange}>
                            <option>Open</option>
                            <option>Closed</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="customerName">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Enter Customer's Name" />
                    </Form.Group>
                    <Form.Group controlId="customerContact">
                        <Form.Label>Customer Contact</Form.Label>
                        <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Enter Customer's Contact Info" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                    <div className='commentForm'>
                        <Form onSubmit={this.commentSubmit}>
                        <Form.Group controlId="commentText">
                            <Form.Label>New Comment</Form.Label>
                            <Form.Control as='textarea' value={this.state.newComment} onChange={this.onChange} placeholder="Enter ticket description" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Post Comment</Button>
                        </Form>
                    </div>
                {this.state.comments.map(comment =>
                    <div key={comment._id} className="mt-3 card-footer"> 
                        <div className='row'>
                                <div className='col-md-12'>
                                    <div className='row'>
                                        <div className='col-md-9'><strong>{comment.author.name}</strong></div>
                                            <div className='text-right col-md-3'>{moment(comment.createdAt).fromNow()}</div>
                                    </div>
                                    <p>{comment.text}</p>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            )
        }
    }
}

TicketPage.propTypes = {
    updateTicket: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { returnErrors, updateTicket, addComment })(TicketPage)