
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware для проверки JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Отправка кода подтверждения
app.post('/api/auth/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Номер телефона обязателен' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: { code },
      create: { phone: cleanPhone, code }
    });
    
    console.log(`Код для ${cleanPhone}: ${code}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка кода
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const cleanPhone = phone.replace(/\D/g, '');
    
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });
    
    if (!user || user.code !== code) {
      return res.status(400).json({ error: 'Неверный код' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    await prisma.user.update({
      where: { phone: cleanPhone },
      data: { code: null }
    });
    
    res.json({ token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение профиля пользователя
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});
