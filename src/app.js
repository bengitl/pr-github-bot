const express = require('express');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(express.json());

app.use('/api', webhookRouter);

module.exports = app;
