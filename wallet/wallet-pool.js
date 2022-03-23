class WalletPool {
  constructor() {
    this.walletMap = {};
  }


  setWallet(account) {
 
    this.walletMap[account.id] = account;
  }

  setMap(walletMap) {
    this.walletMap = walletMap;
  }

  existingAccount({ inputAddress }) {
    const accounts = Object.values(this.walletMap);

    return accounts.find(account => account.publicKey === inputAddress);
  }

  
}

module.exports = WalletPool;
