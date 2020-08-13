import axios from 'axios';
import { GET_TICKETS, ADD_TICKET, UPDATE_TICKET, TICKETS_LOADING } from './types';
import { returnErrors } from './errorActions';


export const getTickets = (term, name) => dispatch => {
    dispatch(setItemsLoading());
    axios
        .get('/api/tickets', {
            params: {
                term: term,
                name: name
            }
        })
        .then(res =>
            dispatch({
                type: GET_TICKETS,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const newTicket = ticket => dispatch => {
    axios
        .post('/api/tickets/create', ticket)
        .then(res => 
            dispatch({
                type: ADD_TICKET,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        )
};

export const updateTicket = (id, data) => dispatch  => {
    axios
        .put(`/api/tickets/${id}`, data)
        .then(res => 
            dispatch({
                type: UPDATE_TICKET
            })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const setItemsLoading = () => {
    return {
        type: TICKETS_LOADING
    };
};