# 🚀 Mausam+ Team Onboarding & Task Allocation Guide

> **Smart India Hackathon 2026 | PS 26076 (MoES / IMD)**  
> **Repository:** `mausam-plus` | **Sprint Duration:** 5 Days (Aug 28 – Sept 2, 2026)

---

## 🗺️ 1. Directory Navigation: What is Where?

Our project is a clean **monorepo**. Here is where everything lives:

| Directory | What is It? | Who Works Here? |
|---|---|---|
| `apps/mobile/` | **Frontend Mobile App (PWA)**: React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Leaflet. | Hrishita, Samiksha, Gayathri, Ninad, Nikshepa |
| ├── `src/cards/` | Universal Card Library (`AqiCard`, `HeatStressCard`, `TideCard`, etc.) + `CardRegistry.ts` | Gayathri, Ninad |
| ├── `src/pages/` | 8 Application Screens (`Home`, `Ask`, `Map`, `Report`, `AlertDetail`, `SavedPlaces`, `Profile`, `Onboarding`) | Hrishita, Samiksha, Ninad, Nikshepa |
| ├── `src/components/` | App layout chrome (`TopAppBar`, `BottomTabBar`, `MobileShell`, `WhyModal`) | Team |
| ├── `src/store/` | Zustand Global State (`useAppStore.ts`) | All |
| `services/bff/` | **Backend-For-Frontend (BFF)**: Node.js, Express, TypeScript. Aggregates weather APIs, AI orchestration, and reports. | Aniket, Hrishita, Samiksha |
| ├── `src/routes/` | API routes (`/forecast`, `/ai/query`, `/reports`, `/alerts`) | Aniket, Hrishita, Samiksha |
| ├── `src/services/` | Live Open-Meteo client, Heat-Stress Index calculation | Aniket |
| `packages/shared-types/` | **Shared TypeScript Types**: `NormalizedForecast`, `Alert`, `CitizenReport`, `PersonaId`, etc. | Aniket (Lead) |
| `packages/design-system/` | **Design Tokens & Primitives**: Severity colors, Sora/Inter typography scale, `CardShell`, `Button`, `Sheet`. | Nikshepa, Team |
| `docs/` | **Documentation**: `ARCHITECTURE.md`, `CARDS.md`, `TEAM_GUIDE.md`. | All |

---

## 👥 2. Task Allocation & Role Breakdown

