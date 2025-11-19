# Helper Files Consistency Fix Plan
**Priority:** HIGH  
**Estimated Time:** 4-6 hours  
**Status:** READY TO IMPLEMENT

---

## Issue #1: Fix Broken Index Exports (CRITICAL)

**File:** `src/helpers/api/index.ts`

**Current State:** Contains 20+ non-existent module exports causing potential build errors

**Fix:**
```typescript
// ========================================
// API Functions - Centralized Export
// Import all API functions from one place
// ========================================

// Re-export all EXISTING API modules only
export * from './account';
export * from './auth';
export * from './attendance';
export * from './committees';
export * from './config';      // Deprecated but exists
export * from './elections';
export * from './electors';
export * from './electors-combined';
export * from './guarantees';
export * from './settings';
export * from './user';
export * from './users';
export * from './voting';

// REMOVED non-existent exports:
// - business, calendar, campaigns, clients, crm, customer
// - finance, hr, intelligence, inventory, kanban, mail
// - mobile, projects, sales, services, staff

// ========================================
// Usage Examples:
// ========================================
//
// Option 1: Import from specific module (RECOMMENDED)
// import { getElectors, createElector } from '@/helpers/api/electors';
//
// Option 2: Import from index (all APIs)
// import { getElectors, getElections } from '@/helpers/api';
//
// ========================================
```

---

## Issue #2: Standardize guarantees.ts Response Handling

**File:** `src/helpers/api/guarantees.ts`

**Problems:**
1. Uses direct `axios` import instead of configured instance
2. Manual response wrapping instead of `responseNormalizer`
3. Hardcoded `API_URL` instead of using config

**Current Pattern (INCONSISTENT):**
```typescript
import axios from 'axios';  // ❌ Wrong

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';  // ❌ Hardcoded

export const getGuarantees = async (filters?) => {
  const response = await axios.get(`${API_URL}/api/guarantees/`, {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`  // ❌ Manual
    }
  });
  
  return {
    data: response.data.data,  // ❌ Manual extraction
    message: response.data.message || 'Success'
  };
};
```

**Fixed Pattern (CONSISTENT):**
```typescript
import axios from 'utils/axios';  // ✅ Configured instance (handles auth automatically)
import { wrapResponse, wrapListResponse } from './responseNormalizer';
import type {
  Guarantee,
  GuaranteeListItem,
  GuaranteeFilters,
  // ... other types
} from 'types/guarantees';

// ✅ No API_URL needed - axios is already configured
// ✅ No manual auth headers - interceptor handles it

export const getGuarantees = async (
  filters?: GuaranteeFilters
): Promise<APIResponse<{
  guarantees: { results: GuaranteeListItem[]; count: number };
  statistics: GuaranteeStatistics;
  groups: GuaranteeGroup[];
}>> => {
  const params: Record<string, any> = {};
  
  if (filters?.search) params.search = filters.search;
  if (filters?.status) params.status = filters.status;
  if (filters?.group) params.group = filters.group;
  if (filters?.page) params.page = filters.page;
  if (filters?.pageSize) params.page_size = filters.pageSize;

  const response = await axios.get('/api/guarantees/', { params });
  
  // ✅ Use response normalizer
  return wrapResponse(response.data);
};

export const getGuarantee = async (id: number): Promise<APIResponse<Guarantee>> => {
  const response = await axios.get(`/api/guarantees/${id}/`);
  return wrapResponse(response.data);
};

export const createGuarantee = async (data: GuaranteeCreateData): Promise<APIResponse<Guarantee>> => {
  const response = await axios.post('/api/guarantees/', data);
  return wrapResponse(response.data);
};

// ... continue for all functions
```

---

## Issue #3: Add ESLint Rule to Prevent Direct Axios Import

**File:** `.eslintrc.json` or `eslint.config.js`

**Add Rule:**
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "axios",
          "message": "Please import from 'utils/axios' instead. The configured instance handles auth tokens and CSRF automatically."
        }
      ]
    }]
  }
}
```

---

## Issue #4: Add Deprecation Warnings

**Files to Update:**

### `src/helpers/api/config.ts`
```typescript
/**
 * CONFIG API - Configuration Management
 * 
 * @deprecated This module is DEPRECATED as of October 2025
 * Use the settings API instead: import { getAppSettings } from './settings'
 * 
 * REMOVAL TIMELINE: April 2026
 * 
 * Migration Guide:
 * - getConfigs() → getAppSettings()
 * - getConfig(id) → getAppSetting(id)
 * - createConfig(data) → createAppSetting(data)
 * - updateConfig(id, data) → updateAppSetting(id, data)
 * - deleteConfig(id) → deleteAppSetting(id)
 */

console.warn(
  '[DEPRECATION WARNING] helpers/api/config is deprecated. ' +
  'Please migrate to helpers/api/settings. ' +
  'This module will be removed in April 2026.'
);

// ... rest of file
```

