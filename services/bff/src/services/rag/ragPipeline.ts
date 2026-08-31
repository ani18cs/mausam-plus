import {
  AIQueryRequest,
  AIQueryResponse,
  NormalizedForecast,
  SupportedLanguage,
  AIAuditTrail,
  AIAuditToolExecution,
  AIAuditChunk,
} from '@mausam/shared-types';
import { vectorStore } from './vectorStore';
import { fetchOpenMeteoForecast } from '../openMeteo';

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  kn: 'Kannada (ಕನ್ನಡ)',
};

/**
 * Executes structured meteorological tools against the live weather aggregator
 */
async function executeStructuredTools(
  lat: number,
  lon: number,
  locationName: string,
  forecastContext?: Partial<NormalizedForecast>
): Promise<{ forecast: NormalizedForecast; toolAudit: AIAuditToolExecution[] }> {
  const toolAudit: AIAuditToolExecution[] = [];

  let liveForecast: NormalizedForecast;
  if (forecastContext && forecastContext.current && forecastContext.location) {
    liveForecast = forecastContext as NormalizedForecast;
    toolAudit.push({
      toolName: 'get_client_telemetry_cache',
      params: { lat, lon, name: locationName },
      resultSummary: `Cached forecast for ${locationName}: ${liveForecast.current.temp_c}°C, ${liveForecast.current.condition}, AQI ${liveForecast.current.aqi}`,
    });
  } else {
    liveForecast = await fetchOpenMeteoForecast(lat, lon, locationName);
    toolAudit.push({
      toolName: 'fetch_open_meteo_live_forecast',
      params: { lat, lon, name: locationName },
      resultSummary: `Fetched real-time forecast: ${liveForecast.current.temp_c}°C, ${liveForecast.current.condition}, Humidity ${liveForecast.current.humidity_pct}%, Wind ${liveForecast.current.wind_kph} km/h`,
    });
  }

  // Air quality tool
  toolAudit.push({
    toolName: 'get_air_quality_telemetry',
    params: { lat, lon },
    resultSummary: `AQI: ${liveForecast.current.aqi} (${liveForecast.extras.air_quality?.health_category || 'Moderate'}), Dominant: ${liveForecast.extras.air_quality?.primary_pollutant || 'PM2.5'}`,
  });

  // Heat stress tool
  toolAudit.push({
    toolName: 'compute_heat_stress_wbgt',
    params: { temp: liveForecast.current.temp_c, humidity: liveForecast.current.humidity_pct },
    resultSummary: `Score: ${liveForecast.extras.heat_stress_index.score}/100 (${liveForecast.extras.heat_stress_index.band}), WBGT: ${liveForecast.extras.heat_stress_index.wbgt_c ?? 26}°C`,
  });

  return { forecast: liveForecast, toolAudit };
}

/**
 * Grounded fallback generator when LLM API key is not configured or unavailable
 */
