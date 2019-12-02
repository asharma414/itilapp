import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL }  from '../actions/types';
const isEmpty = require('is-empty');

const initialState = {
    token: localStorage.getItem('token');
    isAuthenticated: false,
    user: null
    isLoading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false
                isLoading: false
            }
        default:
            return state;
    }
}