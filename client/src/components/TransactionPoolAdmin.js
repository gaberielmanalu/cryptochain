import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';

const POLL_INERVAL_MS = 1000;

class TransactionPoolAdmin extends Component {
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

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
      .then(response => {
        if (response.status === 200) {
          alert('success');
          history.push('/blocks');
        } else {
          alert('The mine-transactions block request did not complete.');
        }
      });
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
        <div><Link to='/Admin'>Home</Link></div>
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
        <hr />
        <Button
          bsStyle="danger"
          onClick={this.fetchMineTransactions}
        >
          Mine the Transactions
        </Button>
      </div>
    )
  }
}

export default TransactionPoolAdmin;