require('dotenv').config();

const express = require('express');
const cors = require('cors');

let initialized = false;

function initDB() {
  if (initialized) return;
  console.log('[db] Zero-delay in-memory store activated for Hackathon MVP demo');
  require('./devMemoryStore').install();
  initialized = true;
}

function createApp() {
  initDB();

  const { authMiddleware } = require('./middleware/auth');
  const authRoutes = require('./routes/auth.routes');
  const frmRoutes = require('./modules/frm/frm.routes');

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const healthHandler = (_req, res) => {
    res.json({
      ok: true,
      module: 'frm',
      storage: 'memory',
      llmMock: true,
    });
  };

  app.get(['/api/health', '/health', '/.netlify/functions/api/health'], healthHandler);
  app.use(['/api/auth', '/auth', '/.netlify/functions/api/auth'], authRoutes);
  app.use(['/api/frm', '/frm', '/.netlify/functions/api/frm', '/.netlify/functions/api'], authMiddleware, frmRoutes);
  app.use('/api', authMiddleware, frmRoutes);
  app.use('/', authMiddleware, frmRoutes);

  app.use((err, _req, res, _next) => {
    console.error('[server]', err);
    res.status(500).json({
      error: 'server_error',
      message: err.message || 'Unexpected server error.',
    });
  });

  return app;
}

module.exports = { createApp, initDB };
