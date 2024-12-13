
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3002;

app.get('/', (_req, res) => {
  res.json({ status: 'Server is running' });
});

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
        create: { phone, role: 'USER' }
      });
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid code' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
