import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class SearchBrandAdmin extends Component {
  state = { brand: ''};

  refreshToken =  () => {
    fetch(`${document.location.origin}/api/refresh-token`)
        .then(response => response.json())
        .then(json => {
        if (json.type === 'error'){
          history.push('/login');
        }
        });
    }   

    componentDidMount() {
      this.refreshToken(); }

  updateBrand = event => {
    this.setState({ brand: event.target.value });
  }

  passingBrand = () => {
    const { brand } = this.state;

    fetch(`${document.location.origin}/api/search-by-brand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/search-result-brand');
      });
  }
  
  render() {
    return (
      <div className='SearchBrand'>
        <Link to='/Admin'>Home</Link>
        <h3>Cari Peredaran Merek:</h3>
        <br/>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='brand'
            value={this.state.brand}
            onChange={this.updateBrand}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.passingBrand}
          >
            Search
          </Button>
        </div>
      </div>
    )
  }
};

export default SearchBrandAdmin;