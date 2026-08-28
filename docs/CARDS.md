# Developer Guide: Adding a New Persona Card

> **Mausam+ Universal Card System**  
> Every teammate developing a new persona feature builds a **Card** that plugs directly into the unified home feed.

---

## 1. Card Anatomy & Rules

Every Card in Mausam+ **MUST** follow these UX principles:
1. **Always wrap with `<CardShell>`** from `@mausam/design-system`:
   - Consistent padding, rounded corners, elevation, and backdrop blur.
   - Icon is placed **Top-Left** (scan order: icon → title → value).
   - "Why?" affordance is placed **Bottom-Right** (consistent muscle memory).
2. **Accept `CardProps`**:
   ```typescript
   import { CardProps } from '@mausam/shared-types';
   import { CardShell } from '@mausam/design-system';
   ```
3. **Handle missing optional data gracefully** with sensible fallback defaults.

---

## 2. Step-by-Step Implementation

### Step 1: Create your Card file in `apps/mobile/src/cards/`
Example: `apps/mobile/src/cards/AgriSoilCard.tsx`

```tsx
import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Sprout, Droplet } from 'lucide-react';

export const AgriSoilCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  return (
    <CardShell
      id="card-agri-soil"
      title="Soil Moisture & Sowing Window"
      subtitle="Topsoil moisture & agricultural irrigation guide"
      icon={<Sprout className="h-5 w-5 text-green-600" />}
      badge={{
        severity: 'safe',
        label: 'Optimal Soil Moisture (38%)',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this guidance?"
    >
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-heading text-4xl font-extrabold text-content-primary tracking-tight">
              38%
            </span>
            <span className="ml-1.5 text-xs font-semibold text-content-muted">Field Capacity</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">Favorable for Kharif Sowing</span>
        </div>

        <p className="text-xs text-content-secondary leading-snug">
          Monsoon precipitation over the past 48h has saturated the top 15cm root zone. Next irrigation recommended in 3 days.
        </p>
      </div>
    </CardShell>
  );
};
```

---

### Step 2: Register your Card in `apps/mobile/src/cards/CardRegistry.ts`

Add an entry to `CARD_REGISTRY`:

```typescript
import { AgriSoilCard } from './AgriSoilCard';

export const CARD_REGISTRY: Record<string, CardRegistryEntry> = {
  // ... existing cards ...

  'card-agri-soil': {
    id: 'card-agri-soil',
    title: 'Soil Moisture & Sowing Window',
    category: 'agri_farming',
    component: AgriSoilCard,
    relevantPersonas: ['agri', 'family'], // Which personas prioritize this card
    defaultRank: 6, // Base rank priority
    description: 'Topsoil saturation level, evapotranspiration rates, and crop planting advice.',
  },
};
```

---

### Step 3: Add "Why?" Reason Trace in `apps/mobile/src/components/layout/WhyModal.tsx`

Add a case for your card ID:

```typescript
case 'card-agri-soil':
  return {
    title: 'Why is Soil Moisture at 38% Optimal?',
    subtitle: 'Agricultural Hydrology Model',
    summary: 'Recent 32mm precipitation reached root zone depth without causing surface ponding.',
    confidence: 93,
    steps: [
      {
        factor: 'Cumulative 48h Rainfall',
        observed: '32.4 mm',
        threshold: '> 25.0 mm',
        note: 'Sufficient to reach field capacity for cereal crops.',
        impact: 'high',
      },
    ],
    recommendation: 'Ideal window for groundnut and soybean sowing. Hold off supplementary drip irrigation for 72 hours.',
  };
```

---

## 3. How Ranking Works

When a user selects personas during onboarding (e.g. `agri` and `family`), `getRankedCardIds()` calculates a priority score:
$$\text{Priority Score} = \text{defaultRank} - (\text{matchedPersonas} \times 10)$$

Cards with lower scores appear first in the home feed. Users can also manually reorder cards using the **Reorder** button on the home screen.
