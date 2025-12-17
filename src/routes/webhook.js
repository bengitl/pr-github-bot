
const express = require('express');
const router = express.Router();

// 使用 express.json() 解析 JSON 请求体
router.post('/', express.json(), (req, res) => {
  try {
    console.log('Received payload:', req.body);
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(400).send('Bad Request: Invalid payload');
  }
});

module.exports = router;
