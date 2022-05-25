import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class Login extends Component {
  state = { username: '', password:'', role:'admin'};

  updateUsername = event => {
    this.setState({ username: event.target.value });
  }

  updatePassword = event => {
    this.setState({ password: event.target.value });
  }

  updateRole = event => {
    this.setState({ role: event.target.value });
  }

  checkData = () => {
    const { username, password } = this.state;

    fetch(`${document.location.origin}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        if (json.type === 'successAdmin'){
          history.push('/admin');
        } else if (json.type === 'successUser') {
          history.push('/home');
        } else {
          history.push('/');
        }
        
      });
  }
  
  render() {
    const {role}= this.state;
    return (
      <div className='Login'>
        <label>Username: </label>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='username'
            value={this.state.username}
            onChange={this.updateUsername}
          />
        </FormGroup>

        <label>Password: </label>
        <FormGroup>
          <FormControl
            input='password'
            type='password'
            placeholder='*******'
            value={this.state.password}
            onChange={this.updatePassword}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.checkData}
          >
            Login
          </Button>
          <br/>
          <Link to='/signup'>Signup</Link>
        </div>
      </div>
    )
  }
};

export default Login;