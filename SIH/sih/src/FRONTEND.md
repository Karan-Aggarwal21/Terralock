# FRONTEND.md — TERRA LOCK

## AI-Powered Predictive Land Acquisition Delay & Risk Analysis System — Frontend Implementation Spec

This document is the single source of truth for building the TERRA LOCK frontend prototype. It translates the product requirements into a concrete implementation plan: stack, structure, components, pages, data contracts, and build order.

---

## 1. Product Summary

TERRA LOCK is a predictive analytics dashboard that tells a project officer, for any land-acquisition case:

1. How likely is this project to be delayed?
2. How long could the delay be?
3. Why is the delay likely to happen?
4. Which geographic areas are at higher risk?
5. What factors are contributing to the risk?
6. What does simulation say about possible outcomes?

The frontend must answer all six questions from the dashboard, with drill-down pages for deeper analysis. It must read like a **government / infrastructure intelligence platform** — not a consumer app.

**Definition of done:** a user selects a project and, without understanding the ML underneath, can state its delay probability, predicted delay length, likely reason, and risk location — from the dashboard alone.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React (Next.js recommended for routing + SSR-ready structure) |
| Styling | Tailwind CSS (utility-first, consistent spacing/tokens) |
| Charts | Recharts or Chart.js (bar, histogram, line/trend) |
| Map | Leaflet or Mapbox GL (polygons, markers, popups, layers) |
| State | React state / Context (no backend yet — mock data layer) |
| Data layer | Typed mock data objects shaped exactly like the future API response (see §9) |

Do not hard-code values inside components — always pass data via props or a data/context layer, so swapping mock data for real API calls later requires no component changes.

---

## 3. Design Direction

**Feel:** government tech platform / GIS command center / enterprise analytics dashboard.

**Do:**
- Clean layouts, strong information hierarchy
- Professional typography, generous whitespace
- Clear, consistent risk indicators
- Map-centric visualization
- Subtle, purposeful animation only
- Accessible contrast (WCAG AA minimum)

**Avoid:**
- Gaming-style UI, excessive gradients/animation
- Overly colorful cards, consumer-app aesthetics
- Decorative elements with no informational purpose

**Risk color system (used everywhere, no exceptions):**

| Level | Range | Suggested color |
|---|---|---|
| LOW | 0–30% | Green |
| MODERATE | 30–60% | Amber/Yellow |
| HIGH | 60–80% | Orange |
| CRITICAL | 80–100% | Red |

Thresholds should be defined as constants (not hard-coded per component) so they can become configurable later.

---

## 4. Application Shell

**Persistent sidebar navigation:**

```
TERRA LOCK
─────────────
Dashboard
Risk Analysis
Monte Carlo Simulation
GIS Map
Predictions
Data / Projects
Settings
```

**Top bar:** global Project Selector (dropdown), persists across all pages. Changing the selected project must update every dependent view: delay probability, delay days, delay reason, risk factors, GIS selection, simulation data, dashboard stats.

**Layout rules:**
- Sidebar collapses on tablet/small screens.
- KPI cards stack vertically on narrow viewports.
- Charts rearrange vertically on smaller screens.
- Map remains usable at all breakpoints; map + dashboard get display priority on large screens.
- Desktop is the primary target; must also work on laptop and tablet.

---

## 5. Reusable Component Library

Build these once, use everywhere — do not re-implement per page:

```
Sidebar
TopNavbar
ProjectSelector
KpiCard
RiskBadge
ProbabilityGauge
PredictionCard
RiskFactorChart
SimulationChart
MapPanel
MapLegend
FilterPanel
DataTable
LoadingState
ErrorState
EmptyState
Tooltip
Modal
```

Every data-driven component must support four states: **loading**, **success**, **empty**, **error** (with retry action). Use skeletons/spinners for loading, never a blank component.

---

## 6. Pages & Feature Specs

### 6.1 Dashboard (`/dashboard`) — primary landing page — F7

Combines outputs of every other feature. Layout:

```
┌─────────────────────────────────────────────────────┐
│ TERRA LOCK                         Project Selector  │
├──────────────┬───────────────────────────────────────┤
│ Sidebar      │  PROJECT RISK OVERVIEW                 │
│              │  [Delay Prob.] [Delay Days] [Reason]   │
│              │  [Risk Trend Chart]                    │
│              │  [Risk Factors]     [GIS Map Summary]  │
└──────────────┴───────────────────────────────────────┘
```

