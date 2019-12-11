import { UPDATE_TICKET, ADD_TICKET, GET_TICKETS, TICKETS_LOADING } from '../actions/types';

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
        case UPDATE_TICKET:
            return {
                ...state
            };
        case ADD_TICKET:
            return {
                ...state
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
