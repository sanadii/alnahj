# Linter Fixes & Incomplete Views - Action Plan
**Election Management System - Frontend Cleanup**

**Date:** October 31, 2025  
**Total Errors:** 262  
**Status:** 🔧 In Progress

---

## 📊 Error Summary

| Category | Count | Priority | Auto-Fix? |
|----------|-------|----------|-----------|
| **Unused Imports** | ~180 | Medium | ✅ Yes |
| **Unused Variables** | ~50 | Medium | ✅ Yes |
| **Restricted Imports** (axios) | 6 | HIGH | ⚠️ Manual |
| **Storybook Import Issues** | 10 | Low | ❌ No |
| **Parsing Errors** | 2 | Low | ❌ No |
| **React Hooks Warnings** | ~14 | Low | ⚠️ Manual |

---

## 🔥 HIGH PRIORITY - Fix First

### 1. Restricted Axios Imports (6 files)

**Issue:** Direct `import axios from 'axios'` instead of `import axios from 'utils/axios'`

**Files:**
1. ❌ `src/helpers/api/business.ts` - Line 3
2. ❌ `src/helpers/api/calendars.ts` - Line 1
3. ❌ `src/helpers/api/config copy.ts` - Line 1
4. ❌ `src/helpers/api/old\config.ts` - Line 4
5. ❌ `src/services/election/elections.ts` - Line 3
6. ❌ `src/ui-component/form-components/clients/ClientComboBox.tsx` - Line 5 (unused)

**Action:** Replace with `import axios from 'utils/axios';`

---

## 📁 Files by Directory

### views/parties/ (2 files with issues)

#### ❌ PartiesList.tsx
```typescript
// Unused state setters
38:19  error  'setParties' is assigned a value but never used
39:19  error  'setLoading' is assigned a value but never used
```

**Reason:** Component uses local state but doesn't populate it (likely incomplete)

**Fix Strategy:**
- Either remove unused state
- OR implement proper data fetching from Redux/API

---

#### ❌ PartyEdit.tsx
```typescript
14:19  error  'setLoading' is assigned a value but never used
```

**Fix:** Remove unused setter or implement loading state

---

### views/results/ (1 file)

#### ❌ ElectionResults.tsx
```typescript
32:10  error  'results' is assigned a value but never used
32:19  error  'setResults' is assigned a value but never used
33:10  error  'loading' is assigned a value but never used
33:19  error  'setLoading' is assigned a value but never used
```

**Reason:** Component scaffold without implementation

**Fix Strategy:** Implement results display OR remove unused state

---

### views/sorting/ (3 files)

#### ❌ Sorting.tsx
```typescript
31:3  error  'getElectionResultsRequest' is defined but never used
70:9  error  'theme' is assigned a value but never used
```

#### ❌ components/AuditTrailTab.tsx
```typescript
46:9   error  'theme' is assigned a value but never used
50:23  error  'loading' is assigned a value but never used
```

#### ❌ components/VoteEntryTab.tsx
```typescript
28:3   error  'IconButton' is defined but never used
29:3   error  'Tooltip' is defined but never used
35:10  error  'AddIcon' is defined but never used
37:13  error  'DeleteIcon' is defined but never used
38:18  error  'VerifiedIcon' is defined but never used
44:32  error  'createVoteCountRequest' is defined but never used
44:56  error  'updateVoteCountRequest' is defined but never used
44:80  error  'deleteVoteCountRequest' is defined but never used
```

**Reason:** Incomplete implementation - imported but not used

---

### views/voting/ (2 files)

#### ❌ VoteEntry.tsx
```typescript
11:3  error  'Card' is defined but never used
12:3  error  'CardContent' is defined but never used
```

#### ❌ VotesList.tsx
```typescript
35:17  error  'ViewIcon' is defined but never used
46:17  error  'setVotes' is assigned a value but never used
47:19  error  'setLoading' is assigned a value but never used
```

---

### views/users/ (3 files)

#### ❌ UserCreate.tsx
```typescript
8:23  error  'Card' is defined but never used
8:29  error  'CardContent' is defined but never used
8:59  error  'Typography' is defined but never used
```

#### ❌ UserProfile.tsx
```typescript
9:37  error  'EmailIcon' is defined but never used
9:58  error  'PersonIcon' is defined but never used
```

#### ❌ UsersList.tsx
```typescript
40:31  error  'UserFilters' is defined but never used
```

#### ❌ components/UserEditDialog.tsx
```typescript
30:15  error  'User' is defined but never used
```

---

### views/settings/ (35+ files)

Too many to list - mostly unused imports. Will auto-fix.

---

## 🎯 Action Plan

### Phase 1: HIGH PRIORITY (30 minutes)

