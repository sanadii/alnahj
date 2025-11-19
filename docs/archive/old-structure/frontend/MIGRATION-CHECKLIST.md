# Frontend Migration Checklist
**Backend API Endpoint Updates - October 2025**

**Date**: October 27, 2025  
**Priority**: 🚨 **HIGH** - Required for system functionality

---

## 📋 Overview

The backend has been refactored to use plural app names. All frontend API calls must be updated to use the new endpoints.

### Changes Summary

| Resource | Old Endpoint | New Endpoint | Impact |
|----------|--------------|--------------|--------|
| Elections | `/api/election/*` | `/api/elections/*` | High |
| Attendees | `/api/attendance/*` | `/api/attendees/*` | High |
| Candidates | `/api/candidates/*` | `/api/candidates/*` | None (already correct) |
| Electors | `/api/electors/*` | `/api/electors/*` | None (already correct) |

---

## ✅ Migration Checklist

### Phase 1: API Services Layer

#### Elections Service
- [ ] **Update service file**: `src/api/services/elections.service.ts`
  ```typescript
  // OLD
  constructor() {
    super('/election');  // ❌ Singular
  }
  
  // NEW
  constructor() {
    super('/elections');  // ✅ Plural
  }
  ```

- [ ] **Test endpoints**:
  - [ ] `GET /api/elections/` - List elections
  - [ ] `GET /api/elections/current/` - Current election
  - [ ] `GET /api/elections/{id}/` - Election detail
  - [ ] `POST /api/elections/` - Create election
  - [ ] `PUT /api/elections/{id}/` - Update election
  - [ ] `GET /api/elections/committees/` - List committees
  - [ ] `GET /api/elections/committees/{id}/` - Committee detail

#### Attendees Service
- [ ] **Update service file**: `src/api/services/attendees.service.ts`
  ```typescript
  // OLD
  constructor() {
    super('/attendance');  // ❌ Singular
  }
  
  // NEW
  constructor() {
    super('/attendees');  // ✅ Plural
  }
  ```

- [ ] **Test endpoints**:
  - [ ] `GET /api/attendees/` - List attendance
  - [ ] `POST /api/attendees/mark_attendance/` - Mark attendance
  - [ ] `GET /api/attendees/committee/{code}/` - By committee
  - [ ] `GET /api/attendees/statistics/{code}/` - Statistics
  - [ ] `POST /api/attendees/statistics/{code}/refresh/` - Refresh stats

---

### Phase 2: API Endpoints Configuration

- [ ] **Update**: `src/api/endpoints.ts`
  ```typescript
  // OLD
  export const API_ENDPOINTS = {
    election: {
      list: '/election/',              // ❌
      current: '/election/current/',   // ❌
    },
    attendance: {
      list: '/attendance/',            // ❌
      mark: '/attendance/mark/',       // ❌
    },
  };
  
  // NEW
  export const API_ENDPOINTS = {
    elections: {                       // ✅ Plural
      list: '/elections/',             // ✅
      current: '/elections/current/',  // ✅
    },
    attendees: {                       // ✅ Plural
      list: '/attendees/',             // ✅
      mark: '/attendees/mark/',        // ✅
    },
  };
  ```

---

### Phase 3: Component Updates

#### Elections Components
- [ ] `src/views/elections/CurrentElection.tsx`
- [ ] `src/views/elections/ElectionsList.tsx`
- [ ] `src/views/elections/ElectionDetail.tsx`
- [ ] `src/views/elections/CommitteesView.tsx`
- [ ] `src/components/features/elections/ElectionCard.tsx`
- [ ] `src/components/features/elections/ElectionForm.tsx`
- [ ] `src/components/features/elections/CommitteeList.tsx`

**Search for**:
```typescript
// Find these patterns
'/api/election/'
'api/election/'
'/election/'  // In API context only
```

#### Attendance Components
- [ ] `src/views/attendance/AttendanceView.tsx`
- [ ] `src/views/attendance/AttendanceByCommittee.tsx`
- [ ] `src/views/attendance/AttendanceStatistics.tsx`
- [ ] `src/components/features/attendance/AttendanceMarkButton.tsx`
- [ ] `src/components/features/attendance/AttendanceList.tsx`

**Search for**:
```typescript
// Find these patterns
'/api/attendance/'
'api/attendance/'
'/attendance/'  // In API context only
```

---

### Phase 4: Custom Hooks

Check these hooks for hardcoded endpoints:

- [ ] `src/hooks/useElections.ts`
  ```typescript
  // OLD
  const response = await axios.get('/api/election/current/');  // ❌
  
  // NEW
  const response = await axios.get('/api/elections/current/');  // ✅
  ```

- [ ] `src/hooks/useAttendance.ts`
  ```typescript
  // OLD
  const response = await axios.get('/api/attendance/');  // ❌
  
  // NEW
  const response = await axios.get('/api/attendees/');  // ✅
  ```

- [ ] `src/hooks/useCommittees.ts`
- [ ] Any other custom hooks that call API directly

---

### Phase 5: Context Providers

- [ ] `src/contexts/ElectionContext.tsx`
- [ ] Check for any hardcoded API endpoints
- [ ] Update if services are called directly

---

### Phase 6: Utility Functions

