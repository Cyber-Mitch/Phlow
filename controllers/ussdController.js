const { handleMenuNavigation } = require('../services/ussdFlowManager');

exports.processUSSD = async (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  
  try {
    const response = await handleMenuNavigation({
      sessionId,
      phoneNumber,
      input: text ? text.split('*') : []
    });
    
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    res.send(`END Error: ${error.message}`);
  }
};