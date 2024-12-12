
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'hydro-pro-secret-key';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Функция генерации кода
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// Отправка кода подтверждения
app.post('/api/auth/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Требуется номер телефона' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const code = generateCode();
    
    // Сохраняем код с временем истечения
    await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: {
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 минут
        verificationAttempts: 0
      },
      create: {
        phone: cleanPhone,
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000),
        role: 'USER'
      }
    });

    console.log(`Код подтверждения для ${cleanPhone}: ${code}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка кода и авторизация
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Требуются телефон и код' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    if (user.verificationAttempts >= 3) {
      return res.status(400).json({ error: 'Превышено количество попыток' });
    }

    if (!user.verificationCode || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ error: 'Код истек' });
    }

    if (user.verificationCode !== code) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationAttempts: { increment: 1 } }
      });
      return res.status(400).json({ error: 'Неверный код' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
        verificationAttempts: 0
      }
    });

    res.json({ token, user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
