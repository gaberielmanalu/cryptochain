import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class Login extends Component {
  state = { name: ''};

  updateName = event => {
    this.setState({ name: event.target.value });
  }

  conductName = () => {
    const { name } = this.state;

    fetch(`${document.location.origin}/api/add-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/home');
      });
  }
  
  render() {
    return (
      <div className='Login'>
        <Link to='/home'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br/>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='name'
            value={this.state.name}
            onChange={this.updateName}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.conductName}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default Login;