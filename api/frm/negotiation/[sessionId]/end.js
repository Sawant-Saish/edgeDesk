const { createApp } = require('../../../../backend/app');
const app = createApp();

module.exports = (req, res) => {
  return app(req, res);
};