KPI cards (minimum 4):
1. **Delay Probability** — e.g. `72.4%` + `HIGH RISK` badge
2. **Predicted Delay** — e.g. `47 DAYS`
3. **Primary Delay Reason** — e.g. `LEGAL DISPUTE` + `84% confidence`
4. **Risk Score** — e.g. `7.8 / 10`

Also include: risk trend chart, risk-factor contribution chart, Monte Carlo distribution summary, GIS risk map, project status/acquisition progress. Must link out to each detailed module.

### 6.2 Risk Analysis / Probability (`/risk-analysis`) — F1

- Prominent probability score (e.g. `72.4%`) with a circular/gauge visualization
- Risk level badge using the standard LOW/MODERATE/HIGH/CRITICAL scale
- Contributing-factor list
- Short plain-language explanation section
- Project selector drives all values

Inputs the score conceptually derives from (for mock data realism): administrative approval status, documentation completeness, legal dispute status, compensation status, land ownership complexity, number of stakeholders, rehabilitation/resettlement status, pending notifications, previous delays, department coordination status.

### 6.3 Monte Carlo Simulation (`/simulation`) — F2

**Control panel:**
```
Number of simulations   [input]
Delay threshold         [input]
Confidence level        [input]
[ Run Simulation ]
```

**Results:**
```
Expected Delay          47 days
Median Delay            43 days
P90 Delay               71 days
Probability > 60 days   32%
```

**Visualization:** histogram/distribution chart with percentile markers and an expected-value indicator.

**Interactions:** change sim count, change threshold, run, reset, view updated results. Must show a loading/progress state while "running," and an error state on failure.

### 6.4 Predictions — Delay Days (`/predictions/delay-days`) — F4

- Large prediction card: `Predicted Delay — 47 Days`
- Expected range: `35–62 Days`
- Confidence interval if available
- Timeline visualization comparing planned completion vs. expected delay vs. P90:

```
Planned Completion
        │
        ▼
████████████████████
                    ├── Expected Delay: 47 days
                    └── P90: 71 days
```

### 6.5 Predictions — Delay Reason (`/predictions/delay-reason`) — F5

- Primary reason card: `Legal Dispute` — `Confidence: 84%`
- Ranked list of secondary reasons:
```
1. Legal Dispute          84%
2. Compensation Delay     67%
3. Documentation Issue    52%
4. Approval Delay         41%
5. Ownership Conflict     29%
```
- Explanation section connecting reason back to risk factors

### 6.6 GIS Map (`/gis-map`) — F6

The most important visual component. Full-screen/large map with:
- Project locations and land parcels as markers/polygons
- Risk visualized via the standard 4-level color scale (heatmap or colored polygons)
- Search, zoom, pan, layer control, legend, filter controls
- Click a parcel → detail popup:
```
Project: NH-XX Expansion
Location
Acquisition Status
Delay Probability
Predicted Delay
Primary Delay Reason
Risk Level
```
- Loading/error states for map data.

### 6.7 ML Explainability (`/explainability`, feeds Dashboard + Risk Analysis) — F3

Supportive, not dominant. Should not surface raw ML jargon.

```
Risk Factors
Legal Dispute              31%
Documentation Issues       22%
Compensation Delay         18%
Administrative Approval    14%
Ownership Complexity        9%
Other                        6%
```

Use a horizontal bar chart + ranked list + tooltips with plain-language explanations. Factor names must be human-readable; hide technical ML terminology (e.g. no "feature weights," "coefficients," "SHAP values" in the UI copy).

### 6.8 Data / Projects (`/projects`)

Table (`DataTable`) of all projects with columns: project name/ID, location, risk level, delay probability, predicted delay, status. Row click → sets the global project selector and can deep-link to the dashboard for that project.

### 6.9 Settings (`/settings`)

Placeholder for future configuration (e.g. risk thresholds, data sources). Not a priority for the prototype but should exist as a stub page.

---

## 7. Consistent Risk Terminology

Use exactly these four labels everywhere — dashboard, probability card, GIS map, risk factors, project list, simulation results. Never introduce alternate wording (e.g. no "Severe," "Minimal," "Elevated"):

```
LOW
MODERATE
HIGH
CRITICAL
```

---

