# Testing Documentation

Testing strategies, test cases, and quality assurance.

## Overview

Comprehensive testing strategy ensuring code quality and reliability.

## Contents

- [Strategy](strategy.md) - Testing strategy overview
- [Unit Testing](unit-testing.md) - Unit test guidelines
- [Integration Testing](integration-testing.md) - Integration tests
- [E2E Testing](e2e-testing.md) - End-to-end tests
- [Coverage](coverage.md) - Test coverage standards

## Testing Stack

### Backend
- **Framework**: [Jest/Pytest/Go Test]
- **Mocking**: [Jest/unittest.mock/testify]
- **Coverage**: [Jest/pytest-cov]

### Frontend
- **Framework**: [Jest/Vitest]
- **React Testing**: [React Testing Library]
- **E2E**: [Cypress/Playwright]

## Testing Pyramid

```
        /\
       /E2E\         Few, slow, expensive
      /______\
     /        \
    /Integration\    Moderate quantity
   /_____________\
  /               \
 /  Unit Tests     \ Many, fast, cheap
/___________________\
```

### Distribution
- **Unit Tests**: 70%
- **Integration Tests**: 20%
- **E2E Tests**: 10%

## Unit Testing

### Guidelines

```typescript
describe('User Service', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      const user = await userService.create(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // hashed
    });
    
    it('should throw error with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!'
      };
      
      await expect(userService.create(userData))
        .rejects
        .toThrow('Invalid email format');
    });
  });
});
```

### Best Practices
- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Arrange-Act-Assert pattern
- ✅ Mock external dependencies
- ✅ Test edge cases

## Integration Testing

### API Testing

```typescript
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
  
  it('should return 401 with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
```

### Database Testing

```typescript
describe('User Model', () => {
  beforeEach(async () => {
    await database.clear();
  });
  
  it('should create user in database', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'hashed'
    });
    
    const found = await User.findById(user.id);
    expect(found).toBeDefined();
    expect(found.email).toBe(user.email);
  });
});
```

## E2E Testing

### User Flows

```typescript
describe('User Registration Flow', () => {
  it('should complete registration successfully', () => {
    cy.visit('/register');
    
    // Fill form
    cy.get('[data-testid="email-input"]')
      .type('newuser@example.com');
    cy.get('[data-testid="password-input"]')
      .type('Password123!');
    cy.get('[data-testid="confirm-password-input"]')
      .type('Password123!');
    
    // Submit
    cy.get('[data-testid="register-button"]').click();
    
    // Verify success
    cy.url().should('include', '/login');
    cy.contains('Registration successful').should('be.visible');
  });
});
```

### Best Practices
- ✅ Test critical user journeys
- ✅ Use data-testid attributes
- ✅ Keep tests independent
- ✅ Clean up after tests
- ✅ Use fixtures for test data

## Test Coverage

### Coverage Goals

- **Overall**: > 80%
- **Critical Paths**: 100%
- **Business Logic**: 100%
- **Utilities**: > 90%
- **Components**: > 80%

### Measuring Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

### Coverage Report

```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
All files           |   85.5  |   82.3   |   88.1  |   85.8
 services/          |   92.1  |   89.4   |   95.2  |   92.3
  auth.service.ts   |   95.0  |   91.2   |   100   |   95.1
  user.service.ts   |   89.2  |   87.6   |   90.4  |   89.4
```

## Testing Strategy

### What to Test

#### Always Test
- ✅ Business logic
- ✅ API endpoints
- ✅ Data validation
- ✅ Error handling
- ✅ Edge cases

#### Consider Testing
- 🤔 UI components
- 🤔 Utility functions
- 🤔 Configuration

#### Don't Test
- ❌ Third-party libraries
- ❌ Framework code
- ❌ Simple getters/setters

### Test Organization

```
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── user-flows/
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Tests
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Watch mode
npm run test:watch

# Specific file
npm test -- user.test.ts
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test:ci
      - run: npm run test:coverage
```

## Mocking

### API Mocking

```typescript
jest.mock('../api/users', () => ({
  getUsers: jest.fn(() => Promise.resolve([
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' }
  ]))
}));
```

### Database Mocking

```typescript
beforeEach(() => {
  jest.spyOn(database, 'query').mockResolvedValue({
    rows: [{ id: 1, email: 'test@example.com' }]
  });
});
```

## Best Practices

### General
- ✅ Write tests first (TDD)
- ✅ Keep tests simple
- ✅ One assertion per test (when possible)
- ✅ Use descriptive names
- ✅ Avoid test interdependence

### Performance
- ✅ Parallelize tests
- ✅ Mock external services
- ✅ Use in-memory databases for tests
- ✅ Clean up after tests

### Maintenance
- ✅ Keep tests DRY
- ✅ Use test utilities
- ✅ Update tests with code
- ✅ Remove obsolete tests

## Debugging Tests

### Failed Tests
```bash
# Run with verbose output
npm test -- --verbose

# Run single test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Common Issues
- Test order dependency
- Async timing issues
- Mock not working
- Database not cleaned
- Environment variables

## Related Documentation

- [Backend Testing](../backend/)
- [Frontend Testing](../frontend/)
- [Security Testing](../security/security-testing.md)

---

**Last Updated**: October 24, 2025  
**Coverage Goal**: 80%+

