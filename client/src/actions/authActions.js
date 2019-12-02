import axios from 'axios';
import { returnErrors } from './errorActions'
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "./types";


// Login - get user token
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});
    const token = getState().auth.token;
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    if(token){
        config.headers['x-auth-token'] = token;
    }
    axios.get('/users/login', config)
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(er => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });

