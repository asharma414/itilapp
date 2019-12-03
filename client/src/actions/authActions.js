import axios from 'axios';
import { returnErrors } from './errorActions';
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "./types";


// Login - get user token
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});

    axios
        .get('/users/login', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
    };

//Register user
export const registerUser = ({name, email, password}) => dispatch => {
    const config = {
        headers:  {
            'Content-type': 'application/json'
        }
    };
    const body = JSON.stringify({name, email, password});

    axios
        .post('/users/register', body, config)
        .then(res => 
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
            )
        .catch(err => {
            dispatch(
                returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
            );
            dispatch({
                type: REGISTER_FAIL
            });
        });
    };

    export const login = ({email, password}) => dispatch => {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        const body = JSON.stringify({email, password});
        
        axios
            .post('/users/login', body, config)
            .then(res => 
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                })
                )
            .catch(err => {
                dispatch(
                    returnErrors(err.resopnse.data, err.response.status, 'LOGIN_FAIL')
                );
                dispatch({
                    type: LOGIN_FAIL
                });
            });
    };

    //logout

    export const logout = () => {
        return {
            type: LOGOUT_SUCCESS
        };
    };

export const tokenConfig = getState => {
    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    if(token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
};


