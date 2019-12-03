import axios from 'axios';
import { GET_TICKETS, ADD_TICKET, CLOSE_TICKET, TICKETS_LOADING } from './types';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

export const getTickets = (getState) => dispatch => {
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

export const newTicket = ticket => (dispatch, getState) => {
    axios
        .post('/tickets/create', ticket, tokenConfig(getState))
        .then(res => 
            dispatch({
                type: ADD_TICKET,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const closeTicket = id => (dispatch, getState) => {
    axios
        .post(`/tickets/close/${id}`, tokenConfig(getState))
        .then(res => 
            dispatch({
                type: CLOSE_TICKET,
                payload: id
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