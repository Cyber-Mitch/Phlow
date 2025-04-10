const { Account, RpcProvider, Contract, uint256 } = require('starknet');

// Initialize StarkNet provider (Testnet)
const provider = new RpcProvider({ nodeUrl: 'https://starknet-testnet.infura.io/v3/YOUR_INFURA_KEY' });

// Token contract addresses (Testnet)
const TOKENS = {
  STARK: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // ETH on StarkNet
  ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // ETH on StarkNet
  USDT: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // USDT on StarkNet
};

// ERC20 ABI (simplified for balance and transfer)
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'felt' }],
    outputs: [{ name: 'balance', type: 'Uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'felt' },
      { name: 'amount', type: 'Uint256' },
    ],
    outputs: [],
  },
];

/**
 * Get the balance of a specific token for a given address.
 * @param {string} address - The StarkNet address to check the balance for.
 * @param {string} token - The token symbol (e.g., 'ETH', 'USDT', 'STRK').
 * @returns {string} - The token balance as a string.
 */
exports.getBalance = async (address, token) => {
  try {
    const contract = new Contract(ERC20_ABI, TOKENS[token], provider);
    const balance = await contract.balanceOf(address);
    return uint256.uint256ToBN(balance.balance).toString();
  } catch (error) {
    console.error(`Error fetching balance for ${token}:`, error);
    throw new Error(`Failed to fetch ${token} balance.`);
  }
};

/**
 * Transfer tokens from one StarkNet address to another.
 * @param {string} privateKey - The private key of the sender.
 * @param {string} fromAddress - The sender's StarkNet address.
 * @param {string} toAddress - The recipient's StarkNet address.
 * @param {string} token - The token symbol (e.g., 'ETH', 'USDT', 'STRK').
 * @param {number} amount - The amount of tokens to transfer.
 * @returns {string} - The transaction hash.
 */
exports.transferTokens = async (privateKey, fromAddress, toAddress, token, amount) => {
  try {
    const account = new Account(provider, fromAddress, privateKey);
    const contract = new Contract(ERC20_ABI, TOKENS[token], account);

    // Convert amount to Uint256 format
    const amountUint256 = uint256.bnToUint256(amount);

    // Execute the transfer transaction
    const tx = await contract.transfer(toAddress, amountUint256);
    await provider.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  } catch (error) {
    console.error(`Error transferring ${token}:`, error);
    throw new Error(`Failed to transfer ${token}.`);
  }
};