import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTicket } from '../actions/ticketActions';
import { returnErrors } from '../actions/errorActions';
import { addComment } from '../actions/commentActions';
import PropTypes from 'prop-types';
import LoadingScreen from './loadingscreen';
import { Form, Button, Table, Row, Col } from 'react-bootstrap';
import dompurify from 'dompurify';
import moment from 'moment';
const sanitizer = dompurify.sanitize;

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

    getTicket() {
        const { id } = this.props.match.params;
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

    componentDidMount() {
        if (this.props.errors) {
            this.setState({ errors: this.props.errors })
        }
        this.getTicket();
        this.setState({ loading: true })
    }

    onChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    commentPost = async (text) => {
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
        await this.props.addComment(id, newComment);
        this.getTicket();
    }

    ticketSubmit = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        if (this.state.newStatus !== this.state.status) {
            this.commentPost(`Status is <i>${this.state.newStatus}</i> was <i>${this.state.status}</i>`)
        }
        if (this.state.newOpen !== this.state.open) {
            this.commentPost(`State is <i>${this.state.newOpen}</i> was <i>${this.state.open}</i>`)
        }
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
        this.getTicket();
    }

    commentSubmit = (e) => {
        e.preventDefault();
        this.commentPost(this.state.commentText)
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div className='container'>
                    <LoadingScreen />
                </div>
            )
        } else {
            return (
                <div className='container'>
                    <Table className='my-4' bordered hover responsive='md'>
                        <thead>
                            <tr>
                                <td>Title</td>
                                <td>Status</td>
                                <td>Open?</td>
                                <td>Author</td> 
                                <td>Created</td>
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
                        <Row>
                            <Col>
                                <Form.Group controlId="customerName">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control type='text' onChange={this.onChange} value={this.state.customerName} placeholder="Customer's Name" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="customerContact">
                                    <Form.Label>Customer Contact</Form.Label>
                                    <Form.Control type='text' onChange={this.onChange} value={this.state.customerContact} placeholder="Customer's Contact Info" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
                                <Form.Group controlId='newOpen'>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control as='select' value={this.state.newOpen} onChange={this.onChange}>
                                        <option>Open</option>
                                        <option>Closed</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' value={this.state.description} onChange={this.onChange} placeholder="Ticket description" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                    <div className='my-4 commentForm'>
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
                                            <p dangerouslySetInnerHTML={{__html: sanitizer(comment.text)}}></p>
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
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { returnErrors, updateTicket, addComment })(TicketPage)