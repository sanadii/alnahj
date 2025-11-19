# Candidate-Elector Decoupling Summary

**Date**: October 28, 2025  
**Status**: Complete ✅

## Overview

Removed the ForeignKey relationship between `Candidate` and `Elector` models, replacing it with a simple `name` CharField. This simplifies the candidate management system and removes the dependency on the electors app.

## Changes Made

### Backend

#### 1. Model Changes (`backend/apps/candidates/models.py`)
- **Removed**: `elector` ForeignKey field
- **Added**: `name` CharField (max_length=200)
- **Updated**: `unique_together` constraint from `['election', 'elector']` to `['election', 'candidate_number']`
- **Updated**: Index from `elector` to `name`
- **Simplified**: `__str__` method to use `name` instead of `elector.full_name`
- **Removed**: Elector validation in `clean()` method

#### 2. Serializer Changes (`backend/apps/candidates/serializers.py`)
- **Removed fields** from `CandidateSerializer`:
  - `elector`
  - `elector_name`
  - `elector_koc_id`
  - `elector_section`
  - `elector_committee`
- **Added**: `name` field
- **Updated** `CandidateListSerializer` to use `name`
- **Updated** `CandidateCreateSerializer`:
  - Replaced `elector` with `name` in fields
  - Removed `validate_elector` method
  - Simplified `validate` method (removed elector uniqueness check)

#### 3. Admin Changes (`backend/apps/candidates/admin.py`)
- **Updated** `CandidateAdmin`:
  - Replaced `elector` with `name` in `list_display`
  - Replaced elector search fields with `name` in `search_fields`
  - Replaced `elector` with `name` in fieldsets
  - Removed `elector` from `get_queryset().select_related()`

#### 4. Migration (`backend/apps/candidates/migrations/0002_remove_elector_relationship.py`)
- Deleted all existing candidates (as requested by user)
- Removed `elector` field and its index
- Added `name` field
- Updated unique constraint to use `candidate_number`
- Added index for `name` field

### Frontend

#### 1. Type Updates (`frontend/src/types/voting.ts`)
- **Removed fields** from `Candidate` interface:
  - `elector`
  - `electorName`
  - `electorKocId`
  - `electorSection`
  - `electorCommittee`
- **Added**: `name: string`

#### 2. API Updates (`frontend/src/helpers/api/voting.ts`)
- Updated `createCandidate` signature to accept `name` instead of `elector`

#### 3. Redux Updates
- **`frontend/src/store/voting/types.ts`**: Updated `CreateCandidateRequestAction` payload to use `name` instead of `elector`
- **`frontend/src/store/voting/actions.ts`**: Updated `createCandidateRequest` action creator to accept `name` instead of `elector`

#### 4. Component Updates (`frontend/src/views/election/CurrentElection.tsx`)
- **Removed imports**: `Autocomplete`, `getElectors` from helpers
- **Removed state**:
  - `electors`
  - `electorsLoading`
  - `selectedElector`
- **Updated** `candidateFormData` state:
  - Replaced `electorKocId` with `name`
- **Removed functions**:
  - `loadElectors()`
- **Simplified** `handleOpenCandidateDialog()` - no longer loads electors
- **Updated** `handleCloseCandidateDialog()` to reset `name` instead of `electorKocId`
- **Updated** `handleAddCandidate()`:
  - Validation message: "Please fill in candidate number and name"
  - Dispatch payload uses `name` instead of `elector`
- **Updated** Candidates table:
  - Removed "KOC ID" column
  - Displays only `candidate.name` instead of `candidate.electorName` and `candidate.electorKocId`
  - Updated `colSpan` from 6 to 5
- **Updated** Add Candidate Dialog:
  - Replaced `Autocomplete` with simple `TextField` for name input
  - Label: "Candidate Name"
  - Placeholder: "Enter candidate's full name"
  - Helper text: "Full name of the candidate"

## Benefits

1. **Simplicity**: No need to manage elector relationships
2. **Flexibility**: Candidates can have any name, not restricted to existing electors
3. **Independence**: Candidates app is no longer tightly coupled with electors app
4. **Performance**: Fewer database joins when fetching candidate data
5. **User Experience**: Simpler form - just enter a name instead of searching/selecting

## Migration Notes

- All existing candidate data was deleted as part of the migration
- No data preservation was required (as confirmed by user)
- Database migration applied successfully: `0002_remove_elector_relationship`

## Testing Recommendations

1. **Backend**:
   - Create a new candidate with a simple name
   - Verify unique constraint works (same candidate_number in same election)
   - Test party affiliation still works correctly
   - Verify serialization includes `name` field in camelCase

2. **Frontend**:
   - Open Add Candidate dialog
   - Enter candidate number and name
   - Select/leave empty party affiliation
   - Verify candidate appears in table with correct name
   - Test validation (empty name/number)

## API Changes

### Create Candidate Endpoint: `POST /api/candidates/`

**Before**:
```json
{
  "election": 1,
  "elector": "KOC12345",
  "candidateNumber": 1,
  "party": 2,
  "partyAffiliation": "Democratic Party"
}
```

**After**:
```json
{
  "election": 1,
  "name": "John Doe",
  "candidateNumber": 1,
  "party": 2,
  "partyAffiliation": "Democratic Party"
}
```

### Get Candidate Response

**Before** (camelCase):
```json
{
  "id": 1,
  "election": 1,
  "elector": "KOC12345",
  "electorName": "John Doe",
  "electorKocId": "KOC12345",
  "electorSection": "Section A",
  "electorCommittee": "COM001",
  "candidateNumber": 1,
  ...
}
```

**After** (camelCase):
```json
{
  "id": 1,
  "election": 1,
  "name": "John Doe",
  "candidateNumber": 1,
  "party": 2,
  "partyName": "Democratic Party",
  "partyColor": "#0066CC",
  ...
}
```

## Files Changed

### Backend
- `backend/apps/candidates/models.py`
- `backend/apps/candidates/serializers.py`
- `backend/apps/candidates/admin.py`
- `backend/apps/candidates/migrations/0002_remove_elector_relationship.py` (new)

### Frontend
- `frontend/src/types/voting.ts`
- `frontend/src/helpers/api/voting.ts`
- `frontend/src/store/voting/types.ts`
- `frontend/src/store/voting/actions.ts`
- `frontend/src/views/election/CurrentElection.tsx`

### Documentation
- `docs/CANDIDATE-ELECTOR-DECOUPLING.md` (this file)

## Related Documentation
- [API Conventions](architecture/backend/02-API-CONVENTIONS.md)
- [Backend Overview](architecture/backend/00-BACKEND-OVERVIEW.md)
- [Changelog](CHANGELOG.md)

---

**Implementation completed by**: AI Assistant  
**Approved by**: User  
**Database migration status**: ✅ Applied successfully

