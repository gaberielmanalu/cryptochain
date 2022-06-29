import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import history from '../history';


class SearchResultAdmin extends Component {
  state = { transactionPoolMap: {}, searchInfo: {} };

  refreshToken =  () => {
    fetch(`${document.location.origin}/api/refresh-token`)
        .then(response => response.json())
        .then(json => {
        if (json.type === 'error'){
          history.push('/login');
        }
        });
    }   


  clearList = () => {
    fetch(`${document.location.origin}/api/clear-list-search`)
      .then(response => {
        if (response.status === 200) {
          alert('success');
          history.push('/Admin');
        } else {
          alert('The clear transactions block request did not complete.');
        }
      });
  }


  componentDidMount() {
    this.refreshToken();
    fetch(`${document.location.origin}/api/get-searched-info`)
      .then(response => response.json())
      .then(json => this.setState({ searchInfo: json }));

    fetch(`${document.location.origin}/api/get-result`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
    
    
  }

    
  render() {
    const  { searchedAddress , searchedBalance, searchedName} = this.state.searchInfo;

    return (
      <div className='SearchResult'>
        <h3>Result</h3>
          <div className='searchInfo'>
          <div>Name: {searchedName}</div>
          <div>Address: {searchedAddress}</div>
          <div>Balance: {searchedBalance}</div>
        </div>
        <br/>
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

export default SearchResultAdmin;