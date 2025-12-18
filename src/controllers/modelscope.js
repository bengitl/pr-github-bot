const axios = require('axios');
const modelscopeConfig = require('../config/modelscope');

async function generateSummary(prDetails) {
  const prompt = `
    为以下 Pull Request 生成简洁且信息丰富的摘要：
    标题: ${prDetails.title}
    描述: ${prDetails.body || '无描述'}
    Diff: ${prDetails.diff_url}
  `;

  try {
    console.log('ModelScope API URL:', modelscopeConfig.apiUrl);
    console.log('ModelScope API Key:', modelscopeConfig.apiKey);

    const response = await axios.post(
      modelscopeConfig.apiUrl,
      {
        model: modelscopeConfig.model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelscopeConfig.apiKey}`,
        },
      }
    );

    console.log('ModelScope API Response:', response.data);
    return response.data.output.text;
  } catch (error) {
    console.error('Error calling ModelScope API:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  generateSummary,
};

