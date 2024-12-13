
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
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
        create: { 
          phone,
          role: 'USER'
        }
      });
      res.json({ success: true, user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('\x1b[31m%s\x1b[0m', '🚫 Error creating user:');
      console.error('\x1b[33m%s\x1b[0m', 'Details:', errorMessage);
      console.error('\x1b[36m%s\x1b[0m', 'Time:', new Date().toISOString());
      res.status(500).json({ 
        success: false, 
        error: 'Error creating user',
        details: errorMessage
      });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid code' });
  }
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
