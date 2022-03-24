import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';


class SearchResultBrand extends Component {
  state = { transactionPoolMap: {}};

  clearList = () => {
    fetch(`${document.location.origin}/api/clear-list-search`)
      .then(response => {
        if (response.status === 200) {
          alert('success');
          history.push('/home');
        } else {
          alert('The clear transactions block request did not complete.');
        }
      });
  }


  componentDidMount() {
    fetch(`${document.location.origin}/api/get-result`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
    
    
  }

    
  render() {
    return (
      <div className='SearchResultBrand'>
        <h3>Result</h3>
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
          onClick={this.clearList}
        >
          Home
        </Button>
      </div>
    )
  }
}

export default SearchResultBrand;