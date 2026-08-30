import { Router, Request, Response } from 'express';
import { AIQueryRequest, AIQueryResponse } from '@mausam/shared-types';
// import OpenAI from 'openai';
import { GoogleGenAI,ThinkingLevel  } from '@google/genai';

export const aiRouter = Router();

aiRouter.post('/query', async (req: Request, res: Response) => {
  try {

   
    const { query = '', location, selectedPersonas = [] , forecastContext} = req.body as AIQueryRequest;
      const gemini = new GoogleGenAI({
  apiKey: process.env.LLM_API_KEY!,
  //baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
    if (!query.trim()) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }
const normalizedQuery = query.trim().toLowerCase();

const greetings = new Set([
  'hi',
  'hii',
  'hello',
  'hey',
  'heyy',
  'hiii',
]);

if (greetings.has(normalizedQuery)) {
  const response: AIQueryResponse = {
    answer: `Hi! Ask me anything about the weather in ${location?.name || 'your location'}.`,
    confidence: 1,
    insights: [],
    suggestedFollowUps: [
      'What is the weather right now?',
      'Will it rain today?',
      'Show me the hourly forecast',
    ],
    generatedAt: new Date().toISOString(),
  };

  return res.json(response);
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
7. If the user sends a greeting such as "hi", "hello", or "hey", respond briefly and invite them to ask a weather-related question. Do not provide an unsolicited forecast.
8. If the user's message is unclear, incomplete, gibberish, or cannot be confidently interpreted, ask them to clarify. Do not assume they are asking for the current weather.
9. Return plain text only. Do not use Markdown syntax such as **, *, #, or bullet formatting.
10. For hourly forecast requests, show only the next 5-6 upcoming hours from the current time. Never include hours that have already passed.

11. Format hourly forecasts vertically, with one hour per line. Each line should follow this style:
7 PM — 24°C · Light Drizzle · Rain 65%

12. Add a short heading such as "Next few hours in Bengaluru:" followed by a blank line, then the hourly lines, then one short takeaway sentence.

13. Keep all responses concise and mobile-friendly. Use line breaks and simple Unicode symbols such as — and · for readability. Avoid Markdown tables, headings using #, excessive bold text, and long paragraphs.
`;
    // const message = await gemini.chat.completions.create({
    //   model: 'gemini-2.5-flash',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: systemPrompt,
    //     },
    //     {
    //       role: 'user',
    //       content: query,
    //     },
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 1200,
    // });
    
const message = await gemini.models.generateContent({
  model: 'gemini-3.5-flash-lite',
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: `${systemPrompt}\n\nUSER QUESTION:\n${query}`,
        },
      ],
    },
  ],
  config: {
    //temperature: 0.7,
    maxOutputTokens:1200,
    thinkingConfig: {
    thinkingLevel: ThinkingLevel.MINIMAL,
  },
  },
  
});
    const answer = message.text || 'Unable to process query';

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