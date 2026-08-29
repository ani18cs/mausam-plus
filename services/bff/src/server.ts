import dotenv from 'dotenv';
import path from 'path'
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
}

);

import express, { Request, Response } from 'express';
import cors from 'cors';
import { forecastRouter } from './routes/forecast';
import { aiRouter } from './routes/ai';
import { reportsRouter } from './routes/reports';
import { alertsRouter } from './routes/alerts';



const app = express();
const PORT = process.env.PORT || 4000;


// Middleware
app.use(
  cors({
    origin: '*', // Allow development origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// API Routes
app.use('/api/forecast', forecastRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/alerts', alertsRouter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'mausam-bff',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.send({
    message: 'Mausam+ Backend-For-Frontend (BFF) Service Running',
    documentation: '/docs/ARCHITECTURE.md',
    endpoints: [
      'GET /api/forecast?lat=12.9716&lon=77.5946',
      'POST /api/ai/query',
      'GET /api/reports',
      'POST /api/reports',
      'GET /api/alerts',
      'GET /api/health',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🌦️  Mausam+ BFF running at http://localhost:${PORT}`);
  console.log(`📊  Forecast endpoint: http://localhost:${PORT}/api/forecast`);
  console.log(`🤖  AI Query endpoint: http://localhost:${PORT}/api/ai/query`);
  console.log(`=========================================`);
});
