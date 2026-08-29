import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sheet } from '@mausam/design-system';
import { CheckCircle, AlertCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const WhyModal: React.FC = () => {
  const { activeWhyModalCardId, setWhyModalCardId, forecast } = useAppStore();

  const getReasonData = (cardId: string) => {
    switch (cardId) {
      case 'card-heat-stress':
        return {
          title: 'Why is Heat-Stress Score at 72 (Orange)?',
          subtitle: 'Biometeorological Apparent Load Algorithm',
          summary: 'High humidity is severely inhibiting skin perspiration cooling despite moderate 31°C air temperature.',
          confidence: 96,
          steps: [
            {
              factor: 'Relative Humidity',
              observed: `${forecast?.current.humidity_pct ?? 68}%`,
              threshold: '> 65%',
              note: 'Reduces evaporative sweat loss efficiency by 55%.',
              impact: 'high',
            },
            {
              factor: 'Solar UV Radiation',
              observed: `${forecast?.current.uv_index ?? 7.4} Index`,
              threshold: '> 7.0',
              note: 'Direct radiant thermal heating on skin tissue.',
              impact: 'high',
            },
            {
              factor: 'Surface Air Flow',
              observed: `${forecast?.current.wind_kph ?? 14.2} km/h`,
              threshold: '< 18 km/h',
              note: 'Mild breeze insufficient to offset ambient vapor pressure.',
              impact: 'medium',
            },
          ],
          recommendation: 'Drink 500ml water per 45 mins outdoors. Limit strenuous continuous cardio.',
        };
      case 'card-health-aqi':
        return {
          title: 'Why is AQI at 128 (Moderate)?',
          subtitle: 'Multi-Sensor Atmospheric Telemetry',
          summary: 'Elevated fine particulate matter (PM2.5) concentrations from urban vehicular traffic and localized dust.',
          confidence: 92,
          steps: [
            {
              factor: 'PM2.5 Concentration',
              observed: '54.2 µg/m³',
              threshold: '> 35.0 µg/m³',
              note: 'Primary driver of respiratory index elevation.',
              impact: 'high',
            },
            {
              factor: 'Atmospheric Boundary Layer',
              observed: '820 m height',
              threshold: '< 1000 m',
              note: 'Low inversion layer trapping pollutants near surface.',
              impact: 'medium',
            },
          ],
          recommendation: 'Individuals with asthma or bronchitis should carry rescue inhalers and avoid traffic corridors.',
        };
      case 'card-fitness-running':
        return {
          title: 'Why is 05:30 AM - 07:15 AM Optimal?',
          subtitle: 'Circadian Metabolic & Climate Model',
          summary: 'Morning hours offer the lowest wet-bulb temperature, zero solar radiation, and minimal traffic emissions.',
          confidence: 94,
          steps: [
            {
              factor: 'Morning Ambient Temp',
              observed: '22.4 °C',
              threshold: '< 25.0 °C',
              note: 'Lowest thermal strain on heart rate during cardio.',
              impact: 'high',
            },
            {
              factor: 'Solar Radiation',
              observed: '0.0 UV',
              threshold: '< 1.0',
              note: 'No ultraviolet skin stress or sunburn risk.',
              impact: 'high',
            },
          ],
          recommendation: 'Complete tempo runs before 7:15 AM before boundary layer heating begins.',
        };
      case 'card-beach-tide':
        return {
          title: 'Why is Swell Wave at 1.2m?',
          subtitle: 'INCOIS Coastal Oceanographic Model',
          summary: 'Moderate offshore wind generate clean 1.2m swell with safe swimming intervals between tides.',
          confidence: 89,
          steps: [
            {
              factor: 'Astronomical Tide Cycle',
              observed: 'Next High at 3:45 PM',
              threshold: '+1.8m peak',
              note: 'Maximum shore water depth reached during afternoon.',
              impact: 'medium',
            },
          ],
          recommendation: 'Avoid swimming near rock groynes during approaching high tide.',
        };
      case 'card-agri-soil':
        return {
          title: 'Why is Soil Moisture at 38% Optimal?',
          subtitle: 'Agricultural Hydrology Model',
          summary: 'Recent rainfall has saturated the topsoil root zone, creating favorable conditions for sowing without waterlogging risk.',
          confidence: 91,
          steps: [
            {
              factor: 'Topsoil Field Capacity',
              observed: '38%',
              threshold: '30% - 45%',
              note: 'Within optimal range for seed germination and root development.',
              impact: 'high',
            },
            {
              factor: 'Frost Risk',
              observed: 'Low',
              threshold: '< 4°C overnight',
              note: 'Overnight temperatures remain well above frost threshold.',
              impact: 'medium',
            },
          ],
          recommendation: 'Favorable window for sowing and spraying. Monitor soil moisture before additional irrigation.',
        };
      case 'card-travel-packing':
        return {
          title: `Why ${forecast?.current.temp_c ?? 28.5}°C Needs This Packing List?`,
          subtitle: 'Travel Comfort & Flight Risk Model',
          summary: 'Packing recommendations and flight delay risk are derived from current temperature, precipitation probability, and wind speed.',
          confidence: 88,
          steps: [
            {
              factor: 'Current Temperature',
              observed: `${forecast?.current.temp_c ?? 28.5}°C`,
              threshold: '20°C - 30°C',
              note: 'Determines clothing layer recommendations.',
              impact: 'high',
            },
            {
              factor: 'Rain Probability',
              observed: `${forecast?.hourly?.[0]?.rain_prob_pct ?? 30}%`,
              threshold: '> 40%',
              note: 'Drives flight delay risk and umbrella/rain gear suggestions.',
              impact: 'high',
            },
            {
              factor: 'Wind Speed',
              observed: `${forecast?.current.wind_kph ?? 14.2} km/h`,
              threshold: '> 25 km/h',
              note: 'High winds may trigger windproof layer recommendation and ground delays.',
              impact: 'medium',
            },
          ],
          recommendation: 'Check flight status closer to departure if rain probability stays above 60%.',
        };
      case 'card-event-planner-comfort':
        return {
          title: 'Why This 7-Day Comfort Rating?',
          subtitle: 'Outdoor Event Suitability Model',
          summary: 'Each day is scored using maximum temperature and rain probability to flag favorable outdoor event windows.',
          confidence: 85,
          steps: [
            {
              factor: 'Max Temperature Threshold',
              observed: 'Daily max compared',
              threshold: '< 35°C = favorable',
              note: 'Days at or above 40°C are marked Poor for outdoor comfort.',
              impact: 'high',
            },
            {
              factor: 'Rain Probability Threshold',
              observed: 'Daily rain % compared',
              threshold: '< 40% = favorable',
              note: 'Days at or above 70% rain risk are marked Poor.',
              impact: 'high',
            },
          ],
          recommendation: 'Prefer days rated "Good" for outdoor events; avoid days rated "Poor".',
        };
      default:
        return {
          title: 'Why am I seeing this recommendation?',
          subtitle: 'Personalized Persona Algorithm',
          summary: 'Telemetry signals matched against your selected persona preferences and local IMD weather feeds.',
          confidence: 90,
          steps: [
            {
              factor: 'Persona Ranking Weight',
              observed: 'Matched Preferences',
              threshold: 'Active',
              note: 'Prioritized to surface top actionable metrics first.',
              impact: 'medium',
            },
          ],
          recommendation: 'Personalize card ordering in your Profile tab at any time.',
        };
    }
  };

  const data = activeWhyModalCardId ? getReasonData(activeWhyModalCardId) : null;

  return (
    <Sheet
      isOpen={Boolean(activeWhyModalCardId)}
      onClose={() => setWhyModalCardId(null)}
      title={data?.title || 'Explainable Decision Trace'}
      subtitle={data?.subtitle}
    >
      {data && (
        <div className="space-y-4 text-xs pb-4">
          {/* Summary */}
          <div className="rounded-2xl bg-card-subtle p-3.5 border border-border-subtle">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-content-primary flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-accent-primary" /> Model Rationale
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                {data.confidence}% Confidence
              </span>
            </div>
            <p className="text-content-secondary leading-relaxed">{data.summary}</p>
          </div>

          {/* Contributing Steps / Factor Trace */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-content-muted mb-2">
              Environmental Factor Breakdown
            </h4>
            <div className="space-y-2">
              {data.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border-subtle p-2.5 bg-card/60 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-content-primary text-xs">{step.factor}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-content-muted font-mono">
                        {step.threshold}
                      </span>
                    </div>
                    <p className="text-[11px] text-content-secondary mt-0.5">{step.note}</p>
                  </div>
                  <span className="font-heading font-extrabold text-accent-primary text-xs whitespace-nowrap">
                    {step.observed}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Medical / Operational Recommendation */}
          <div className="rounded-xl bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 p-3">
            <h5 className="font-bold text-sky-800 dark:text-sky-300 text-xs mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Actionable Protocol
            </h5>
            <p className="text-sky-900 dark:text-sky-200 leading-snug">{data.recommendation}</p>
          </div>
        </div>
      )}
    </Sheet>
  );
};