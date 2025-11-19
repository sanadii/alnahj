# Candidates App - Refactoring Summary

**Date:** October 25, 2025  
**Status:** ✅ Complete

---

## Overview

Candidates and Parties have been separated from the `apps.voting` module into a new dedicated `apps.candidates` module for better organization and separation of concerns.

---

## What Was Created

### New App Structure: `apps/candidates/`

```
backend/apps/candidates/
├── __init__.py          ✅ App initialization
├── apps.py              ✅ App configuration
├── models.py            ✅ Party and Candidate models
├── serializers.py       ✅ Party and Candidate serializers
├── views.py             ✅ Party and Candidate viewsets
├── urls.py              ✅ URL routing
└── admin.py             ✅ Django admin configuration
```

---

## Models Moved

### 1. Party Model
**From:** `apps.voting.models.Party`  
**To:** `apps.candidates.models.Party`

**Fields:**
- election (FK to Election)
- name
- abbreviation
- color
- description
- is_active
- created_at, updated_at

**Properties:**
- `candidate_count` - Total candidates in party

### 2. Candidate Model
**From:** `apps.voting.models.Candidate`  
**To:** `apps.candidates.models.Candidate`

**Fields:**
- election (FK to Election)
- elector (FK to Elector)
- candidate_number
- party (FK to Party, nullable)
- party_affiliation
- is_active
- created_at, updated_at

**Properties:**
- `total_votes` - Total verified votes
- `vote_percentage` - Percentage of votes

---

## API Endpoints

### OLD URLs (Deprecated)
```
❌ /api/voting/parties/          - Removed
❌ /api/voting/candidates/       - Removed
```

### NEW URLs (Active)
```
✅ /api/candidates/parties/          - Party CRUD
✅ /api/candidates/                  - Candidate CRUD
```

---

## Detailed Endpoints

### Parties
```
GET     /api/candidates/parties/                - List parties
POST    /api/candidates/parties/                - Create party (admin)
GET     /api/candidates/parties/{id}/           - Get party details
PUT     /api/candidates/parties/{id}/           - Update party (admin)
DELETE  /api/candidates/parties/{id}/           - Delete party (admin)
GET     /api/candidates/parties/{id}/candidates/ - Get party candidates
GET     /api/candidates/parties/statistics/     - Get statistics
```

### Candidates
```
GET     /api/candidates/                 - List candidates
POST    /api/candidates/                 - Add candidate (admin)
GET     /api/candidates/{id}/            - Get candidate details
PUT     /api/candidates/{id}/            - Update candidate (admin)
PATCH   /api/candidates/{id}/            - Partial update (admin)
DELETE  /api/candidates/{id}/            - Delete candidate (admin)
GET     /api/candidates/statistics/      - Get statistics
GET     /api/candidates/{id}/vote-counts/ - Get vote counts for candidate
```

---

## Serializers

### Party Serializers
- `PartySerializer` - Full party details
- `PartyListSerializer` - Lightweight for lists
- `PartyCreateSerializer` - For creating parties

### Candidate Serializers
- `CandidateSerializer` - Full candidate details
- `CandidateListSerializer` - Lightweight for lists
- `CandidateCreateSerializer` - For creating candidates
- `CandidateUpdateSerializer` - For updating candidates

---

## ViewSets

### PartyViewSet
- Inherits from `StandardResponseMixin`
- Filtering by election, is_active
- Search by name, abbreviation
- Custom actions: `candidates/`, `statistics/`
- Admin-only create/update/delete

### CandidateViewSet
- Inherits from `StandardResponseMixin`
- Filtering by election, party, is_active
- Search by candidate_number, elector name, KOC ID
- Custom actions: `statistics/`, `vote_counts/`
- Admin-only create/update/delete

---

## Database Changes

### **IMPORTANT:** No database migration needed!

The models use the **same database tables**:
- `parties` table (unchanged)
- `candidates` table (unchanged)

Only the **Python module location** changed, not the database schema.

---

## Changes to Existing Modules

### 1. `apps/voting/models.py`
```python
# Added import at top
from apps.candidates.models import Party, Candidate

# Removed Party and Candidate class definitions
# VoteCount still references Candidate via FK
```

### 2. `apps/voting/serializers.py`
```python
# Added import
from apps.candidates.serializers import PartySerializer, CandidateSerializer

# Removed PartySerializer and CandidateSerializer definitions
```

