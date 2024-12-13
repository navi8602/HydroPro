import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = 3002;

app.get("/api/systems", async (req, res) => {
  try {
    const HYDROPONIC_SYSTEMS = [
        {
          id: 'hydropro-2000',
          name: 'HydroPro 2000',
          model: 'HP-2000',
          description: 'Компактная система для начинающих. Идеально подходит для выращивания зелени и небольших овощей.',
          capacity: 8,
          dimensions: JSON.stringify({ width: 60, height: 150, depth: 30 }),
          features: ['Автоматический полив', 'LED освещение', 'Базовый контроль pH', 'Таймер освещения'],
          monthlyPrice: 2500,
          imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
          specifications: JSON.stringify({
            powerConsumption: 100,
            waterCapacity: 20,
            lightingType: 'LED полного спектра',
            automationLevel: 'basic'
          })
        },
        {
          id: 'hydropro-3000',
          name: 'HydroPro 3000',
          model: 'HP-3000',
          description: 'Продвинутая система для опытных пользователей. Расширенные возможности контроля и автоматизации.',
          capacity: 12,
          dimensions: JSON.stringify({ width: 80, height: 180, depth: 40 }),
          features: ['Умный полив с датчиками', 'Регулируемое LED освещение', 'Автоматический контроль pH и EC', 'Мобильное приложение', 'Климат-контроль'],
          monthlyPrice: 4500,
          imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
          specifications: JSON.stringify({
            powerConsumption: 180,
            waterCapacity: 40,
            lightingType: 'Регулируемый LED',
            automationLevel: 'advanced'
          })
        },
        {
          id: 'hydropro-4000',
          name: 'HydroPro 4000',
          model: 'HP-4000',
          description: 'Профессиональная система с максимальной автоматизацией и контролем. Для серьезного домашнего выращивания.',
          capacity: 16,
          dimensions: JSON.stringify({ width: 100, height: 200, depth: 50 }),
          features: ['Полная автоматизация', 'Профессиональное LED освещение', 'Автоматическая корректировка питательного раствора', 'Удаленный мониторинг', 'Интеграция с умным домом', 'Анализ урожайности'],
          monthlyPrice: 7500,
          imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
          specifications: JSON.stringify({
            powerConsumption: 250,
            waterCapacity: 60,
            lightingType: 'Профессиональный LED',
            automationLevel: 'professional'
          })
        }
      ];

      for (const system of HYDROPONIC_SYSTEMS) {
        await pool.query(
          `INSERT INTO "System" (id, name, model, description, capacity, dimensions, features, "monthlyPrice", "imageUrl", specifications)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [
            system.id,
            system.name,
            system.model,
            system.description,
            system.capacity,
            system.dimensions,
            system.features,
            system.monthlyPrice,
            system.imageUrl,
            system.specifications
          ]
        );
      }

      const newResult = await pool.query('SELECT * FROM "System" ORDER BY "createdAt" DESC');
      res.json(newResult.rows);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

app.post('/api/systems/create-test', async (req, res) => {
  try {
    await prisma.$executeRaw`
      INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate", "status")
      SELECT 
        'system1',
        "User".id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '6 months',
        'ACTIVE'
      FROM "User"
      WHERE NOT EXISTS (
        SELECT 1 
        FROM "RentedSystem" 
        WHERE "RentedSystem"."userId" = "User".id
      )
    `;
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating test systems:', error);
    res.status(500).json({ error: 'Failed to create test systems' });
  }
});

app.post("/api/systems/rent", async (req, res) => {
  try {
    const { systemId, months } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(authHeader.split(' ')[1]);
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
    res.status(500).json({ error: 'Failed to rent system' });
  }
});

app.post("/api/systems/rent", async (req, res) => {
  const { systemId, userId, months } = req.body;
  
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    const result = await pool.query(
      `INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [systemId, userId, startDate, endDate]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error renting system:", error);
    res.status(500).json({ error: "Failed to rent system" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
// Users API endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        permissions: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.patch('/api/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});