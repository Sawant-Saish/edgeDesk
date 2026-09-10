const serverless = require('serverless-http');
const { createApp } = require('../../backend/app');

const app = createApp();
const handler = serverless(app, {
  binary: ['multipart/form-data', 'application/pdf', 'image/*', 'application/octet-stream'],
});

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};
