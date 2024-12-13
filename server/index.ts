
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import getPort from "get-port";

const app = express();
const prisma = new PrismaClient();

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
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role: "USER" },
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error during user upsert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/systems", async (req, res) => {
  try {
    const systems = await prisma.rentedSystem.findMany();
    res.json(systems);
  } catch (error) {
    console.error("Error fetching systems:", error);
    res.status(500).json({ error: "Failed to fetch systems" });
  }
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
