// Verification script for Mausam+ BFF endpoints
async function runTests() {
  console.log('--- Testing 1: Health & Cache Telemetry ---');
  const healthRes = await fetch('http://127.0.0.1:4000/api/health');
  console.log('Health:', await healthRes.json());

  console.log('\n--- Testing 2: Live Forecast Telemetry (Bengaluru) ---');
  const forecastRes = await fetch('http://127.0.0.1:4000/api/forecast?lat=12.9716&lon=77.5946&name=Bengaluru');
  const forecast = await forecastRes.json();
  console.log('Forecast Location:', forecast.location);
  console.log('Current Condition:', forecast.current.condition, `${forecast.current.temp_c}°C`, `AQI: ${forecast.current.aqi}`);
  console.log('Heat Stress:', forecast.extras.heat_stress_index);

  console.log('\n--- Testing 3: RAG AI Query in English ---');
  const aiEnRes = await fetch('http://127.0.0.1:4000/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'Can I go for an outdoor run at 6 PM?',
      location: { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
      selectedPersonas: ['fitness', 'health'],
      language: 'en',
    }),
  });
  const aiEn = await aiEnRes.json();
  console.log('Answer (EN):', aiEn.answer);
  console.log('Audit Tools:', aiEn.auditTrail?.structuredToolsExecuted?.map((t) => t.toolName));
  console.log('Audit Chunks:', aiEn.auditTrail?.retrievedChunks?.map((c) => c.title));

  console.log('\n--- Testing 4: RAG AI Query in Hindi ---');
  const aiHiRes = await fetch('http://127.0.0.1:4000/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'क्या आज शाम को दौड़ने जा सकते हैं?',
      location: { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
      selectedPersonas: ['fitness'],
      language: 'hi',
    }),
  });
  const aiHi = await aiHiRes.json();
  console.log('Answer (HI):', aiHi.answer);

  console.log('\n--- Testing 5: RAG AI Query in Kannada ---');
  const aiKnRes = await fetch('http://127.0.0.1:4000/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'ಇಂದು ಸಂಜೆ ವ್ಯಾಯಾಮ ಮಾಡಲು ಸೂಕ್ತವೇ?',
      location: { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
      selectedPersonas: ['fitness'],
      language: 'kn',
    }),
  });
  const aiKn = await aiKnRes.json();
  console.log('Answer (KN):', aiKn.answer);

  console.log('\n--- Testing 6: Localized Notification Dispatch ---');
  const notifRes = await fetch('http://127.0.0.1:4000/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: 'kn',
      type: 'what_changed',
      variables: { diff: '2.5', trend: 'ಬೆಚ್ಚಗಿದೆ', humidDiff: '15' },
    }),
  });
  const notif = await notifRes.json();
  console.log('Notification Dispatch (KN):', notif);
  console.log('\n✅ All tests completed successfully!');
}

runTests().catch(console.error);
