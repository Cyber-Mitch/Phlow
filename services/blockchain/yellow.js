// services/yellowcard.js
const axios = require('axios');

const YELLOWCARD_API_URL = 'https://api.yellowcard.io'; // Update with actual URL

exports.buyCrypto = async (amount, bankAccount, ethereumAddress) => {
  const response = await axios.post(
    `${YELLOWCARD_API_URL}/v1/orders/buy`,
    {
      amount,
      currency: 'NGN', // Adjust based on your region
      paymentMethod: 'bank_transfer',
      cryptoCurrency: 'ETH',
      destinationAddress: ethereumAddress
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.YELLOWCARD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

exports.sellCrypto = async (amount, bankAccount, ethereumAddress) => {
  const response = await axios.post(
    `${YELLOWCARD_API_URL}/v1/orders/sell`,
    {
      amount,
      currency: 'NGN',
      paymentMethod: 'bank_transfer',
      cryptoCurrency: 'ETH',
      sourceAddress: ethereumAddress
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.YELLOWCARD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};