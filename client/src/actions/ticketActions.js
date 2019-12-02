import axios from 'axios';
import { GET_TICKETS, DELETE_TICKET, TICKETS_LOADING } from './types';

export const getTickets = () => dispatch => {
    dispatch(setItemsLoading());
    axios
        .get('/tickets')
        .then(res =>
            dispatch({
                type: GET_TICKETS,
                payload: res.data
        })
    );
};

export const deleteTicket = id => {
    return {
        type: DELETE_TICKET,
        payload: id
    };
};

export const setItemsLoading = () => {
    return {
        type: TICKETS_LOADING
    }
}