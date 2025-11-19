# Release Update – November 15, 2025

## Guarantee Contact Simplification

- **What changed:** Guarantees now store a single normalized `mobile` field. The previous `primary_phone` / `alternate_phone` pair has been retired.
- **Validation:** The backend still normalizes and validates Kuwaiti numbers (8 digits starting with 5/6/9 with optional `+965` prefix).
- **Frontend:** All guarantee flows (list inline edit, add/edit dialogs, elector dialogs) read and write only the `mobile` field. Inline edits update the API immediately, and Elector actions now pass the elector’s mobile automatically when creating guarantees.
- **Action Required:** Update any external integrations or Postman collections to send/expect `mobile`. Remove references to `alternate_phone`.

## Verification Checklist

- [x] Migration renames the column and drops the obsolete alternate field.
- [x] Manual guarantee create/edit confirms the mobile value persists.
- [x] Elector list “Add” control syncs the elector’s mobile into guarantees.
- [x] Documentation updated (confirmation feature summary, API notes, release log).

## Owners

- Backend: Platform Engineering – Guarantees module
- Frontend: Election Ops UI Squad