- [ ] `src/utils/api.ts`
- [ ] `src/utils/election-helpers.ts`
- [ ] `src/utils/attendance-helpers.ts`
- [ ] Any utility functions that construct API URLs

---

### Phase 7: Tests

#### Update Test Files
- [ ] `src/api/services/__tests__/elections.service.test.ts`
- [ ] `src/api/services/__tests__/attendees.service.test.ts`
- [ ] `src/components/features/elections/__tests__/*.test.tsx`
- [ ] `src/components/features/attendance/__tests__/*.test.tsx`

#### Mock API Endpoints
```typescript
// OLD mocks
jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url === '/api/election/current/') {  // ❌
      // ...
    }
  })
}));

// NEW mocks
jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url === '/api/elections/current/') {  // ✅
      // ...
    }
  })
}));
```

---

### Phase 8: Documentation

- [ ] Update README.md with new API endpoints
- [ ] Update API documentation
- [ ] Update component documentation
- [ ] Update example code snippets

---

### Phase 9: Configuration Files

- [ ] `.env.example`
  ```bash
  # Make sure base URL is correct
  VITE_API_BASE_URL=http://localhost:8000/api
  ```

- [ ] Check any proxy configurations
- [ ] Check any mock service worker configurations

---

## 🔍 Search and Replace Commands

### Using Find and Replace in VS Code

1. **Open Find in Files**: `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)

2. **Search for Elections**:
   ```
   Find: /api/election/
   Replace: /api/elections/
   ```
   
   **Files to include**: `src/**/*.ts,src/**/*.tsx`
   
   **Files to exclude**: `node_modules,dist,build`

3. **Search for Attendance**:
   ```
   Find: /api/attendance/
   Replace: /api/attendees/
   ```

4. **Search for Endpoint Constants**:
   ```
   Find: election:
   Replace: elections:
   ```
   (Manual review required - only in endpoint definitions)

### Using Command Line

```bash
# Elections
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|/api/election/|/api/elections/|g' {} +

# Attendance  
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|/api/attendance/|/api/attendees/|g' {} +
```

**⚠️ Warning**: Always backup before running batch replacements!

---

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Elections
- [ ] View current election
- [ ] List all elections
- [ ] View election details
- [ ] Create new election (admin)
- [ ] Update election (admin)
- [ ] Delete election (admin)
- [ ] View committees list
- [ ] View committee details
- [ ] Committee statistics

#### Attendance
- [ ] View attendance list
- [ ] Mark attendance
- [ ] View attendance by committee
- [ ] View attendance statistics
- [ ] Refresh statistics
- [ ] Walk-in registration

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- elections
npm test -- attendance

# Run with coverage
npm test -- --coverage
```

---

## 🐛 Common Issues & Solutions

### Issue 1: 404 Not Found

**Symptom**: API calls returning 404 errors

**Cause**: Using old singular endpoints

**Solution**: 
```typescript
// ❌ Wrong
await axios.get('/api/election/current/');

// ✅ Correct
await axios.get('/api/elections/current/');
```

---

### Issue 2: CORS Errors

**Symptom**: CORS errors in browser console

**Cause**: Backend might not have updated CORS settings

**Solution**: 
1. Check backend is running latest version
2. Verify backend CORS settings include new endpoints

---

### Issue 3: Tests Failing

**Symptom**: Tests fail after migration

**Cause**: Mock API endpoints not updated

**Solution**: Update all mocked endpoints in tests

---

## 📊 Progress Tracking

### Overall Progress

- [ ] Phase 1: API Services Layer (0/2 services)
- [ ] Phase 2: Endpoints Configuration (0/1 file)
- [ ] Phase 3: Component Updates (0/~15 components)
- [ ] Phase 4: Custom Hooks (0/~5 hooks)
- [ ] Phase 5: Context Providers (0/~2 providers)
- [ ] Phase 6: Utility Functions (0/~3 files)
- [ ] Phase 7: Tests (0/~20 test files)
- [ ] Phase 8: Documentation (0/~5 docs)
- [ ] Phase 9: Configuration (0/~2 files)

### Estimated Time

- **Small project**: 2-4 hours
- **Medium project**: 4-8 hours
- **Large project**: 1-2 days

**Our project**: Medium (~6-8 hours estimated)

---

## ✅ Final Verification

After completing all phases:

### Functionality Tests
- [ ] All election features work
- [ ] All attendance features work
- [ ] No 404 errors in console
- [ ] No failed API calls
- [ ] All forms submit successfully
- [ ] Data loads correctly

### Code Quality
- [ ] No linting errors
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript compiles without errors

### Documentation
- [ ] All docs updated
- [ ] Examples use new endpoints
- [ ] README reflects changes

---

## 🎉 Completion

Once all checkboxes are marked:

1. Run full test suite
2. Test on staging environment
3. Get code review
4. Deploy to production
5. Monitor for issues

---

## 📞 Need Help?

- **Backend API Docs**: `../../backend/docs/BACKEND-STANDARDIZATION-GUIDE.md`
- **Backend Changes**: `../../backend/APPS-PLURALIZATION-SUMMARY.md`
- **API Integration Guide**: `./API-INTEGRATION-GUIDE.md`
- **Team Chat**: #frontend-dev

---

**Created**: October 27, 2025  
**Status**: 🚧 Migration In Progress  
**Priority**: 🚨 HIGH

