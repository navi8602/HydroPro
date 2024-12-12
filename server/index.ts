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
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: { 
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 минут
      },
      create: { 
        phone: cleanPhone, 
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000),
        role: 'USER'
      }
    });

    // В реальном приложении здесь был бы код отправки СМС
    console.log(`Код подтверждения для ${cleanPhone}: ${code}`);
    res.json({ success: true, message: 'Код отправлен' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка при отправке кода' });
  }
});

app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const cleanPhone = phone.replace(/\D/g, '');
    
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user || user.verificationCode !== code || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ error: 'Неверный код или код истек' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        verificationCode: null,
        verificationCodeExpires: null
      }
    });

    res.json({ token, user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка при проверке кода' });
  }
});

// Защищенный роут для проверки аутентификации
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

const checkSystemPermission = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const systemId = parseInt(req.params.id);
    
    const permission = await prisma.permission.findUnique({
      where: {
        userId_systemId: {
          userId,
          systemId
        }
      }
    });

    if (!permission) {
      return res.status(403).json({ error: 'Нет доступа к системе' });
    }

    req.permission = permission;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Управление пользователями
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        permissions: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.patch('/api/users/:id/role', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Системы
app.post('/api/systems/rent', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { systemName, capacity, rentalPeriod } = req.body;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + rentalPeriod);

    const system = await prisma.rentedSystem.create({
      data: {
        userId,
        systemName,
        capacity,
        rentalPeriod,
        startDate,
        endDate
      }
    });

    res.json(system);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/systems', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const systems = await prisma.rentedSystem.findMany({
      where: { userId },
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
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/systems/:id', authenticateToken, checkSystemPermission, async (req, res) => {
  try {
    const systemId = parseInt(req.params.id);
    const system = await prisma.rentedSystem.findUnique({
      where: { id: systemId }
    });
    res.json(system);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// Растения
app.post('/api/plants', authenticateToken, async (req, res) => {
  try {
    const { systemId, name, position, expectedHarvestDate } = req.body;
    
    const plant = await prisma.plant.create({
      data: {
        systemId,
        name,
        position,
        plantedDate: new Date(),
        expectedHarvestDate: new Date(expectedHarvestDate),
        status: 'healthy'
      }
    });

    res.json(plant);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/plants/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plant.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Метрики
app.post('/api/metrics', authenticateToken, async (req, res) => {
  try {
    const { systemId, temperature, humidity, nutrientLevel, phLevel } = req.body;
    
    const metric = await prisma.metrics.create({
      data: {
        systemId,
        temperature,
        humidity,
        nutrientLevel,
        phLevel
      }
    });

    res.json(metric);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Растения
app.get('/api/plants/:systemId', authenticateToken, async (req, res) => {
  try {
    const { systemId } = req.params;
    const plants = await prisma.plant.findMany({
      where: { systemId: parseInt(systemId) },
      orderBy: { position: 'asc' }
    });
    res.json(plants);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.patch('/api/plants/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const plant = await prisma.plant.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    res.json(plant);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Метрики
app.get('/api/metrics/:systemId', authenticateToken, async (req, res) => {
  try {
    const { systemId } = req.params;
    const { period } = req.query;
    
    let startDate = new Date();
    switch(period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    const metrics = await prisma.metrics.findMany({
      where: { 
        systemId: parseInt(systemId),
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' }
    });
    
    res.json(metrics);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Уведомления и оповещения
app.post('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { systemId, type, message } = req.body;
    
    const alert = await prisma.alert.create({
      data: {
        userId,
        systemId,
        type,
        message,
        read: false
      }
    });
    
    res.json(alert);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.patch('/api/alerts/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await prisma.alert.update({
      where: { id: parseInt(id) },
      data: { read: true }
    });
    res.json(alert);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение схемы базы данных
app.get('/api/database/schema', async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`
      SELECT 
        name as table_name
      FROM 
        sqlite_master 
      WHERE 
        type='table' AND 
        name NOT LIKE 'sqlite_%' AND 
        name NOT LIKE '_prisma_%'
    `;
    res.json(tables);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});