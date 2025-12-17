const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const githubController = require('../controllers/github');
const githubConfig = require('../config/github');

const router = express.Router();
const webhooks = new Webhooks({ secret: githubConfig.webhookSecret });

webhooks.on('pull_request.opened', githubController.handlePullRequestOpened);

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  webhooks.verifyAndReceive({ id: req.headers['x-github-delivery'], name: req.headers['x-github-event'], signature: req.headers['x-hub-signature-256'] }, req.body)
    .then(() => res.status(200).send('OK'))
    .catch(() => res.status(400).send('Error'));
});

module.exports = router;
