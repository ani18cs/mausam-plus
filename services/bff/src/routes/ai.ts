import { Router, Request, Response } from 'express';
import { AIQueryRequest, AIQueryResponse } from '@mausam/shared-types';
import OpenAI from 'openai';

export const aiRouter = Router();

aiRouter.post('/query', async (req: Request, res: Response) => {
  try {

   
    const { query = '', location, selectedPersonas = [] , forecastContext} = req.body as AIQueryRequest;
      const gemini = new OpenAI({
  apiKey: process.env.LLM_API_KEY!,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
    if (!query.trim()) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    const systemPrompt = `You are Ask Mausam, a weather assistant for India.

Answer ONLY using the weather data provided below.
Do not invent temperature, humidity, AQI, rain probability, UV, or safety conditions.
If required data is missing, clearly say that it is unavailable.

Location: ${location?.name || 'India'}
Selected personas: ${selectedPersonas.join(', ') || 'none'}

CURRENT FORECAST DATA:
${JSON.stringify(forecastContext, null, 2)}
The "daily" array contains the upcoming forecast days in order.
daily[0] = today
daily[1] = tomorrow
The hourly array contains only the next ~24 hours.
The daily array contains the multi-day forecast.

If tomorrow's hourly entries are not present, do not claim exact hourly conditions for tomorrow.
You may still give a general tomorrow recommendation using daily forecast data, but clearly state that it is based on the daily forecast.
If the user asks about tomorrow, use daily[1].
If the user asks about a later day, use the matching date from the daily array.
Instructions:
1. Answer the user's exact question first.
2. Be concise and practical.
3. Mention relevant numbers from the forecast when useful.
4. Give safety advice only when supported by the supplied data.
5. Do not claim the data is from IMD unless the supplied source metadata says so.
6.Keep the answer under 120 words
`;
    const message = await gemini.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const answer = message.choices[0].message.content || 'Unable to process query';

    const response: AIQueryResponse = {
      answer,
      confidence: 0.85,
      insights: [],
      suggestedFollowUps: [
        'What about tomorrow\'s weather?',
        'Show me the hourly forecast',
        'Is it safe for outdoor activities?',
      ],
      generatedAt: new Date().toISOString(),
    };

    return res.json(response);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to process weather query',
      answer: 'Sorry, I couldn\'t process that. Please try again.',
      confidence: 0,
      insights: [],
      suggestedFollowUps: [],
    });
  }
});