const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockchainSchema = new Schema({
    blockchainDB: Schema.Types.Mixed
  });
  
const blockchainDB = mongoose.model('block', blockchainSchema);


module.exports =  blockchainDB;