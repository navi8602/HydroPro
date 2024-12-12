
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
  origin: ['http://0.0.0.0:3000', 'http://localhost:3000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
  // В реальном приложении здесь была бы отправка СМС
  res.json({ success: true, message: 'Code sent successfully' });
});

app.post('/api/auth/verify-code', (req, res) => {
  const { phone, code } = req.body;
  // В реальном приложении здесь была бы проверка кода
  if (code === '1234') {
    res.json({ success: true, token: 'test-token' });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});

startServer(port);
