# Selectors & Helpers Audit

**Date:** November 17, 2025  
**Status:** In Progress

## Selectors Audit

### Current Structure
- **Location**: `frontend/src/selectors/` (centralized)
- **Files**: 10 selector files (auth, user, users, elections, committees, guarantees, attendance, voting, electors)
- **Pattern**: Using `createSelector` from reselect

### Issues Found

#### 1. Co-location
- ❌ Selectors are in a separate `selectors/` folder, not co-located with store modules
- ✅ **Standard**: Move to `store/{module}/selectors.ts` for better organization

#### 2. Type Safety
- ✅ Most selectors use `RootState` type
- ⚠️ Some selectors don't export individual selectors (only main selector)
- ⚠️ Missing return type annotations on some selectors

#### 3. Memoization
- ✅ Using `createSelector` appropriately
- ⚠️ Some selectors might be over-memoized (simple property access)
- ⚠️ Inconsistent patterns across modules

#### 4. Exports
- ✅ Centralized export via `selectors/index.ts`
- ⚠️ Some modules export multiple selectors, others only one

### Selector Files Status

| Module | File | Individual Selectors | Type Safety | Status |
|--------|------|---------------------|-------------|--------|
| `electors` | `electorsSelector.ts` | ✅ Yes (8 selectors) | ✅ Good | ✅ Good |
| `guarantees` | `guaranteesSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `users` | `usersSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `attendance` | `attendanceSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `elections` | `electionsSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `committees` | `committeesSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `voting` | `votingSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `auth` | `authSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |
| `user` | `userSelector.ts` | ❌ No (only main) | ✅ Good | ⚠️ Needs individual selectors |

## Helpers Audit

### Current Structure
- **API Helpers**: `frontend/src/helpers/api/` (15+ modules)
- **URL Constants**: `frontend/src/helpers/urls/` (only 2 modules: account, config)
- **API Client**: `frontend/src/helpers/api_client.ts` and `api_helper.ts`

### Issues Found

#### 1. URL Constants Missing
- ❌ Most domains don't have URL constant modules
- ✅ Only `account` and `config` have URL modules
- ⚠️ Hardcoded URLs likely exist in API helper files

#### 2. API Client
- ✅ Has interceptors for auth and token refresh
- ⚠️ Typing could be improved (generics for request/response)
- ⚠️ Error handling could be more structured

#### 3. Error Normalization
- ⚠️ Errors likely returned as strings or raw API responses
- ⚠️ No structured error format (`{ code, message, details }`)

#### 4. Helper Organization
- ✅ Well organized by domain
- ✅ Centralized exports via `helpers/api/index.ts`
- ⚠️ URL constants not centralized

## Action Plan

### Phase 1: Selectors (Priority: High)

1. **Co-locate selectors**
   - Move `selectors/{module}Selector.ts` → `store/{module}/selectors.ts`
   - Update `selectors/index.ts` to re-export from store modules
   - Update all imports in views/components

2. **Add individual selectors**
   - Create granular selectors for each module (following `electorsSelector.ts` pattern)
   - Export both main selector and individual selectors

3. **Type safety improvements**
   - Add explicit return types to all selectors
   - Ensure all use `RootState` type

### Phase 2: Helpers (Priority: High)

1. **URL Constants**
   - Create URL modules for all domains: `electors.ts`, `guarantees.ts`, `users.ts`, `elections.ts`, `committees.ts`, `attendance.ts`, `voting.ts`, `strategic.ts`
   - Audit API helper files for hardcoded URLs
   - Replace hardcoded URLs with constants

2. **Error Normalization**
   - Create structured error format
   - Update API client to normalize errors
   - Update sagas to use normalized errors

3. **Type Safety**
   - Add generics to API client methods
   - Type all API helper functions

## Priority Order

1. ✅ **Selectors co-location** (quick win, improves organization) - ✅ Started (guarantees done)
2. ✅ **URL constants** (prevents bugs, improves maintainability) - ✅ Completed (all modules created, electors & guarantees updated)
3. ⚠️ **Individual selectors** (improves performance and DX) - ⚠️ In Progress
4. ⚠️ **Error normalization** (improves error handling) - ⚠️ Pending
5. ⚠️ **Type safety** (improves DX and catches bugs) - ⚠️ Pending

## Progress Update (Nov 17, 2025)

### ✅ Completed
- Created URL constant modules for all domains:
  - `electors.ts` ✅
  - `guarantees.ts` ✅
  - `users.ts` ✅
  - `elections.ts` ✅
  - `committees.ts` ✅
  - `attendance.ts` ✅
  - `voting.ts` ✅
- Updated `helpers/urls/index.ts` to export all modules
- Updated `helpers/api/electors.ts` to use URL constants (all 13 endpoints)
- Updated `helpers/api/guarantees.ts` to use URL constants (all 15 endpoints)
- Created `store/guarantees/selectors.ts` with individual selectors

### ⚠️ Remaining
- Update remaining API helpers to use URL constants:
  - `users.ts`
  - `elections.ts`
  - `committees.ts`
  - `attendance.ts`
  - `voting.ts`
  - `auth.ts`
- Co-locate remaining selectors:
  - `usersSelector.ts` → `store/users/selectors.ts`
  - `electionsSelector.ts` → `store/elections/selectors.ts`
  - `committeesSelector.ts` → `store/committees/selectors.ts`
  - `attendanceSelector.ts` → `store/attendance/selectors.ts`
  - `votingSelector.ts` → `store/voting/selectors.ts`
  - `authSelector.ts` → `store/auth/selectors.ts`

