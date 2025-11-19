# Elector Tab Refactor Plan

## Backend
- [ ] Finalize guarantee status propagation for any remaining endpoints (confidence, stats, exports)
- [ ] Update automated tests/fixtures to new status values and drop follow-up assertions
- [ ] Regenerate API docs/examples that still reference deprecated fields/statuses

## Frontend
- [ ] Replace dialog-based “Add to Guarantee” with inline dual buttons (Add = `MEDIUM`, Pending = `PENDING`)
- [ ] Show guarantee state (including pending) as chips with new color palette
- [ ] Update QuickAdd dialog logic or remove if no longer needed
- [ ] Adjust Electors list, filters, and view dialog to consume new `guaranteeStatus`
- [ ] Remove follow-up related UI elements/columns
- [ ] Update guarantee statistics widgets/cards to new status buckets

## State & APIs
- [ ] Extend Elector Redux slice/types to store `guaranteeStatus`
- [ ] Update selectors & sagas to use new status field and remove follow-up state
- [ ] Verify API helper transformations align with backend payloads

## QA & Validation
- [ ] Manual regression: Electors list, view dialog, guarantee actions, dashboards
- [ ] Verify color & badge states across themes (light/dark)
- [ ] Confirm migrations applied cleanly in staging

## Documentation & Communication
- [ ] Update README / user guides with new guarantee workflow
- [ ] Notify stakeholders about removal of follow-up tracking and new statuses
