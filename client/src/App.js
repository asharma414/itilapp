import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import TicketList from './components/ticketlist';
import Navigation from './components/navbar';
import Register from './components/register'
import Login from './components/login';
import { loadUser } from './actions/authActions';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NewTicket from './components/newticket';

function App() {
  return (
    <Provider store={store}>
      <div className='container'>
        <Router>
          <Navigation />
          <Route path='/login' exact component={Login} />
          <Route path='/register' exact component={Register} />
          <Route path='/tickets' exact component={TicketList} />
          <Route path='/tickets/create' exact component={NewTicket} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
