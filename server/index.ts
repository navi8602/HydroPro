import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3002;
const fallbackPort = 3005;

const startServer = (portToUse) => {
  app.listen(portToUse, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${portToUse}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToUse === port) {
      console.log(`Port ${portToUse} is busy, trying ${fallbackPort}`);
      startServer(fallbackPort);
    }
  });
};

app.use(cors({
  origin: ['http://0.0.0.0:3000', 'http://localhost:3000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/send-code', (req, res) => {
  const { phone } = req.body;
  // В реальном приложении здесь была бы отправка СМС
  res.json({ success: true, message: 'Code sent successfully' });
});

app.post('/api/auth/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  // В реальном приложении здесь была бы проверка кода
  if (code === '1234') {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: "file:./dev.db"
          }
        }
      });
      
      const user = await prisma.user.upsert({
        where: { phone },
        update: {},
        create: {
          phone,
          role: 'USER',
          rentedSystems: {
            create: {
              systemName: 'Базовая система',
              capacity: 6,
              rentalPeriod: 30,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              plants: {
                create: []
              },
              metrics: {
                create: [
                  {
                    temperature: 23,
                    humidity: 65,
                    nutrientLevel: 500,
                    phLevel: 6.5
                  }
                ]
              }
            }
          }
        },
        include: {
          rentedSystems: true
        }
      });
      
      res.json({ 
        success: true, 
        token: `auth_${user.id}`,
        userId: user.id,
        systems: user.rentedSystems
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});

startServer(port);