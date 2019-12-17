import axios from 'axios';
import { ADD_COMMENT } from './types';
import { returnErrors } from './errorActions';

export const addComment = (id, data) => dispatch => {
    axios
        .post(`/api/tickets/${id}/comments`, data)
        .then(res => dispatch({
            type: ADD_COMMENT
        })
        )
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};
