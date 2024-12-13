
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
  res.json({ success: true, message: 'Code sent' });
});

app.post('/api/auth/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  
  try {
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role: 'USER' }
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

const port = 3003;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
