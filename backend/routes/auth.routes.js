const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'edgedesk-frm-dev-secret-change-me';
  return jwt.sign(
    { email: user.email },
    secret,
    { subject: String(user._id), expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'name, email, and password are required.',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        error: 'email_taken',
        message: 'An account with that email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({
      error: 'server_error',
      message: err.message || 'Registration failed.',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'email and password are required.',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    
    // Hackathon demo fallback: If user does not exist yet, auto-create account
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        name: email.split('@')[0] || 'Hackathon Visitor',
        email: email.toLowerCase(),
        passwordHash,
      });
    } else {
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({
          error: 'invalid_credentials',
          message: 'Invalid email or password.',
        });
      }
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({
      error: 'server_error',
      message: err.message || 'Login failed.',
    });
  }
});

module.exports = router;
