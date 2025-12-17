
const express = require('express');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const githubConfig = require('../config/github');
const modelscopeController = require('../controllers/modelscope');

const router = express.Router();
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: githubConfig,
});

// 使用 express.json() 解析 JSON 请求体
router.post('/', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    const event = req.headers['x-github-event'];

    console.log('Received payload:', payload);
    console.log('Event type:', event);

    // 验证签名（可选）
    const signature = req.headers['x-hub-signature-256'];
    console.log('Signature:', signature);

    // 处理 Pull Request 事件
    if (event === 'pull_request') {
      const action = payload.action;
      const prNumber = payload.pull_request.number;
      const prTitle = payload.pull_request.title;
      console.log(`Pull Request #${prNumber} ${action}: ${prTitle}`);

      if (action === 'opened') {
        // 获取 PR 详情
        const prDetails = await octokit.pulls.get({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          pull_number: prNumber,
        });

        // 调用 AI 模型生成摘要
        const summary = await modelscopeController.generateSummary(prDetails.data);

        // 在 PR 下添加评论
        await octokit.issues.createComment({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          issue_number: prNumber,
          body: `## AI Generated Summary\n\n${summary}`,
        });

        console.log(`AI Summary added to PR #${prNumber}`);
        res.status(200).send(`Processed PR #${prNumber}: AI Summary added`);
      } else {
        res.status(200).send(`Received PR #${prNumber} ${action} event`);
      }
    } else {
      res.status(200).send(`Received ${event} event`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
