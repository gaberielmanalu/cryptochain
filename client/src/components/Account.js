import React from 'react';

const Account = ({ account }) => {
  const {name, publicKey} = account;

  return (
    <div className='Account'>
      <div>Name:  {name} || publicKey: {publicKey}</div>
    </div>
  );
}

export default Account;