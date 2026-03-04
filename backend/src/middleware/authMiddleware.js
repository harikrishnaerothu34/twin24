import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

