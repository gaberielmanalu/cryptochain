import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class Search extends Component {
  state = { address: ''};

  updateAddress = event => {
    this.setState({ address: event.target.value });
  }

  passingAddress = () => {
    const { address } = this.state;

    fetch(`${document.location.origin}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/search-result');
      });
  }
  
  render() {
    return (
      <div className='Search'>
        <Link to='/home'>Home</Link>
        <h3>Cari Riwayat Instance: </h3>
        <br/>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='address'
            value={this.state.address}
            onChange={this.updateAddress}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.passingAddress}
          >
            Search
          </Button>
        </div>
      </div>
    )
  }
};

export default Search;