# Integration Documentation
## Election Management System - Cross-Cutting Patterns

**Status:** ✅ Complete Integration Patterns  
**Last Updated:** October 31, 2025

---

## 🚀 Quick Navigation

| Document | Purpose | Lines | For |
|----------|---------|-------|-----|
| **[API Integration](API-INTEGRATION.md)** | API layer patterns | 646 | Frontend devs |
| **[Full-Stack Integration](FULL-STACK-INTEGRATION.md)** | End-to-end patterns | 612 | Full-stack devs |

---

## 📚 What's Here?

This folder contains **cross-cutting documentation** that spans both frontend and backend:

- 🔌 **API Integration** - How frontend connects to backend
- 🔄 **Full-Stack Patterns** - End-to-end data flow
- 🤝 **Communication Patterns** - Frontend ↔ Backend interaction

---

## 🎯 Domain-Specific Documentation

**Standards have moved to their domain folders:**

### Backend Standards
**Location:** [`../backend/STANDARDS.md`](../backend/STANDARDS.md)

**What's There:**
- API Response Format
- ViewSet Architecture
- URL Conventions
- Serializers & Models
- Permissions & Security

**For:** Backend developers using Django/DRF

---

### Frontend Standards
**Location:** [`../frontend/STANDARDS.md`](../frontend/STANDARDS.md)

**What's There:**
- Component Patterns
- State Management
- TypeScript Usage
- Form Handling
- Error Boundaries

**For:** Frontend developers using React/TypeScript

---

## 📖 Integration Documentation

### 1. API Integration

**File:** [`API-INTEGRATION.md`](API-INTEGRATION.md)

**What's Inside:**
- Service Layer Pattern
- API Client Configuration
- Request/Response Handling
- Authentication & Tokens
- Error Handling
- Custom Hooks
- Type Safety

**Use When:**
- Frontend integrating with backend
- Creating API services
- Implementing custom hooks
- Handling authentication

---

### 2. Full-Stack Integration

**File:** [`FULL-STACK-INTEGRATION.md`](FULL-STACK-INTEGRATION.md)

**What's Inside:**
- Frontend ↔ Backend Communication
- Complete Data Flow
- Type Consistency
- Error Propagation
- Authentication Flow
- Best Practices
- Common Patterns

**Use When:**
- Understanding end-to-end flow
- Ensuring type consistency
- Debugging integration issues
- Planning new features

---

## 🎯 When to Use This Folder

### Use Integration Docs For:

✅ **API Layer** - Frontend calling backend  
✅ **Data Flow** - Frontend → Backend → Frontend  
✅ **Authentication** - JWT token flow  
✅ **Error Handling** - Cross-layer errors  
✅ **Type Consistency** - Shared types/interfaces

### Use Domain Docs For:

🔙 **Backend-Specific** → [`../backend/`](../backend/)
- Django patterns
- Database models
- Backend standards
- API design

🎨 **Frontend-Specific** → [`../frontend/`](../frontend/)
- React patterns
- Component design
- Frontend standards
- UI/UX patterns

---

## 🔑 Key Integration Patterns

### Service Layer Pattern

```typescript
// frontend/src/api/services/myService.ts
import { apiClient } from '../apiClient';
import { MyModel } from '../types';

class MyService {
  async getAll(): Promise<APIResponse<MyModel[]>> {
    const response = await apiClient.get('/api/my-models/');
    return response.data;
  }
}

export const myService = new MyService();
```

### Custom Hook Pattern

```typescript
// frontend/src/hooks/useMyData.ts
import { useState, useEffect } from 'react';
import { myService } from '../api/services/myService';

export const useMyData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await myService.getAll();
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
```

### Backend API Response

```python
# backend/apps/myapp/views.py
from apps.utils.responses import APIResponse
from apps.utils.viewsets import StandardResponseMixin

class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """API endpoints for MyModel."""
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    
    # StandardResponseMixin automatically wraps responses
    # in APIResponse format
```

---

## 📊 Integration Flow

### Complete Request Flow

