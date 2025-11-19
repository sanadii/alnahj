# User Management

User authentication, registration, and profile management system.

## Overview

The User Management module handles all user-related functionality including:
- User registration
- User authentication (login/logout)
- User profile management
- Password management

## Features

### ✅ Implemented
- User registration with email validation
- Login with email and password
- JWT-based authentication
- User profile viewing
- User profile editing

### 🔄 In Progress
- Password reset functionality
- Email verification
- Multi-factor authentication (MFA)

### ⏳ Planned
- Social authentication (Google, GitHub)
- User roles and permissions
- Account deactivation

## API Endpoints

See [API Reference](api.md) for detailed endpoint documentation.

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
POST   /api/auth/refresh      # Refresh access token
```

### User Profile
```
GET    /api/users/me          # Get current user profile
PATCH  /api/users/me          # Update current user profile
GET    /api/users/:id         # Get user by ID (admin)
```

### Password Management
```
POST   /api/auth/forgot-password     # Request password reset
POST   /api/auth/reset-password      # Reset password with token
POST   /api/auth/change-password     # Change password (authenticated)
```

## Data Model

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

See [Data Models](../../database/schema.md) for database schema.

## Authentication Flow

### Registration
1. User submits registration form
2. Backend validates email and password
3. Password is hashed
4. User record created in database
5. Verification email sent
6. User redirected to login

### Login
1. User submits email and password
2. Backend validates credentials
3. JWT tokens generated (access + refresh)
4. Tokens returned to client
5. Client stores tokens
6. User redirected to dashboard

### Authentication
1. Client includes access token in requests
2. Backend validates token
3. User identity extracted from token
4. Request processed with user context

### Token Refresh
1. Access token expires
2. Client uses refresh token
3. New access token generated
4. Seamless user experience

## Security

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Password Storage
- Passwords hashed using bcrypt
- Salt rounds: 12
- Never stored in plain text

### Token Security
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Tokens signed with secret key
- Refresh tokens stored securely

### Protection
- CSRF protection enabled
- XSS prevention
- Rate limiting on auth endpoints
- Account lockout after failed attempts

See [Security Documentation](../../security/) for more details.

## Frontend Implementation

### Components
```
src/features/auth/
├── Login.tsx              # Login page
├── Register.tsx           # Registration page
├── ForgotPassword.tsx     # Password reset request
├── ResetPassword.tsx      # Password reset with token
└── Profile.tsx            # User profile page
```

### State Management
```
store/auth/
├── actions.ts             # Auth actions
├── reducer.ts             # Auth reducer
├── selectors.ts           # Auth selectors
└── types.ts               # TypeScript types
```

### Protected Routes
```typescript
<ProtectedRoute path="/dashboard">
  <Dashboard />
</ProtectedRoute>
```

## Backend Implementation

### Controllers
```
controllers/
├── auth.controller.ts     # Authentication logic
└── users.controller.ts    # User management logic
```

### Services
```
services/
├── auth.service.ts        # Auth business logic
├── user.service.ts        # User business logic
└── email.service.ts       # Email sending
```

### Middleware
```
middleware/
├── auth.middleware.ts     # Verify JWT
├── validate.middleware.ts # Validate requests
└── ratelimit.middleware.ts # Rate limiting
```

## Testing

### Unit Tests
- User model validation
- Password hashing
- Token generation
- Business logic

### Integration Tests
- Registration flow
- Login flow
- Profile update flow
- Password reset flow

### E2E Tests
- Complete user journey
- Error scenarios
- Edge cases

See [Testing Guide](testing.md) for test details.

## Common Issues

### Login Fails
- Check email and password
- Verify account is active
- Check email verification status
- Review rate limiting

### Token Expired
- Use refresh token
- Re-login if refresh fails
- Check token expiry settings

### Registration Fails
- Email already exists
- Password doesn't meet requirements
- Invalid email format
- Server validation errors

## Related Documentation

- [API Reference](api.md) - Detailed API documentation
- [Authentication](authentication.md) - Authentication deep dive
- [Profile Management](profiles.md) - Profile features
- [Security](../../security/) - Security practices
- [Testing](testing.md) - Testing guide

---

**Status**: ✅ Core features implemented  
**Last Updated**: October 24, 2025

