import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class App extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
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
        <div><Link to='/production'>Lapor Produksi Beras</Link></div>
        <div><Link to='/transaction-pool'>Daftar Transaksi</Link></div>
        <div><Link to='/search'>Pencarian Instansi</Link></div>
        <div><Link to='/search-by-brand'>Pencarian Merk</Link></div>
        <br />
        <div className='WalletInfo'>
          <div>Address: {address}</div>
          <div>Jumlah Beras: {balance} Kg</div>
        </div>
      </div>
    );
  }
}

export default App;