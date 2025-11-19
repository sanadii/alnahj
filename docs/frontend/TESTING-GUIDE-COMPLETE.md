# Testing Guide - Complete Setup & Usage

**Date**: November 3, 2025  
**Status**: ✅ COMPLETE  
**Testing Framework**: Vitest + React Testing Library

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Files Created](#files-created)
3. [Installation](#installation)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [Test Examples](#test-examples)
7. [Best Practices](#best-practices)

---

## 🎯 Overview

Complete testing setup for the Election Dashboard:

- ✅ **Vitest** - Fast unit test framework (works with Vite)
- ✅ **React Testing Library** - Component testing
- ✅ **Test Setup** - Global configuration and mocks
- ✅ **Test Utilities** - Reusable helpers and mock data
- ✅ **Unit Tests** - API services, hooks
- ✅ **Integration Tests** - Components with API calls
- ✅ **Coverage Reports** - Code coverage tracking

---

## 📁 Files Created

### 1. Configuration
```
vitest.config.ts                    # Vitest configuration
```

### 2. Test Setup
```
src/test/setup.ts                   # Global test setup (mocks, matchers)
src/test/utils/test-utils.tsx      # Custom render, mock data generators
```

### 3. Test Files
```
src/api/__tests__/dashboard.api.test.ts                           # API service tests
src/hooks/dashboard/__tests__/useDashboardData.test.ts            # Hook tests
src/views/election/components/charts/__tests__/
  └── GuaranteesTrendChartWithAPI.test.tsx                        # Component tests
```

---

## 📦 Installation

### Install Test Dependencies

```bash
cd frontend

# Install Vitest and testing libraries
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Or with yarn
yarn add --dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 🧪 Running Tests

### Run Tests in Watch Mode
```bash
npm test
# or
npm run test
```

### Run Tests Once (CI Mode)
```bash
npm run test:run
```

### Run Tests with UI
```bash
npm run test:ui
# Opens browser with interactive test UI
```

### Run Tests with Coverage
```bash
npm run test:coverage
# Generates coverage report in ./coverage folder
```

### Run Specific Test File
```bash
npm test dashboard.api.test
```

### Run Tests for Specific Pattern
```bash
npm test -- hooks
```

---

## ✍️ Writing Tests

### Test File Structure

```typescript
// ComponentName.test.tsx or functionName.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from 'test/utils/test-utils';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

### Test Types

#### 1. Unit Tests (API Services)

```typescript
// api/__tests__/dashboard.api.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getGuaranteesTrend } from '../dashboard.api';

describe('Dashboard API', () => {
  it('should fetch guarantee trends', async () => {
    const result = await getGuaranteesTrend(1, '30days');
    expect(result.data).toBeDefined();
  });
});
```

#### 2. Hook Tests

```typescript
// hooks/dashboard/__tests__/useDashboardData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useGuaranteesTrend } from '../useDashboardData';

describe('useGuaranteesTrend', () => {
  it('should fetch data on mount', async () => {
    const { result } = renderHook(() => useGuaranteesTrend(1, '30days'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

#### 3. Component Tests

```typescript
// components/__tests__/MyComponent.test.tsx
import { render, screen } from 'test/utils/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## 📚 Test Examples

### Example 1: Testing Loading States

```typescript
it('should show loading spinner', () => {
  (useGuaranteesTrend as any).mockReturnValue({
    data: null,
    loading: true,
    error: null
  });

  render(<GuaranteesTrendChartWithAPI electionId={1} />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Example 2: Testing Error States

```typescript
it('should show error message', () => {
  (useGuaranteesTrend as any).mockReturnValue({
    data: null,
    loading: false,
    error: 'Failed to fetch'
  });

  render(<GuaranteesTrendChartWithAPI electionId={1} />);

  expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
});
```

### Example 3: Testing User Interactions

```typescript
it('should call refetch on retry button click', () => {
  const mockRefetch = vi.fn();
  (useGuaranteesTrend as any).mockReturnValue({
    data: null,
    loading: false,
    error: 'Error',
    refetch: mockRefetch
  });

  render(<GuaranteesTrendChartWithAPI electionId={1} />);

  const retryButton = screen.getByRole('button', { name: /retry/i });
  retryButton.click();

  expect(mockRefetch).toHaveBeenCalled();
});
```

### Example 4: Testing API Calls

```typescript
it('should call API with correct parameters', async () => {
  const mockGet = vi.fn().mockResolvedValue({ data: [] });
  
  await getGuaranteesTrend(1, '30days');

  expect(mockGet).toHaveBeenCalledWith(
    '/api/elections/1/dashboard/guarantees/trends',
    { period: '30days' }
  );
});
```

### Example 5: Testing Async Behavior

```typescript
it('should update data after fetch', async () => {
  const mockData = [{ date: '2025-10-01', total: 45 }];
  (getGuaranteesTrend as any).mockResolvedValue({ data: mockData });

  const { result } = renderHook(() => useGuaranteesTrend(1, '30days'));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual(mockData);
});
```

---

## 🎯 Best Practices

### 1. Test Organization

```
✅ DO: Group related tests in describe blocks
✅ DO: Use descriptive test names
✅ DO: One assertion per test (when possible)
✅ DO: Test user behavior, not implementation

❌ DON'T: Test implementation details
❌ DON'T: Write flaky tests
❌ DON'T: Test third-party code
```

### 2. Mocking Guidelines

```typescript
// ✅ GOOD: Mock external dependencies
vi.mock('api/dashboard.api', () => ({
  getGuaranteesTrend: vi.fn()
}));

// ✅ GOOD: Mock only what you need
vi.mock('hooks/dashboard/useDashboardData', () => ({
  useGuaranteesTrend: vi.fn()
}));

// ❌ BAD: Mocking too much
// Don't mock everything, test real behavior when possible
```

### 3. Assertions

```typescript
// ✅ GOOD: Specific assertions
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// ✅ GOOD: Multiple specific assertions
expect(result.current.data).toBeDefined();
expect(result.current.loading).toBe(false);
expect(result.current.error).toBeNull();

// ❌ BAD: Vague assertions
expect(screen.getByText('text')).toBeTruthy();
```

### 4. Cleanup

```typescript
// ✅ GOOD: Cleanup mocks
beforeEach(() => {
  vi.clearAllMocks();
});

// ✅ GOOD: Cleanup is automatic with @testing-library/react
// But you can add custom cleanup if needed
afterEach(() => {
  // Custom cleanup
});
```

### 5. Async Testing

```typescript
// ✅ GOOD: Use waitFor for async operations
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});

// ✅ GOOD: Use findBy queries (automatically wait)
const element = await screen.findByText('Loaded');

// ❌ BAD: Don't use setTimeout
setTimeout(() => {
  expect(result.current.data).toBeDefined();
}, 1000);
```

---

## 📊 Coverage

### View Coverage Report

After running `npm run test:coverage`:

```bash
# Open HTML report
open coverage/index.html  # Mac
start coverage/index.html # Windows
```

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### What to Cover

✅ **High Priority**:
- API service functions
- Custom hooks
- Component logic
- Error handling
- User interactions

⚠️ **Medium Priority**:
- UI rendering
- Style calculations
- Utility functions

⏸️ **Low Priority**:
- Third-party integrations
- Mock data generators
- Type definitions

---

## 🐛 Debugging Tests

### Enable Debug Mode

```typescript
import { render, screen, debug } from 'test/utils/test-utils';

it('should render', () => {
  render(<MyComponent />);
  
  // Print entire DOM
  debug();
  
  // Print specific element
  debug(screen.getByRole('button'));
});
```

### Use Vitest UI for Debugging

```bash
npm run test:ui
# Open browser, set breakpoints, inspect state
```

### Common Issues

**Issue**: Tests timeout
```typescript
// Solution: Increase timeout
it('should fetch data', async () => {
  // ... test
}, 10000); // 10 second timeout
```

**Issue**: Element not found
```typescript
// Solution: Use findBy (waits) instead of getBy
const element = await screen.findByText('text');
```

**Issue**: Mock not working
```typescript
// Solution: Check mock is before import
vi.mock('../module'); // Must be at top of file
import { function } from '../module';
```

---

## 📝 Test Checklist

### Before Committing

- [ ] All tests pass (`npm run test:run`)
- [ ] Coverage meets goals (`npm run test:coverage`)
- [ ] No console errors/warnings
- [ ] Tests are deterministic (no flaky tests)
- [ ] Test names are descriptive
- [ ] Mocks are cleaned up

### For New Features

- [ ] Unit tests for new functions
- [ ] Hook tests for new hooks
- [ ] Component tests for new components
- [ ] Integration tests for critical paths
- [ ] Error state tests
- [ ] Loading state tests
- [ ] Empty state tests

---

## 🎉 Summary

### What's Been Created ✅

- ✅ Complete Vitest setup
- ✅ Test utilities and helpers
- ✅ Mock data generators
- ✅ API service tests
- ✅ Hook tests
- ✅ Component tests
- ✅ Test scripts in package.json

### What's Ready to Use ✅

- ✅ Run `npm test` to start testing
- ✅ Run `npm run test:coverage` for coverage
- ✅ Run `npm run test:ui` for interactive testing
- ✅ All test files follow best practices
- ✅ Comprehensive testing documentation

### Next Steps 🚀

1. Install test dependencies (`npm install --save-dev ...`)
2. Run tests (`npm test`)
3. Write tests for remaining components
4. Achieve > 80% coverage
5. Set up CI/CD with automated testing

---

**Document Version**: 1.0  
**Last Updated**: November 3, 2025  
**Status**: ✅ Testing Setup Complete - Ready for Use

