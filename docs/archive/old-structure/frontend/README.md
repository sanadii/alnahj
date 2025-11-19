# Frontend Documentation Hub

**Election Management System - React + TypeScript Frontend**

---

## 📌 About This Documentation

**Purpose**: Complete frontend development documentation, standards, patterns, and best practices for the Election Management System frontend built with React, TypeScript, and Material-UI.

**Looking for backend docs?** → [`../../backend/docs/`](../../backend/docs/)

---

## 🎯 Quick Navigation

### For New Frontend Developers

1. **[Frontend Standardization Guide](./FRONTEND-STANDARDIZATION-GUIDE.md)** ⭐ **START HERE**
   - Complete guide to frontend code standards and patterns
   - API integration standards (including October 2025 updates)
   - Component patterns and best practices
   - TypeScript standards
   - State management patterns

2. **[API Integration Guide](./API-INTEGRATION-GUIDE.md)** 🔗
   - How to integrate with backend APIs
   - Service layer patterns
   - Custom hooks for data fetching
   - Error handling
   - **IMPORTANT**: Updated endpoint information (elections, attendees)

3. **[Component Library](./COMPONENT-LIBRARY.md)** 🎨
   - Catalog of all reusable components
   - Usage examples and props documentation
   - Layout components
   - Feature-specific components

---

## 🚨 Important Updates (October 2025)

### Backend API Endpoint Changes

The backend has been refactored with pluralized endpoints. **All frontend code must be updated**:

| Component | Old Endpoint | New Endpoint | Status |
|-----------|--------------|--------------|--------|
| Elections | `/api/election/` | `/api/elections/` | ⚠️ **Update Required** |
| Attendees | `/api/attendance/` | `/api/attendees/` | ⚠️ **Update Required** |
| Candidates | `/api/candidates/` | `/api/candidates/` | ✅ Already Correct |
| Electors | `/api/electors/` | `/api/electors/` | ✅ Already Correct |

**See**: [`API-INTEGRATION-GUIDE.md`](./API-INTEGRATION-GUIDE.md) for migration details

---

## 🏗️ Frontend Architecture

### Tech Stack

- **React**: 18.x with Hooks
- **TypeScript**: 5.x for type safety
- **Material-UI (MUI)**: v5 for UI components
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Form Management**: React Hook Form + Yup validation
- **Build Tool**: Vite for fast development

### Project Structure

```
frontend/src/
├── api/                      # API integration layer
│   ├── client.ts            # Axios configuration
│   ├── endpoints.ts         # API endpoint constants
│   └── services/            # Service classes per resource
│       ├── elections.service.ts
│       ├── electors.service.ts
│       ├── candidates.service.ts
│       ├── attendees.service.ts
│       └── ...
│
├── components/              # React components
│   ├── common/             # Shared components (Button, Card, Modal)
│   ├── layout/             # Layout components (Header, Sidebar, Footer)
│   └── features/           # Feature-specific components
│       ├── elections/
│       ├── electors/
│       ├── candidates/
│       └── ...
│
├── views/                   # Page-level components
│   ├── elections/
│   │   ├── CurrentElection.tsx
│   │   ├── ElectionsList.tsx
│   │   └── CommitteesView.tsx
│   ├── dashboard/
│   └── ...
│
├── hooks/                   # Custom React hooks
│   ├── useApi.ts           # Data fetching hook
│   ├── useMutation.ts      # Data mutation hook
│   ├── useAuth.ts          # Authentication hook
│   └── ...
│
├── contexts/                # React Context providers
│   ├── AuthContext.tsx
│   └── ...
│
├── types/                   # TypeScript type definitions
│   ├── models.ts           # Data models
│   ├── api.types.ts        # API response types
│   └── ...
│
├── utils/                   # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── ...
│
├── theme/                   # MUI theme configuration
│   └── theme.ts
│
└── assets/                  # Static assets
    ├── images/
    └── icons/
```

---

## 🚀 Quick Start

### Development Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Configure environment
cp .env.example .env
# Edit .env with your backend URL

# 4. Start development server
npm run dev
# or
yarn dev

# Server runs at: http://localhost:5173
```

### Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Election Management System
```

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting errors
npm run format           # Format with Prettier

