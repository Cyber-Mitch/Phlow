const axios = require('axios');

exports.convertToFiat = async (ethereumAddress, amount, accountNumber) => {
  const response = await axios.post(
    'https://api.sendwyre.com/v3/transfers',
    {
      sourceCurrency: 'USDC',
      destCurrency: 'NGN',
      sourceAmount: amount.toString(),
      dest: `naira:${accountNumber}`,
      blockchainNetwork: 'ethereum',
      sourceAddress: ethereumAddress
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WYRE_API_KEY}`
      }
    }
  );

  return response.data; // { id, status, amount }
};