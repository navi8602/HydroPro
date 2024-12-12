
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'hydro-pro-secret-key';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

app.post('/api/auth/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Требуется номер телефона' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const code = generateCode();
    
    // Create or update user with verification code
    await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: { verificationCode: code },
      create: { 
        phone: cleanPhone, 
        verificationCode: code
      }
    });

    console.log(`Code for ${cleanPhone}: ${code}`); // For testing
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const cleanPhone = phone.replace(/\D/g, '');
    
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ error: 'Неверный код' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    await prisma.user.update({
      where: { phone: cleanPhone },
      data: { verificationCode: null }
    });

    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
