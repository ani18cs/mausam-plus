import { Router, Request, Response } from 'express';
import { AIQueryRequest, AIQueryResponse, SupportedLanguage } from '@mausam/shared-types';
import { runRAGPipeline } from '../services/rag/ragPipeline';

export const aiRouter = Router();

aiRouter.post('/query', async (req: Request, res: Response) => {
  const { query = '', location, selectedPersonas = [], forecastContext } = req.body as AIQueryRequest;

  if (!query.trim()) {
    return res.status(400).json({ error: 'Query cannot be empty' });
  }

  // Detect user language from body, header, or query
  const language = (req.body.language || req.headers['x-user-language'] || req.query.lang || 'en') as SupportedLanguage;

  try {
    const response: AIQueryResponse = await runRAGPipeline({
      query,
      location: location || { lat: 12.9716, lon: 77.5946, name: 'Bengaluru, Karnataka' },
      selectedPersonas,
      forecastContext,
      language: language === 'hi' || language === 'kn' ? language : 'en',
    });

    return res.json(response);
  } catch (error: any) {
    console.error('[AI Route Error]', error);
    return res.status(500).json({
      error: 'AI retrieval pipeline error',
      details: error?.message,
    });
  }
});