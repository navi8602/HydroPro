
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, code } = req.body;
    // Mock authentication for now
    res.json({ success: true, token: 'mock-token' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const port = 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
