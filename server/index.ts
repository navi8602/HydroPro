
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3002;
const fallbackPort = 3005;

const startServer = (portToUse) => {
  app.listen(portToUse, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${portToUse}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToUse === port) {
      console.log(`Port ${portToUse} is busy, trying ${fallbackPort}`);
      startServer(fallbackPort);
    }
  });
};

app.use(cors({
  origin: ['http://0.0.0.0:3000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'test-token' });
});

startServer(port);