## 8. Mock Data Requirements

Create at least 4 mock projects spanning every risk level, so the UI can demonstrate all states:

```
Project A → LOW
Project B → MODERATE
Project C → HIGH
Project D → CRITICAL
```

Mock data should live in a dedicated data module (e.g. `/data/mockProjects.ts`), typed to match the API contract in §9 exactly, so it can be swapped for real fetch calls with no component changes.

---

## 9. Frontend Data Contract

Design every component against this shape. No component should assume a value exists that isn't in this contract — extend the contract instead of hard-coding.

```json
{
  "project_id": "P001",
  "name": "NH-XX Expansion",
  "location": { "lat": 0.0, "lng": 0.0 },
  "delay_probability": 0.724,
  "risk_level": "HIGH",
  "predicted_delay_days": 47,
  "predicted_delay_range": { "min": 35, "max": 62 },
  "delay_reason": "Legal Dispute",
  "delay_reason_confidence": 0.84,
  "delay_reasons_ranked": [
    { "reason": "Legal Dispute", "confidence": 0.84 },
    { "reason": "Compensation Delay", "confidence": 0.67 }
  ],
  "risk_factors": [
    { "name": "Legal Dispute", "importance": 0.31 },
    { "name": "Documentation", "importance": 0.22 }
  ],
  "simulation": {
    "num_simulations": 10000,
    "expected_delay": 47,
    "median_delay": 43,
    "min_delay": 12,
    "max_delay": 95,
    "p90_delay": 71,
    "probability_exceeds_threshold": 0.32,
    "distribution": [/* array of simulated delay values for histogram */]
  }
}
```

---

## 10. Master Checkpoint Status

This document is executed sequentially, one checkpoint at a time. Update this table after every checkpoint completes.

| Checkpoint | Feature | Status |
|---|---|---|
| CP1 | Application Shell | PASS |
| CP2 | Project Risk Dashboard | PASS |
| CP3 | Probability & Predictions | PASS |
| CP4 | Monte Carlo Simulation | PASS |
| CP5 | Interactive GIS | PASS |
| CP6 | ML Explainability | PASS |
| CP7 | Polish & Validation | NOT STARTED |

Status values: `NOT STARTED` · `IN PROGRESS` · `BLOCKED` · `PASS`

---

## 10A. AI Agent Operating Rules

This document must be executed sequentially. The AI coding agent **MUST NOT** implement all frontend features at once.

### Execution Cycle

For every checkpoint:

1. Read the entire checkpoint.
2. Inspect the existing repository structure.
3. Identify dependencies from previous checkpoints.
4. Implement ONLY the current checkpoint.
5. Run the application.
6. Run TypeScript checks.
7. Run lint checks.
8. Run production build.
9. Manually verify every acceptance criterion.
10. Fix all discovered issues.
11. Only then mark the checkpoint as PASS.
12. Stop and report the checkpoint status before continuing.

### Rules

- Never skip a checkpoint.
- Never mark a checkpoint PASS if any acceptance criterion fails.
- Do not implement future features early.
- Reuse existing components whenever possible.
- Do not create duplicate components.
- Do not hard-code project-specific values inside UI components.
- Keep mock data separate from presentation components.
- Preserve the API-ready data contract (§9).
- Do not add features outside F1–F7.
- If requirements are ambiguous, follow this document rather than inventing behavior.

---

## 10B. Checkpoint Implementation Plan

### CHECKPOINT 1 — APPLICATION SHELL

**Goal:** Create the complete reusable application foundation before implementing feature-specific functionality.

**Build:**
- React/Next.js application structure
- Tailwind design tokens
- Global typography and spacing
- Sidebar
- TopNavbar
- ProjectSelector
- Application routing
- Base page layout
- KpiCard
- RiskBadge
- ProbabilityGauge
- PredictionCard
- LoadingState
- ErrorState
- EmptyState

**Required Routes:**
```
/dashboard
/risk-analysis
/simulation
/predictions/delay-days
/predictions/delay-reason
/gis-map
/explainability
/projects
/settings
```

**Verification:**
- Application starts successfully.
- Every required route loads.
- Sidebar navigation works.
- ProjectSelector renders.
- ProjectSelector changes the active project.
- Active project state is globally accessible.
- Sidebar collapses on smaller screens.
- No console errors.
- No TypeScript errors.
- No lint errors.
- Production build succeeds.

