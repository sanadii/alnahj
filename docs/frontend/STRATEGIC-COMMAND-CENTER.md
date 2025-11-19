# Strategic Command Center – Implementation Blueprint

## 1. Vision & Strategic Outcomes

- **Primary Goal**: Deliver the decisive planning hub that maximizes guarantees, optimizes resources, and choreographs campaign execution for Kuwait Oil Company (KOC) elections.
- **Winning Metrics**:
  - Guarantee coverage ≥ 80% across priority committees
  - Confirmed guarantees growth ≥ 12% week-over-week in decisive phases
  - Budget utilization within ±5% of plan per sprint
  - Event-to-guarantee conversion ≥ 35%

## 2. Executive Summary

The Strategic Command Center consolidates data intelligence, operational tooling, and playbook automation into a premium MUI experience. It merges existing analytics from `/api/reports/dashboard/admin/`, coverage reports, and trends endpoints with newly curated strategic recommendations, enabling admins to:

- Monitor guarantees, budget proxies, resource readiness, and time horizons in a single view
- Launch pre-built campaign accelerators or customize tactical plans (tasks, events, assignments)
- Coordinate follow-ups, budget allocations, and coverage gap closures with actionable insights
- Export executive briefs for stakeholders and field teams

## 3. Core Modules & Features

### 3.1 Strategic Intelligence Header

- Premium header (`PremiumPageHeader`) with admin-only guard.
- KPIs cards: Guarantees coverage %, confirmed guarantees (trend delta), attendance trajectory, resource utilization (derived until budget API lands).
- Live refresh + snapshot actions (trigger `/api/reports/analytics/create-snapshot/`).

### 3.2 Mission Control Dashboard

- **Guarantee Coverage Intelligence**: Dual charts using `/api/reports/charts/guarantee-distribution/` (pie) and `/api/reports/charts/committee-comparison/` (bar) with insight chips highlighting risk committees.
- **Momentum Tracker**: 30-day trend line from `/api/reports/analytics/trends/`, overlaying guarantee growth vs. target slope.
- **Risk Radar**: Surface committees or groups below coverage thresholds with recommended countermeasures.

### 3.3 Campaign Playbooks

- **Prebuilt Scenarios** (auto-generated from admin dashboard & coverage data):
  - _Guarantee Surge Blitz_: Focus on low-coverage committees with top-performing teams.
  - _Resource Rebalance_: Reallocate volunteers where attendance lag impacts guarantees.
  - _Budget Shock Absorber_: Flag budget overruns using planned vs actual projections (placeholder until backend endpoint exists).
- **Custom Strategic Planner**: Form capturing objective, timeframe, target guarantee lift, budget allocation, and team owners. Outputs actionable task list + event schedule (integrates with existing modules via deep links).

### 3.4 Operational Toolkit

- Quick actions linking to Guarantees follow-up filters, Committees assignment, Attendance watch, Task/Events creation (reuse shared dialog patterns).
- Embedded todo/event assignment leveraging existing `shared/components` dialogs; persist plan drafts in local storage for iterative refinement.

### 3.5 Executive Export Suite

- One-click export using `/api/reports/export/` (CSV/PDF) bundling:
  - Coverage report snapshot
  - Playbook summary
  - Timeline & assignments
- Optional shareable link (future enhancement) for supervisors.

## 4. Data Contracts & Integrations

- **Admin Overview** (`GET /api/reports/dashboard/admin/`): totals, role counts, committee stats, trends. Extend serializer if budget/resource fields needed.
- **Coverage** (`GET /api/reports/coverage/`): summary, by_committee, by_section, by_user, recommendations.
- **Trends** (`GET /api/reports/analytics/trends/?days=30`): arrays for guarantees, attendance, coverage.
- **Charts** (`GET /api/reports/charts/guarantee-distribution/`, `GET /api/reports/charts/committee-comparison/`).
- **Snapshots** (`POST /api/reports/analytics/create-snapshot/`): optional manual capture.
- **Future Need**: `GET /api/reports/budget/summary/` (to be added) for precise budget utilization and forecasting.

## 5. Architecture & Implementation Plan

### Phase 1 – Navigation & API Layer (0.5 day)

1. Add `menu-items/strategic.ts` and register in `menu-items/index.ts` with premium icon.
2. Register `/strategic` route in `routes/MainRoutes.tsx` (guarded by admin role).
3. Create `helpers/api/strategic.ts` exposing typed methods for the endpoints above; export interfaces (StrategicOverviewPayload, CoverageInsight, TrendSeries, PlaybookRecommendation, etc.).

### Phase 2 – State & Sagas (0.5 day)

1. New Redux module `store/strategic/` (`actions.ts`, `types.ts`, `reducer.ts`, `saga.ts`, `selectors.ts`).
2. Support filters: time range (7/30/90 days), scenario focus (coverage/budget/resource), committee drill-down.
3. Register reducer in `rootReducer` and saga in `rootSaga`. Ensure concurrency-safe API batches (`yield all`).

### Phase 3 – Strategic Command Center UI (1.5 days)

1. Scaffold `views/strategic/Strategic.tsx` using `Grid2`, `PremiumCard`, `PremiumPageHeader`.
2. Compose sections outlined in Core Modules, ensuring MUI premium theming, responsive breakpoints, skeleton loaders, and error states.
3. Build reusable widgets in `views/strategic/components/` (KPIGrid, TrendChartCard, PlaybookPanel, CustomPlanForm, OperationalToolbar).

### Phase 4 – Interactions & Export (0.5 day)

1. Implement scenario-generation utility mapping backend metrics to recommended actions.
2. Wire export modal (format selection, include charts toggle).
3. Integrate deep links to Guarantees, Committees, Attendance pages with pre-filter query params.

### Phase 5 – QA & Documentation (0.5 day)

1. Write Cypress or React Testing Library smoke test for saga success and error paths (if coverage exists).
2. Manual test with admin account: data load, filters, playbook generation, export.
3. Update documentation index (`DASHBOARD-DOCUMENTATION-INDEX.md`) and API reference with new endpoints/requirements.

## 6. Best-Practice Playbook (Field Execution)

- **Guarantee Expansion**: Daily focus lists from coverage gaps; assign highest-performing agents via Operational Toolkit; set follow-up cadence using todo/event modules.
- **Event Orchestration**: Align events to committees with lowest attendance convergence; track conversions via Guarantees module.
- **Resource Discipline**: Budget proxies ensure volunteers and funds are shifted toward high-impact segments; future budget API will provide granular control.
- **Timeline Command**: Trend analytics reveal momentum shifts; use snapshot feature to checkpoint before/after major pushes.
- **Feedback Loops**: Supervisors review generated playbooks weekly, adjust tactics, and deploy new events/tasks immediately through deep links.

## 7. Risk & Mitigation Matrix

- **Budget Data Unavailable** → Introduce interim estimations (docs-derived ratios) and earmark backend enhancement.
- **API Latency/Load** → Batch requests in saga, cache last successful response, display skeleton UI to maintain premium feel.
- **Permission Leakage** → Strict admin guard for menu/route; render informative notice for unauthorized roles.
- **Change Adoption** → Provide in-app walkthrough (optional tooltip overlay) and distribute exported strategic briefs to stakeholders.

## 8. Success Criteria

- Page renders within 2s with cached data; <3s on cold load.
- Admin adoption ≥ 90% (tracked via future telemetry).
- Guarantee coverage uplift ≥ 15% within first campaign cycle.
- Zero lint/test regressions; all exports function with accurate data.

---

**Status**: Approved plan ready for implementation. Next action—greenlight development sprints per phased breakdown above.