```
Frontend Component
    ↓
Custom Hook (useMyData)
    ↓
Service Layer (myService.getAll)
    ↓
API Client (axios)
    ↓ HTTP Request
Backend ViewSet
    ↓
StandardResponseMixin
    ↓
Serializer
    ↓
Database
    ↓ HTTP Response (APIResponse format)
API Client
    ↓
Service Layer
    ↓
Custom Hook
    ↓
Frontend Component (Update UI)
```

---

## 🛠️ Development Workflow

### Building Integrated Features

**1. Backend First:**
- Design models (see [`../backend/STANDARDS.md`](../backend/STANDARDS.md))
- Create ViewSets
- Test with API client

**2. Types & Interfaces:**
- Define TypeScript types
- Match backend response format
- Ensure consistency

**3. Frontend Integration:**
- Create service layer
- Build custom hooks
- Develop components

**4. Testing:**
- Test API endpoints
- Test frontend components
- Test end-to-end flow

---

## 📖 Related Documentation

### Domain Documentation
- [`../backend/`](../backend/) - Backend documentation
- [`../frontend/`](../frontend/) - Frontend documentation

### Project Documentation
- [`../INDEX.md`](../INDEX.md) - Main navigation
- [`../getting-started/`](../getting-started/) - Onboarding
- [`../reference/`](../reference/) - Quick references

---

## ✅ Integration Standards

### API Communication

✅ **Use service layer** - Don't call APIs directly from components  
✅ **Use custom hooks** - Encapsulate data fetching logic  
✅ **Handle errors** - Catch and display errors gracefully  
✅ **Type everything** - Use TypeScript for type safety  
✅ **Follow conventions** - camelCase frontend, snake_case backend

### Authentication

✅ **Use JWT tokens** - Access + refresh tokens  
✅ **Auto-refresh** - Implement automatic token refresh  
✅ **Interceptors** - Use axios interceptors for auth  
✅ **Secure storage** - Store tokens securely  
✅ **Handle expiry** - Graceful token expiration handling

---

## 🚨 Common Issues

### Issue 1: Type Mismatches
**Problem:** Frontend types don't match backend response  
**Solution:** Check [`FULL-STACK-INTEGRATION.md`](FULL-STACK-INTEGRATION.md#type-consistency)

### Issue 2: Authentication Errors
**Problem:** Token expiry or refresh issues  
**Solution:** Check [`API-INTEGRATION.md`](API-INTEGRATION.md#authentication)

### Issue 3: Error Handling
**Problem:** Errors not propagating correctly  
**Solution:** Check [`FULL-STACK-INTEGRATION.md`](FULL-STACK-INTEGRATION.md#error-handling)

### Issue 4: camelCase vs snake_case
**Problem:** Field name conversion issues  
**Solution:** Check [`../backend/API-CONVENTIONS.md`](../backend/API-CONVENTIONS.md)

---

## 📞 Questions?

**API Integration:**
- Check [`API-INTEGRATION.md`](API-INTEGRATION.md)
- Review service layer examples
- Ask integration team

**Full-Stack Flow:**
- Check [`FULL-STACK-INTEGRATION.md`](FULL-STACK-INTEGRATION.md)
- Review data flow diagram
- Pair programming

**Backend-Specific:**
- Check [`../backend/`](../backend/)
- Ask backend team

**Frontend-Specific:**
- Check [`../frontend/`](../frontend/)
- Ask frontend team

---

## 🎓 Learning Path

**Beginner:**
1. Understand backend API format
2. Learn service layer pattern
3. Build simple API calls

**Intermediate:**
4. Create custom hooks
5. Handle complex data flows
6. Implement authentication

**Advanced:**
7. Optimize performance
8. Handle edge cases
9. Design new patterns

---

**Integration Team Contact:** Development Team  
**Last Updated:** October 31, 2025  
**Status:** ✅ **Complete Integration Patterns**

---

**Remember: This folder is for cross-cutting patterns only. Domain-specific docs are in their respective folders!** 🎯

