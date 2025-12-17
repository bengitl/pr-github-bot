const express = require('express');
const app = express();

// 使用 express.json() 解析 JSON 请求体
app.use(express.json());

// 使用 webhook 路由
app.use('/api/webhook', require('./routes/webhook'));

module.exports = app;
