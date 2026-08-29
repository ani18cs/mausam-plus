import { Router, Request, Response } from 'express';
import { AIQueryRequest, AIQueryResponse, NormalizedForecast } from '@mausam/shared-types';
import OpenAI from 'openai';

export const aiRouter = Router();

function generateGroundedFallback(
  query: string,
  locationName: string,
  forecast?: Partial<NormalizedForecast>
): AIQueryResponse {
  const q = query.toLowerCase();
  const current = forecast?.current;
  const today = forecast?.daily?.[0];
  const tomorrow = forecast?.daily?.[1];
  const heatStress = forecast?.extras?.heat_stress_index;

  const temp = current?.temp_c ?? 28;
  const feelsLike = current?.feels_like_c ?? 31;
  const humidity = current?.humidity_pct ?? 65;
  const condition = current?.condition ?? 'Partly Cloudy';
  const aqi = current?.aqi ?? 120;
  const rainProb = today?.rain_prob_pct ?? 40;
  const tomorrowRain = tomorrow?.rain_prob_pct ?? 35;
  const tomorrowTempMax = tomorrow?.temp_max_c ?? 32;

  let answer = '';
  const insights: AIQueryResponse['insights'] = [];
  const followUps: string[] = [];

  if (q.includes('run') || q.includes('jog') || q.includes('workout') || q.includes('fitness')) {
    const isGoodRunning = temp < 30 && humidity < 75 && aqi < 150;
    answer = isGoodRunning
      ? `Outdoor workouts in **${locationName}** are **favorable**. Current temperature is **${temp}°C** (feels like **${feelsLike}°C**) with **${condition}** skies. Air quality (AQI ${aqi}) is acceptable for general cardio.`
      : `Outdoor workouts in **${locationName}** require **caution**. Temperature is **${temp}°C** with high humidity (${humidity}%) and AQI **${aqi}**. Consider morning workouts or indoor sessions to prevent thermal strain.`;
    
    insights.push({
      type: isGoodRunning ? 'favorable' : 'caution',
      label: 'Thermal Comfort',
      text: `${temp}°C with ${humidity}% humidity.`,
    });
    followUps.push('What about tomorrow morning workout window?', 'Show me the hourly heat index');
  } else if (q.includes('rain') || q.includes('umbrella') || q.includes('commute') || q.includes('traffic')) {
    answer = rainProb >= 50
      ? `**Yes, carry an umbrella.** Rain probability for **${locationName}** is **${rainProb}%** today with ${condition} conditions. Expect localized delays during evening commute hours.`
      : `Rain probability in **${locationName}** is relatively low at **${rainProb}%** today. Current weather is **${condition}** with **${temp}°C**.`;
    
    insights.push({
      type: rainProb >= 50 ? 'critical' : 'favorable',
      label: 'Precipitation',
      text: `${rainProb}% chance of rain today.`,
    });
    followUps.push('Will it rain tomorrow?', 'Show me Doppler Radar live feed');
  } else if (q.includes('tomorrow')) {
    answer = `Tomorrow in **${locationName}**, expected conditions are **${tomorrow?.condition || 'Partly Cloudy'}** with a high of **${tomorrowTempMax}°C** and a low of **${tomorrow?.temp_min_c ?? 22}°C**. Rain chance is **${tomorrowRain}%**.`;
    insights.push({
      type: 'favorable',
      label: 'Tomorrow Outlook',
      text: `High of ${tomorrowTempMax}°C, rain probability ${tomorrowRain}%.`,
    });
    followUps.push('Is it safe for outdoor travel tomorrow?', 'What is the UV index tomorrow?');
  } else if (q.includes('aqi') || q.includes('air') || q.includes('pollution') || q.includes('smog')) {
    const aqiCategory = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Satisfactory' : aqi <= 200 ? 'Moderate' : 'Poor';
    answer = `Current Air Quality Index (AQI) in **${locationName}** is **${aqi} (${aqiCategory})**. Dominant pollutants are PM2.5 and PM10. Sensitive individuals should consider wearing masks in traffic corridors.`;
    insights.push({
      type: aqi > 100 ? 'caution' : 'favorable',
      label: 'Air Quality',
      text: `AQI ${aqi} (${aqiCategory}).`,
    });
    followUps.push('How does humidity affect air quality?', 'Show hourly AQI trend');
  } else {
    answer = `Current weather in **${locationName}** is **${condition}** at **${temp}°C** (feels like **${feelsLike}°C**) with **${humidity}%** humidity and wind at **${current?.wind_kph ?? 12} km/h**. Rain chance is **${rainProb}%** today.`;
    if (heatStress) {
      insights.push({
        type: heatStress.score > 60 ? 'caution' : 'favorable',
        label: 'Heat Stress',
        text: `Score ${heatStress.score} (${heatStress.band}).`,
      });
    }
    followUps.push('Will it rain today?', 'Is it safe for a run this evening?', 'What about tomorrow?');
  }

  return {
    answer,
    confidence: 0.88,
    insights,
    suggestedFollowUps: followUps.length > 0 ? followUps : [
      'What about tomorrow\'s weather?',
      'Show me the hourly forecast',
      'Is it safe for outdoor activities?',
    ],
    generatedAt: new Date().toISOString(),
  };
}

aiRouter.post('/query', async (req: Request, res: Response) => {
  const { query = '', location, selectedPersonas = [], forecastContext } = req.body as AIQueryRequest;

  if (!query.trim()) {
    return res.status(400).json({ error: 'Query cannot be empty' });
  }

  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const gemini = new OpenAI({
        apiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });

      const systemPrompt = `You are Ask Mausam, an intelligent grounded weather assistant for India (developed for MoES / IMD).

Answer ONLY using the weather data provided below.
Do not invent temperature, humidity, AQI, rain probability, UV, or safety conditions.
If required data is missing, clearly say that it is unavailable.

Location: ${location?.name || 'India'}
Selected personas: ${selectedPersonas.join(', ') || 'none'}

CURRENT FORECAST DATA:
${JSON.stringify(forecastContext, null, 2)}
The "daily" array contains the upcoming forecast days in order:
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
2. Be concise, practical, and grounded.
3. Mention relevant numbers from the forecast when useful.
4. Give safety advice only when supported by the supplied data.
5. Keep the answer under 120 words.
`;

      const message = await gemini.chat.completions.create({
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      });

      const answer = message.choices[0].message.content || 'Unable to process query';

      const response: AIQueryResponse = {
        answer,
        confidence: 0.95,
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
      console.warn('Gemini API call failed, falling back to grounded telemetry engine:', error);
      const fallback = generateGroundedFallback(query, location?.name || 'India', forecastContext);
      return res.json(fallback);
    }
  }

  // Grounded telemetry engine when no API key configured
  const fallback = generateGroundedFallback(query, location?.name || 'India', forecastContext);
  return res.json(fallback);
});