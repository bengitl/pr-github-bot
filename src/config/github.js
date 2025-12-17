module.exports = {
  appId: process.env.GITHUB_APP_ID,
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
};
