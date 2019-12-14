import axios from 'axios';
import { FIND_USER } from './types';
import { returnErrors } from './errorActions';

export const findUser = user => dispatch => {
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