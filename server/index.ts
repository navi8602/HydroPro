
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

const prisma = new PrismaClient();

// Аутентификация
app.post("/api/auth/send-code", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Номер телефона обязателен' });
    }
    // В реальном приложении здесь будет отправка СМС
    // Для демо используем код 1234
    console.log('Sending code to phone:', phone);
    
    // Проверяем существование пользователя
    const user = await pool.query(
      'SELECT * FROM "User" WHERE phone = $1',
      [phone]
    );
    
    if (user.rows.length === 0) {
      // Создаем нового пользователя если не существует
      await pool.query(
        'INSERT INTO "User" (phone) VALUES ($1)',
        [phone]
      );
    }
    
    res.json({ success: true, message: 'Код отправлен' });
  } catch (error) {
    console.error('Error in send-code:', error);
    res.status(500).json({ error: 'Ошибка при отправке кода' });
  }
});

app.post("/api/auth/verify-code", async (req, res) => {
  try {
    const { phone, code } = req.body;
    // Для демо проверяем код 1234
    if (code === '1234') {
      const user = await pool.query(
        'SELECT * FROM "User" WHERE phone = $1',
        [phone]
      );
      
      if (user.rows.length === 0) {
        // Создаем нового пользователя
        const newUser = await pool.query(
          'INSERT INTO "User" (phone) VALUES ($1) RETURNING id',
          [phone]
        );
        res.json({ token: newUser.rows[0].id });
      } else {
        res.json({ token: user.rows[0].id });
      }
    } else {
      res.status(400).json({ error: 'Invalid code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify code' });
  }
});
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = 3003;

app.get("/api/systems", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "System" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

app.get("/api/systems/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = parseInt(token);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const result = await pool.query(
      `SELECT s.*, rs.*, 
       (SELECT json_agg(p.*) 
        FROM "Plant" p 
        WHERE p."systemId" = s.id) as plants
       FROM "System" s 
       JOIN "RentedSystem" rs ON s.id = rs."systemId" 
       WHERE rs."userId" = $1 AND rs.status = 'ACTIVE'`,
      [userId]
    );
    
    const systems = result.rows.map(row => ({
      id: row.systemid,
      name: row.name,
      type: row.type,
      description: row.description,
      image: row.image,
      price: row.price,
      capacity: 6,
      plants: Array.isArray(row.plants) ? row.plants.map(plant => ({
        ...plant,
        status: plant.status || 'healthy'
      })) : [],
      status: row.status,
      startDate: row.startdate,
      endDate: row.enddate
    }));
    
    res.json(systems);
  } catch (error) {
    console.error('Error fetching user systems:', error);
    res.status(500).json({ error: 'Failed to fetch user systems' });
  }
});

app.post("/api/systems/rent", async (req, res) => {
  try {
    console.log('Received rental request:', {
      body: req.body,
      headers: req.headers,
      auth: req.headers.authorization,
      systemId: req.body.systemId,
      months: req.body.months,
      token: req.headers.authorization?.split(' ')[1]
      body: req.body,
      headers: req.headers,
      auth: req.headers.authorization
    });
    const { systemId, months } = req.body;
    if (!systemId || !months) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    let userId;
    try {
      userId = parseInt(token);
      if (isNaN(userId)) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      
      const userExists = await pool.query('SELECT id FROM "User" WHERE id = $1', [userId]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);

      const result = await pool.query(
        `INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate", "status")
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [systemId, userId, startDate, endDate, 'ACTIVE']
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error renting system:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to rent system' });
    }
  } catch (error) {
    console.error('Error in rent endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
