import axios from 'axios';
import { FIND_USER, USERS_LOADING } from './types';
import { returnErrors } from './errorActions';

export const findUser = user => dispatch => {
    dispatch(setUserLoading());
    axios
        .get('/users')
        .then(res => dispatch({
            type: FIND_USER,
            payload: res.data
        })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status)) 
        )
}

export const setUserLoading = () => {
    return {
        type: USERS_LOADING
    };
};