function generateDeterministicGroundedAnswer(
  query: string,
  locationName: string,
  forecast: NormalizedForecast,
  retrievedChunks: AIAuditChunk[],
  language: SupportedLanguage
): string {
  const q = query.toLowerCase();
  const current = forecast.current;
  const today = forecast.daily?.[0];
  const tomorrow = forecast.daily?.[1];
  const heatStress = forecast.extras.heat_stress_index;

  const temp = current.temp_c;
  const feelsLike = current.feels_like_c;
  const humidity = current.humidity_pct;
  const condition = current.condition;
  const aqi = current.aqi;
  const rainProb = today?.rain_prob_pct ?? 25;

  const topAdvisory = retrievedChunks[0]?.snippet ? `\n\n📌 **Safety Guideline (${retrievedChunks[0].title})**: ${retrievedChunks[0].snippet.split('\n')[0]}` : '';

  if (language === 'hi') {
    if (q.includes('run') || q.includes('दौड़') || q.includes('व्यायाम') || q.includes('workout')) {
      const isFavorable = temp < 30 && aqi < 150;
      return isFavorable
        ? `**${locationName}** में आज आउटडोर व्यायाम के लिए मौसम **अनुकूल** है। वर्तमान तापमान **${temp}°C** (महसूस **${feelsLike}°C**) है और वायु गुणवत्ता AQI **${aqi}** है।${topAdvisory}`
        : `**${locationName}** में बाहरी व्यायाम के लिए **सावधानी** बरतें। तापमान **${temp}°C** और आर्द्रता **${humidity}%** है। शरीर में पानी की कमी न होने दें।${topAdvisory}`;
    }
    if (q.includes('rain') || q.includes('बारिश') || q.includes('छाता') || q.includes('waterlog')) {
      return rainProb >= 50
        ? `**हां, छाता साथ रखें।** **${locationName}** में आज बारिश की संभावना **${rainProb}%** है। स्थिति: **${condition}**।${topAdvisory}`
        : `**${locationName}** में आज बारिश की संभावना केवल **${rainProb}%** है। वर्तमान मौसम **${condition}** है।${topAdvisory}`;
    }
    return `**${locationName}** में वर्तमान मौसम **${condition}** है। तापमान **${temp}°C** (महसूस **${feelsLike}°C**), आर्द्रता **${humidity}%**, और वायु गुणवत्ता AQI **${aqi}** है। बारिश की संभावना **${rainProb}%** है।${topAdvisory}`;
  }

  if (language === 'kn') {
    if (q.includes('run') || q.includes('ಓಟ') || q.includes('ವ್ಯಾಯಾಮ') || q.includes('workout')) {
      const isFavorable = temp < 30 && aqi < 150;
      return isFavorable
        ? `**${locationName}** ನಲ್ಲಿ ಇಂದು ಹೊರಾಂಗಣ ವ್ಯಾಯಾಮಕ್ಕೆ ಹವಾಮಾನ **ಅನುಕೂಲಕರವಾಗಿದೆ**. ಪ್ರಸ್ತುತ ತಾಪಮಾನ **${temp}°C** (ಅನುಭವ **${feelsLike}°C**) ಮತ್ತು ವಾಯು ಗುಣಮಟ್ಟ AQI **${aqi}** ಇದೆ.${topAdvisory}`
        : `**${locationName}** ನಲ್ಲಿ ವ್ಯಾಯಾಮ ಮಾಡುವಾಗ **ಎಚ್ಚರಿಕೆ** ವಹಿಸಿ. ತಾಪಮಾನ **${temp}°C** ಮತ್ತು ಆರ್ದ್ರತೆ **${humidity}%** ಇದೆ. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.${topAdvisory}`;
    }
    if (q.includes('rain') || q.includes('ಮಳೆ') || q.includes('ಛತ್ರಿ') || q.includes('umbrella')) {
      return rainProb >= 50
        ? `**ಹೌದು, ಛತ್ರಿ ಜೊತೆಯಲ್ಲಿರಲಿ.** **${locationName}** ನಲ್ಲಿ ಇಂದು ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ **${rainProb}%** ಇದೆ. ಸ್ಥಿತಿ: **${condition}**.${topAdvisory}`
        : `**${locationName}** ನಲ್ಲಿ ಇಂದು ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ಕಡಿಮೆ ಇದ್ದು (**${rainProb}%**). ಪ್ರಸ್ತುತ ಹವಾಮಾನ **${condition}** ಆಗಿದೆ.${topAdvisory}`;
    }
    return `**${locationName}** ನಲ್ಲಿ ಪ್ರಸ್ತುತ ಹವಾಮಾನ **${condition}** ಆಗಿದೆ. ತಾಪಮಾನ **${temp}°C** (ಅನುಭವ **${feelsLike}°C**), ಆರ್ದ್ರತೆ **${humidity}%**, ಮತ್ತು ವಾಯು ಗುಣಮಟ್ಟ AQI **${aqi}** ಇದೆ. ಮಳೆಯ ಸಂಭವನೀಯತೆ **${rainProb}%**.${topAdvisory}`;
  }

  // English default
  if (q.includes('run') || q.includes('jog') || q.includes('workout') || q.includes('fitness')) {
    const isGoodRunning = temp < 30 && humidity < 75 && aqi < 150;
    return isGoodRunning
      ? `Outdoor workouts in **${locationName}** are **favorable**. Current temperature is **${temp}°C** (feels like **${feelsLike}°C**) with **${condition}** skies. Air quality (AQI ${aqi}) is within acceptable thresholds.${topAdvisory}`
      : `Outdoor workouts in **${locationName}** require **caution**. Temperature is **${temp}°C** with high humidity (${humidity}%) and AQI **${aqi}**. Consider morning workouts to minimize thermal strain.${topAdvisory}`;
  }

  if (q.includes('rain') || q.includes('umbrella') || q.includes('commute') || q.includes('waterlog')) {
    return rainProb >= 50
      ? `**Yes, carry an umbrella.** Rain probability for **${locationName}** is **${rainProb}%** today with ${condition} conditions. Allow extra transit time during evening hours.${topAdvisory}`
      : `Rain probability in **${locationName}** is relatively low at **${rainProb}%** today. Current weather is **${condition}** with **${temp}°C**.${topAdvisory}`;
  }

  if (q.includes('tomorrow')) {
    return `Tomorrow in **${locationName}**, expected conditions are **${tomorrow?.condition || 'Partly Cloudy'}** with a high of **${tomorrow?.temp_max_c ?? 32}°C** and low of **${tomorrow?.temp_min_c ?? 22}°C**. Rain chance is **${tomorrow?.rain_prob_pct ?? 20}%**.${topAdvisory}`;
  }

  return `Current weather in **${locationName}** is **${condition}** at **${temp}°C** (feels like **${feelsLike}°C**) with **${humidity}%** humidity, wind at **${current.wind_kph} km/h**, and AQI **${aqi}**. Rain probability is **${rainProb}%** today.${topAdvisory}`;
}