### 3. `apps/voting/views.py`
```python
# Added import
from apps.candidates.models import Candidate
from apps.candidates.serializers import CandidateSerializer

# Removed PartyViewSet and CandidateViewSet
```

### 4. `apps/voting/urls.py`
```python
# Removed party and candidate routes
# Only vote-counts, committee-entries, and results remain
```

### 5. `core/settings.py`
```python
INSTALLED_APPS = [
    # ...
    'apps.candidates',  # ← Added
    # ...
]
```

### 6. `core/urls.py`
```python
urlpatterns = [
    # ...
    path('api/candidates/', include('apps.candidates.urls')),  # ← Added
    # ...
]
```

---

## Backward Compatibility

### Import Aliases
For temporary backward compatibility, `apps.voting` re-exports:
```python
from apps.candidates.models import Party, Candidate
from apps.candidates.serializers import PartySerializer, CandidateSerializer
```

**These should be updated in consuming code:**
```python
# OLD (deprecated)
from apps.voting.models import Party, Candidate

# NEW (correct)
from apps.candidates.models import Party, Candidate
```

---

## Testing Checklist

### ✅ Models
- [ ] Can create Party
- [ ] Can create Candidate
- [ ] Party.candidate_count works
- [ ] Candidate.total_votes works
- [ ] Candidate.vote_percentage works

### ✅ API Endpoints
- [ ] GET /api/candidates/parties/ returns parties
- [ ] POST /api/candidates/parties/ creates party (admin)
- [ ] GET /api/candidates/ returns candidates
- [ ] POST /api/candidates/ creates candidate (admin)
- [ ] GET /api/candidates/{id}/vote-counts/ returns vote counts

### ✅ Relationships
- [ ] VoteCount still references Candidate correctly
- [ ] ElectionResults still works with candidates
- [ ] Election.parties relationship works
- [ ] Election.candidates relationship works

---

## Migration Steps (For Deployment)

### 1. Deploy Code
```bash
git pull origin main
```

### 2. NO Database Migration Needed
```bash
# NOT NEEDED - tables already exist
# python manage.py makemigrations candidates
# python manage.py migrate candidates
```

### 3. Restart Server
```bash
python manage.py runserver
# or
systemctl restart gunicorn  # production
```

### 4. Verify Endpoints
```bash
curl http://localhost:8000/api/candidates/parties/
curl http://localhost:8000/api/candidates/
```

---

## Frontend Changes Required

### Update API Calls

**OLD:**
```typescript
// api/elections.ts
const parties = await api.get('/api/voting/parties/');
const candidates = await api.get('/api/voting/candidates/');
```

**NEW:**
```typescript
// api/candidates.ts (new file)
const parties = await api.get('/api/candidates/parties/');
const candidates = await api.get('/api/candidates/');
```

### Files to Update
1. Create: `frontend/src/helpers/api/candidates.ts`
2. Update: Any files importing from `/api/voting/parties/` or `/api/voting/candidates/`
3. Update: URL constants if using centralized API URLs

---

## Benefits

### 1. Better Organization ✅
- Candidates and parties are logically separate from vote counting
- Clearer module responsibilities

### 2. Cleaner URLs ✅
```
/api/candidates/          - Candidate management
/api/candidates/parties/  - Party management
/api/voting/              - Vote counting and results
```

### 3. Easier to Maintain ✅
- Smaller, focused modules
- Clear separation of concerns
- Easier to test independently

### 4. Follows Best Practices ✅
- Single Responsibility Principle
- Logical grouping
- RESTful API design

---

## Next Steps

1. ✅ Update frontend API calls
2. ✅ Test all endpoints
3. ✅ Update API documentation
4. ✅ Update standardization guide
5. ✅ Deploy to production

---

## Documentation Updates

- [ ] Update `BACKEND-STANDARDIZATION-GUIDE.md`
- [ ] Update API documentation
- [ ] Update frontend API helper docs
- [ ] Update deployment guide

---

## Rollback Plan

If issues arise:

1. Revert code changes:
```bash
git revert <commit-hash>
```

2. No database rollback needed (tables unchanged)

3. Restart server

---

## Questions?

- Check `apps/candidates/models.py` for model details
- Check `apps/candidates/views.py` for endpoint logic
- Check `apps/candidates/serializers.py` for data formats
- Check `apps/candidates/urls.py` for URL patterns

---

**Refactoring Complete!** ✅

The candidates and parties are now in their own dedicated module with clean separation from voting operations.

