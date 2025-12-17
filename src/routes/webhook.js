const express = require('express');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const githubConfig = require('../config/github');
const modelscopeController = require('../controllers/modelscope');

const router = express.Router();

// 使用 express.json() 解析 JSON 请求体
router.post('/', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    const event = req.headers['x-github-event'];

    console.log('Received payload:', payload);
    console.log('Event type:', event);

    if (event === 'pull_request') {
      const action = payload.action;
      const prNumber = payload.pull_request.number;
      const prTitle = payload.pull_request.title;
      console.log(`Pull Request #${prNumber} ${action}: ${prTitle}`);

      if (action === 'opened') {
        // 获取安装 ID
        const installationId = payload.installation.id;
        if (!installationId) {
          console.error('Installation ID not found in payload');
          return res.status(400).send('Bad Request: Installation ID not found');
        }

        // 创建认证对象
        const auth = createAppAuth({
          appId: githubConfig.appId,
          privateKey: githubConfig.privateKey,
          installationId: installationId,
        });

        // 获取 Octokit 实例
        const octokit = new Octokit({ authStrategy: createAppAuth, auth });

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