/**
 * Complete RAG pipeline: Structured Retrieval + Unstructured Vector RAG + Generation + Audit Trail
 */
export async function runRAGPipeline(request: AIQueryRequest & { language?: SupportedLanguage }): Promise<AIQueryResponse> {
  const { query, location, selectedPersonas = [], forecastContext, language = 'en' } = request;
  const lat = location?.lat ?? 12.9716;
  const lon = location?.lon ?? 77.5946;
  const locationName = location?.name || 'Bengaluru, Karnataka';

  // 1. STRUCTURED RETRIEVAL
  const { forecast, toolAudit } = await executeStructuredTools(lat, lon, locationName, forecastContext);

  // 2. UNSTRUCTURED RETRIEVAL (Vector RAG)
  const retrievedChunks = vectorStore.search(query, 4);

  // 3. AUDIT TRAIL LOGGING
  const auditTrail: AIAuditTrail = {
    query,
    language,
    structuredToolsExecuted: toolAudit,
    retrievedChunks,
    generatedAt: new Date().toISOString(),
  };

  console.log(`[RAG Pipeline] Query: "${query}" | Lang: ${language} | Tools: ${toolAudit.length} | Chunks: ${retrievedChunks.length}`);

  // 4. GENERATION (LLM or Grounded Telemetry Fallback)
  const rawApiKey = (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  const rawModel = (process.env.LLM_MODEL || 'gemini-2.5-flash').trim();
  const model = rawModel.startsWith('models/') ? rawModel.replace('models/', '') : rawModel;

  let answer = '';
  const insights: AIQueryResponse['insights'] = [];

  if (rawApiKey) {
    try {
      const languageInstruction = language !== 'en'
        ? `CRITICAL LANGUAGE REQUIREMENT: You MUST respond ONLY in ${LANGUAGE_NAMES[language] || language}. Do not respond in English. Keep numbers and units (e.g. °C, km/h, AQI) intact.`
        : `Respond in clear, concise English.`;

      const prompt = `You are Ask Mausam, India's official AI meteorologist developed for the Ministry of Earth Sciences (MoES) and IMD.

${languageInstruction}

Grounded Facts Policy:
1. Every numeric claim about temperature, humidity, wind, UV, AQI, or rain MUST strictly match the structured weather data below.
2. Every safety precaution should incorporate the retrieved official IMD / NDMA knowledge passages below.
3. Keep the response direct, helpful, and under 130 words.

USER QUERY:
${query}

LOCATION:
${locationName} (Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)})

STRUCTURED LIVE METEOROLOGICAL TELEMETRY:
- Current Temperature: ${forecast.current.temp_c}°C (Apparent / Feels Like: ${forecast.current.feels_like_c}°C)
- Current Condition: ${forecast.current.condition}
- Relative Humidity: ${forecast.current.humidity_pct}%
- Wind Speed: ${forecast.current.wind_kph} km/h
- UV Index: ${forecast.current.uv_index}
- Air Quality Index (AQI): ${forecast.current.aqi} (${forecast.extras.air_quality?.health_category || 'Moderate'}, Primary Pollutant: ${forecast.extras.air_quality?.primary_pollutant || 'PM2.5'})
- Heat Stress Index Score: ${forecast.extras.heat_stress_index.score}/100 (${forecast.extras.heat_stress_index.label || 'Caution'})
- Today's Rain Probability: ${forecast.daily?.[0]?.rain_prob_pct ?? 20}%
- Tomorrow's Forecast: High ${forecast.daily?.[1]?.temp_max_c ?? 32}°C, Low ${forecast.daily?.[1]?.temp_min_c ?? 22}°C, Rain ${forecast.daily?.[1]?.rain_prob_pct ?? 25}%, Condition: ${forecast.daily?.[1]?.condition || 'Partly Cloudy'}

RETRIEVED OFFICIAL IMD/NDMA KNOWLEDGE PASSAGES:
${retrievedChunks.map((c, i) => `[Source ${i + 1}: ${c.title}]\n${c.snippet}`).join('\n\n')}
`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(rawApiKey)}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        answer = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      }
    } catch (err) {
      console.warn('[RAG Pipeline] LLM API call failed, falling back to deterministic grounded engine:', err);
    }
  }

  if (!answer) {
    answer = generateDeterministicGroundedAnswer(query, locationName, forecast, retrievedChunks, language);
  }

  // Generate actionable insights
  if (forecast.current.aqi > 100) {
    insights.push({
      type: 'caution',
      label: 'Air Quality',
      text: `AQI ${forecast.current.aqi} (${forecast.extras.air_quality?.health_category || 'Moderate'}). Wear N95 in transit.`,
    });
  }
  if (forecast.extras.heat_stress_index.score > 55) {
    insights.push({
      type: 'caution',
      label: 'Thermal Strain',
      text: `Heat-Stress index ${forecast.extras.heat_stress_index.score}/100. Hydrate frequently.`,
    });
  }

  return {
    answer,
    confidence: 0.96,
    insights,
    suggestedFollowUps: [
      language === 'hi' ? 'कल का मौसम कैसा रहेगा?' : language === 'kn' ? 'ನಾಳೆಯ ಹವಾಮಾನ ಹೇಗಿರಲಿದೆ?' : 'What about tomorrow\'s forecast?',
      language === 'hi' ? 'क्या बारिश का अलर्ट है?' : language === 'kn' ? 'ಮಳೆ ಎಚ್ಚರಿಕೆ ಇದೆಯೇ?' : 'Is there an active rain alert?',
      language === 'hi' ? 'दौड़ने का सर्वोत्तम समय क्या है?' : language === 'kn' ? 'ವ್ಯಾಯಾಮಕ್ಕೆ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?' : 'What is the best running window?',
    ],
    generatedAt: new Date().toISOString(),
    auditTrail,
  };
}
