
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Отправка кода подтверждения
app.post('/api/auth/send-code', async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  
  try {
    const user = await prisma.user.upsert({
      where: { phone },
      update: { code },
      create: { phone, code }
    });
    
    // Здесь будет логика отправки SMS
    console.log(`Code for ${phone}: ${code}`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Проверка кода и выдача токена
app.post('/api/auth/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user || user.code !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    
    const token = jwt.sign({ userId: user.id }, 'your-secret-key');
    
    await prisma.user.update({
      where: { phone },
      data: { code: null }
    });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});
