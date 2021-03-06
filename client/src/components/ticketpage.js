import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTicket } from '../actions/ticketActions';
import { returnErrors } from '../actions/errorActions';
import { findUser } from '../actions/userActions';
import PropTypes from 'prop-types';
import LoadingScreen from './loadingscreen';
import { Form, Button, Table, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import dompurify from 'dompurify';
const sanitizer = dompurify.sanitize;

class TicketPage extends Component {
    state = {
        commentText: '',
        updates: {
            status: '',
            created: '',
            open: '',
            updated: '',
            title: '',
            description: '',
            customerName: '',
            customerContact: '',
            author: '',
            comments: [],
            assignedTo: '',
            number: ''
        },
        original: {
            status: '',
            created: '',
            open: '',
            updated: '',
            title: '',
            description: '',
            customerName: '',
            customerContact: '',
            author: '',
            comments: [],
            assignedTo: '',
            number: ''
        },
        comments: [],
        loading: false,
        errors: {}
    }

    getTicket() {
        const { id } = this.props.match.params;
        axios
            .get(`/api/tickets/${id}`)
            .then(res =>
                this.setState({
                    updates: {
                        title: res.data.title,
                        status: res.data.status,
                        open: res.data.open,
                        created: res.data.createdAt,
                        updated: res.data.updatedAt,
                        description: res.data.description,
                        number: res.data.number,
                        customerName: ((res.data || {}).customer || {}).name,
                        customerContact: ((res.data || {}).customer || {}).contact,
                        author: ((res.data || {}).author || {}).name,
                        assignedTo: ((res.data || {}).assignedTo || {}).name
                    },
                    original: {
                        title: res.data.title,
                        status: res.data.status,
                        open: res.data.open,
                        created: res.data.createdAt,
                        updated: res.data.updatedAt,
                        number: res.data.number,
                        description: res.data.description,
                        customerName: ((res.data || {}).customer || {}).name,
                        customerContact: ((res.data || {}).customer || {}).contact,
                        author: ((res.data || {}).author || {}).name,
                        assignedTo: ((res.data || {}).assignedTo || {}).name,
                    },
                    comments: res.data.comments,
                    loading: false
                })
            )
            .catch(err =>
                this.props.history.push('/')
            );
    }

    componentDidMount() {
        if (this.props.errors) {
            this.setState({ errors: this.props.errors })
        }
        this.props.findUser();
        this.getTicket();
        this.setState({ loading: true })
    }

    onChange = (e) => {
        const { updates } = { ...this.state };
        const currentState = updates;
        const { id, value } = e.target;
        if (id === 'commentText') {
            this.setState({ commentText: value })
        } else {
            currentState[id] = value;
            this.setState({ updates: currentState })
        }
    }

    commentPost = (text) => {
        const { id } = this.props.match.params;
        const userId = this.props.auth.user.id;
        const username = this.props.auth.user.name;
        const newComment = {
            text: text,
            author: {
                id: userId,
                name: username
            }
        }
        axios
            .post(`/api/tickets/${id}/comments`, newComment)
            .then(res => this.setState({comments: [res.data, ...this.state.comments], commentText: ''}))
            .catch(err =>
                console.log(err)
            );
    }

    stateMatch = (original, updates) => {
        if (Object.keys(original).length !== Object.keys(updates).length) {
            return false;
        }
        for (const property in original) {
            if (original[property] !== updates[property]) {
                return false;
            }
        }
        return true;
    }

    ticketSubmit = async (e) => {
        e.preventDefault();
        if (!this.stateMatch(this.state.original, this.state.updates)) {
            const { users } = this.props.user;
            let userArr = users.map(user => user.name);
            if (userArr.includes(this.state.updates.assignedTo)) {
                let assignedToIndex = userArr.indexOf(this.state.updates.assignedTo)
                const { id } = this.props.match.params;
                if (this.state.updates.status !== this.state.original.status) {
                    this.commentPost(`Status is <em>${this.state.updates.status}</em> was <em>${this.state.original.status}</em>`)
                }
                const updatedTicket = {
                    description: this.state.updates.description,
                    customer: {
                        name: this.state.updates.customerName,
                        contact: this.state.updates.customerContact
                    },
                    status: this.state.updates.status,
                    assignedTo: {
                        id: users[assignedToIndex]._id,
                        name: this.state.updates.assignedTo
                    }
                }
                await this.props.updateTicket(id, updatedTicket);
            } else {
                alert('Invalid assigned to user')
            }
            window.location.reload();
        }
    }

    commentSubmit = (e) => {
        e.preventDefault();
        if (this.state.commentText.length > 0) {
            this.commentPost(this.state.commentText)
        }
    }

    isClosed = () => {
        return !this.state.original.open ? "disabled" : "";
    }

    render() {
        const { users } = this.props.user;
        const { loading } = this.props.user;
        if (this.state.loading === true && loading === true) {
            return (
                <div className='container'>
                    <LoadingScreen />
                </div>
            )
        } else {
            return (
                <div className='container'>
                    <datalist id='datalist1'>
                        {
                            users.map(user => (
                                <option key={user._id} value={user.name}></option>
                            ))}
                    </datalist>
                    <Table className='my-4' bordered hover responsive='md'>
                        <thead>
                            <tr>
                                <td>Ticket #</td>
                                <td>Title</td>
                                <td>Status</td>
                                <td>State</td>
                                <td>Author</td>
                                <td>Created</td>
                                <td>Last Modified</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.original.number}</td>
                                <td>{this.state.original.title}</td>
                                <td>{this.state.original.status}</td>
                                <td>{this.state.original.open ? 'Open' : 'Closed'}</td>
                                <td>{this.state.original.author}</td>
                                <td>{moment(this.state.original.created).format('lll')}</td>
                                <td>{moment(this.state.original.updated).format('lll')}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Form onSubmit={this.ticketSubmit}>
                        <Row>
                            <Col>
                                <Form.Group controlId="customerName">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control type='text' onChange={this.onChange} value={this.state.updates.customerName} placeholder="Customer's Name" disabled={this.isClosed()} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="customerContact">
                                    <Form.Label>Customer Contact</Form.Label>
                                    <Form.Control type='text' onChange={this.onChange} value={this.state.updates.customerContact} placeholder="Customer's Contact Info" disabled={this.isClosed()} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId='status'>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as='select' value={this.state.updates.status} onChange={this.onChange} disabled={this.isClosed()}>
                                        <option>New</option>
                                        <option>Awaiting Customer Feedback</option>
                                        <option>In Progress</option>
                                        <option>Cancelled</option>
                                        <option>Resolved</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId='assignedTo'>
                            <Form.Label>Assigned To</Form.Label>
                            <Form.Control list='datalist1' type='text' value={this.state.updates.assignedTo} onChange={this.onChange} required placeholder='Assign ticket to user' disabled={this.isClosed()} />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' value={this.state.updates.description} onChange={this.onChange} required placeholder="Ticket description" disabled={this.isClosed()} />
                        </Form.Group>
                        <Button variant='outline-primary' type='submit' disabled={this.isClosed()} >Submit</Button>
                    </Form>
                    <div className='my-4 commentForm'>
                        <Form onSubmit={this.commentSubmit}>
                            <Form.Group controlId='commentText'>
                                <Form.Label>New Comment</Form.Label>
                                <Form.Control as='textarea' value={this.state.commentText} onChange={this.onChange} placeholder="Enter comments" disabled={this.isClosed()} />
                            </Form.Group>
                            <Button variant='outline-secondary' type='submit' disabled={this.isClosed()}>Post Comment</Button>
                        </Form>
                    </div>
                    {this.state.comments.map(comment =>
                        <div key={comment._id} className='mt-3 card-footer'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='row'>
                                        <div className='col-md-9'><strong>{comment.author.name}</strong></div>
                                        <div className='text-right col-md-3'>{moment(comment.createdAt).fromNow()}</div>
                                    </div>
                                    <p dangerouslySetInnerHTML={{ __html: sanitizer(comment.text) }}></p>
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
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    findUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    user: state.user
});

export default connect(mapStateToProps, { returnErrors, updateTicket, findUser })(TicketPage)