Work is divided across the 6 team members based on task complexity. Each teammate has their own designated feature branch and specific files to work on.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    TASK ALLOCATION MATRIX                                │
├────────────┬─────────┬──────────────────────────────────┬────────────────────────────────┤
│ Teammate   │ Level   │ Module & Responsibilities        │ Feature Branch                 │
├────────────┼─────────┼──────────────────────────────────┼────────────────────────────────┤
│ 👨‍💻 Aniket   │ Hard    │ Architecture, BFF Aggregator     │ feature/weather-aggregator     │
│ 👩‍💻 Hrishita │ Hard    │ Conversational AI & Alerts Engine│ feature/conversational-ai      │
│ 👩‍💻 Samiksha │ Hard    │ Hyperlocal Map & Citizen Reports │ feature/citizen-reports-map    │
│ 👩‍💻 Gayathri │ Medium  │ Persona Cards & Visualizations   │ feature/persona-cards          │
│ 👨‍💻 Ninad   │ Easy    │ Saved Places & Voice Feedback    │ feature/onboarding-design-sys  │
│ 👩‍💻 Nikshepa │ Easy    │ Translations & Theme/Units       │ feature/onboarding-design-sys  │
└────────────┴─────────┴──────────────────────────────────┴────────────────────────────────┘
```

---

### 🔴 HARD TASKS (Aniket, Hrishita, Samiksha)

#### 1. 👨‍💻 Aniket — Team Lead / Backend Aggregator & Forecasting Engine
- **Difficulty:** Hard
- **Branch:** `feature/weather-aggregator`
- **What to build:**
  1. Enhance `services/bff/src/services/openMeteo.ts` with multi-location geocoding (Open-Meteo Geocoding API).
  2. Implement OpenAQ or IQAir API fanout in BFF for real PM2.5/PM10 pollutant telemetry.
  3. Refine the Heat-Stress Index biometeorological formula in `services/bff/src/services/heatStress.ts`.
  4. Implement the "What Changed?" forecast-diff calculation comparing yesterday's telemetry with today.
- **Files to edit:**
  - `services/bff/src/services/openMeteo.ts`
  - `services/bff/src/services/heatStress.ts`
  - `services/bff/src/routes/forecast.ts`
  - `packages/shared-types/src/index.ts`

#### 2. 👩‍💻 Hrishita — Conversational AI ("Ask Mausam") & Explainable Alerts
- **Difficulty:** Hard
- **Branch:** `feature/conversational-ai` (and `feature/alerts-explainability`)
- **What to build:**
  1. Connect `services/bff/src/routes/ai.ts` to real OpenAI/Claude API or structured function-calling prompt.
  2. Inject the current `NormalizedForecast` into the LLM system prompt so answers are 100% grounded in real IMD telemetry.
  3. Enhance `apps/mobile/src/pages/AlertDetailPage.tsx` and `services/bff/src/routes/alerts.ts` with dynamic IMD alert parsing and structured "Reason Trace" factor steps.
- **Files to edit:**
  - `services/bff/src/routes/ai.ts`
  - `services/bff/src/routes/alerts.ts`
  - `apps/mobile/src/pages/AskMausamPage.tsx`
  - `apps/mobile/src/pages/AlertDetailPage.tsx`

#### 3. 👩‍💻 Samiksha — Hyperlocal Risk Map & Citizen Report Pipeline
- **Difficulty:** Hard
- **Branch:** `feature/citizen-reports-map`
- **What to build:**
  1. Connect `services/bff/src/routes/reports.ts` to Supabase / PostgreSQL database for persistent citizen reports.
  2. Implement community upvoting (`POST /api/reports/:id/upvote`) and status verification.
  3. Upgrade `apps/mobile/src/pages/HyperlocalMapPage.tsx` with Leaflet heatmaps / radar tile overlays for precipitation and AQI.
  4. Geolocation auto-detection using `navigator.geolocation.getCurrentPosition`.
- **Files to edit:**
  - `apps/mobile/src/pages/HyperlocalMapPage.tsx`
  - `apps/mobile/src/pages/CitizenReportPage.tsx`
  - `services/bff/src/routes/reports.ts`

---

### 🟡 MEDIUM TASK (Gayathri)

#### 4. 👩‍💻 Gayathri — Persona Cards & Data Visualizations
- **Difficulty:** Medium
- **Branch:** `feature/persona-cards`
- **What to build:**
  1. Build the remaining Persona Cards in `apps/mobile/src/cards/` using `<CardShell>` (see `docs/CARDS.md`):
     - `AgriSoilCard.tsx` (Agriculture persona: soil moisture, frost, spraying window)
     - `TravelPackingCard.tsx` (Traveler persona: packing recommendations & flight delay risks)
     - `EventPlannerComfortCard.tsx` (Event planner persona: 7-day outdoor comfort matrix)
  2. Add interactive Recharts temperature/precipitation trend graphs inside cards.
  3. Register cards in `apps/mobile/src/cards/CardRegistry.ts` and add reason trace data in `WhyModal.tsx`.
- **Files to edit:**
  - `apps/mobile/src/cards/` (create new card files)
  - `apps/mobile/src/cards/CardRegistry.ts`
  - `apps/mobile/src/components/layout/WhyModal.tsx`

---

### 🟢 EASY TASKS (Ninad, Nikshepa)

#### 5. 👨‍💻 Ninad — Saved Places & Voice Feedback Experience
- **Difficulty:** Easy
- **Branch:** `feature/onboarding-design-system` (or `feature/persona-cards`)
- **What to build:**
  1. Improve `apps/mobile/src/pages/SavedPlacesPage.tsx` with real-time temperature badges and search filtering for Indian cities.
  2. Enhance the voice recording animation and speech feedback on `apps/mobile/src/pages/AskMausamPage.tsx` (using Web Speech API `SpeechRecognition` if supported).
  3. Add quick action chips for switching active locations in `TopAppBar.tsx`.
- **Files to edit:**
  - `apps/mobile/src/pages/SavedPlacesPage.tsx`
  - `apps/mobile/src/pages/AskMausamPage.tsx`
  - `apps/mobile/src/components/layout/TopAppBar.tsx`

#### 6. 👩‍💻 Nikshepa — Multilingual Localization, Themes & UI Polish
- **Difficulty:** Easy
- **Branch:** `feature/onboarding-design-system`
- **What to build:**
  1. Create a lightweight dictionary `apps/mobile/src/utils/i18n.ts` supporting key UI strings in **English, Hindi, Tamil, Bengali, and Marathi**.
  2. Wire the language selector in `apps/mobile/src/pages/ProfilePage.tsx` so changing language updates headings, navigation tabs, and buttons.
  3. Verify contrast and smooth CSS transitions for Light & Dark mode tokens in `packages/design-system/src/tokens.css`.
  4. Ensure all tap targets are >= 44x44px and safe-area insets work on mobile notch screens.
- **Files to edit:**
  - `apps/mobile/src/pages/ProfilePage.tsx`
  - `apps/mobile/src/utils/i18n.ts` (create file)
  - `packages/design-system/src/tokens.css`

---

## 💻 3. How to Run Locally (Every Teammate Follows This)

### Step 1: Clone and Install
```bash
git clone <REPO_URL>
cd mausam-plus
npm install
```

### Step 2: Set Up Environment Variables
```bash
cp .env.example .env
```

### Step 3: Run the Development Servers
```bash
# Option 1: Run frontend & backend simultaneously
npm run dev:all

# Option 2: Run frontend only (connects to local or deployed BFF)
npm run dev:mobile
# Opens at http://localhost:5173

# Option 3: Run BFF backend
npm run dev:bff
# Runs at http://localhost:4000
```

---

## 🔀 4. Git Workflow: Where & How to Push Code

### Step 1: Checkout your designated feature branch
Before writing code, switch to your assigned feature branch:
```bash
# Pull latest changes first
git checkout develop
git pull origin develop

# Switch to your feature branch (example for Gayathri)
git checkout feature/persona-cards
```

### Step 2: Make your changes and test locally
Make sure your changes pass all checks:
```bash
# 1. Typecheck: must pass with 0 errors
npm run typecheck

# 2. Build check
npm run build
```

### Step 3: Commit with Conventional Commits
Use the conventional commit format:
```bash
git add .
git commit -m "feat(cards): add AgriSoilCard for farming persona"
```

### Step 4: Push to GitHub & Create a PR
```bash
# Push your branch
git push -u origin <your-feature-branch-name>
```

Then go to GitHub:
1. Open a **Pull Request (PR)** from your branch into **`develop`** (NEVER directly into `main`).
2. Add a short description and screenshot of your UI change.
3. Once reviewed and CI passes, merge into **`develop`**.

---

## ⏰ Daily Team Sync Rule

- **24-Hour Branch Rule**: No feature branch may live longer than 24 hours without merging into `develop`.
- **Sync twice daily**: 10:00 AM standup + 7:00 PM integration merge & smoke test.
