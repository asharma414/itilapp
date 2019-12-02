import defaultOptions from '../defaultOptions'

const setAuthToken = token => {
    if (token) {
        defaultOptions.headers['Authorization'] = token;
    } else {
        delete defaultOptions.headers['Authorization'];
    }
};

export default setAuthToken;