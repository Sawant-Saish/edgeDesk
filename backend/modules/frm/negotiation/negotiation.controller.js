const negotiationService = require('./negotiation.service');

async function start(req, res) {
  try {
    const { skillProfileId, difficultyLevel } = req.body || {};
    if (!skillProfileId) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'skillProfileId is required.',
      });
    }

    const result = await negotiationService.startSession({
      userId: req.user.id,
      skillProfileId,
      difficultyLevel,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      error: err.code || 'server_error',
      message: err.message || 'Failed to start negotiation.',
    });
  }
}

async function message(req, res) {
  try {
    const result = await negotiationService.sendMessage({
      userId: req.user.id,
      sessionId: req.params.sessionId,
      text: req.body?.text,
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      error: err.code || 'server_error',
      message: err.message || 'Failed to send message.',
    });
  }
}

async function end(req, res) {
  try {
    const result = await negotiationService.endSession({
      userId: req.user.id,
      sessionId: req.params.sessionId,
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      error: err.code || 'server_error',
      message: err.message || 'Failed to end negotiation.',
    });
  }
}

module.exports = { start, message, end };
