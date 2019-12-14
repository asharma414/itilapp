import { FIND_USER, USERS_LOADING } from '../actions/types';

const initialState = {
    users: [],
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FIND_USER:
            return {
                ...state,
                users: action.payload,
                loading: false
            };
        case USERS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
        }
};