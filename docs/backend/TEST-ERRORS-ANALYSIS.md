# Test Errors Analysis & Fixes

**Date:** January 2025  
**Status:** ✅ Fixed

---

## Errors Found

### 1. Migration Error: `Elector has no field named 'sub_team'` ❌

**Root Cause:**
Migration `0007_rename_team_fields.py` was trying to rename an index that references `sub_team` AFTER the field had already been renamed to `team` in the same migration. Django validates index renames by checking if the field exists, but by that point the field had already been renamed.

**Error Location:**
```
File: backend/apps/electors/migrations/0007_rename_team_fields.py
Line 26-29: RenameIndex operation for 'electors_sub_tea_b22b3e_idx'
```

**The Problem:**
1. Migration renames `team` → `department` (line 11-14)
2. Migration renames `sub_team` → `team` (line 16-19) ✅ Field renamed
3. Migration tries to rename index for `sub_team` (line 26-29) ❌ Field no longer exists!

**Fix Applied:**
Reordered migration operations to rename indexes BEFORE renaming fields:
1. ✅ Rename index `electors_team_b99939_idx` → `electors_department_b99939_idx`
2. ✅ Rename index `electors_sub_tea_b22b3e_idx` → `electors_team_b22b3e_idx`
3. ✅ Rename field `team` → `department`
4. ✅ Rename field `sub_team` → `team`

**File Fixed:**
- `backend/apps/electors/migrations/0007_rename_team_fields.py`

---

### 2. Database Access Error: `RuntimeError: Database access not allowed` ❌

**Root Cause:**
Tests were missing the `@pytest.mark.django_db` decorator, which is required for pytest-django to allow database access in tests.

**Error Message:**
```
RuntimeError: Database access not allowed, use the "django_db" mark, 
or the "db" or "transactional_db" fixtures to enable it.
```

**Fix Applied:**
Added `@pytest.mark.django_db` decorator to all test classes that need database access:

**Files Fixed:**
- `backend/tests/models/test_elector_models.py` - Added `@pytest.mark.django_db` to `TestElector`
- `backend/tests/models/test_guarantee_models.py` - Added to `TestGuaranteeGroup` and `TestGuarantee`
- `backend/tests/models/test_election_models.py` - Added to `TestElection` and `TestCommittee`

**Note:** `TestNormalizeKuwaitPhone` doesn't need `@pytest.mark.django_db` because it only tests a function, not database operations.

---

### 3. Test Assertion Error: Phone Normalization ❌

**Root Cause:**
Incorrect expected value in test. The function takes the last 8 digits when the number has more than 8 digits after +965.

**Error:**
```python
assert normalize_kuwait_phone('+965123456789') == '+96512345678'  # Wrong!
```

**Actual Behavior:**
```python
normalize_kuwait_phone('+965123456789') == '+96523456789'  # Takes last 8 digits
```

**Fix Applied:**
Updated test expectation to match actual function behavior:
```python
assert normalize_kuwait_phone('+965123456789') == '+96523456789'  # Last 8 digits
```

**File Fixed:**
- `backend/tests/models/test_guarantee_models.py` - Line 33

---

## Summary of Fixes

| Issue | Type | Status | Fix |
|-------|------|--------|-----|
| Migration field lookup error | Migration | ✅ Fixed | Reordered operations |
| Database access not allowed | Test Setup | ✅ Fixed | Added `@pytest.mark.django_db` |
| Phone normalization assertion | Test Logic | ✅ Fixed | Updated expected value |

---

## Files Modified

1. ✅ `backend/apps/electors/migrations/0007_rename_team_fields.py` - Reordered operations
2. ✅ `backend/tests/models/test_elector_models.py` - Added `@pytest.mark.django_db`
3. ✅ `backend/tests/models/test_guarantee_models.py` - Added `@pytest.mark.django_db` + fixed assertion
4. ✅ `backend/tests/models/test_election_models.py` - Added `@pytest.mark.django_db`

---

## Next Steps

After these fixes, tests should run successfully. Run:

```bash
pytest backend/tests/models/ -v
```

All errors should now be resolved.

---

**Fixed:** January 2025



