# Mausam+ System Architecture & Technical Specification

> **SIH Problem Statement 26076 — Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)**
> **Version:** 1.0.0-foundation | **Sprint:** 5-Day Team Architecture

---

## 1. Executive Summary & Core Philosophy

**Mausam+** transforms standard weather apps from static dashboard utilities into an **adaptive, persona-aware, conversational, and explainable weather companion**.

Instead of rendering different themes or splintered screens, Mausam+ utilizes **one universal Card System**. A persona is simply a ranked, filtered subset of reusable weather cards from a shared card library. Onboarding lets a citizen select 1–2 initial personas (e.g. *Outdoor Fitness + Health-Conscious*), which establishes the initial feed hierarchy; users can reorder or explore any card at will.

```
┌─────────────────────────────────────────────────────────────┐
│                    Citizen / User Client                    │
│                 (React 18 + Vite + TS PWA)                  │
│   [Onboarding] [Home Feed] [Ask AI] [Risk Map] [Profile]    │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON via REST (Single Origin)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Backend-For-Frontend Service (BFF)              │
│                  (Node.js + Express + TS)                   │
│                                                             │
│  ┌───────────────────────┐    ┌──────────────────────────┐  │
│  │   Weather Aggregator  │    │ Heat-Stress Bio Index    │  │
│  │ (Open-Meteo Normaliz.)│    │ (Steadman / WBGT Model)  │  │
│  └───────────┬───────────┘    └────────────┬─────────────┘  │
│              │                             │                │
│  ┌───────────▼───────────┐    ┌────────────▼─────────────┐  │
│  │  Conversational AI    │    │ Explainable Alerts &     │  │
│  │  (NLP Reasoner Stub)  │    │ Reason Trace Engine      │  │
│  └───────────────────────┘    └──────────────────────────┘  │
└──────┬───────────────────┬───────────────────┬──────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Open-Meteo  │    │  OpenAQ /    │    │  Citizen     │
│  Global GFS  │    │  WorldTides  │    │  Report DB   │
│  (Live API)  │    │ (Telemetry)  │    │  (Supabase)  │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Monorepo Structure

```
mausam-plus/
├── apps/
│   └── mobile/                     # React 18 + Vite + TS + Tailwind PWA
│       ├── public/                 # PWA manifest, service worker, icons
│       └── src/
│           ├── cards/              # Universal card library & CardRegistry
│           ├── components/layout/  # TopAppBar, BottomTabBar, MobileShell, WhyModal
│           ├── pages/              # 8 Routed application screens
│           └── store/              # Zustand global client store
├── services/
│   └── bff/                        # Node.js + Express + TypeScript BFF
│       └── src/
│           ├── routes/             # /api/forecast, /api/ai, /api/reports, /api/alerts
│           ├── services/           # Open-Meteo aggregator & Heat-stress engine
│           └── server.ts           # Express server entry point
├── packages/
│   ├── design-system/              # Design tokens (CSS vars + Tailwind preset) & primitives
│   └── shared-types/               # Canonical NormalizedForecast, Alert, PersonaId contracts
├── docs/
│   ├── ARCHITECTURE.md             # This architecture manual
│   └── CARDS.md                    # Developer guide for adding new persona cards
├── .github/
│   ├── ISSUE_TEMPLATE/feature.md   # Teammate feature task template
│   └── workflows/ci.yml            # CI lint + typecheck + build pipeline
├── .env.example                    # Environment secrets template
├── CONTRIBUTING.md                 # Branching strategy & 24h merge rule
└── README.md                       # Monorepo startup instructions
```

---

## 3. Data Contracts (`packages/shared-types`)

Frontend and backend communicate strictly via canonical types exported by `@mausam/shared-types`:

### `NormalizedForecast`
```typescript
interface NormalizedForecast {
  location: { name: string; lat: number; lon: number; country?: string };
  current: {
    temp_c: number;
    feels_like_c: number;
    humidity_pct: number;
    wind_kph: number;
    uv_index: number;
    aqi: number;
    condition: string;
    is_day?: boolean;
  };
  hourly: Array<{
    time: string;
    temp_c: number;
    rain_prob_pct: number;
    aqi: number;
    uv_index: number;
    condition?: string;
  }>;
  daily: Array<{
    date: string;
    temp_min_c: number;
    temp_max_c: number;
    rain_prob_pct: number;
    sunrise: string;
    sunset: string;
  }>;
  extras: {
    tide?: { next_high: string; next_low: string; wave_height_m: number; water_temp_c?: number; surf_quality?: string };
    heat_stress_index: { score: number; band: "green"|"yellow"|"orange"|"red"; label?: string; summary?: string };
    running_window?: { score: number; optimal_time_slot: string; reason: string };
    aqi_breakdown?: { pm25: number; pm10: number; no2: number; o3: number; primary_pollutant: string };
  };
  meta: { sources: string[]; fetched_at: string; cached?: boolean };
}
```

---

## 4. BFF Endpoints & Implementation Guide

### 1. `GET /api/forecast?lat={lat}&lon={lon}&name={name}`
- **Current State:** Fully implemented with **live Open-Meteo High-Resolution GFS telemetry** and resilient fallback for offline/simulated testing.
- **Caching:** In-memory LRU-like 10-minute cache to minimize redundant external calls.
- **Calculations:** Automatically calculates composite Heat-Stress Index, hourly fitness running windows, and AQI estimations.

### 2. `POST /api/ai/query`
- **Request Body:** `{ query: string, location: { lat, lon, name }, selectedPersonas?: PersonaId[] }`
- **Current State:** Smart NLP heuristics engine answering flagship questions (*"Can I run at 6 PM?"*, *"Will it rain during school commute?"*, *"What is the heat risk?"*).
- **Production Integration (Teammate 5):**
  1. Set `LLM_API_KEY` in `.env`.
  2. Call OpenAI / Anthropic function-calling API with current `NormalizedForecast` injected in system context.
  3. Ground answers directly into IMD telemetry.

### 3. `GET /api/reports` & `POST /api/reports`
- **Current State:** In-memory store with sample citizen reports (waterlogging in Koramangala, tree blockage in Jayanagar).
- **Production Integration (Teammate 6):**
  1. Connect to Supabase / Postgres using `@supabase/supabase-js`.
  2. Insert rows into `citizen_reports` table with PostGIS geospatial coordinates.
  3. Implement community upvoting & automatic IMD radar verification triggers.

### 4. `GET /api/alerts` & `GET /api/alerts/:id`
- **Current State:** Structured explainable alerts with full reason traces (triggers, observed values, thresholds, and confidence).
- **Production Integration (Teammate 5):**
  1. Ingest IMD CAP (Common Alerting Protocol) XML feeds from `data.gov.in`.
  2. Map CAP polygon parameters into explainable reason trace factors.

---

## 5. Heat-Stress Biometeorological Model

Unlike traditional apps that display raw dry-bulb temperature, Mausam+ calculates a composite **Heat-Stress Index (0–100)** based on Steadman's Apparent Temperature & Wet-Bulb Globe Temperature (WBGT) approximations:

$$e = \left(\frac{\text{RH}}{100}\right) \times 6.105 \times \exp\left(\frac{17.27 \times T}{237.7 + T}\right)$$

$$\text{AT} = T + 0.33 \times e - 0.70 \times v_{\text{wind}} - 4.0 + 0.8 \times \text{UV}$$

**Bands:**
- **Green (0–49):** Safe / Minimal physiological load.
- **Yellow (50–69):** Caution / Moderate thermal load. Hydration required.
- **Orange (70–87):** High Risk / Severe thermal strain. Perspiration cooling impaired.
- **Red (88–100):** Extreme Danger / Heat stroke risk within 20 mins of exertion.

---

## 6. Decisions Made & Architectural Records

1. **Monorepo Tooling:** Used npm workspaces for zero-overhead package resolution without complex bundler configuration across teams.
2. **Client-Side Framework:** React 18 + Vite + Tailwind + Framer Motion + Zustand. Chosen to allow instant PWA deployment ("Add to Home Screen") for the SIH live demo on phone hardware while maintaining a desktop phone bezel.
3. **Card-First Homogeneous Architecture:** Avoided fragmented per-persona pages. All 8 personas share a single unified feed where cards are prioritized by persona relevance.
4. **Explainability First:** Every card and alert exposes an unambiguous "Why?" affordance pinned to the bottom-right corner for muscle-memory access to underlying biometeorological rationale.
5. **No Direct 3rd-Party Calls from Client:** All weather, air quality, marine, and AI calls route through the BFF to prevent API key exposure and ensure deterministic contract normalization.
