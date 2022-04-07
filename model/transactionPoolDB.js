const mongoose = require('mongoose');
const TransactionPool = require('../wallet/transaction-pool');
const Schema = mongoose.Schema;

const transactionPoolSchema = new Schema({
    Transaction:{
      id: String,
      detail: Object,
      outputMap: Object,
      input:{
        timestamp : Number,
        amount: Number,
        address: String,
        senderName: String,
        signature : Object
        
      },
      passing: {
        type: String,
        default: 'yes'
      }
    }
  });
  



const transactionPoolDB = mongoose.model('transaction', transactionPoolSchema);

module.exports =  transactionPoolDB;