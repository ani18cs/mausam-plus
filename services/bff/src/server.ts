import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { forecastRouter } from './routes/forecast';
import { aiRouter } from './routes/ai';
import { reportsRouter } from './routes/reports';
import { alertsRouter } from './routes/alerts';
import { notificationsRouter } from './routes/notifications';
import imdRouter from './routes/imd';
import { cacheService } from './services/cache';

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for Cloud Run, Render, Fly.io load balancers
app.set('trust proxy', 1);

// 1. CORS Configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-language'],
  })
);

app.use(express.json({ limit: '10mb' }));

// 2. Structured Request Logging & Telemetry Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.includes('/health')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 3. Rate Limiting Middleware (Stateless In-Memory / Distributed Friendly)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please retry in 15 minutes.' },
});

const aiEndpointLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 queries per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI query rate limit reached. Please wait a moment.' },
});

app.use('/api/', globalApiLimiter);
app.use('/api/ai/', aiEndpointLimiter);

// 4. API Routes
app.use('/api/forecast', forecastRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/imd', imdRouter);

// 5. Health & Observability Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const cacheStats = cacheService.getStats();
  res.json({
    status: 'healthy',
    service: 'mausam-bff',
    version: '2.0.0',
    stateless: true,
    cache: cacheStats,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.send({
    message: 'Mausam+ Backend-For-Frontend (BFF) Production Service Running',
    version: '2.0.0',
    documentation: '/docs/ARCHITECTURE.md',
    endpoints: [
      'GET /api/forecast?lat=12.9716&lon=77.5946',
      'POST /api/ai/query',
      'GET /api/alerts',
      'POST /api/notifications/send',
      'GET /api/reports',
      'GET /api/health',
    ],
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled BFF Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err?.message,
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🌦️  Mausam+ BFF v2.0 running at http://localhost:${PORT}`);
  console.log(`📊  Forecast endpoint: http://localhost:${PORT}/api/forecast`);
  console.log(`🤖  RAG AI Query endpoint: http://localhost:${PORT}/api/ai/query`);
  console.log(`🔔  Notifications endpoint: http://localhost:${PORT}/api/notifications/send`);
  console.log(`=========================================`);
});
