import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import systemRoutes from './routes/system.routes.js';
import plantRoutes from './routes/plant.routes.js';
import userRoutes from './routes/user.routes.js';
import { initWebSocket } from './websocket/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/systems', systemRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });

    // Initialize WebSocket
    initWebSocket(server);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
