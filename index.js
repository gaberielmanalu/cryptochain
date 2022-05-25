const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const mongoose =  require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');



const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const transactionPoolDB = require('./model/transactionPoolDB');
const blockchainDB = require('./model/blockchainDB');
const signupDB = require('./model/signupDB');
const WalletPool = require('./wallet/wallet-pool');
const Account = require('./wallet/account');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');


/*
  var someVar = [];

  db.query("select transaction as '' from transactions", function(err, rows){
    if(err) {
      throw err;
    } else {
      setValue(rows);
    }
  });

  function setValue(value) {
    textLength = value.length;
    someVar = value;
    //console.log(someVar);
  } 

*/


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const account = new Account();
const wallet = new Wallet();
const walletPool = new WalletPool();
const pubsub = new PubSub({ blockchain, transactionPool, wallet, walletPool});
const transactionMiner = new TransactionMiner({
    blockchain, transactionPool, wallet, pubsub
});
let user = {};

let listTransaction = {};
let searchedAddress = {};
let searchedBalance = {};
let searchedName = {};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()* 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

//const dbURI = 'mongodb://gabe:1234@blockchain-shard-00-00.4sedk.mongodb.net:27017,blockchain-shard-00-01.4sedk.mongodb.net:27017,blockchain-shard-00-02.4sedk.mongodb.net:27017/rantai-pasok?ssl=true&replicaSet=atlas-ie8ybu-shard-0&authSource=admin&retryWrites=true&w=majority';
dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS)
.then((result) => {
  app.listen(PORT,() => { 
    console.log(`listening at localhost: ${PORT}`);
    
    if(PORT !== DEFAULT_PORT){
        syncWithRootState(); 
    }    
})  
}).catch((err) => console.log(err));



inject();
async function inject(){
  const transactionInject = await transactionPoolDB.find();
  //console.log(transactionInject.Transaction.input.signature);
  if(transactionInject !== null){
    for(Transaction of transactionInject){
      transactionPool.setTransaction(Transaction.Transaction);
    }
  }
  blockchain.clearChain();
  const blockchainInject = await blockchainDB.find();
  //console.log(transactionInject.Transaction.input.signature);
    for(Block of blockchainInject){
      blockchain.chain.push(Block.Block);
    }
  

};




app.use(cors({ credentials:true, origin: `http://localhost:${DEFAULT_PORT}` }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/get-users', async (req,res) => {
  try{
    const users = await signupDB.find();
    res.json(users);
  } catch (err){
    console.log(err);
  }

});

app.post('/api/register', async (req,res) => {
  const { fullName, instanceName, username, email, password, role, confPassword } = req.body;
  try{
    if (password === confPassword){
      
      const salt = await bcrypt.genSalt();
      const hashPassword =  await bcrypt.hash(password, salt);
      const signupToDB =   new signupDB({
        fullName: fullName,
        instanceName: instanceName,
        email: email,
        username: username,
        password: hashPassword,
        role: role
      });
    
       signupToDB.save();
      //signupToDB.updateOne({username: username}, {$set :{wallet:wallet}});  
      //user = await signupDB.find({username: username});

    }  else {
      throw new Error('Password dan Confirm Password tidak sama!');
    }
  } catch(error){
    return res.status(400).json({ type: 'error', message: error.message });
  }

  
  
  /*
  try {
    const signupToDB = new signupDB({
      fullName: fullName,
      instanceName: instanceName,
      email: email,
      username: username,
      password: hashPassword,
      role: role
    });
  
    signupToDB.save()
    .then(data =>{
      res.json({msg:"Register Berhasil!"});
    })
  } catch (err) {
    
  }
  */
  res.json({ type: 'success' });
});

app.post('/api/login', async (req,res) => {
  const user = await signupDB.find({
    username: req.body.username
  });

  try{
    if(!user){
      throw new Error('Username tidak ditemukan!');
    } else {
      const match = await bcrypt.compare(req.body.password, user[0].password);
    
      if(match) {
        const userId = user[0].id;
        const fullName = user[0].fullName;
        const username = user[0].username;
        const role = user[0].role;

        const accessToken = jwt.sign({userId, fullName, username}, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn : '60s'
        });
        const refreshToken = jwt.sign({userId, fullName, username}, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn : '1d'
        });
        await signupDB.updateOne({username: req.body.username}, {$set: {refresh_token: refreshToken}}); 
        res.cookie('refreshToken', refreshToken ,{
          httpOnly: true,
          maxAge: 24*60*60*1000
      });
      if(role === 'admin'){
        res.json({ type: 'successAdmin' });
      } else {
        res.json({ type: 'successUser' });
      }
      } else {
        throw new Error('Wrong Password!');
        }
    }   
} catch (error) {
  return res.status(400).json({ type: 'error', message: error.message });
  }
});

app.get('/api/refresh-token', async (req,res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      throw new Error('401');
    } else {
      const user = await signupDB.find({ refresh_token: refreshToken});
      if(!user[0]){
        throw new Error ('403');
      } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
          if(err) {
            throw new Error('401');
          } else {
            const userId = user[0].id;
          const fullName = user[0].fullName;
          const username = user[0].username;
          const accessToken = jwt.sign({userId, fullName, username}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
          });
          res.json({accessToken});
          }
        })
      }
      
    }
  } catch (err){
    return res.status(400).json({ type: 'error', message: err.message });
  }
}); 

