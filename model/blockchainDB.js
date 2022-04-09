const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockchainSchema = new Schema({
    Block: {
      timestamp: Number,
      lastHash: String,
      hash: String,
      data: Object,
      nonce: Number,
      difficulty: Number
    }
  });
  
const blockchainDB = mongoose.model('block', blockchainSchema);


module.exports =  blockchainDB;