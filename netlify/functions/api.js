const serverless = require('serverless-http');
const { createApp } = require('../../backend/app');

const app = createApp();
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Normalize event.path for Netlify redirect handling
  if (event.path) {
    if (event.path.startsWith('/.netlify/functions/api')) {
      event.path = event.path.replace('/.netlify/functions/api', '/api');
    } else if (!event.path.startsWith('/api')) {
      event.path = '/api' + (event.path.startsWith('/') ? '' : '/') + event.path;
    }
  }
  return await handler(event, context);
};
