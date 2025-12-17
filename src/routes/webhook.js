const express = require('express');
const router = express.Router();

// 使用 express.raw 以接收原始请求体
router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());
    console.log('Received payload:', payload);

    // 签名验证（可选）
    const signature = req.headers['x-hub-signature-256'];
    console.log('Signature:', signature);

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error parsing payload:', error);
    res.status(400).send('Bad Request: Invalid payload');
  }
});

module.exports = router;

