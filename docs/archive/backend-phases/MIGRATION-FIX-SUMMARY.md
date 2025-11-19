# Migration Fix Summary

**Date**: October 27, 2025
**Issue**: `OperationalError: no such table: parties`

## Problem

After moving `Party` and `Candidate` models from `apps.voting` to `apps.candidates`:
- The voting app had a migration (0002) that deleted Party/Candidate models
- This migration referenced the candidates app migration
- Migration was marked as applied but tables were never created
- Django migration history was inconsistent

## Root Cause

1. The `voting.0002` migration was applied before `candidates.0001` existed
2. This created a dependency conflict
3. Django marked the candidates migration as applied without running the SQL
4. Result: Tables missing from database

## Solution

### Step 1: Fix Migration History
```python
# Removed voting.0002 from django_migrations table
DELETE FROM django_migrations 
WHERE app='voting' AND name='0002_alter_party_unique_together_remove_party_election_and_more'
```

### Step 2: Apply Migrations in Correct Order
```bash
python manage.py migrate candidates  # Created 0001_initial_candidates_models
python manage.py migrate voting      # Re-applied 0002
```

### Step 3: Manually Create Tables
Even after step 2, tables weren't created. Manually executed SQL:
- Created `parties` table with all fields and indexes
- Created `candidates` table with all fields and indexes
- Created all required indexes and constraints

## Verification

✅ Tables verified to exist:
- `parties` table: **EXISTS**
- `candidates` table: **EXISTS**

✅ Migration status:
```
candidates
 [X] 0001_initial_candidates_models
voting
 [X] 0001_initial
 [X] 0002_alter_party_unique_together_remove_party_election_and_more
```

## Files Created/Modified

- `/apps/candidates/migrations/0001_initial_candidates_models.py` - Initial migration
- Fixed django_migrations table entries
- Manually created database tables

## Prevention

When moving models between apps in the future:
1. Create new app's migration FIRST
2. Apply new app migration
3. Then update dependent app migrations
4. Always verify tables exist after migrations
5. Use `python manage.py sqlmigrate` to check SQL
6. Use database inspection tools to verify table creation

## Status

✅ **RESOLVED** - Tables created, migration history corrected, endpoint functional

