
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Auth routes
app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
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

app.get('/api/systems', async (req, res) => {
  try {
    const systems = await prisma.rentedSystem.findMany();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
