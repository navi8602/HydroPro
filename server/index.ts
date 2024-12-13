
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors({
  origin: ['http://0.0.0.0:3000', 'http://localhost:3000', '*'],
  credentials: true
}));

app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
  res.json({ success: true, message: 'Code sent successfully' });
});

app.post('/api/auth/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  
  if (code === '1234') {
    try {
      const user = await prisma.user.upsert({
        where: { phone },
        update: {},
        create: { phone }
      });
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, error: 'Error creating user' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid code' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