**PASS CONDITION:** Checkpoint 1 is PASS only when every verification item succeeds.

---

### CHECKPOINT 2 — PROJECT RISK DASHBOARD

**Goal:** Deliver the primary decision-making page (F7), wired to mock data via the required data architecture (§10E).

**Build:**
- Dashboard page layout (§6.1)
- KPI cards: Delay Probability, Predicted Delay, Primary Delay Reason, Risk Score
- Risk trend chart
- Risk factor contribution summary (uses F3 data, simplified)
- GIS map summary embed
- Monte Carlo distribution summary widget
- Links from each dashboard section to its detailed module

**Verification:**
- Dashboard loads project data through the Data Service layer, not by importing mock data directly into components.
- All four KPI cards render correctly for LOW, MODERATE, HIGH, and CRITICAL mock projects.
- Switching the ProjectSelector updates every dashboard section.
- Loading, empty, and error states work for each dashboard section.
- Navigation links to Risk Analysis, Simulation, Predictions, GIS Map, and Explainability all work.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 2 is PASS only when every verification item succeeds.

---

### CHECKPOINT 3 — PROBABILITY & PREDICTIONS

**Goal:** Implement F1, F4, and F5 as standalone detail pages.

**Build:**
- Risk Analysis page (§6.2): probability score, gauge, risk badge, contributing-factor list, explanation section
- Delay Days Prediction page (§6.4): prediction card, expected range, timeline visualization
- Delay Reason Prediction page (§6.5): primary reason card, confidence score, ranked reason list, explanation section

**Verification:**
- All three pages read from the active project via the global selector — no page-local hard-coded project data.
- ProbabilityGauge and PredictionCard components are reused from Checkpoint 1, not reimplemented.
- Risk level badge on each page matches the standard 4-level scale (§7) and matches the dashboard's value for the same project.
- Loading, empty, and error states present on all three pages.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 3 is PASS only when every verification item succeeds.

---

### CHECKPOINT 4 — MONTE CARLO SIMULATION

**Goal:** Implement F2 as an interactive simulation page.

**Build:**
- Simulation control panel (number of simulations, delay threshold, confidence level, Run Simulation button)
- Results block: Expected Delay, Median Delay, P90 Delay, Probability > threshold
- Distribution/histogram chart with percentile markers and expected-value indicator
- Reset control

**Verification:**
- Changing simulation parameters and clicking Run updates the results and chart.
- A progress/loading state displays while the simulation "runs."
- Reset returns the panel to its default state.
- An error state exists and is reachable (e.g. invalid parameter input).
- Results respect the active project from the global selector.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 4 is PASS only when every verification item succeeds.

---

### CHECKPOINT 5 — INTERACTIVE GIS

**Goal:** Implement F6, the most important visual component.

**Build:**
- Full-size map (MapPanel) with project locations/parcels
- Risk visualization using the standard 4-level color scale
- MapLegend, search control, layer control, FilterPanel
- Click-to-select parcel with detail popup (project, location, acquisition status, delay probability, predicted delay, primary reason, risk level)

**Verification:**
- Map loads without errors and renders all mock projects.
- Each risk level is visually distinguishable using the standard color scale.
- Zoom, pan, and search work.
- Clicking a parcel opens the detail popup with correct data for that project.
- Selecting a parcel updates the global ProjectSelector (or is clearly two-way consistent with it).
- Filters narrow the visible set of projects/parcels correctly.
- Loading and error states exist for map data.
- Map remains usable on tablet breakpoints.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 5 is PASS only when every verification item succeeds.

---

### CHECKPOINT 6 — ML EXPLAINABILITY

**Goal:** Implement F3 as a supportive, non-dominant explainability page.

**Build:**
- Feature importance horizontal bar chart
- Ranked risk-factor list
- Tooltips with plain-language explanations
- Optional expanded explanation panel

**Verification:**
- Factor names are human-readable; no raw ML terminology (e.g. "feature weights," "coefficients") appears in UI copy.
- Values match the risk factors shown on the Dashboard and Risk Analysis page for the same project.
- Tooltips render on hover/focus.
- Loading, empty, and error states present.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 6 is PASS only when every verification item succeeds.

---

### CHECKPOINT 7 — POLISH & SYSTEM VALIDATION

**Goal:** Validate the complete system end-to-end and bring it to a consistent, responsive, production-ready state.

