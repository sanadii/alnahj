# Action Types Audit & Standardization

**Date:** November 17, 2025  
**Status:** In Progress

## Issues Found

### 1. ERROR vs FAILURE Inconsistency

| Module | Pattern | Status |
|--------|---------|--------|
| `guarantees` | `FAILURE` | ✅ Correct |
| `voting` | `FAILURE` | ✅ Correct |
| `strategic` | `FAILURE` | ✅ Correct |
| `elections` (candidates/parties) | `FAILURE` | ✅ Correct |
| `attendance` | `ERROR` | ❌ Needs fix |
| `electors` | `ERROR` | ❌ Needs fix |
| `users` | `ERROR` | ❌ Needs fix |
| `auth` | `ERROR` | ❌ Needs fix |
| `elections` (main) | `ERROR` | ❌ Needs fix |
| `committees` | `ERROR` | ❌ Needs fix |

**Standard:** Use `FAILURE` consistently (as per STORE-SAGA-GUIDE.md)

### 2. Namespace Prefix Inconsistency

| Module | Pattern | Status |
|--------|---------|--------|
| `guarantees` | `guarantees/ACTION` | ✅ Correct |
| `electors` | `electors/ACTION` | ✅ Correct |
| `users` | `users/ACTION` | ✅ Correct |
| `auth` | `auth/ACTION` | ✅ Correct |
| `elections` | `elections/ACTION` | ✅ Correct |
| `committees` | `committees/ACTION` | ✅ Correct |
| `voting` | `voting/ACTION` | ✅ Correct |
| `strategic` | `STRATEGIC/ACTION` | ⚠️ Should be `strategic/ACTION` |
| `attendance` | `ACTION` (no prefix!) | ❌ Missing namespace |

**Standard:** Use lowercase module name with `/` separator: `module/ACTION_NAME`

### 3. Format Inconsistency

- Most modules use string literals: `'guarantees/GET_GUARANTEES_REQUEST'`
- Strategic uses template literal with constant: `${STRATEGIC_PREFIX}/GET_DATA_REQUEST`

**Standard:** String literals are preferred for simplicity, but constants are acceptable for maintainability.

## Standardization Plan

1. ✅ **Standardize to `FAILURE`**: Update all `ERROR` to `FAILURE` in:
   - `attendance/actionTypes.ts`
   - `electors/actionTypes.ts`
   - `users/actionTypes.ts`
   - `auth/actionTypes.ts`
   - `elections/actionTypes.ts` (main actions)
   - `committees/actionTypes.ts`

2. ✅ **Fix namespace prefixes**:
   - `attendance`: Add `attendance/` prefix to all actions
   - `strategic`: Change `STRATEGIC/` to `strategic/`

3. ✅ **Update reducers**: Update all reducer switch cases to use `FAILURE` instead of `ERROR`

4. ✅ **Update sagas**: Update all saga action type references

5. ✅ **Update actions**: Update action creators if needed

## Action Type Naming Convention

**Format:** `module/ACTION_NAME_PHASE`

- **Module**: Lowercase, matches folder name (e.g., `guarantees`, `electors`)
- **Action Name**: Uppercase with underscores (e.g., `GET_GUARANTEES`, `CREATE_USER`)
- **Phase**: `REQUEST`, `SUCCESS`, `FAILURE` (or `SET_`, `CLEAR_` for non-async)

**Examples:**
- ✅ `guarantees/GET_GUARANTEES_REQUEST`
- ✅ `electors/CREATE_ELECTOR_SUCCESS`
- ✅ `users/SET_USER_FILTERS`
- ❌ `GET_ATTENDANCES_REQUEST` (missing prefix)
- ❌ `STRATEGIC/GET_DATA_REQUEST` (uppercase prefix)

