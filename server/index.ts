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

// Update user role
app.patch("/api/users/role", async (req, res) => {
  try {
    const { phone, role } = req.body;
    console.log('Updating user role:', { phone, role });
    
    const result = await pool.query(
      'UPDATE "User" SET role = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE phone = $2 RETURNING *',
      [role.toUpperCase(), phone]
    );
    
    if (result.rows.length === 0) {
      console.log('User not found:', phone);
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log('User updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Get user's rented systems
app.get("/api/user/systems", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const phone = req.headers.authorization;
    console.log('Received phone:', phone);
    
    if (!phone) {
      console.log('No phone provided');
      return res.status(401).json({ error: 'No authorization provided' });
    }

    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      [phone]
    );
    
    if (userResult.rows.length === 0) {
      console.log('User not found for phone:', phone);
      return res.json([]);
    }

    const userId = userResult.rows[0].id;
    console.log('Found user:', userId);
    
    const result = await pool.query(
      `SELECT s.*, rs.status, rs."startDate", rs."endDate" 
       FROM "System" s
       JOIN "RentedSystem" rs ON rs."systemId" = s.id
       WHERE rs."userId" = $1 AND rs.status = 'ACTIVE'`,
      [userId]
    );
    
    console.log('Found systems:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user systems:", error);
    res.status(500).json({ error: "Failed to fetch user systems" });
  }
});

// Rent a system 
app.post("/api/systems/rent", async (req, res) => {
  try {
    const { systemId, months } = req.body;
    const phone = req.headers.authorization?.split(' ')[1];
    
    console.log('Attempting to rent system:', { systemId, months, phone });
    
    if (!phone) {
      console.log('Rent failed: No phone provided');
      return res.status(401).json({ error: "Unauthorized: No phone provided" });
    }

    if (!systemId || !months) {
      console.log('Rent failed: Missing fields', { systemId, months });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      [phone]
    );

    if (userResult.rows.length === 0) {
      console.log('Rent failed: User not found for phone', phone);
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;
    console.log('Found user:', userId);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    // Check if system exists and is available
    const systemResult = await pool.query(
      'SELECT id FROM "System" WHERE id = $1',
      [systemId]
    );

    if (systemResult.rows.length === 0) {
      console.log('Rent failed: System not found', systemId);
      return res.status(404).json({ error: "System not found" });
    }

    // Check if system is already rented
    const rentedCheck = await pool.query(
      `SELECT id FROM "RentedSystem" 
       WHERE "systemId" = $1 
       AND status = 'ACTIVE'
       AND "endDate" > CURRENT_TIMESTAMP`,
      [systemId]
    );

    if (rentedCheck.rows.length > 0) {
      console.log('Rent failed: System already rented', systemId);
      return res.status(400).json({ error: "System is already rented" });
    }

    const result = await pool.query(
      `INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate", status)
       VALUES ($1, $2, $3, $4, 'ACTIVE')
       RETURNING *`,
      [systemId, userId, startDate, endDate]
    );

    console.log('Successfully rented system:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      systemId,
      userId: userResult?.rows[0]?.id,
      phone

// Create new system (admin only)
app.post("/api/systems", async (req, res) => {
  try {
    const phone = req.headers.authorization?.split(' ')[1];
    if (!phone) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      [phone]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, model, description, capacity, dimensions, features, monthlyPrice, specifications } = req.body;
    
    const result = await pool.query(
      `INSERT INTO "System" (name, model, description, capacity, dimensions, features, "monthlyPrice", specifications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, model, description, capacity, dimensions, features, monthlyPrice, specifications]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating system:", error);
    res.status(500).json({ error: "Failed to create system" });
  }
});

    };
    console.error("Error renting system:", errorDetails);
    res.status(500).json({ 
      error: "Failed to rent system",
      details: errorDetails
    });
  }
});

app.post("/api/auth/send-code", (req, res) => {
  const { phone } = req.body;
  console.log(`Received phone: ${phone}`);
  res.json({ success: true });
});

app.post("/api/auth/verify-code", async (req, res) => {
  const { phone } = req.body;
  try {
    console.log('Verifying code for phone:', phone);
    
    // Update existing user to ADMIN or create new as ADMIN
    const result = await pool.query(
      `INSERT INTO "User" (phone, role) 
       VALUES ($1, 'ADMIN') 
       ON CONFLICT (phone) 
       DO UPDATE SET 
         role = 'ADMIN',
         "updatedAt" = CURRENT_TIMESTAMP
       RETURNING *`,
      [phone]
    );

    // Ensure the role is set to ADMIN
    if (result.rows.length > 0 && result.rows[0].role !== 'ADMIN') {
      await pool.query(
        `UPDATE "User" SET role = 'ADMIN' WHERE phone = $1`,
        [phone]
      );
    }

    // Add full permissions for all systems
    if (result.rows.length > 0) {
      const userId = result.rows[0].id;
      await pool.query(
        `INSERT INTO "Permission" ("userId", "accessLevel")
         VALUES ($1, 'full')
         ON CONFLICT ("userId") 
         DO UPDATE SET "accessLevel" = 'full'`,
        [userId]
      );
    }
    
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
  try {
    const { systemId, months } = req.body;
    const phone = req.headers.authorization;
    
    if (!phone) {
      return res.status(401).json({ error: "Unauthorized: No phone provided" });
    }

    // Get userId by phone
    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      [phone]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;
  
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

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: "The requested endpoint could not be found",
    path: req.path,
    method: req.method
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message 
  });
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
app.post("/api/auth/register", async (req, res) => {
  try {
    const { phone } = req.body;
    console.log('Registering new user:', phone);
    const result = await pool.query(
      `INSERT INTO "User" (phone, role) 
       VALUES ($1, 'ADMIN') 
       ON CONFLICT (phone) 
       DO UPDATE SET "updatedAt" = CURRENT_TIMESTAMP, role = 'ADMIN'
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
      res.json({ success: true, user: user, token: token });
    } else {
      res.status(400).json({ success: false, error: 'Failed to create user' });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, error: "Database connection error. Please try again." });
  }
});