**Build:**
- Responsive pass across desktop, laptop, and tablet breakpoints for every page
- Loading, empty, and error states verified/completed across all components
- Full UI consistency audit against the risk terminology (§7) and color system (§3)
- Projects/Data table page (§6.8) and Settings stub (§6.9) finalized

**Verification:**
- Every page in §10B (CP1–CP6) still passes its own verification after the polish pass.
- The full user journey in §12 completes without errors, for at least one project of each risk level.
- No two pages use different terminology or colors for the same risk level.
- No console/TypeScript/lint errors; production build succeeds.

**PASS CONDITION:** Checkpoint 7 is PASS only when every verification item succeeds and the full acceptance checklist (§12) passes.

---

## 10C. Checkpoint Gate

The agent MUST stop after completing each checkpoint. Before proceeding, report:

```
CHECKPOINT: [number]
STATUS: PASS / BLOCKED

IMPLEMENTED:
- ...

VERIFIED:
- ...

ERRORS FOUND:
- ...

ERRORS FIXED:
- ...

REMAINING ISSUES:
- ...

BUILD STATUS:
- PASS / FAIL
```

Only `STATUS: PASS` allows the next checkpoint to begin. This gate is what prevents the agent from collapsing multiple checkpoints — shell → dashboard → GIS → simulation → backend integration → extra components — into a single uncontrolled run.

---

## 10D. Feature Dependency Map

```
F1 — Probability
    ↓
    Project Risk Data

F2 — Monte Carlo
    ↓
    Project Delay Data

F3 — Explainability
    ↓
    Risk Factor Data

F4 — Delay Days
    ↓
    Prediction Data

F5 — Delay Reason
    ↓
    Prediction / Reason Data

F6 — GIS
    ↓
    Project + Location + Risk Data

F7 — Dashboard
    ↓
    Integrates F1–F6
```

---

## 10E. Data Architecture

The prototype currently uses mock data. The frontend **MUST** be structured so mock data can later be replaced by backend API responses without rewriting UI components.

**Required architecture (now):**

```
Page
 ↓
Feature Component
 ↓
Hook / Context
 ↓
Data Service
 ↓
Mock Data Provider
```

**Future architecture (post-backend):**

```
Page
 ↓
Feature Component
 ↓
Hook / Context
 ↓
Data Service
 ↓
API Provider
 ↓
Backend
 ↓
ML Model
```

**Rule:** UI components must never directly import project-specific mock data. Components consume data only through the Hook/Context + Data Service layer. This is what allows the mock-to-API swap to happen without touching presentation components.

---

## 11. Implementation Rules

1. Do not add features outside the 7 core features (F1–F7).
2. Do not remove any of the 7 core features.
3. Keep one consistent visual system across all seven — no per-feature visual styles.
4. Build with reusable React components (§5); no duplicated UI logic.
5. Use realistic, varied mock data (§8) — not placeholder zeros.
6. Never hard-code data inside a visual component when it can be passed as a prop.
7. Keep the data contract (§9) backend-ready at every step.
8. Charts and the map must be responsive.
9. Every major component needs loading, empty, and error states.
10. Prioritize decision-making information over technical/ML detail.
11. Avoid unnecessary animation.
12. Keep ML terminology hidden or simplified for end users.
13. Use only the four standard risk labels (§7) everywhere.
14. Maintain the professional government/infrastructure aesthetic (§3).

---

## 12. Acceptance Checklist

**Core features:** F1 Probability · F2 Monte Carlo · F3 ML Weighting · F4 Delay Days · F5 Delay Reason · F6 GIS Map · F7 Risk Dashboard — all present.

**UX:** clear navigation, clear project selection, consistent risk indicators, intuitive charts, interactive GIS, responsive layout, loading/error/empty states.

**Technical:** reusable components, mock data separated from components, API-ready data structures, no unnecessary hard-coded values, consistent styling, no duplicated UI logic.

**Final user journey (must work end-to-end):**

```
Select Project → View Risk Dashboard → See Delay Probability
→ See Predicted Delay Days → See Predicted Delay Reason
→ Inspect Risk Factors → Run/View Monte Carlo Simulation
→ Inspect High-Risk Areas on GIS Map → Understand overall project risk
```

The prototype is done when this journey requires no explanation of the underlying ML to complete.