# Testing
npm run test             # Run tests
npm run test:coverage    # Run with coverage
npm run test:watch       # Watch mode
```

---

## 📚 Documentation Files

### Core Guides

1. **FRONTEND-STANDARDIZATION-GUIDE.md** (Main Reference)
   - API integration standards
   - Component patterns
   - State management
   - TypeScript standards
   - Styling standards
   - Form handling
   - Error handling
   - Testing standards
   - Best practices

2. **API-INTEGRATION-GUIDE.md** (API Layer)
   - API client setup
   - Service layer pattern
   - Service implementations for all resources
   - Custom hooks (useApi, useMutation)
   - Error handling
   - Migration guide for new endpoints

3. **COMPONENT-LIBRARY.md** (Components Reference)
   - Common components (Button, Card, Modal, etc.)
   - Feature components (Elections, Electors, Candidates, etc.)
   - Layout components
   - Loading/Error/Empty states
   - Usage examples and props documentation

---

## 🎨 Component Standards

### Component Structure

All components should follow this structure:

```typescript
/**
 * ComponentName - Brief description
 * 
 * @component
 * @example
 * ```tsx
 * <ComponentName prop1={value1} prop2={value2} />
 * ```
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  ...rest
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render helpers
  
  return (
    // JSX
  );
};
```

### TypeScript Standards

- ✅ **All** components must have TypeScript interfaces for props
- ✅ **All** API responses must be properly typed
- ✅ **All** functions must have return type annotations
- ✅ Use `interface` for object types
- ✅ Use `type` for unions and utility types

---

## 🔗 API Integration

### Standard Pattern

```typescript
// 1. Define service
class ElectionsService {
  private basePath = '/elections';  // Plural!
  
  async getCurrent(): Promise<APIResponse<Election>> {
    const response = await apiClient.get(`${this.basePath}/current/`);
    return response.data;
  }
}

// 2. Use in component with custom hook
function CurrentElection() {
  const { data, loading, error } = useApi(
    () => electionsService.getCurrent()
  );
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!data) return <EmptyState title="No election" />;
  
  return <ElectionCard election={data} />;
}
```

---

## 🧪 Testing Standards

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ElectionCard } from './ElectionCard';

describe('ElectionCard', () => {
  it('renders election data', () => {
    render(<ElectionCard election={mockElection} />);
    expect(screen.getByText('Test Election')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ElectionCard election={mockElection} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## 📊 Code Quality Standards

### Linting & Formatting

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Code Review Checklist

- [ ] TypeScript types defined for all props and data
- [ ] Components documented with JSDoc
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Responsive design checked
- [ ] Accessibility (a11y) verified
- [ ] Tests written and passing
- [ ] No console.log() in production code
- [ ] API endpoints use new plural format
- [ ] Form validation implemented

---

## ✅ Migration Tasks (October 2025)

### Update API Endpoints

**Priority: HIGH** - Required for system functionality

#### Tasks:
1. [ ] Update `src/api/services/elections.service.ts`
   - Change basePath from `/election` to `/elections`
   
2. [ ] Update `src/api/services/attendees.service.ts`
   - Change basePath from `/attendance` to `/attendees`
   
3. [ ] Update `src/api/endpoints.ts`
   - Replace all `/election` with `/elections`
   - Replace all `/attendance` with `/attendees`
   
4. [ ] Search and replace across codebase
   - Find: `/api/election/` → Replace: `/api/elections/`
   - Find: `/api/attendance/` → Replace: `/api/attendees/`
   
5. [ ] Update tests to use new endpoints
   
6. [ ] Test all API integrations:
   - [ ] Elections list/detail/create/update
   - [ ] Committees list/detail
   - [ ] Attendance marking
   - [ ] Attendance statistics

**See**: [`API-INTEGRATION-GUIDE.md`](./API-INTEGRATION-GUIDE.md) for detailed migration steps

---

## 🛠️ Development Workflow

### Adding New Features

1. **Plan**
   - Review requirements
   - Check existing patterns
   - Read relevant documentation

2. **Implement**
   - Create/update components
   - Add TypeScript types
   - Implement API integration
   - Handle loading/error states
   - Add form validation

3. **Test**
   - Write unit tests
   - Test manually
   - Check responsive design
   - Verify accessibility

4. **Document**
   - Add JSDoc comments
   - Update COMPONENT-LIBRARY.md if reusable
   - Update API-INTEGRATION-GUIDE.md if new service

5. **Review**
   - Run linter
   - Check code quality
   - Create pull request

---

## 🎯 Best Practices Summary

### Component Design

✅ **DO**:
- Keep components small and focused
- Use functional components with hooks
- Provide TypeScript interfaces for props
- Handle loading, error, and empty states
- Use Material-UI components consistently
- Document complex logic

❌ **DON'T**:
- Create class components
- Put business logic in components
- Forget to handle edge cases
- Use inline styles
- Skip prop validation
- Forget accessibility

### State Management

✅ **DO**:
- Use Context API for global state
- Use custom hooks for data fetching
- Keep state close to where it's used
- Use useCallback and useMemo appropriately

❌ **DON'T**:
- Prop drill excessively
- Put all state in one context
- Forget to memoize expensive operations

---

## 📞 Support & Resources

### Internal Documentation
- **Backend API Docs**: `../../backend/docs/`
- **Backend Standards**: `../../backend/docs/BACKEND-STANDARDIZATION-GUIDE.md`
- **API Response Format**: See backend `APIResponse` class

### External Resources
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Material-UI Docs**: https://mui.com/
- **React Hook Form**: https://react-hook-form.com/
- **React Router**: https://reactrouter.com/

### Getting Help
1. Check this documentation first
2. Review similar components in the codebase
3. Check backend API documentation
4. Ask in team chat
5. Create GitHub issue

---

## 📝 Version History

### v1.0 (October 27, 2025)
- ✅ Initial frontend documentation created
- ✅ Standardization guide established
- ✅ API integration guide with new endpoints
- ✅ Component library documentation
- ✅ Migration guide for October 2025 backend changes

---

## 🤝 Contributing

### Before Submitting PR

1. Read [FRONTEND-STANDARDIZATION-GUIDE.md](./FRONTEND-STANDARDIZATION-GUIDE.md)
2. Follow existing component patterns
3. Add/update TypeScript types
4. Write/update tests
5. Run linter and fix errors
6. Update documentation if needed
7. Test API integration with new endpoints

---

**Maintained by**: Frontend Team  
**Last Updated**: October 27, 2025  
**Status**: ✅ Active Development  
**Backend Coordination**: See `../../backend/docs/` for backend standards

