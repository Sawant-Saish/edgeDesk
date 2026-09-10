require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

let initialized = false;
let usingMemory = false;

async function initDB() {
  if (initialized) return;
  const uri = process.env.MONGO_URI;

  // On serverless / public demo where MONGO_URI is missing, localhost, or 'memory',
  // instantly activate in-memory store so visitors get zero-delay instant MVP access.
  const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const isLocalHost = !uri || uri.includes('127.0.0.1') || uri.includes('localhost') || uri === 'memory';

  if ((isServerless && isLocalHost) || uri === 'memory') {
    console.log('[db] Instant in-memory store activated for Hackathon MVP visitors');
    require('./devMemoryStore').install();
    usingMemory = true;
    initialized = true;
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/edgedesk_frm', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log('[mongo] connected');
    }
  } catch (err) {
    console.warn('[mongo] unavailable — falling back to instant in-memory store:', err.message);
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
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(async (_req, _res, next) => {
    await initDB();
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
