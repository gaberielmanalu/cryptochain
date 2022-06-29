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
import Umum from './components/Umum';
import BlocksUmum from './components/BlocksUmum';
import SearchResultUmum from './components/SearchResultUmum';
import SearchResultAdmin from './components/SearchResultAdmin';
import SearchResultBrandUmum from './components/SearchResultBrandUmum';
import SearchResultBrandAdmin from './components/SearchResultBrandAdmin';
import SearchUmum from './components/SearchUmum';
import SearchBrandUmum from './components/SearchBrandUmum';
import SearchBrandAdmin from './components/SearchBrandAdmin';
import TransactionPoolAdmin from './components/TransactionPoolAdmin';
import ConductTransactionAdmin from './components/ConductTransactionAdmin';
import BlocksAdmin from './components/BlocksAdmin';
import SearchAdmin from './components/SearchAdmin';

axios.defaults.withCredentials = true;

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={Umum} />
      <Route exact path='/home' component={App} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/admin' component={Admin} />
      <Route path='/blocks' component={Blocks} />
      <Route path='/blocks-umum' component={BlocksUmum} />
      <Route path='/blocks-admin' component={BlocksAdmin} />
      <Route path='/conduct-transaction' component={ConductTransaction} />
      <Route path='/conduct-transaction-admin' component={ConductTransactionAdmin} />
      <Route path='/transaction-pool' component={TransactionPool} />
      <Route path='/transaction-pool-admin' component={TransactionPoolAdmin} />
      <Route path='/production' component={Production} />
      <Route path='/search' component={Search} />
      <Route path='/search-umum' component={SearchUmum} />
      <Route path='/search-admin' component={SearchAdmin} />
      <Route path='/search-by-brand' component={SearchBrand} />
      <Route path='/search-by-brand-umum' component={SearchBrandUmum} />
      <Route path='/search-by-brand-admin' component={SearchBrandAdmin} />
      <Route path='/search-result' component={SearchResult} />
      <Route path='/search-result-umum' component={SearchResultUmum} />
      <Route path='/search-result-admin' component={SearchResultAdmin} />
      <Route path='/search-result-brand' component={SearchResultBrand} />
      <Route path='/search-result-brand-umum' component={SearchResultBrandUmum} />
      <Route path='/search-result-brand-admin' component={SearchResultBrandAdmin} />
    </Switch>
  </Router>,
  document.getElementById('root')
);