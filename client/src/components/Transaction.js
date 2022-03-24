import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, outputMap, detail } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className='Transaction'>
      <div>From: {`${input.senderName} || ${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
      {
          recipients.map(recipient => (
            detail[recipient] ? (
              <div key={recipient}>
                To: {`${input.recipientName} || ${recipient.substring(0, 20)}...`} | Sent: {`${outputMap[recipient]} liter`} | Brand: {detail[recipient].brand} |Price: {`${detail[recipient].price} /liter`}
              </div>
            ) : (
            <div key={recipient}>
                
            </div>
            )
        ))
      } 
    </div>
  );
}

export default Transaction;