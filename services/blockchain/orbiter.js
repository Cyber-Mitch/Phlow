// blockchain/orbiter.js
const { OrbiterClient, ENDPOINT } = require('@orbiter-finance/bridge-sdk');
const { Account, RpcProvider, constants } = require('starknet');
const { decrypt } = require('../middleware/security');

const provider = new RpcProvider({ nodeUrl: 'https://starknet-testnet.infura.io/v3/YOUR_INFURA_KEY' });

// Initialize Orbiter client
const orbiter = await OrbiterClient.create({
  apiEndpoint: ENDPOINT.TESTNET,
  apiKey: process.env.ORBITER_API_KEY,
  channelId: process.env.ORBITER_CHANNEL_ID
});

exports.bridgeToEthereum = async (privateKey, starknetAddress, recipient, token, amount) => {
  const tradePair = {
    srcChainId: 'SN_SEPOLIA',
    dstChainId: '11155111', // Sepolia Ethereum testnet
    srcTokenSymbol: token,
    dstTokenSymbol: token,
    routerType: 'CONTRACT'
  };

  const router = orbiter.createRouter(tradePair);
  const sendValue = amount.toString(); // Ensure amount is in correct format

  const account = new Account(provider, starknetAddress, privateKey);
  const approve = await router.createApprove(starknetAddress, sendValue);
  const transaction = router.createTransaction(starknetAddress, recipient, sendValue);

  const txResponse = await account.execute([approve, transaction]);
  await provider.waitForTransaction(txResponse.transaction_hash);

  return { transactionHash: txResponse.transaction_hash, recipient };
};

exports.bridgeToStarkNet = async (ethereumAddress, recipient, token, amount) => {
  const tradePair = {
    srcChainId: '11155111',
    dstChainId: 'SN_SEPOLIA',
    srcTokenSymbol: token,
    dstTokenSymbol: token,
    routerType: 'EOA'
  };

  const router = orbiter.createRouter(tradePair);
  const sendValue = amount.toString();

  // Note: Requires Ethereum wallet integration for signing, omitted here for simplicity
  // Assume Yellow Card handles sending to Ethereum, and we bridge from there
  const transaction = router.createTransaction(ethereumAddress, recipient, sendValue);
  // Execute via Ethereum provider (e.g., ethers.js) - to be implemented if needed
};