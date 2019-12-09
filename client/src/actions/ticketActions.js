import axios from 'axios';
import { GET_TICKETS, ADD_TICKET, UPDATE_TICKET, TICKETS_LOADING } from './types';
import { returnErrors } from './errorActions';


export const getTickets = () => dispatch => {
    dispatch(setItemsLoading());
    axios
        .get('/tickets')
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
        .post('/tickets/create', ticket)
        .then(res => 
            dispatch({
                type: ADD_TICKET
            })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const updateTicket = (id, data) => dispatch  => {
    axios
        .put(`/tickets/${id}`, data)
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