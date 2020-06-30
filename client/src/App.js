import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import TicketList from './components/ticketlist';
import Navigation from './components/navbar';
import Register from './components/auth/register'
import Login from './components/auth/login';
import NewTicket from './components/newticket';
import ActivatedScreen from './components/activatedscreen';
import TicketPage from './components/ticketpage';
import PrivateRoute from './components/protected-route/privateroute';
import Page404 from './components/page404';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

var decoded
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className='container'>
          <Router>
            <Navigation />
            <Switch>
              <Route path='/' exact component={Login} />
              <Route path='/login' exact component={Login} />
              <Route path='/register' exact component={Register} />
              <Route path='/verify/:id' exact component={ActivatedScreen} />
              <PrivateRoute exact path='/tickets/:page?' component={TicketList} />
              <PrivateRoute exact path='/ticket/:id' component={TicketPage} />
              <PrivateRoute exact path='/mytickets' component={() => <TicketList user={decoded.name} />} />
              <PrivateRoute exact path='/new' component={NewTicket} />
              <Route component={Page404} />
            </Switch>
          </Router>
        </div>
      </Provider>
    )
  }
}
