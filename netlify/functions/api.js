const serverless = require('serverless-http');
const { createApp } = require('../../backend/app');

const app = createApp();
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};
