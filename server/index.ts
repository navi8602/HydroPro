
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
  // В реальном приложении здесь будет отправка SMS
  res.json({ success: true });
});

app.post('/api/auth/verify-code', async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role: 'USER' }
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Systems routes
app.get('/api/systems', async (req, res) => {
  try {
    const systems = await prisma.rentedSystem.findMany();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

const port = 3003;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
