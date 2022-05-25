import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import history from '../history';


class Signup extends Component {
  state = { fullName: '', username: '', instanceName:'', email:'', password:'', confPassword:'', role:'user'};

  updateRole = event => {
    this.setState({ role: event.target.value });
  }

  updateFullName = event => {
    this.setState({ fullName: event.target.value });
  }

  updateInstanceName = event => {
    this.setState({ instanceName: event.target.value });
  }

  updateEmail = event => {
    this.setState({ email: event.target.value });
  }

  updateUsername = event => {
    this.setState({ username: event.target.value });
  }

  updatePassword = event => {
    this.setState({ password: event.target.value });
  }

  updateConfPassword = event => {
    this.setState({ confPassword: event.target.value });
  }
  
  
  
  
  submitData =  () => {
    const { fullName, instanceName, username, email, password, confPassword, role} = this.state;

    fetch(`${document.location.origin}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, instanceName, email, password, confPassword, role })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        if(json.type === 'error'){
          history.push('/signup');
        } else {
          history.push('/');
        }
      
      });

  
    
  }
  
  
  render() {
    const {role}= this.state;
    return (
        
      <div className='Signup'>
        <label>Full Name:: </label>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='fullName'
            value={this.state.fullName}
            onChange={this.updateFullName}
          />
        </FormGroup>

        <label>Instance Name: </label>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='instanceName'
            value={this.state.instanceName}
            onChange={this.updateInstanceName}
          />
        </FormGroup>

        <label>E-mail: </label>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='email'
            value={this.state.email}
            onChange={this.updateEmail}
          />
        </FormGroup>

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
            placeholder='****'
            value={this.state.password}
            onChange={this.updatePassword}
          />
        </FormGroup>

        <label>Confirm Password: </label>
        <FormGroup>
          <FormControl
            input='password'
            type='password'
            placeholder='****'
            value={this.state.confPassword}
            onChange={this.updateConfPassword}
          />
        </FormGroup>
        

        <label>
            Admin
            <input type="radio"
                    value="admin"
                    checked={role ==='admin'}
                    onChange={this.updateRole} />
        </label>
        <label>
            User
            <input type="radio"
                    value="user"
                    checked={role ==='user'}
                    onChange={this.updateRole} />
        </label>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.submitData}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default Signup;