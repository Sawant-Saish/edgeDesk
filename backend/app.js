require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

let initialized = false;
let usingMemory = false;

async function initDB() {
  if (initialized) return;
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edgedesk_frm';

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log('[mongo] connected');
    }
  } catch (err) {
    console.warn('[mongo] unavailable — installing in-memory store:', err.message);
    require('./devMemoryStore').install();
    usingMemory = true;
  }
  initialized = true;
}

function createApp() {
  const { authMiddleware } = require('./middleware/auth');
  const authRoutes = require('./routes/auth.routes');
  const frmRoutes = require('./modules/frm/frm.routes');

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));

  app.use(async (req, _res, next) => {
    await initDB();
    // Normalize path for Netlify Functions when prefix /.netlify/functions/api is present
    if (req.url.startsWith('/.netlify/functions/api')) {
      req.url = req.url.replace('/.netlify/functions/api', '/api');
    }
    next();
  });

  const healthHandler = (_req, res) => {
    res.json({
      ok: true,
      module: 'frm',
      storage: usingMemory ? 'memory' : 'mongo',
      llmMock:
        process.env.LLM_MOCK === 'true' ||
        (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY),
    });
  };

  app.get(['/api/health', '/health'], healthHandler);
  app.use(['/api/auth', '/auth'], authRoutes);
  app.use(['/api/frm', '/frm'], authMiddleware, frmRoutes);

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
