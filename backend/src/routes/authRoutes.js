import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );
};

const requireMongo = (res) => {
  if (isMongoConnected()) {
    return true;
  }

  res.status(503).json({
    message: 'Database unavailable. Please try again shortly.'
  });
  return false;
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.string().min(8).max(128).required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match'
  })
});

router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!requireMongo(res)) {
      return;
    }

    const normalizedEmail = value.email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await User.hashPassword(value.password);
    const user = await User.create({
      name: value.name,
      email: normalizedEmail,
      passwordHash
    });

    const token = signAccessToken(user);

    res.status(201).json({
      token,
      user: toSafeUser(user)
    });
  } catch (err) {
    console.error('Register error', err.message);
    res.status(500).json({ message: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!requireMongo(res)) {
      return;
    }

    const normalizedEmail = value.email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(value.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAccessToken(user);
    res.json({
      success: true,
      token,
      user: toSafeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// New signup route with confirmPassword validation
router.post('/signup', async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!requireMongo(res)) {
      return;
    }

    const normalizedEmail = value.email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await User.hashPassword(value.password);
    const user = await User.create({
      name: value.name,
      email: normalizedEmail,
      passwordHash
    });

    const token = signAccessToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: toSafeUser(user)
    });
  } catch (err) {
    console.error('Signup error', err.message);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    if (!requireMongo(res)) {
      return;
    }

    const user = await User.findById(req.user.id).select('_id name email role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user: toSafeUser(user) });
  } catch (err) {
    console.error('Session lookup error:', err.message);
    res.status(500).json({ message: 'Failed to load session' });
  }
});

export default router;

