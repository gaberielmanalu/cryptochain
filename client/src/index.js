import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import axios from 'axios';
import App from './components/App';
import Admin from './components/Admin';
import loginAdmin from './components/LoginAdmin';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import Login from './components/Login';
import TransactionPool from './components/TransactionPool';
import Production from './components/Production';
import './index.css';
import Search from './components/Search';
import SearchResult from './components/SearchResult';
import SearchBrand from './components/SearchBrand';
import SearchResultBrand from './components/SearchResultBrand';
import Signup from './components/Signup';

axios.defaults.withCredentials = true;

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/home' component={App} />
      <Route exact path='/login-admin' component={loginAdmin} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/admin' component={Admin} />
      <Route path='/blocks' component={Blocks} />
      <Route path='/conduct-transaction' component={ConductTransaction} />
      <Route path='/transaction-pool' component={TransactionPool} />
      <Route path='/production' component={Production} />
      <Route path='/search' component={Search} />
      <Route path='/search-by-brand' component={SearchBrand} />
      <Route path='/search-result' component={SearchResult} />
      <Route path='/search-result-brand' component={SearchResultBrand} />
    </Switch>
  </Router>,
  document.getElementById('root')
);