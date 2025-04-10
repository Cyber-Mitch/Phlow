const axios = require('axios');

// Orbiter Finance API configuration
const ORBITER_API_URL = 'https://testnet-api.orbiter.finance/sdk'; // Testnet URL
const ORBITER_API_KEY = 'YOUR_ORBITER_API_KEY'; // Replace with your Orbiter API key

/**
 * Bridge tokens from StarkNet to Ethereum using Orbiter Finance.
 * @param {string} txHash - The StarkNet transaction hash of the token transfer.
 * @param {string} recipient - The Ethereum address to receive the tokens.
 * @param {string} token - The token symbol (e.g., 'ETH', 'USDT', 'STRK').
 * @param {number} amount - The amount of tokens to bridge.
 * @returns {object} - The bridge transaction details.
 */
exports.bridgeToEthereum = async (txHash, recipient, token, amount) => {
  try {
    // Call Orbiter API to initiate the bridge
    const response = await axios.post(`${ORBITER_API_URL}/bridge`, {
      sourceChain: 'starknet',
      targetChain: 'ethereum',
      txHash,
      recipient,
      token,
      amount: amount.toString(),
    }, {
      headers: {
        'Authorization': `Bearer ${ORBITER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Orbiter Bridge Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to initiate bridge transaction.');
  }
};

/**
 * Check the status of a bridge transaction.
 * @param {string} txHash - The transaction hash of the bridge transaction.
 * @returns {object} - The status of the bridge transaction.
 */
exports.checkBridgeStatus = async (txHash) => {
  try {
    const response = await axios.get(`${ORBITER_API_URL}/transaction/status/${txHash}`, {
      headers: {
        'Authorization': `Bearer ${ORBITER_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Orbiter Status Check Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to check bridge transaction status.');
  }
}