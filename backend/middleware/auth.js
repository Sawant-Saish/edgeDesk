const jwt = require('jsonwebtoken');

/**
 * JWT auth middleware (IncomeX-compatible shape).
 * Falls back to default hackathon demo user if token is missing or invalid.
 */
function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'edgedesk-frm-dev-secret-change-me';
      const payload = jwt.verify(token, secret);
      req.user = { id: payload.sub || payload.id, email: payload.email };
      return next();
    } catch {
      // Fall through to default user on invalid token
    }
  }

  // Default guest user for open hackathon demo access
  req.user = { id: 'demo_hackathon_user', email: 'visitor@incomex.ai' };
  return next();
}

module.exports = { authMiddleware };
