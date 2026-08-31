import {
  calculateWBGTAndHeatLoad,
  calculateEvapotranspiration,
  calculateMarineCoastalSwell,
  computeBiometeorologyPipeline,
} from './src/services/biometeorology';

console.log('🧪 === RUNNING BIOMETEOROLOGICAL PIPELINE TEST SUITE ===\n');

// 1. Test Delhi Peak Summer (Extreme Heatwave)
const delhiWbgt = calculateWBGTAndHeatLoad(43, 35, 12, 850);
console.log('1. Delhi Peak Summer (43°C, 35% RH, 850 W/m²):');
console.log('   WBGT:', delhiWbgt);
if (delhiWbgt.value <= 30 || delhiWbgt.flagColor !== '#EF4444') {
  throw new Error(`Delhi WBGT failed: expected Danger category (>32°C / red), got ${JSON.stringify(delhiWbgt)}`);
}

// 2. Test Bengaluru Pleasant Morning
const blrWbgt = calculateWBGTAndHeatLoad(22, 55, 10, 400);
console.log('\n2. Bengaluru Pleasant Morning (22°C, 55% RH, 400 W/m²):');
console.log('   WBGT:', blrWbgt);
if (blrWbgt.category !== 'Normal' || blrWbgt.flagColor !== '#10B981') {
  throw new Error(`Bengaluru WBGT failed: expected Normal category, got ${JSON.stringify(blrWbgt)}`);
}

// 3. Test Evapotranspiration (ET0) and Topsoil Moisture
const agriET = calculateEvapotranspiration(32, 65, 600, 14);
console.log('\n3. Agricultural Evapotranspiration (32°C, 65% RH, 600 W/m²):');
console.log('   ET0 & Soil Moisture:', agriET);
if (agriET.et0 <= 0 || agriET.soilMoistureScore <= 0) {
  throw new Error(`ET0 computation invalid: ${JSON.stringify(agriET)}`);
}

// 4. Test Mumbai Coastal Marine Swell
const mumbaiSwell = calculateMarineCoastalSwell(2.8, 10, 38, true);
console.log('\n4. Mumbai Coastal Swell (2.8m, 10s period, 38 km/h wind):');
console.log('   Marine Swell:', mumbaiSwell);
if (!mumbaiSwell.hazardLevel.includes('Rough Seas') && !mumbaiSwell.hazardLevel.includes('Caution')) {
  throw new Error(`Mumbai marine swell failed: ${JSON.stringify(mumbaiSwell)}`);
}

// 5. Test Full Pipeline & Explainability Trace
const pipelineResult = computeBiometeorologyPipeline({
  tempC: 34.5,
  humidityPct: 78,
  windKph: 16.5,
  solarRadiationWm2: 720,
  uvIndex: 8.2,
  swellHeightM: 1.8,
  wavePeriodSec: 9,
  isCoastal: true,
});
console.log('\n5. Complete Pipeline Output:');
console.log(JSON.stringify(pipelineResult, null, 2));

if (
  !pipelineResult.wbgt ||
  !pipelineResult.evapotranspiration ||
  !pipelineResult.marineSwell ||
  pipelineResult.explainabilityTrace.standardCitation !== 'MoES/NDMA Heatwave SOP & INCOIS Ocean Protocol'
) {
  throw new Error('Pipeline output schema or citation mismatch!');
}

console.log('\n✅ ALL BIOMETEOROLOGICAL ENGINE TESTS PASSED CLEANLY!');
