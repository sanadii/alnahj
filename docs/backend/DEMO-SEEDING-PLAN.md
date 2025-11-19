# Backend Demo Seeding Plan

## Objectives
- Provide a single backend-driven workflow to seed demo data (parties, committees, users, guarantees, attendance) for a selected election.
- Allow granular configuration per phase while reusing existing data when phases are disabled.
- Expose a monitoring endpoint so the frontend can poll for progress instead of orchestrating dozens of API calls.

## Proposed APIs
### 1. Create Demo Job
`POST /api/demos/election-seed/`

```json
{
  "election_id": 1,
  "phases": {
    "parties": { "enabled": true, "count": 4, "candidates_per_party": 3, "independent_candidates": 2 },
    "committees": { "enabled": true, "count": 8 },
    "users": { "enabled": true, "count": 15, "assign_to_committees": true },
    "guarantees": { "enabled": true, "batch_size": 100, "total_limit": null, "group_distribution": "random" },
    "attendance": { "enabled": true, "rate": 0.75, "batch_size": 50 }
  }
}
```

**Response**
```json
{ "job_id": 42, "status": "queued" }
```

### 2. Job Status
`GET /api/demos/election-seed/{job_id}/`

Returns:
```json
{
  "id": 42,
  "status": "running",
  "current_phase": "guarantees",
  "progress": {
    "parties": { "created": 4, "candidates": 14 },
    "committees": { "created": 8 },
    "users": { "created": 20 },
    "guarantees": { "total": 300, "batches": 3 },
    "attendance": { "total": 0 }
  },
  "errors": []
}
```

## Architecture
1. **Model**
   - `DemoSeedJob` with fields: `id`, `election`, `config` (JSON), `status`, `current_phase`, `progress` (JSON), `errors` (JSON), `created_at`, `updated_at`.

2. **Serializer**
   - `DemoSeedRequestSerializer` validates election existence, permissions, and fills defaults.
   - `DemoSeedJobSerializer` surfaces job metadata for polling.

3. **Services**
   - `DemoSeedService` orchestrates phases.
   - Phase-specific helpers:
     - `PartySeeder`
     - `CommitteeSeeder`
     - `UserSeeder`
     - `GuaranteeSeeder`
     - `AttendanceSeeder`
   - Each helper receives `election`, `config`, `job` and reports progress via callbacks.

4. **Random Data Utilities**
   - Python equivalents of frontend generators (names, colors, phone numbers).

5. **Viewset**
   - New `DemoSeedViewSet` with:
     - `create` → start job (`DemoSeedService.run()`).
     - `retrieve` → return job status.
   - Restricted to admins / election managers.

6. **Execution Strategy**
   - Initial implementation runs synchronously inside the request (phases executed sequentially).
   - Structure service so it can be wrapped with Celery later if job duration becomes an issue.

## Phase Details
| Phase      | Action                                                                 | Notes |
|------------|------------------------------------------------------------------------|-------|
| Parties    | Create `Party` + `Candidate` entries.                                  | Ensure random colors and numbers. |
| Committees | Create committees and call existing auto-assign electors logic.        | Skip if disabled; reuse existing. |
| Users      | Create election members via `UserCreateSerializer`.                    | If disabled, fetch existing members. |
| Guarantees | Batch create guarantees using electors + members.                      | Respect batch size, group distribution, total limit. |
| Attendance | Batch mark attendance using committees/electors.                       | Respect target rate and batch size. |

## Progress Tracking
- After each phase, update `job.progress[phase]`.
- For guarantees/attendance, update after every batch with totals/batch counts.
- Errors appended to `job.errors` with `{ phase, message, extra }`.

## Frontend Integration
1. `POST /api/demos/election-seed/` with the form config.
2. Poll `GET /api/demos/election-seed/{job_id}/` every few seconds to update the control panel.
3. Remove client-side batching logic once backend endpoint is stable.

## Next Steps
1. Create `apps/demos` module with models/serializers/services.
2. Implement `DemoSeedService` and phase helpers.
3. Expose DRF viewset + URLs.
4. Update frontend to call new endpoints and remove local batch timers.


