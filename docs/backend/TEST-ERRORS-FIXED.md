# Test Errors Fixed - Model Constraints and Test Fixtures

**Date**: 2025-01-XX  
**Status**: Complete

## Summary

Fixed multiple test failures related to:
1. Missing `committee` field in `Elector` model tests
2. Missing default value for `Committee.gender` field
3. Incorrect unique constraint on `Committee.code` field

## Issues Fixed

### 1. Elector Model - Missing Committee Field

**Error**: `NOT NULL constraint failed: electors.committee_id`

**Root Cause**: The `Elector` model requires a `committee` field (NOT NULL), but tests were creating `Elector` instances without providing a committee.

**Fix**: Updated all test files to:
- Add fixtures for `user`, `election`, and `committee`
- Provide `committee` parameter when creating `Elector` instances in all tests

**Files Modified**:
- `backend/tests/models/test_elector_models.py`
- `backend/tests/models/test_guarantee_models.py`

### 2. Committee Model - Missing Gender Default

**Error**: `AssertionError: assert '' == 'MIXED'`

**Root Cause**: The `Committee.gender` field had no default value, but tests expected it to default to 'MIXED'.

**Fix**: Added `default='MIXED'` to the `gender` field in `Committee` model.

**File Modified**:
- `backend/apps/elections/models.py`

### 3. Committee Model - Incorrect Unique Constraint

**Error**: `UNIQUE constraint failed: committees.code`

**Root Cause**: The `Committee.code` field had `unique=True`, making it globally unique. However, the business logic requires that the same code can exist in different elections (unique per election, not globally).

**Fix**: 
- Removed `unique=True` from `code` field
- Added `UniqueConstraint` on `['election', 'code']` in the model's `Meta` class

**File Modified**:
- `backend/apps/elections/models.py`

## Migration Created

Created migration `0009_fix_committee_code_unique_and_gender_default.py` to:
1. Remove unique constraint from `code` field
2. Add default value 'MIXED' to `gender` field
3. Add unique constraint on `['election', 'code']`

**File Created**:
- `backend/apps/elections/migrations/0009_fix_committee_code_unique_and_gender_default.py`

## Test Files Updated

### `backend/tests/models/test_elector_models.py`
- Added fixtures: `user`, `election`, `committee`
- Updated all test methods to accept `committee` parameter
- All `Elector.objects.create()` calls now include `committee=committee`

### `backend/tests/models/test_guarantee_models.py`
- Updated `elector` fixture to create a `Committee` and provide it when creating `Elector`

## Model Changes

### `backend/apps/elections/models.py`

**Committee Model**:
```python
# Before
code = models.CharField(max_length=20, unique=True, ...)
gender = models.CharField(max_length=10, choices=GENDER_CHOICES, ...)

# After
code = models.CharField(max_length=20, ...)  # Removed unique=True
gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='MIXED', ...)

# Added to Meta.constraints
constraints = [
    models.UniqueConstraint(
        fields=['election', 'code'],
        name='unique_committee_code_per_election'
    ),
]
```

## Verification

All fixes have been applied. Tests should now pass when run with:
```bash
pytest tests/models/ -v
```

## Next Steps

1. Run tests to verify all fixes work correctly
2. Apply migration to development database if needed
3. Update any existing code that relies on the old `Committee.code` unique constraint behavior


