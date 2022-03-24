const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const WalletPool = require('./wallet/wallet-pool');
const Account = require('./wallet/account');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

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

let listTransaction = {};
let searchedAddress = {};
let searchedBalance = {};
let searchedName = {};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

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

app.post('/api/transact', (req, res) => {
  const { amount, recipient, price } = req.body;

  let transaction = transactionPool
    .existingTransaction({ inputAddress: wallet.publicKey });

  let recipientAccount = walletPool.existingAccount({inputAddress: recipient});

  let senderAccount = walletPool.existingAccount({inputAddress: wallet.publicKey});


  try {
    if(recipientAccount){
      if (transaction) {
        transaction.update({ 
          senderWallet: wallet, senderName: senderAccount.name , recipient, recipientName: recipientAccount.name, amount, price});
      } else {
        transaction = wallet.createTransaction({
          recipient,
          senderName: senderAccount.name,
          recipientName: recipientAccount.name,
          amount,
          price,
          chain: blockchain.chain
        });
      }
    } else {
      throw new Error('Recipient does not exist');
    }
    } catch(error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/get-result', (req, res) => {
  res.json(listTransaction);
});

app.get('/api/clear-list-search', (req, res) => {

  listTransaction = {};
  searchedAddress = {};
  searchedBalance = {};
  searchedName = {};
  res.json({type: 'success'});
});

app.get('/api/get-contact', (req, res) => {
  res.json(walletPool.walletMap);
});


app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.post('/api/production', (req, res) => {
   const { amount } = req.body;
  transactionMiner.mineProduction({amount});

  res.json({ type: 'success' }); 
});

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
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