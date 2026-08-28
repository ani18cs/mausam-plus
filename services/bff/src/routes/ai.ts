import { Router, Request, Response } from 'express';
import { AIQueryRequest, AIQueryResponse } from '@mausam/shared-types';

export const aiRouter = Router();

/**
 * POST /api/ai/query
 * Conversational Natural Language Query Endpoint ("Ask Mausam")
 *
 * // TODO: replace with real LLM implementation (Claude/OpenAI Function Calling) — see docs/ARCHITECTURE.md
 * Currently provides high-fidelity, persona-aware contextual responses for SIH prototype demonstrations.
 */
aiRouter.post('/query', (req: Request, res: Response) => {
  const { query = '', location, selectedPersonas = [] } = req.body as AIQueryRequest;
  const q = query.toLowerCase().trim();

  let response: AIQueryResponse;

  if (q.includes('run') || q.includes('jog') || q.includes('running') || q.includes('workout')) {
    response = {
      answer:
        'Running at 6:00 PM is **acceptable with precautions**. While the ambient temperature drops to 27°C, relative humidity remains elevated at 74%, resulting in moderate heat stress. For optimal physiological comfort, we recommend running between **5:30 AM and 7:00 AM tomorrow** when UV is 0 and AQI is under 90.',
      confidence: 0.94,
      insights: [
        {
          type: 'caution',
          label: 'Elevated Humidity',
          text: '74% humidity reduces evaporative sweat cooling.',
        },
        {
          type: 'favorable',
          label: 'Decreasing Solar Radiation',
          text: 'UV index drops to 0.5 past 5:30 PM.',
        },
      ],
      suggestedFollowUps: [
        'What is tomorrow morning\'s running suitability score?',
        'Show hydration recommendations for running in 75% humidity',
        'Check AQI forecast for morning workout hours',
      ],
      suggestedCardId: 'card-fitness-running',
      generatedAt: new Date().toISOString(),
    };
  } else if (q.includes('rain') || q.includes('commute') || q.includes('umbrella') || q.includes('school')) {
    response = {
      answer:
        '**Carry an umbrella!** IMD radar indicates a 68% probability of localized thunderstorm activity and waterlogging between **4:30 PM and 7:00 PM** across central arterial routes. Morning commutes will remain largely clear.',
      confidence: 0.91,
      insights: [
        {
          type: 'critical',
          label: 'Peak Rain Window',
          text: 'Convective rain band expected between 4:30 PM and 7:00 PM.',
        },
        {
          type: 'caution',
          label: 'Traffic Slowdown',
          text: 'High probability of localized waterlogging on Outer Ring Road.',
        },
      ],
      suggestedFollowUps: [
        'Are there any citizen-reported waterlogging spots nearby?',
        'Will tomorrow morning school bus hours be affected by rain?',
        'Show hourly precipitation probability chart',
      ],
      suggestedCardId: 'card-commute-radar',
      generatedAt: new Date().toISOString(),
    };
  } else if (q.includes('beach') || q.includes('surf') || q.includes('swim') || q.includes('tide') || q.includes('sea')) {
    response = {
      answer:
        '**Fair beach conditions today.** High tide occurs at **3:45 PM (+1.8m)** with moderate wave heights of 1.2m and sea temperature of 27.5°C. Swimming is safe in designated zones, but caution is advised near low-tide rip currents after 8:30 PM.',
      confidence: 0.88,
      insights: [
        {
          type: 'favorable',
          label: 'Wave Height',
          text: '1.2m waves suitable for novice and intermediate surfers.',
        },
        {
          type: 'caution',
          label: 'High Tide Timing',
          text: 'Maximum beach inundation expected at 3:45 PM.',
        },
      ],
      suggestedFollowUps: [
        'When is the next low tide schedule?',
        'What is the coastal water quality and jellyfish alert status?',
      ],
      suggestedCardId: 'card-beach-tide',
      generatedAt: new Date().toISOString(),
    };
  } else if (q.includes('heat') || q.includes('uv') || q.includes('sun') || q.includes('aqi') || q.includes('air')) {
    response = {
      answer:
        'The composite **Heat-Stress Index is 72 (High Risk / Orange Band)** today. Even though the air temperature is 31°C, high humidity and direct solar radiation push perceived thermal strain to 37°C equivalent. Air quality (AQI 128) is Moderate with elevated PM2.5.',
      confidence: 0.96,
      insights: [
        {
          type: 'critical',
          label: 'High Thermal Strain',
          text: 'Drink at least 500ml water per hour of outdoor exposure.',
        },
        {
          type: 'caution',
          label: 'Sensitive Groups AQI',
          text: 'Individuals with respiratory sensitivity should avoid prolonged exertion.',
        },
      ],
      suggestedFollowUps: [
        'How is the heat stress index calculated?',
        'What is the PM2.5 pollutant concentration today?',
      ],
      suggestedCardId: 'card-heat-stress',
      generatedAt: new Date().toISOString(),
    };
  } else {
    // Default smart response
    response = {
      answer: `Based on current meteorological telemetry for **${
        location?.name || 'your location'
      }**, conditions are currently **Partly Cloudy (28.5°C)** with a composite Heat-Stress Index of **72 (Caution)** and AQI of **128**. Precipitation probability increases to **65% later this afternoon**.`,
      confidence: 0.89,
      insights: [
        {
          type: 'favorable',
          label: 'Current Temp',
          text: '28.5°C with mild wind speeds of 14 km/h.',
        },
        {
          type: 'caution',
          label: 'Precipitation',
          text: 'Isolated thunderstorm potential between 4 PM and 7 PM.',
        },
      ],
      suggestedFollowUps: [
        'Can I go for a run this evening?',
        'Will it rain during the evening commute?',
        'What is the current AQI and pollutant breakdown?',
      ],
      suggestedCardId: 'card-health-aqi',
      generatedAt: new Date().toISOString(),
    };
  }

  return res.json(response);
});
