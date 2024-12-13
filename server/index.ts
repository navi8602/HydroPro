
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const prisma = new PrismaClient();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = 3002;

app.get("/api/systems", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "System" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

app.post("/api/systems/rent", async (req, res) => {
  try {
    const { systemId, months } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const userId = parseInt(token);
    
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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
    res.status(500).json({ error: 'Failed to rent system' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
