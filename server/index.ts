
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'hydro-pro-secret-key';

app.use(cors());
app.use(express.json());

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

// Аутентификация
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

// Системы
app.post('/api/systems/rent', authenticateToken, async (req, res) => {
  try {
    const { systemName, capacity, rentalPeriod, startDate, endDate } = req.body;
    
    const system = await prisma.rentedSystem.create({
      data: {
        userId: req.user.userId,
        systemName,
        capacity,
        rentalPeriod,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
    
    res.json(system);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/systems', authenticateToken, async (req, res) => {
  try {
    const systems = await prisma.rentedSystem.findMany({
      where: { userId: req.user.userId },
      include: {
        plants: true,
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });
    
    res.json(systems);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Растения
app.post('/api/plants', authenticateToken, async (req, res) => {
  try {
    const { systemId, name, position, plantedDate, expectedHarvestDate } = req.body;
    
    const plant = await prisma.plant.create({
      data: {
        systemId,
        name,
        position,
        plantedDate: new Date(plantedDate),
        expectedHarvestDate: new Date(expectedHarvestDate),
        status: 'healthy'
      }
    });
    
    res.json(plant);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Метрики
app.post('/api/metrics', authenticateToken, async (req, res) => {
  try {
    const { systemId, temperature, humidity, nutrientLevel, phLevel } = req.body;
    
    const metrics = await prisma.metrics.create({
      data: {
        systemId,
        temperature,
        humidity,
        nutrientLevel,
        phLevel
      }
    });
    
    res.json(metrics);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000 (HTTPS)');
});
