# Strategic Command Center – Roadmap

## Overview
- **Objective**: Deliver end-to-end strategic tooling that replaces placeholder metrics, powers executive decisioning, and aligns UI with authoritative backend data.
- **Scope**: Backend analytics, frontend enhancements, testing, documentation, and rollout coordination.
- **Status**: Phase 1 in progress (backend foundations).

---

## Phase 1 – Backend Metrics Backbone *(In Progress)*
### Goals
- Persist real campaign finance metrics and resource readiness data.
- Expose APIs consumed by the Strategic Command Center to remove temporary heuristics.

### Action Items
1. **Campaign Finance Snapshot Model**
   - Add `CampaignFinanceSnapshot` under `apps/reports` with fields:
     - `total_budget`, `committed_budget`, `spent_budget`, `available_budget`
     - `burn_rate`, `period_start`, `period_end`, `notes`
     - `created_at`, `created_by`
   - Register in admin, create initial migration.

2. **Reporting Service & Serializer**
   - Build `CampaignFinanceSnapshotSerializer`.
   - Add service helper returning combined finance + resource metrics:
     - Latest finance snapshot (or zeroed defaults).
     - Resource summary derived from `CustomUser`, guarantees, attendance (e.g., supervisors, field agents, active today).

3. **Analytics Endpoint**
   - Add `GET /api/reports/analytics/campaign-performance/` returning:
     - `budget`: totals, burn rate, remaining %, snapshot metadata.
     - `resources`: headcount, role breakdown, active-today metrics.
     - `forecast`: placeholders for future predictive outputs (null if unavailable).
   - Update `AdminDashboardSerializer` to embed `budget_overview` & `resource_overview` for legacy consumers.

4. **Documentation & Samples**
   - Update `API-ENDPOINTS-REFERENCE.md` with the new endpoint and payload.
   - Provide snippet for creating finance snapshots (management command or admin instructions).

### Deliverables
- Django model + migration + admin registration.
- Serializer, service layer, REST endpoint, tests (unit where feasible).
- API reference entry + README note for seeding snapshots.

---

## Phase 2 – Frontend Strategic Enhancements *(Next)*
### Goals
- Consume new backend data and enrich Strategic Command Center UX.

### Action Items
1. Update `helpers/api/strategic.ts` + saga to call `/analytics/campaign-performance/`.
2. Replace provisional calculations in `Strategic.tsx` with backend values.
3. Persist plan builder drafts (local storage for MVP, consider backend later).
4. Integrate chart visualizations (ApexCharts) for coverage/momentum once design approves.
5. Extend navigation badges/notifications for strategic alerts (e.g., low coverage committees, budget variance).

### Deliverables
- Updated API helper + saga + reducer state.
- Enhanced Strategic Command Center UI with real metrics, persistence, and charts.

---

## Phase 3 – Testing & QA
### Goals
- Validate new functionality across API, frontend, and workflows.

### Action Items
1. Manual admin walkthrough: data load, filters, recommendations, plan export.
2. Add saga integration test covering strategic data load + snapshot creation.
3. Triage legacy lint warnings (guarantees, voting) or isolate them from CI pipeline.

### Deliverables
- Test plan + executed results.
- Passing targeted lint/tests for strategic modules.

---

## Phase 4 – Documentation & Rollout
### Goals
- Ensure supporting documentation and runbooks are ready.

### Action Items
1. Update `API-ENDPOINTS-REFERENCE.md` (Phase 1) and add any backend contract changes.
2. Create user-facing Strategic Command Center guide (usage scenarios, charts, alerts).
3. Record QA validation steps + regression checklist for future releases.

### Deliverables
- Updated backend and frontend docs.
- QA validation record.

---

## Dependencies & Risks
- **Backend Data Availability**: Finance snapshots require manual entry until automated data feed exists.
- **Legacy Lint Debt**: Global lint warnings may obstruct CI; plan to isolate or resolve.
- **Design Approval for Charts**: ApexCharts integration blocked until design sign-off.
- **Snapshot Volume**: High-frequency snapshots may require batching/archival (future mitigation).

---

## Tracking & Next Steps
- ✅ Phase 1 plan defined; begin implementing model + endpoint.
- ⏭ After backend delivery, move to frontend integrations (Phase 2).
- 🔄 Maintain checklist in this roadmap; update status per phase completion.


