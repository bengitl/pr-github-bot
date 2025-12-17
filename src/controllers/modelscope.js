const axios = require('axios');
const modelscopeConfig = require('../config/modelscope');

async function generateSummary(prDetails) {
  const prompt = `
    为以下 Pull Request 生成简洁且信息丰富的摘要：
    标题: ${prDetails.title}
    描述: ${prDetails.body}
    Diff: ${prDetails.diff_url}
  `;

  const response = await axios.post(
    modelscopeConfig.apiUrl,
    {
      model: modelscopeConfig.model,
      input: {
        prompt: prompt,
      },
      parameters: {
        max_tokens: 512,
        temperature: 0.7,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modelscopeConfig.apiKey}`,
      },
    }
  );

  return response.data.output.text;
}

module.exports = {
  generateSummary,
};
