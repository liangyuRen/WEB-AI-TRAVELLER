import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import travelRoutes from './routes/travel';
import budgetRoutes from './routes/budget';
import llmRoutes from './routes/llm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/travel', travelRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/llm', llmRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Travel Planner Backend is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
