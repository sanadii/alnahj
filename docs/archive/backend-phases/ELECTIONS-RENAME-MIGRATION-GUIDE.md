# Elections App Rename - Migration Guide

## Summary
The `apps/election` module has been renamed to `apps/elections` (plural) to follow Django conventions.

## Changes Made

### 1. Directory and Files
- Copied `apps/election/` to `apps/elections/`
- Updated `apps/elections/apps.py`: `ElectionConfig` → `ElectionsConfig`, `name = 'apps.elections'`
- Updated `apps/elections/__init__.py`: Updated app config reference
- Updated `apps/elections/urls.py`: `app_name = 'elections'`
- Removed old `apps/election/` directory

### 2. Settings and URLs
- `core/settings.py`: `'apps.election'` → `'apps.elections'` in `INSTALLED_APPS`
- `core/urls.py`: `/api/election/` → `/api/elections/` and `include('apps.elections.urls')`

### 3. Model References
Updated all Foreign Key references from `'election.Election'` and `'election.Committee'` to `'elections.Election'` and `'elections.Committee'` in:
- `apps/attendance/models.py`
- `apps/electors/models.py`
- `apps/candidates/models.py`
- `apps/voting/models.py`

### 4. Import Statements
Updated all imports from `apps.election` to `apps.elections` in:
- `apps/voting/views.py`
- `apps/attendance/views.py`
- `apps/reports/views.py`
- `apps/electors/management/commands/import_electors.py`
- `apps/voting/management/commands/create_demo_election.py`
- `apps/electors/import_service.py`
- `apps/attendance/serializers.py`

### 5. Migration Files
Updated migration dependencies and foreign key references from `'election'` to `'elections'` in:
- `apps/elections/migrations/0001_initial.py`
- `apps/elections/migrations/0002_remove_guarantee_dates.py`
- `apps/elections/migrations/0003_rename_voting_date_to_election_date.py`
- `apps/attendance/migrations/0001_initial.py`
- `apps/electors/migrations/0001_initial.py`
- `apps/voting/migrations/0001_initial.py`

### 6. Admin Configuration
- Removed `Candidate` and `Party` admin registrations from `apps/voting/admin.py` (moved to `apps/candidates`)

## Database Migration Required

Since the app has been renamed but migrations have already been applied to the database with the old app name, you need to update the database to reflect the new app name.

### Option 1: Update Django Migration History (Recommended for existing databases)

Run this SQL to update the migration history:

```sql
-- Update migration history table
UPDATE django_migrations 
SET app = 'elections' 
WHERE app = 'election';

-- Update content types table
UPDATE django_content_type 
SET app_label = 'elections' 
WHERE app_label = 'election';
```

### Option 2: Fresh Database (If you can reset the database)

If you can afford to reset the database:

```bash
# Drop and recreate database
# Then run:
python manage.py migrate
```

### Option 3: Fake Migrations (Alternative approach)

```bash
# Mark old election migrations as unapplied
python manage.py migrate election zero --fake

# Apply new elections migrations
python manage.py migrate elections --fake
```

## Testing After Migration

1. Start the server:
```bash
python manage.py runserver
```

2. Test the new endpoint:
```bash
curl http://127.0.0.1:8000/api/elections/current/
```

3. Verify admin panel loads without errors:
```
http://127.0.0.1:8000/admin/
```

## Frontend Updates Needed

The frontend will need to be updated to use the new API endpoint `/api/elections/` instead of `/api/election/`:

1. Update API URL constants
2. Update all API calls that reference `/api/election/`
3. Test all election-related features

## API Endpoint Changes

| Old Endpoint | New Endpoint |
|--------------|--------------|
| `/api/election/` | `/api/elections/` |
| `/api/election/current/` | `/api/elections/current/` |
| `/api/election/committees/` | `/api/elections/committees/` |

## Rollback Plan

If you need to rollback:

1. Change `INSTALLED_APPS` back to `'apps.election'` in `settings.py`
2. Change URL to `include('apps.election.urls')` in `core/urls.py`
3. Revert model reference changes in all apps
4. Revert import statement changes
5. Run SQL to revert migration history:
```sql
UPDATE django_migrations SET app = 'election' WHERE app = 'elections';
UPDATE django_content_type SET app_label = 'election' WHERE app_label = 'elections';
```

## Completed By
AI Assistant - October 27, 2025

## Status
✅ Code refactoring complete
⚠️ Database migration pending (user needs to run SQL or reset database)
⚠️ Frontend updates pending

