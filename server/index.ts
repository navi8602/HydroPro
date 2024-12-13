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

// Get available systems
app.get("/api/systems", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "System" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching systems:", error);
    res.status(500).json({ error: "Failed to fetch systems" });
  }
});

// Get user's rented systems
app.get("/api/user/systems", async (req, res) => {
  try {
    const phone = req.headers.authorization?.split(' ')[1]; // Get phone from token
    
    // Get systems with user phone directly
    const result = await pool.query(
      `SELECT s.*, rs.status, rs."startDate", rs."endDate" 
       FROM "System" s
       JOIN "RentedSystem" rs ON rs."systemId" = s.id
       JOIN "User" u ON rs."userId" = u.id
       WHERE u.phone = $1 AND rs.status = 'ACTIVE'
       AND rs."endDate" > CURRENT_TIMESTAMP`,
      [phone]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user systems:", error);
    res.status(500).json({ error: "Failed to fetch user systems" });
  }
});

// Rent a system
app.post("/api/systems/rent", async (req, res) => {
  const { systemId, months } = req.body;
  const userId = req.headers.authorization?.split(' ')[1];
  
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);
    
    const result = await pool.query(
      `INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate", status)
       VALUES ($1, $2, $3, $4, 'ACTIVE')
       RETURNING *`,
      [systemId, userId, startDate, endDate]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error renting system:", error);
    res.status(500).json({ error: "Failed to rent system" });
  }
});

// Cancel system rental
app.post("/api/systems/cancel", async (req, res) => {
  const { rentalId } = req.body;
  const userId = req.headers.authorization?.split(' ')[1];
  
  try {
    const result = await pool.query(
      `UPDATE "RentedSystem" 
       SET status = 'CANCELLED', "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $1 AND "userId" = $2
       RETURNING *`,
      [rentalId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error cancelling rental:", error);
    res.status(500).json({ error: "Failed to cancel rental" });
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