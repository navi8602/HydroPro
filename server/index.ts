
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3002;

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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
