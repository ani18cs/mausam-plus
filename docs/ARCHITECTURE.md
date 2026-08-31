# Mausam+ System Architecture & Technical Specification

> **SIH Problem Statement 26076 — Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)**
> **Version:** 2.1.0 | **Layer:** Full-Stack & UI/UX Architecture

---

## 1. Executive Summary & Core Philosophy

**Mausam+** transforms standard weather apps from static dashboard utilities into an **adaptive, persona-aware, conversational, explainable, and multi-lingual weather companion**.

Instead of rendering different themes or splintered screens, Mausam+ utilizes **one universal Card System**. A persona is simply a ranked, filtered subset of reusable weather cards from a shared card library. Onboarding lets a citizen select 1–2 initial personas (e.g. *Outdoor Fitness + Health-Conscious*), which establishes the initial feed hierarchy; users can reorder or explore any card at will.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Citizen / User Client                          │
│        (React 18 + Vite + TS + Capacitor Native Android / iOS)          │
│   [Native GPS / Camera] [Voice TTS/STT] [3 Languages: en, hi, kn]       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON via REST (Single Origin / Reverse Proxy)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Backend-For-Frontend Service (BFF)                    │
│            (Node.js + Express + TS + Redis + Multi-Stage Docker)        │
│                                                                         │
│  ┌───────────────────────┐    ┌──────────────────────────────────────┐  │
│  │   Weather Aggregator  │    │ Dual-Retrieval RAG Pipeline          │  │
│  │ (Open-Meteo + Marine) │    │ (Knowledge Base + TF-IDF Vector Store│  │
│  └───────────┬───────────┘    └──────────────────┬───────────────────┘  │
│              │                                   │                      │
│  ┌───────────▼───────────┐    ┌──────────────────▼───────────────────┐  │
│  │ Redis / In-Memory TTL │    │ Explainable Alerts &                 │  │
│  │ Caching (12-min TTL)  │    │ Reason Trace Engine                  │  │
│  └───────────────────────┘    └──────────────────────────────────────┘  │
└──────────────┬───────────────────┬───────────────────┬──────────────────┘
               │                   │                   │
               ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │  Open-Meteo  │    │ Open-Meteo   │    │  IMD & NDMA  │
        │  Weather API │    │  Marine API  │    │  Standards   │
        │  (Live API)  │    │ (Live Swell) │    │  (Grounded)  │
        └──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Monorepo Structure

```
mausam-plus/
├── apps/
│   └── mobile/                     # React 18 + Vite + TS + Tailwind + Capacitor Native
│       ├── android/                # Native Android Studio project (Capacitor 8)
│       ├── public/                 # PWA manifest, service worker, IMD emblem
│       └── src/
│           ├── cards/              # Universal card library & CardRegistry
│           ├── components/
│           │   ├── alerts/         # IMDBulletinBoard
│           │   ├── layout/         # TopAppBar, BottomTabBar, MobileShell, WhyModal
│           │   └── weather/        # LottieWeatherGraphic
│           ├── locales/            # en.json, hi.json, kn.json (3-Language Dictionary)
│           ├── pages/              # 8 Routed application screens
│           ├── services/           # Native Services (GPS, Camera, Push, Back Button)
│           ├── store/              # Zustand global client store
│           └── utils/i18n.ts       # i18next engine + Intl number/date formatters
├── services/
│   └── bff/                        # Node.js + Express + TypeScript BFF
│       ├── Dockerfile              # Multi-stage production container with dumb-init
│       └── src/
│           ├── routes/             # /api/forecast, /api/ai, /api/reports, /api/notifications
│           ├── services/
│           │   ├── cache.ts        # Redis client with graceful in-memory TTL fallback
│           │   ├── openMeteo.ts    # Live Open-Meteo Weather + Marine API Aggregator
│           │   ├── notifications.ts# Localized Push & Local Notification Dispatcher
│           │   └── rag/            # Vector store, Knowledge base, Dual-retrieval pipeline
│           └── server.ts           # Express server entry point with Rate Limiting
├── packages/
│   ├── design-system/              # Design tokens (CSS vars + Noto Sans Kannada)
│   └── shared-types/               # Canonical types (NormalizedForecast, AIAuditTrail, SupportedLanguage)
├── docs/
│   ├── ARCHITECTURE.md             # This architecture manual
│   └── CARDS.md                    # Developer guide for adding new persona cards
└── README.md                       # Monorepo startup instructions
```

---

## 3. Data Contracts (`packages/shared-types`)

Frontend and backend communicate strictly via canonical types exported by `@mausam/shared-types`:

### `SupportedLanguage`
```typescript
export type SupportedLanguage = 'en' | 'hi' | 'kn';
```

### `NormalizedForecast`
```typescript
interface NormalizedForecast {
  location: { name: string; lat: number; lon: number; country?: string };
  current: {
    temp_c: number;
    feels_like_c: number;
    humidity_pct: number;
    wind_kph: number;
    wind_dir_deg: number;
    uv_index: number;
    condition: string;
    condition_code: number;
    is_day: boolean;
    aqi?: number;
  };
  hourly: Array<{
    time: string;
    temp_c: number;
    feels_like_c: number;
    humidity_pct: number;
    rain_prob_pct: number;
    condition: string;
    wind_kph: number;
  }>;
  daily: Array<{
    date: string;
    temp_min_c: number;
    temp_max_c: number;
    rain_prob_pct: number;
    condition: string;
    sunrise?: string;
    sunset?: string;
  }>;
  extras: {
    heat_stress_index?: { score: number; band: string; label: string; summary: string };
    aqi_breakdown?: { pm25: number; pm10: number; no2: number; o3: number; primary_pollutant: string };
    running_window?: { score: number; optimal_time_slot: string; reason: string };
    marine?: { swell_wave_height_m: number; sea_surface_temp_c: number; wave_period_s: number; surf_verdict: string };
    forecast_diff?: { temp_delta: number; humidity_delta: number; summary: string; trend: 'warmer' | 'cooler' | 'similar' };
  };
}
```

---

## 4. Backend Production & Scaling Architecture

### A. Redis Caching Hierarchy
| Metric / Endpoint | Cache Key Pattern | TTL | Eviction Policy |
| :--- | :--- | :--- | :--- |
| **Hourly Weather & Marine** | `forecast:{lat_2dp}:{lon_2dp}` | 720 sec (12 min) | `volatile-lru` |
| **Conversational AI RAG** | `ai:{sha256(query_lang_loc)}` | 1800 sec (30 min) | `volatile-lru` |
| **IMD Bulletins & Warnings** | `imd:warnings:{state}` | 300 sec (5 min) | `volatile-lru` |
| **Reverse Geocoding** | `geo:{lat}:{lon}` | 86400 sec (24 hr) | `volatile-lru` |

### B. Rate Limiting & Denial-of-Service Defense
- **Per-IP Rate Limiting:** 120 requests / minute per client IP using `express-rate-limit`.
- **AI Query Throttling:** 20 queries / minute per user token to protect LLM inference quotas.
- **Connection Draining & Signal Handling:** Uses `dumb-init` in Docker to forward `SIGTERM`/`SIGINT` signals, completing in-flight HTTP requests before pod termination.

### C. Production Containerization (`Dockerfile`)
- **Multi-Stage Build:** TypeScript compilation occurs in a temporary build container; the final runtime image is based on minimal `node:20-alpine` (<140 MB).
- **Non-Root Execution:** Container runs strictly as the unprivileged `node` user (UID 1000).
- **Signal Handling:** PID 1 signal management handled by `dumb-init`.
- **Health Check Probe:** Configured at `/api/health` with 30s intervals.

---

## 5. Conversational AI RAG Architecture & Indic Language Roadmap

### Current Implementation
- **Tool Retrieval:** Interrogates live weather metrics, AQI, and swell conditions.
- **Unstructured Retrieval:** Vector search over 9 authoritative IMD, NDMA, and CPCB standard operating procedures.
- **Multi-Lingual Generation:** Prompt conditioning directs the LLM to formulate natural responses in the user's selected language (`en`, `hi`, `kn`).
- **Explainability:** Frontend inspects `auditTrail` to verify exactly which meteorological tools and safety passages contributed to the answer.

### Indic Language Retrieval Roadmap (Future Scope)
- While the LLM currently reasons and outputs in English, Hindi, and Kannada, the underlying vector knowledge chunks are indexed from English IMD/NDMA source manuals.
- **Deliberate Future Scope Item:** Native vector indexing of vernacular Indic disaster manuals (e.g. Karnataka State Natural Disaster Monitoring Centre - KSNDMC Kannada guidelines, Hindi NDMA manuals) using multi-lingual dense embeddings (e.g. `text-embedding-3-large` or `Sarvam-Indic-Embed`).

---

## 6. Native Cross-Platform Capacitor Architecture

Mausam+ is packaged and deployed as a real native Android and iOS mobile application via **Capacitor 8**:

- **Hardware GPS Geolocation (`@capacitor/geolocation`):** Precise coordinate resolution with battery-saving coarse/fine transitions.
- **Device Camera (`@capacitor/camera`):** Native hardware camera capture for citizen waterlogging reports.
- **Voice Intelligence (`@capacitor-community/speech-recognition` & `@capacitor-community/text-to-speech`):** Native Android/iOS speech synthesis and microphone audio stream capture with Web Speech API browser fallbacks.
- **Hardware Navigation (`@capacitor/app`):** Android hardware back button interceptor preventing abrupt app exits.
- **Theme & Status Bar (`@capacitor/status-bar`):** Native status bar and navigation bar tint synchronization matching active light/dark themes.

---

## 7. UI/UX Architecture & Official IMD Live Feed Roadmap

### A. Full-Screen Hero & Clutter-Free Universal Card System
- **Hero Tile:** Viewport-height presentation with large temperature numeral, canonical Unicode degree symbol (`\u00B0C`), animated weather graphic component (`LottieWeatherGraphic`), active location name, and one-line difference insight.
- **Single-Main-Point Cards:** Every tile is decluttered to show **1 icon, 1 primary number/value, 1 short label (2–4 words max)**. All supporting scientific models, physiological factors, and CPCB pollutant breakdowns reside behind the tap-to-expand `WhyModal`.
- **Persona Scoping & Two-Way Personalization:** Home feed strictly renders 4–6 cards matching the user's opted-in personas. A collapsed **"More categories"** drawer allows users to permanently pin any unselected card into their active feed.
- **Hyperlocal Map Numeric Overlays:** Leaflet markers render bold numeric telemetry tags (`AQI 142`, `36°C`, `18mm`) with a persistent layer legend and "Why?" popup context.

### B. Official IMD Live Feed Ingestion Roadmap
Mausam+ incorporates an **Official IMD Bulletin Board** in the Alerts tab displaying authoritative national weather bulletins, tropical cyclone outlooks, and Agromet advisories with PDF links.

**Roadmap for Direct Machine-to-Machine IMD Feed Ingestion:**
1. **API Integration with IMD Open Data Gateway / NWFC:** Ingest CAP (Common Alerting Protocol) XML/JSON feeds directly from `mausam.imd.gov.in`.
2. **Automated PDF Parsing Worker:** Background microservice using OCR/PDF extraction to parse daily Agromet advisory tables into structured district-level soil and crop advisories.
3. **Geo-Fenced WebSocket Push Notifications:** Instantaneous push dispatch when an IMD Red/Orange alert is issued within 25 km of the user's GPS bounding box.
