import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers';
import { createContext } from './context';

const app = express();

app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true,
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'TapTask API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      trpc: '/trpc'
    }
  });
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`🔌 tRPC endpoint: http://localhost:${port}/trpc`);
});
