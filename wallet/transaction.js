const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
  constructor({ senderWallet, senderName, recipient, recipientName, amount, outputMap, input, detail, price, brand }) {
    this.id = uuid();
    this.detail = detail || this.createDetail({recipient, price, brand});
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
    this.input = input || this.createInput({ senderWallet, senderName, recipientName, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet, senderName, recipientName, outputMap, detail }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      senderName: senderName,
      recipientName: recipientName,
      signature: senderWallet.sign(outputMap, detail)
    };
  }

  createDetail({ recipient, price, brand }){
    const detail = {};

      detail[recipient] = {price, brand};

      return detail;

    }

  

  update({ senderWallet, senderName, recipient, recipientName, amount, price }) {
    
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance');
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    this.detail[recipient] = price;

    this.input = this.createInput({ senderWallet, senderName, recipientName, outputMap: this.outputMap, detail: this.detail});

    
  }

  static validTransaction(transaction) {
    const { input: { address, amount, signature }, outputMap, passing} = transaction;

    const outputTotal = Object.values(outputMap)
      .reduce((total, outputAmount) => total + outputAmount);

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if(!passing){
      if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
        console.error(`Invalid signature from ${address}`);
        return false;
      }
    }
    

    return true;
  }

  static rewardTransaction({ minerWallet }) {
    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD }
    });
  }

  static inputProduction({ minerWallet, amount }) {
    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: amount }
    });
  }
}

module.exports = Transaction;