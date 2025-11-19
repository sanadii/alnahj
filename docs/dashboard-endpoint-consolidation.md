## Dashboard Endpoint Consolidation Plan

**Status:** Option A implemented (`/api/elections/{id}/dashboard/overview/`) while legacy endpoints remain for compatibility.

### Background
- `GET /api/elections/{id}/dashboard/electors/demographics/` returns grouped elector counts by gender, area, department, team, and family. Response also includes lightweight meta (totals + timestamp). The payload is mostly static during a session unless data changes materially.
- `GET /api/elections/{id}/dashboard/attendance/summary/` returns overall attendance/vote metrics plus committee-level and guarantee breakdowns. Meta includes committee count and timestamp.
- Both endpoints are fetched immediately after loading the current election dashboard, which causes back-to-back trips and duplicated header/meta data. They surface complementary slices of the same election snapshot and are good candidates for consolidation or a shared upstream cache.

### Current Response Sketch
```json
// demographics
{
  "status": "success",
  "data": {
    "by_gender": [...],
    "by_area": [...],
    "by_department": [...],
    "by_team": [...],
    "by_family": [...]
  },
  "meta": {
    "election_id": 1,
    "total_areas": 6,
    "total_teams": 24,
    "total_departments": 8,
    "total_families": 512,
    "last_updated": "2025-11-11T10:12:54.345Z"
  }
}

// attendance summary
{
  "status": "success",
  "data": {
    "summary": {...},
    "committees": [...],
    "guaranteesByUser": [...],
    "guaranteesByGroup": [...],
    "guaranteesByUserGroups": [...],
    "topPerformers": [...],
    "lowPerformers": [...]
  },
  "meta": {
    "election_id": 1,
    "total_committees": 28,
    "last_updated": "2025-11-11T10:13:02.112Z"
  }
}
```

### Overlap / Alignment
- Both payloads include the election id and a timestamp; callers only care about the latest snapshot.
- Frontend consumes both to render one dashboard screen. Components share the election context and rarely need one without the other.
- Neither response is paginated on the backend; the frontend already paginates large arrays (families, committees, etc.).

### Consolidation Options

#### Option A — New Combined Endpoint
- Introduce `GET /api/elections/{id}/dashboard/overview/` returning:
  ```json
  {
    "status": "success",
    "data": {
      "summary": {...},               // attendance summary
      "committees": [...],
      "guaranteeBreakdown": {...},    // user/group/user-groups
      "demographics": {...}           // already-structured data
    },
    "meta": {
      "election_id": id,
      "totals": {
        "areas": X,
        "teams": Y,
        "departments": Z,
        "families": N,
        "committees": M,
        "electors": total_electors,
        "attendance": total_attendance,
        "votes": total_votes
      },
      "generated_at": timestamp
    }
  }
  ```
- Implementation path:
  1. Create `get_dashboard_overview(election_id)` utility that internally calls `get_elector_demographics` and `get_attendance_dashboard`, sharing database access when possible (e.g. reuse elector queryset).
  2. Add serializer composing `AttendanceDashboardSerializer` + `ElectorDemographicsSerializer`.
  3. Expose new API view; keep existing endpoints for backward compatibility initially.
  4. Frontend: replace two separate hooks with one `useDashboardOverview` that caches the result; supply slices to existing components.
- Benefits: single request + consistent meta; easy to memoize/cached; reduces StrictMode double-fetch side effects.
- Considerations: ensure the combined query does not double-count heavy aggregations. We can refactor shared ORM queries (e.g. prefetch electors once, reuse for both demographic breakdown and committee stats).

#### Option B — Extend Existing Endpoints
- Keep `/demographics/` and `/attendance/summary/`, but allow callers to request extras through `include` params:
  - `/attendance/summary/?include=demographics` returns attendance data plus a `demographics` field.
  - `/demographics/?include=summary` behaves similarly.
- Pros: minimal routing changes; consumers opt-in.
- Cons: more branching in view logic; still two endpoints to document; requires query-parameter handling to avoid unclear defaults.

### Recommended Approach
- Proceed with **Option A** (dedicated overview endpoint) while keeping the current endpoints during a transition period.
- Justification:
  - Aligns with frontend usage (dashboard needs both datasets immediately).
  - Simplifies caching strategy (one response primed at login).
  - Allows incremental backend optimisations (shared queryset/prefetch; aggregated totals in one place).
  - Enables future subresource flags if we want to lazy-load very large sections (e.g. `?omit=guaranteeBreakdown`).

### Backend Tasks
1. **Utility Refactor**
   - Extract shared elector queryset builder used across demographics/attendance.
   - Ensure totals (electors, attendance, votes) are returned alongside groupings.
2. **Overview Serializer**
   - Compose structure described above; reuse existing serializers internally to avoid duplication.
3. **APIView + URL**
   - Add `DashboardOverviewView` under `/dashboard/overview/`.
   - Optionally add caching header (e.g. `Cache-Control: private, max-age=30`) if data changes slowly.
4. **Backwards Compatibility**
   - Keep original endpoints live; mark as “planned to merge” in docs.
   - Once frontend migrates, monitor usage logs before deprecating.

### Frontend Tasks
1. Create `getDashboardOverview` API helper + `useDashboardOverview` hook.
2. Update `DashboardView` to use the consolidated hook and split the returned data across existing components.
3. Remove direct fetching of the two legacy endpoints once the new hook is stable.
4. Ensure pagination + chart components still receive the same arrays.

### Risks / Mitigation
- **Large Payload Size**: Combined JSON could grow big (families + committees). Mitigate by keeping arrays paginated client-side and consider optional “lite” mode (query param) if needed later.
- **Performance**: Need to profile the combined ORM queries. Use `select_related/prefetch_related` and possibly cached aggregates to avoid longer response times.
- **Rollout**: Deploy new endpoint first, switch frontend behind feature flag, then retire old endpoints after verification.

### Next Steps Checklist
- [ ] Draft `get_dashboard_overview` function leveraging existing helpers.
- [ ] Implement serializer and API view returning consolidated structure.
- [ ] Add docs changelog + API reference entry.
- [ ] Update frontend hooks + components to consume new endpoint.
- [ ] Monitor response time and error logs after deployment.

