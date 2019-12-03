import { CLOSE_TICKET, ADD_TICKET, GET_TICKETS, TICKETS_LOADING } from '../actions/types';

const initialState = {
    tickets: [],
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_TICKETS:
            return {
                ...state,
                tickets: action.payload,
                loading: false
            };
        case CLOSE_TICKET:
            return {
                ...state,
                tickets: state.tickets.filter(ticket => ticket._id !== action.payload)
            };
        case ADD_TICKET:
            return {
                ...state,
                tickets: [action.payload, ...state.tickets]
            };
        case TICKETS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
