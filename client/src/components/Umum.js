import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {Button } from 'react-bootstrap';
import history from '../history';
import axios from 'axios';


class Umum extends Component {


  render() {
   
    

    return (
      <div className='Umum'>
      <br/>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          Selamat Datang pada Jaringan Blockchain Rantai Pasok Beras
        </div>
        <br />
        <div><Link to='/blocks-umum'>Blocks</Link></div>
        <div><Link to='/search-umum'>Pencarian Instansi</Link></div>
        <div><Link to='/search-by-brand-umum'>Pencarian Merk</Link></div>
        <br />
        <div><Link to='/login'>Login</Link></div>
      </div>
      

      
    );
  }
}

export default Umum;