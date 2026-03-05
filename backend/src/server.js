import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';

import connectMongo from './utils/mongo.js';
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import metricRoutes from './routes/metricRoutes.js';
import { initWebSocket } from './ws/websocket.js';

dotenv.config();

const app = express();

// Basic security hardening
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Rate limiting for API abuse protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/metrics', metricRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  console.log('\n🚀 Starting API server...');
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Port: ${PORT}`);
  try {
    await connectMongo();
    console.log('✓ Database connection ready (MongoDB Atlas)');

    const server = http.createServer(app);

    // Attach WebSocket server for real-time updates to dashboards
    const wss = new WebSocketServer({ server, path: '/ws' });
    initWebSocket(wss);

    server.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✅ SERVER RUNNING SUCCESSFULLY`);
      console.log(`${'='.repeat(60)}`);
      console.log(`✓ API server listening on: http://localhost:${PORT}`);
      console.log(`✓ WebSocket server ready on: ws://localhost:${PORT}/ws`);
      console.log(`✓ CORS enabled for: http://localhost:5173, http://localhost:5174`);
      console.log(`✓ Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`✓ Signup endpoint: POST http://localhost:${PORT}/api/auth/signup`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error('❌ Startup error:', err);
  process.exit(1);
});