---

## Implementation Checklist

### Step 1: Fix Broken Exports ⏱️ 10 minutes
```bash
- [ ] Update src/helpers/api/index.ts
- [ ] Remove all non-existent module exports
- [ ] Test import { getElectors } from 'helpers/api'
- [ ] Verify no build errors
```

### Step 2: Standardize guarantees.ts ⏱️ 45 minutes
```bash
- [ ] Update all imports (axios, types)
- [ ] Remove API_URL constant
- [ ] Remove manual auth headers
- [ ] Convert all functions to use wrapResponse
- [ ] Update return types
- [ ] Test all guarantee API calls
```

### Step 3: Add ESLint Rule ⏱️ 15 minutes
```bash
- [ ] Update ESLint config
- [ ] Run lint to find violations
- [ ] Fix any existing violations
- [ ] Test rule works
```

### Step 4: Add Deprecation Warnings ⏱️ 20 minutes
```bash
- [ ] Add warning to config.ts
- [ ] Add JSDoc @deprecated tags
- [ ] Update documentation
- [ ] Add removal timeline
```

### Step 5: Review Other API Helpers ⏱️ 2-3 hours
```bash
- [ ] auth.ts - Add responseNormalizer
- [ ] elections.ts - Verify consistency
- [ ] users.ts - Add responseNormalizer
- [ ] voting.ts - Verify consistency
- [ ] attendance.ts - Verify consistency
- [ ] committees.ts - Verify consistency
```

---

## Testing Plan

### Unit Tests to Add

**File:** `src/helpers/api/__tests__/guarantees.test.ts`
```typescript
import { getGuarantees, createGuarantee } from '../guarantees';
import axios from 'utils/axios';

jest.mock('utils/axios');

describe('Guarantees API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch guarantees with normalized response', async () => {
    const mockData = {
      data: {
        guarantees: { results: [], count: 0 },
        statistics: {},
        groups: []
      }
    };
    
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
    
    const result = await getGuarantees();
    
    expect(axios.get).toHaveBeenCalledWith('/api/guarantees/', { params: {} });
    expect(result.data).toBeDefined();
  });

  it('should create guarantee with normalized response', async () => {
    const mockGuarantee = { id: 1, status: 'MEDIUM' };
    (axios.post as jest.Mock).mockResolvedValue({ data: mockGuarantee });
    
    const result = await createGuarantee({ elector: 'PA001', status: 'MEDIUM' });
    
    expect(result.data).toEqual(mockGuarantee);
  });
});
```

### Integration Tests

```bash
# Test API calls work after changes
1. Start backend server
2. Login to frontend
3. Navigate to Guarantees page
4. Verify data loads
5. Create new guarantee
6. Update guarantee
7. Delete guarantee
8. Check browser console for deprecation warnings
```

---

## Verification Commands

```bash
# 1. Check for direct axios imports (should find none after fix)
grep -r "import axios from 'axios'" src/helpers/api/

# 2. Check for hardcoded API URLs (should find none)
grep -r "const API_URL = " src/helpers/api/

# 3. Run linter
npm run lint

# 4. Run type check
npm run type-check

# 5. Run tests
npm run test
```

---

## Expected Results

### Before Fixes
```
❌ 20+ broken exports in index.ts
❌ guarantees.ts uses direct axios
❌ Manual response wrapping in 5+ files
❌ No ESLint protection against direct axios
⚠️  Deprecated files without warnings
```

### After Fixes
```
✅ All exports in index.ts valid
✅ guarantees.ts uses configured axios
✅ Consistent response normalization
✅ ESLint prevents direct axios imports
✅ Clear deprecation warnings with timeline
```

---

## Rollback Plan

If issues occur:
```bash
# 1. Revert changes
git checkout HEAD -- src/helpers/api/index.ts
git checkout HEAD -- src/helpers/api/guarantees.ts

# 2. Remove ESLint rule if blocking
# (edit .eslintrc.json and remove no-restricted-imports)

# 3. Test application still works

# 4. Re-apply fixes one at a time
```

---

## Post-Implementation Tasks

1. **Update Documentation**
   - [ ] Update API-ENDPOINTS-REFERENCE.md
   - [ ] Update RESPONSE-FORMAT-HANDLING.md
   - [ ] Add migration guide for deprecated functions

2. **Team Communication**
   - [ ] Notify team of changes
   - [ ] Share migration guide
   - [ ] Schedule code review

3. **Monitor**
   - [ ] Watch for console warnings
   - [ ] Monitor error logs
   - [ ] Gather feedback

---

**Ready to implement? Run the fixes in order above! ✅**

