
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001; // Using different port from frontend

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
