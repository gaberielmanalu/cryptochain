const uuid = require('uuid/v1');

class Account {
  constructor() {
    this.id = uuid();
    this.name = '';
    this.publicKey= '';
  }

  addAttribute(name, publicKey){
      this.name = name;
      this.publicKey = publicKey;
  }
}

module.exports = Account;