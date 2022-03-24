import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import App from './components/App';
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

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/home' component={App} />
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