#### 1.1 Fix Restricted Axios Imports
- [ ] `helpers/api/business.ts`
- [ ] `helpers/api/calendars.ts`
- [ ] `helpers/api/config copy.ts`
- [ ] `helpers/api/old\config.ts`
- [ ] `services/election/elections.ts`
- [ ] `ui-component/form-components/clients/ClientComboBox.tsx`

---

### Phase 2: AUTO-FIX (10 minutes)

#### 2.1 Run ESLint Auto-Fix
```bash
npm run lint -- --fix
```

This will automatically remove:
- ✅ Unused imports
- ✅ Trailing whitespace
- ✅ Line ending issues (CRLF → LF)

Expected: ~180 errors fixed automatically

---

### Phase 3: INCOMPLETE VIEWS (1-2 hours)

#### 3.1 PartiesList.tsx
**Options:**
- A) Remove unused state (if using Redux)
- B) Implement local state fetching
- C) Mark as TODO and document

#### 3.2 PartyEdit.tsx
**Options:**
- A) Remove unused loading state
- B) Implement loading indicator

#### 3.3 ElectionResults.tsx
**Options:**
- A) Complete implementation (fetch & display results)
- B) Remove file if not needed
- C) Mark as TODO

#### 3.4 VotesList.tsx & VoteEntry.tsx
**Options:**
- A) Complete implementation
- B) Remove unused state
- C) Mark as TODO

#### 3.5 Sorting Components
**Action:** Remove unused imports/variables

---

### Phase 4: MANUAL CLEANUP (30 minutes)

#### 4.1 Remove Unused Variables
- Error handlers (err, error) that are caught but not logged
- Theme variables not used
- Loading states without UI

#### 4.2 Fix Storybook Imports
- Update import statements or disable rule

#### 4.3 Fix Parsing Errors
- Check TypeScript config issues

---

## 📋 Detailed Task List

### Quick Wins (Auto-fixable)
- [x] Run `npm run lint -- --fix`
- [ ] Verify auto-fixes didn't break anything

### Manual Fixes - Helpers/Services
- [ ] Fix `helpers/api/business.ts` axios import
- [ ] Fix `helpers/api/calendars.ts` axios import
- [ ] Fix `helpers/api/config copy.ts` axios import
- [ ] Fix `helpers/api/old\config.ts` axios import
- [ ] Fix `services/election/elections.ts` axios import

### Manual Fixes - Views
- [ ] PartiesList.tsx - Complete or clean up
- [ ] PartyEdit.tsx - Remove unused loading
- [ ] ElectionResults.tsx - Complete or mark TODO
- [ ] VotesList.tsx - Complete or clean up
- [ ] VoteEntry.tsx - Remove unused imports
- [ ] Sorting components - Clean up imports
- [ ] UserCreate.tsx - Remove unused imports
- [ ] UserProfile.tsx - Remove unused imports
- [ ] UsersList.tsx - Remove unused type
- [ ] UserEditDialog.tsx - Remove unused type

### Manual Fixes - Settings
- [ ] Clean up views/settings/* files (after auto-fix)

---

## 🎓 Decision Matrix for Incomplete Views

For each incomplete view, ask:

1. **Is this feature actively used?**
   - YES → Complete implementation
   - NO → Remove or mark as TODO

2. **Is there a Redux slice for it?**
   - YES → Connect to Redux
   - NO → Create or use local state

3. **Is the API endpoint ready?**
   - YES → Implement fetch logic
   - NO → Document as waiting on backend

4. **Is this a future feature?**
   - YES → Mark as TODO with comment
   - NO → Remove

---

## 🚀 Execution Order

```bash
# 1. Auto-fix what we can
npm run lint -- --fix

# 2. Check remaining errors
npm run lint

# 3. Fix restricted imports (6 files)
# ... manual edits ...

# 4. Fix incomplete views (case by case)
# ... manual edits ...

# 5. Final verification
npm run lint
```

---

## ✅ Success Criteria

- [ ] Zero lint errors in production code
- [ ] All axios imports use `utils/axios`
- [ ] All unused imports removed
- [ ] All incomplete views either completed or documented
- [ ] Codebase passes CI/CD checks

---

## 📊 Expected Results

### Before
```
✖ 3964 problems (262 errors, 3702 warnings)
  0 errors and 3694 warnings potentially fixable with the `--fix` option.
```

### After Phase 1-2 (Auto-fix + Axios)
```
✖ ~80 problems (remaining manual fixes)
```

### After Phase 3-4 (Complete)
```
✖ 0 errors, <50 warnings (acceptable)
```

---

**Next Step:** Start with Phase 1 - Fix restricted axios imports

---

**Last Updated:** October 31, 2025  
**Assigned To:** Development Team  
**Status:** Ready to Execute

