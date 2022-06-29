import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button } from 'react-bootstrap';
import logo from '../assets/logo.png';
import history from '../history';

class Admin extends Component {
  state = { walletInfo: {}, token: {} };

  
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
      this.refreshToken();
      fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));  
  
  
    }

  logout =  () => {
    axios.delete(`${document.location.origin}/api/logout`)
    .then(history.push('/login'));
    
   
   
 }

  render() {
    const { address, balance, name } = this.state.walletInfo;

    return (
      <div className='App'>
      <div className='Pinggir'>Halo, {name}</div>
      <br/>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          Selamat Datang pada Jaringan Blockchain Rantai Pasok Beras
        </div>
        <br />
        <div><Link to='/blocks-admin'>Blocks</Link></div>
        <div><Link to='/conduct-transaction-admin'>Jual Beli</Link></div>
        <div><Link to='/production'>Lapor Produksi Beras</Link></div>
        <div><Link to='/transaction-pool-admin'>Daftar Transaksi</Link></div>
        <div><Link to='/search-admin'>Pencarian Instansi</Link></div>
        <div><Link to='/search-by-brand-admin'>Pencarian Merk</Link></div>
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

export default Admin;