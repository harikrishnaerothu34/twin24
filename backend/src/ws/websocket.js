import jwt from 'jsonwebtoken';

// userId -> Set of WebSocket connections
const userConnections = new Map();

export function initWebSocket(wss) {
  wss.on('connection', (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      if (!token) {
        ws.close(4001, 'Missing token');
        return;
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      const userId = payload.sub;

      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId).add(ws);

      ws.on('close', () => {
        const set = userConnections.get(userId);
        if (set) {
          set.delete(ws);
          if (set.size === 0) {
            userConnections.delete(userId);
          }
        }
      });
    } catch (err) {
      console.error('WebSocket auth failed', err);
      try {
        ws.close(4002, 'Unauthorized');
      } catch (e) {
        // ignore
      }
    }
  });
}

export function broadcastToUser(userId, payload) {
  const conns = userConnections.get(userId?.toString());
  if (!conns || conns.size === 0) return;

  const message = JSON.stringify(payload);
  for (const ws of conns) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}

