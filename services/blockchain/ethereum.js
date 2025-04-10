const { ethers } = require('ethers');

const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_KEY);

exports.getBalance = async (address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching Ethereum balance:', error);
    throw new Error('Failed to fetch Ethereum balance.');
  }
};

exports.transferTokens = async (privateKey, toAddress, amount) => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(amount)
    });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error transferring Ethereum:', error);
    throw new Error('Failed to transfer Ethereum.');
  }
};