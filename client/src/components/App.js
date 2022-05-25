import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {Button } from 'react-bootstrap';
import history from '../history';
import axios from 'axios';


class App extends Component {
  state = { walletInfo: {}, token: {}};

  refreshToken =  () => {
    fetch(`${document.location.origin}/api/refresh-token`)
        .then(response => response.json())
        .then(json => {
        if (json.type === 'error'){
          history.push('/');
        }
        });
    }


  componentDidMount() {
    this.refreshToken();

    /*
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));  

    */
  }

 
  logout =  () => {
     axios.delete(`${document.location.origin}/api/logout`)
     .then(history.push('/'));
     
    
    
  }

  render() {
    const { address, balance, name } = this.state.walletInfo;
    

    return (
      <div className='App'>
      <div className='Pinggir'>Halo,{name}</div>
      <br/>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          Selamat Datang pada Jaringan Blockchain Rantai Pasok Beras
        </div>
        <br />
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Jual Beli</Link></div>
        
        <div><Link to='/transaction-pool'>Daftar Transaksi</Link></div>
        <div><Link to='/search'>Pencarian Instansi</Link></div>
        <div><Link to='/search-by-brand'>Pencarian Merk</Link></div>
        <br />
        <div className='WalletInfo'>
          <div>Address: {address}</div>
          <div>Jumlah Beras: {balance} Kg</div>
        </div>
        <Button
            bsStyle="danger"
            onClick={this.logout}
          >
            Logout
          </Button>
      </div>
      

      
    );
  }
}

export default App;