app.delete('/api/logout', async (req,res) =>{
  const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await signupDB.find({ refresh_token: refreshToken});
    if(!user[0]) return res.sendStatus(204);
    const userId =user[0].id;
    await signupDB.updateOne(
      { id: userId}, { $set: { refresh_token: null}}
    );
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}); 

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
  res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;

  const blocksReversed = blockchain.chain.slice().reverse();

  let startIndex = (id-1) * 5;
  let endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact',  async (req, res) => {
  const { amount, recipient, price, brand } = req.body;

  let transaction = transactionPool
    .existingTransaction({ inputAddress: wallet.publicKey });

  let recipientAccount = walletPool.existingAccount({inputAddress: recipient});

  let senderAccount = walletPool.existingAccount({inputAddress: wallet.publicKey});


  try {
    if(recipientAccount){
      if (!transaction) {
        transaction = wallet.createTransaction({
          recipient,
          senderName: senderAccount.name,
          recipientName: recipientAccount.name,
          amount,
          price,
          brand,
          chain: blockchain.chain
        });
        
        /*transaction.update({ 
          senderWallet: wallet, senderName: senderAccount.name , recipient, recipientName: recipientAccount.name, amount, price}); */
      }else {
        throw new Error('Lakukan Mining terlebih dahulu');
      }
    } else {
      throw new Error('Recipient does not exist');
    }
    } catch(error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  

  /*
   transactionPoolToDB.collection.deleteMany({}).then(function(){
    console.log("Data deleted"); // Success
    }).catch(function(error){
    console.log(error); // Failure
    });
  */
  const transactionPoolToDB = await new transactionPoolDB({
      Transaction: {
        id: transaction.id,
        detail: transaction.detail,
        outputMap: transaction.outputMap,
        input:{
          timestamp: transaction.input.timestamp,
          amount: transaction.input.amount,
          address: transaction.input.address,
          senderName: transaction.input.senderName,
          signature: transaction.input.signature
          
        }
      }
  });

  await transactionPoolToDB.save();

    //res.redirect('/api/add-transaction-pool');
  res.json({ type: 'success', transaction });
});

/*
app.get('/api/add-transaction-pool', (req,res)=>{
    
  transactionPoolToDB.save().then((result) => res.send(result)).catch((err)=>console.log(err)); 


}); 

*/



app.get('/api/transaction-pool-map', (req, res) => {

  res.json(transactionPool.transactionMap);
});

app.get('/api/get-result', (req, res) => {
  res.json(listTransaction);
});

app.get('/api/clear-list-search', (req, res) => {

  listTransaction = {};
  searchedAddress = '';
  searchedBalance = '';
  searchedName = '';
  res.json({type: 'success'});
});

app.get('/api/get-contact', (req, res) => {
  res.json(walletPool.walletMap);
});


app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  const  deleteTransaction = new transactionPoolDB;
  deleteTransaction.collection.deleteMany({}).catch(function(error){
    console.log(error); // Failure
    });
  
    

  res.redirect('/api/blocks');
});

app.post('/api/production', (req, res) => {
   const { amount, recipient } = req.body;
  transactionMiner.mineProduction({amount, recipient});

  res.json({ type: 'success' }); 
});

app.get('/api/wallet-info', (req, res) => {
  const address = user.publicKey;
  const name = user.instanceName;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
    name
  });
});

app.get('/api/known-addresses', (req, res) => {
  const addressMap = {};

  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      const recipient = Object.keys(transaction.outputMap);

      recipient.forEach(recipient => addressMap[recipient] = recipient);
    }
  }

  res.json(Object.keys(addressMap));
});

app.post('/api/search', (req, res) => {
  const {address} = req.body;

  searchedAddress = address;
  searchedBalance = Wallet.calculateBalance({ chain: blockchain.chain, address });
  searchedName = walletPool.existingAccount({inputAddress: address}).name;


        for (let block of blockchain.chain) {
          for (let transaction of block.data) {
            if(transaction.input.address == address){
              listTransaction[transaction.id] = transaction;
            }
          }
        }

  res.json({ type: 'success' }); 
});

app.post('/api/search-by-brand', (req, res) => {
  const {brand} = req.body;

    for (let block of blockchain.chain) {
      for (let transaction of block.data) {
        for(const key in transaction.detail){
          if(transaction.detail[key].brand == brand){
            listTransaction[transaction.id] = transaction;
          }
        }    
      }
    }
  
    res.json({ type: 'success' }); 
});

app.get('/api/get-searched-info', (req, res) =>{
  res.json({
    searchedAddress,
    searchedBalance, 
    searchedName
  });
});

app.post('/api/add-name',(req,res)=>{
  const { name } = req.body;
  account.addAttribute(name, wallet.publicKey);

  walletPool.setWallet(account);

  pubsub.broadcastAccount(account);

  res.json({ type: 'success' }); 
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/get-contact` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootWalletPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootWalletPoolMap);
      walletPool.setMap(rootWalletPoolMap);
    }
  });
};

/*

  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
      const transaction =  wallet.createTransaction({
          recipient, amount, chain: blockchain.chain
      });

      transactionPool.setTransaction(transaction);
  };

  const walletAction = () => generateWalletTransaction ({
      wallet, recipient: walletFoo.publicKey,  amount:5
  });

  const walletFooAction = () => generateWalletTransaction({
      wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  });

  const walletBarAction = () => generateWalletTransaction({
      wallet: walletBar, recipient: wallet.publicKey, amount: 15
  });
  
  for(let i = 0 ; i<5 ; i++){
      if (i%3 === 0){
          walletAction();
          walletFooAction();
      } else if (i%3 === 1) {
          walletAction();
          walletBarAction();
      } else {
          walletBarAction();
          walletFooAction();
      }

      transactionMiner.mineTransactions();
  }

*/
/*

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()* 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT,() => { 
    console.log(`listening at localhost: ${PORT}`);
    
    if(PORT !== DEFAULT_PORT){
        syncWithRootState(); 
    }    
});  

*/