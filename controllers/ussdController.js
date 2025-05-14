// ussdController.js
const { handleMenuNavigation } = require('../services/ussdFlowManager');

exports.processUSSD = async (req, res) => {
  // Extract parameters from Africa's Talking API POST request
  const { sessionId, phoneNumber, serviceCode, text } = req.body;

  try {
    // Pass the parameters to the flow manager
    const response = await handleMenuNavigation({
      sessionId,
      phoneNumber,
      serviceCode,
      text,
    });

    // Set the response content type as required by Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    // Send an END response if an error occurs
    res.set('Content-Type', 'text/plain');
    res.send(`END Error: ${error.message}`);
  }
};