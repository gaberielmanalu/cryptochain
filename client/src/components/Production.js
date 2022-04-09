import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Account from './Account';
import { Link } from 'react-router-dom';
import history from '../history';

const POLL_INERVAL_MS = 1000;


class Production extends Component {
  state = { recipient: '' , amount: 0,  knownAddresses: [] };

  fetchAccountPoolMap = () => {
    fetch(`${document.location.origin}/api/get-contact`)
        .then(response => response.json())
        .then(json => this.setState({ knownAddresses: json }));
    }
  
  
  componentDidMount() {
    this.fetchAccountPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.fetchAccountPoolMap(),
      POLL_INERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }


  conductTransaction = () => {
    const { amount, recipient } = this.state;

    fetch(`${document.location.origin}/api/production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, recipient })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  }
  
  render() {
    return (
      <div className='Production'>
        <Link to='/home'>Home</Link>
        <h3>Lapor Produksi Beras</h3>
        <br />
        <h4>Known Addresses</h4>
        {
          Object.values(this.state.knownAddresses).map(account => {
            return (
              <div key={account.id}>
                <hr />
                <Account account={account} />
              </div>
            )
          })
        }
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='recipient'
            value={this.state.recipient}
            onChange={this.updateRecipient}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='number'
            placeholder='amount'
            value={this.state.amount}
            onChange={this.updateAmount}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.conductTransaction}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default Production;