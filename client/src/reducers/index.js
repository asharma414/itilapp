import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import ticketReducer from './ticketReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    ticket: ticketReducer
});