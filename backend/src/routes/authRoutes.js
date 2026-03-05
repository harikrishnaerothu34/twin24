import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory storage for mock mode
const mockUsers = new Map();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
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

    // Mock mode if MongoDB not connected
    if (!isMongoConnected()) {
      const existingMock = Array.from(mockUsers.values()).find(u => u.email === value.email);
      if (existingMock) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await User.hashPassword(value.password);
      const userId = `mock-${Date.now()}`;
      const mockUser = {
        _id: userId,
        name: value.name,
        email: value.email,
        passwordHash,
        role: 'user'
      };

      mockUsers.set(userId, mockUser);

      const token = jwt.sign(
        { sub: userId, role: mockUser.role },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '12h' }
      );

      return res.status(201).json({
        token,
        user: { id: userId, name: mockUser.name, email: mockUser.email, role: mockUser.role }
      });
    }

    // Database mode
    const existing = await User.findOne({ email: value.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await User.hashPassword(value.password);
    const user = await User.create({
      name: value.name,
      email: value.email,
      passwordHash
    });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '12h' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('\n📧 Login request received:', { email, timestamp: new Date().toISOString() });
    
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    // Mock mode if MongoDB not connected
    if (!isMongoConnected()) {
      console.log('⚠️  MongoDB not connected - using mock mode');
      const mockUser = Array.from(mockUsers.values()).find(u => u.email === value.email);
      if (!mockUser) {
        console.log('❌ User not found:', value.email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(value.password, mockUser.passwordHash);
      if (!ok) {
        console.log('❌ Invalid password for:', value.email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { sub: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '12h' }
      );

      console.log('✅ Login successful (mock mode):', { name: mockUser.name, email: mockUser.email });
      return res.json({
        success: true,
        token,
        user: { id: mockUser._id, name: mockUser.name, email: mockUser.email, role: mockUser.role }
      });
    }

    // Database mode
    console.log('🗄️  Querying MongoDB for user:', value.email);
    const user = await User.findOne({ email: value.email });
    if (!user) {
      console.log('❌ User not found in database:', value.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(value.password);
    if (!ok) {
      console.log('❌ Invalid password for user:', value.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '12h' }
    );

    console.log('✅ Login successful (database mode):', { id: user._id, name: user.name, email: user.email });
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
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

    // Mock mode if MongoDB not connected
    if (!isMongoConnected()) {
      const existingMock = Array.from(mockUsers.values()).find(u => u.email === value.email);
      if (existingMock) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await User.hashPassword(value.password);
      const userId = `mock-${Date.now()}`;
      const mockUser = {
        _id: userId,
        name: value.name,
        email: value.email,
        passwordHash,
        role: 'user'
      };

      mockUsers.set(userId, mockUser);

      const token = jwt.sign(
        { sub: userId, role: mockUser.role },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '12h' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, name: mockUser.name, email: mockUser.email, role: mockUser.role }
      });
    }

    // Database mode - MongoDB Atlas
    const existing = await User.findOne({ email: value.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await User.hashPassword(value.password);
    const user = await User.create({
      name: value.name,
      email: value.email,
      passwordHash
    });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '12h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

export default router;

