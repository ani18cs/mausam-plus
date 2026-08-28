# Mausam+ Contribution & Git Workflow Guidelines

Welcome to the **Mausam+** core development team! This repository is engineered for a fast-paced 5-day hackathon sprint (SIH PS 26076 / MoES / IMD) across 6 developers working simultaneously in a monorepo. Follow these guidelines strictly to ensure smooth, zero-conflict integration.

---

## 1. Branching Strategy

Our git flow consists of two persistent branches and short-lived feature branches:

- **`main`**: Protected production branch. Always demo-ready. Updated only by the Lead Engineer via PR merge from `develop`.
- **`develop`**: The primary integration branch. All feature branches merge here via reviewed Pull Requests.
- **`feature/<short-desc>`**: Topic branches for individual features (e.g., `feature/heat-stress-card`, `feature/weather-aggregator`, `feature/ai-nl-query`).

### ⏰ The 24-Hour Rule (Zero Merge Debt)
- **No feature branch may live longer than 24 hours.**
- Everyone pulls `develop` and merges back into `develop` at least **twice a day** (midday sync + end of day).
- Long-lived branches cause massive merge conflicts. Break tasks into small, functional slices and ship frequently.

---

## 2. Commit Message Conventions

We adhere to the Conventional Commits specification:
```
<type>(<scope>): <short imperative summary>
```

### Types:
- `feat`: New feature or user-facing addition
- `fix`: Bug fix
- `refactor`: Code restructuring without functional changes
- `docs`: Documentation updates
- `style`: Formatting, whitespace, or token adjustments
- `test`: Adding or updating test cases
- `chore`: Tooling, build config, package upgrades

### Scopes:
- `cards`: Card component system (`AqiCard`, `HeatStressCard`, etc.)
- `bff`: Backend-for-Frontend API endpoints & aggregator services
- `ui`: Design system, layouts, navigation, animations
- `ai`: Conversational query handling & explainability prompts
- `map`: Leaflet layers, citizen report markers, geolocation
- `pwa`: Service worker, manifest, offline caching
- `types`: Shared TypeScript interfaces

### Examples:
```bash
feat(cards): add AQI pollutant breakdown and health badge
feat(bff): integrate Open-Meteo current and hourly forecast
fix(map): resolve safe-area floating action button overlap on iOS
docs(arch): document heat-stress index calculation formula
```

---

## 3. Pull Request (PR) Checklist

Before submitting a PR to `develop`, ensure all checkboxes pass:

- [ ] **Typecheck passes**: `npm run typecheck` succeeds with 0 errors across all workspaces.
- [ ] **Build succeeds**: `npm run build` generates error-free bundles.
- [ ] **Lint passes**: `npm run lint` passes without fatal errors.
- [ ] **No Hardcoded Keys**: API keys/secrets are sourced via `.env` / environment variables.
- [ ] **UI Verification**: Included a screenshot or GIF in the PR description for any visual changes.
- [ ] **Touch Points Checked**: Shared types in `packages/shared-types` updated if API contracts changed.

---

## 4. Teammate Starter Feature Branches

The following initial feature branches are pre-configured:
1. `feature/persona-cards` — Frontend Persona Cards & ranking system
2. `feature/weather-aggregator` — BFF Open-Meteo, AQI & WorldTides data fanout
3. `feature/conversational-ai` — "Ask Mausam" NL query orchestration & voice loop
4. `feature/alerts-explainability` — Explainable reason-trace alerts engine
5. `feature/citizen-reports-map` — Hyperlocal risk map & crowdsourced reporting flow
6. `feature/onboarding-design-system` — Persona onboarding flow & design token refinements

---

## 5. Daily Sync Schedule

- **10:00 AM — Morning Standup (15 min)**: Yesterday's progress, today's goals, immediate blockers.
- **02:00 PM — Midday Sync & Pull (10 min)**: Pull latest `develop`, resolve conflicts early.
- **07:00 PM — Evening Integration & Demo (30 min)**: PR reviews, merges into `develop`, end-of-day smoke test.
