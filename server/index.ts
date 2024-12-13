import express from "express";
import cors from "cors";
import pkg from 'pg';
const { Pool } = pkg;
import getPort from "get-port";
import jwt from 'jsonwebtoken'; // Import JWT library

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Define JWT secret

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.post("/api/auth/send-code", (req, res) => {
  const { phone } = req.body;
  console.log(`Received phone: ${phone}`);
  res.json({ success: true });
});

app.post("/api/auth/verify-code", async (req, res) => {
  const { phone } = req.body;
  try {
    await pool.query('SELECT 1'); // Test connection
    
    const result = await pool.query(
      `INSERT INTO "User" (phone, role) 
       VALUES ($1, 'USER') 
       ON CONFLICT (phone) 
       DO UPDATE SET "updatedAt" = CURRENT_TIMESTAMP 
       RETURNING *`,
      [phone]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({ 
        success: true, 
        user: user,
        token: token 
      });
    } else {
      res.status(400).json({ success: false, error: 'Failed to create user' });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      error: "Database connection error. Please try again.",
    });
  }
});

app.get("/api/systems", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "RentedSystem" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching systems:", error);
    res.status(500).json({ error: "Failed to fetch systems" });
  }
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const startServer = async () => {
  try {
    const port = await getPort({ port: [3003, 3004, 3005, 3006] });
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();