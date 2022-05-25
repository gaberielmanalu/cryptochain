const { text } = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signupSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    instanceName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    refresh_token: {
        type: String
    },
    wallet: {
        type: Object
    },
    publicKey: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }

  });
  
const signupDB = mongoose.model('user', signupSchema);


module.exports =  signupDB;