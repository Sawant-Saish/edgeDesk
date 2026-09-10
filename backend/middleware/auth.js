const jwt = require('jsonwebtoken');

/**
 * JWT auth middleware (IncomeX-compatible shape).
 * Expects: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Missing or invalid Authorization header.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'edgedesk-frm-dev-secret-change-me';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.sub || payload.id, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Token expired or invalid. Please sign in again.',
    });
  }
}

module.exports = { authMiddleware };
