// app.js or server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ussdRoutes = require('./routes/ussd');

const app = express();

// Middleware to parse form-urlencoded and JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD route
app.use('/ussd', ussdRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});