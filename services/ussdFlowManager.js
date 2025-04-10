const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { getBalance, transferTokens } = require('./blockchain/starknet');
const { bridgeToEthereum } = require('./blockchain/orbiter');
const { convertToFiat } = require('./offramp/wyre');

exports.handleMenuNavigation = async ({ sessionId, phoneNumber, text }) => {
  try {
    const user = await User.findOne({ phoneNumber });
    const input = text ? text.split('*') : []; // Split USSD input by '*'

    if (input.length === 0) {
      // Initial menu
      return `CON Welcome to Plow!
      1. Connect Wallet
      2. Check Balance
      3. Convert Crypto to Cash
      4. Transaction History
      5. Change Bank Account`;
    }

    const [step, ...values] = input;

    switch (step) {
      case '1': // Connect Wallet
        if (values.length === 0) {
          return `CON Enter your wallet details in this format:
          StarkNet Private Key,StarkNet Address,Ethereum Private Key,Ethereum Address
          Example: 0x123...,0x456...,0x789...,0xabc...`;
        }

        // Split the input into individual values
        const [starknetPrivateKey, starknetAddress, ethereumPrivateKey, ethereumAddress] = values[0].split(',');

        // Validate the input
        if (!starknetPrivateKey || !starknetAddress || !ethereumPrivateKey || !ethereumAddress) {
          return 'END Invalid format. Please try again.';
        }

        // Save the wallet details
        await User.findOneAndUpdate(
          { phoneNumber },
          { 
            starknetPrivateKey, 
            starknetAddress, 
            ethereumPrivateKey, 
            ethereumAddress 
          },
          { upsert: true }
        );
        return 'END Wallet connected successfully!';

      case '2': // Check Balance
        if (!user) return 'END Wallet not connected. Use option 1 to connect.';
        const starknetBalance = await getBalance(user.starknetAddress, 'ETH');
        return `END Your StarkNet balance: ${starknetBalance} ETH`;

      case '3': // Convert Crypto to Cash
        if (!user) return 'END Wallet not connected. Use option 1 to connect.';
        if (values.length === 0) return `CON Select token:
        1. STRK (StarkNet)
        2. ETH (StarkNet)
        3. USDT (StarkNet)`;

        const tokenOption = values[0];
        let token;
        switch (tokenOption) {
          case '1':
            token = 'STRK';
            break;
          case '2':
            token = 'ETH';
            break;
          case '3':
            token = 'USDT';
            break;
          default:
            return 'END Invalid token selected.';
        }

        if (values.length === 1) return `CON Enter amount to convert (in ${token}):`;
        if (values.length === 2) return 'CON Enter your bank account number:';

        const amount = parseFloat(values[1]);
        const accountNumber = values[2];

        // Step 1: Transfer tokens to Orbiter's StarkNet address
        const orbiterStarknetAddress = '0xOrbiterStarknetAddress'; // Replace with Orbiter's StarkNet address
        const txHash = await transferTokens(user.starknetPrivateKey, user.starknetAddress, orbiterStarknetAddress, token, amount);

        // Step 2: Initiate bridge to Ethereum using Orbiter
        const bridgeResult = await bridgeToEthereum(txHash, user.ethereumAddress, token, amount);

        // Step 3: Convert bridged tokens to fiat using Wyre
        const fiatTx = await convertToFiat(bridgeResult.recipient, amount, accountNumber);

        // Save transaction to database
        await Transaction.create({
          user: user._id,
          type: 'conversion',
          token,
          amount,
          status: 'completed',
          txHash: fiatTx.id
        });

        return `END Conversion successful! Fiat TX ID: ${fiatTx.id}`;

      case '4': // Transaction History
        if (!user) return 'END Wallet not connected. Use option 1 to connect.';
        const transactions = await Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
        if (transactions.length === 0) return 'END No transactions found.';

        let history = 'END Recent Transactions:\n';
        transactions.forEach((tx, index) => {
          history += `${index + 1}. ${tx.type} - ${tx.amount} ${tx.token} - ${tx.status}\n`;
        });
        return history;

      case '5': // Change Bank Account
        if (!user) return 'END Wallet not connected. Use option 1 to connect.';
        if (values.length === 0) return 'CON Enter new bank account number:';
        if (values.length === 1) return 'CON Enter bank code:';

        await User.findOneAndUpdate(
          { phoneNumber },
          { bankAccount: { number: values[0], code: values[1] } }
        );
        return 'END Bank account updated successfully!';

      default:
        return 'END Invalid option. Please try again.';
    }
  } catch (error) {
    console.error(`Error in session ${sessionId}:`, error);
    return 'END An error occurred. Please try again later.';
  }
};