# 🌦️ Mausam+ — Persona-Aware, Conversational, Explainable Weather Intelligence

> **Smart India Hackathon 2026 | Problem Statement 26076**  
> **Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
> **Team Architecture:** 6-person Parallel Engineering Monorepo

---

## 🌟 Overview

**Mausam+** transforms traditional weather apps into an intelligent, persona-configured companion. One adaptive homepage reconfigures itself for **8 distinct personas** (runners, farmers, beachgoers, commuters, parents, travelers, health-conscious, event planners), tells you **why** an alert triggered through explainable step-by-step traces, understands plain-language questions like *"Can I run at 6 PM?"*, and aggregates verified citizen weather reports on a hyperlocal risk map.

---

## 📁 Monorepo Layout

```
mausam-plus/
├── apps/
│   └── mobile/                  # React 18 + Vite + TS PWA (Frontend Mobile Client)
├── services/
│   └── bff/                     # Node.js + Express + TS Backend-For-Frontend
├── packages/
│   ├── design-system/           # Shared tokens, CSS vars, Tailwind preset & primitives
│   └── shared-types/            # Canonical NormalizedForecast, Alert, Card contracts
├── docs/
│   ├── ARCHITECTURE.md          # Full system architecture & BFF integration specs
│   └── CARDS.md                 # Teammate guide for adding new persona cards
├── .github/
│   ├── ISSUE_TEMPLATE/feature.md# Issue template for feature tasks
│   └── workflows/ci.yml         # CI pipeline (lint + typecheck + build)
├── .env.example                 # Secrets & API endpoints template
├── CONTRIBUTING.md              # Branching rules, conventional commits, 24h merge rule
└── README.md                    # This document
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js >= 18.x (tested on Node 20.x & 24.x)
- npm >= 9.x

### 1. Install Dependencies
Run from the repository root to install all workspace dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the environment variables template:
```bash
cp .env.example .env
```

### 3. Start Development Servers

**Option A: Start Everything Together**
```bash
npm run dev:all
```

**Option B: Start Individually**
- **Frontend PWA (Vite):**
  ```bash
  npm run dev:mobile
  # Opens at http://localhost:5173
  ```
- **Backend BFF (Express):**
  ```bash
  npm run dev:bff
  # Runs at http://localhost:4000
  ```

---

## 📱 Interactive Routed Screens

| Route | Description | Differentiator |
|---|---|---|
| `/onboarding` | Persona Selector | Multi-select among 8 personas with dynamic weighting |
| `/home` | Adaptive Home Feed | Ambient hero header, severe alert banner, ranked card feed with drag-to-reorder |
| `/ask` | "Ask Mausam" AI | Conversational query bar, quick prompt chips, voice recording simulation |
| `/map` | Hyperlocal Risk Map | Full-screen Leaflet map with Rain/Heat/AQI layers & citizen hazard markers |
| `/report` | Citizen Weather Report | Geotagged submission form with category picker & verification pipeline |
| `/alert/:id` | Explainable Alert Detail | Step-by-step reason trace (observed values vs thresholds & rules) |
| `/saved-places`| Saved Traveler Cities | Multi-destination weather previews for travelers |
| `/profile` | Settings & Personalization| Persona editor, multilingual switcher (5 languages), units & dark/light theme |

---

## 📚 Documentation Links

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, BFF fanout, external APIs, and decisions made.
- [docs/CARDS.md](docs/CARDS.md) — Developer guide on building and registering new cards.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Git workflow, branch naming, commit conventions, and daily sync rhythm.

---

## 🧪 Verification & Quality Checks

Run the monorepo test suites:
```bash
# Typecheck all packages, backend and frontend
npm run typecheck

# Build all packages and production bundles
npm run build

# Run linter
npm run lint
```
