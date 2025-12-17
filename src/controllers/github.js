const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const modelscopeController = require('./modelscope'); // 修改为 modelscope
const githubConfig = require('../config/github');

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: githubConfig,
});

async function handlePullRequestOpened(context) {
  const { pull_request } = context.payload;
  const { owner, repo, number } = pull_request;

  const prDetails = await octokit.pulls.get({
    owner: owner.login,
    repo: repo.name,
    pull_number: number,
  });

  const summary = await modelscopeController.generateSummary(prDetails.data); // 修改为 modelscope

  await octokit.issues.createComment({
    owner: owner.login,
    repo: repo.name,
    issue_number: number,
    body: `## AI Generated Summary\n\n${summary}`,
  });
}

module.exports = {
  handlePullRequestOpened,
};
