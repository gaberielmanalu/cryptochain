import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';

const POLL_INERVAL_MS = 1000;

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  refreshToken =  () => {
    fetch(`${document.location.origin}/api/refresh-token`)
        .then(response => response.json())
        .then(json => {
        if (json.type === 'error'){
          history.push('/login');
        }
        });
    }   

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
  }


   componentDidMount() {
    this.refreshToken();
    this.fetchTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }
 

  render() {
    return (
      <div className='TransactionPool'>
        <div><Link to='/home'>Home</Link></div>
        <h3>Transaction Pool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TransactionPool;