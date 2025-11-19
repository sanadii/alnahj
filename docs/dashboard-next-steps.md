# Dashboard Improvement Plan

## Current State Snapshot

- Backend responses now include both the new status buckets (`pending`, `medium`, `high`, `not_available`) and legacy compatibility fields (`strong`, `weak`, follow-up totals) to unblock the UI.
- Guarantee confirmation is back to a tri-state enum (`PENDING`, `CONFIRMED`, `NOT_AVAILABLE`) with a derived `isConfirmed` boolean for legacy components; filters, serializers, and dialogs were updated accordingly.
- Frontend widgets render again, but several cards still reference interim labels and duplicate logic for computing percentages.
- `Dashboard.tsx` remains a 1.8k-line monolith that mixes election CRUD, committees, guarantees, and attendance dashboards in a single component.

## Critical Fixes (Highest Priority)

1. **Stabilise guarantee statistics consumption**
   - Replace ad-hoc calculations inside `frontend/src/views/guarantees/Guarantees.tsx` with a typed mapper that reads the new stats fields.
   - Remove dead follow-up UI and ensure confirmation toggles only rely on the boolean `isConfirmed`.
2. **Normalize chart data helpers**
   - Update `helpers/api/dashboard.ts` to expose typed mappers (e.g., `mapGuaranteeTrend`) so that charts do not depend on raw response shapes.
   - Audit mock data generators to mirror production payloads (already partially done, continue for remaining endpoints).
3. **Backend migration hardening**
   - Batch the confirmation-state migration (`0006_confirmation_boolean`) using `iterator()` to avoid memory pressure on large datasets.

## Structural Improvements

- **Modularise `Dashboard.tsx`:** Split the page into feature slices (overview, guarantees, attendance, management) with local hooks and context for shared state.
- **Typed selectors/hooks:** Introduce dedicated hooks (e.g., `useGuaranteeStatistics`, `useAttendanceSummary`) that encapsulate null-guards and derived metrics.
- **API typing alignment:** Share response contracts between backend serializers and frontend types (e.g., via OpenAPI generation or manual `@types` module).

## UX / Data Enhancements

- Revisit KPI naming/colour semantics now that “strong/weak” are compatibility aliases—align copy with `high`, `pending`, `not available`.
- Extend guarantee filters with an explicit `isConfirmed` toggle and surface confirmation rate directly on the dashboard.
- Validate attendance widgets still provide meaningful comparisons (attendance vs confirmation vs guarantee totals).

## Observability & QA

- Add regression tests (serializer + integration) to lock dashboard field names.
- Capture unit tests for the new mapping helpers to guarantee forwards compatibility.
- Add structured logging around confirmation toggles and auto-assignment endpoints for easier troubleshooting.

## Open Questions

- Should we expose a backend-derived `confirmation_rate` or rely on frontend computation?
- Are there downstream consumers (reports/exports) that still need the legacy follow-up metrics?
- Do we plan to surface the new status taxonomy (`high/not_available`) directly to end users, or keep the legacy wording in the UI?

## Suggested Next Steps

1. Land the statistics mapper refactor and prune the remaining follow-up UI.
2. Break `Dashboard.tsx` into focused child components with typed props and minimal internal state.
3. Coordinate with UX on updated KPI copy/colour semantics before redesigning cards.
4. Schedule time for automated coverage (backend serializer tests + frontend mapping tests) once the contract is frozen.
