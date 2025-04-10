const express = require('express');
const bodyParser = require('body-parser');
const { handleMenuNavigation } = require('./services/ussdFlowManager');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  try {
    const response = await handleMenuNavigation({ sessionId, phoneNumber, text });
    res.set('Content-Type: 'text/plain'),
    res.send(response);
  } catch (error) {
    res.send('END An error occurred. Please try again later.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});