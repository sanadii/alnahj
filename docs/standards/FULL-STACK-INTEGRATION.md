# Frontend-Backend Integration Guide

**Election Management System - Full Stack Integration**

**Last Updated:** October 27, 2025

---

## Overview

This document explains how the frontend and backend work together in the Election Management System, ensuring both teams follow compatible standards and practices.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + TypeScript + Material-UI + Vite                   │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │ Components │  │   Hooks    │  │  Services  │          │
│  │  (Views)   │─▶│  (useApi)  │─▶│   (Axios)  │          │
│  └────────────┘  └────────────┘  └────────────┘          │
│                                         │                   │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                     HTTP/JSON
                                     JWT Auth
                                          │
┌─────────────────────────────────────────┼───────────────────┐
│                                         ▼                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  ViewSets  │◀─│Serializers │◀─│   Models   │          │
│  │    (API)   │  │(Validation)│  │ (Database) │          │
│  └────────────┘  └────────────┘  └────────────┘          │
│                                                             │
│  Django REST Framework + PostgreSQL                        │
│                         Backend                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Communication Standards

### Response Format (Backend → Frontend)

**All backend responses use this format**:

```typescript
interface APIResponse<T> {
  status: 'success' | 'error';
  data: T | null;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    request_id: string;
    pagination?: {
      count: number;
      next: string | null;
      previous: string | null;
    };
  };
}
```

**Backend Implementation** (Python/Django):
```python
# backend/apps/utils/responses.py
class APIResponse:
    @staticmethod
    def success(data, message=None):
        return Response({
            'status': 'success',
            'data': data,
            'message': message,
            'meta': {
                'timestamp': timezone.now().isoformat(),
                'request_id': str(uuid.uuid4())
            }
        })
```

**Frontend Usage** (TypeScript/React):
```typescript
// frontend/src/api/services/elections.service.ts
async getCurrent(): Promise<APIResponse<Election>> {
  const response = await apiClient.get('/elections/current/');
  return response.data; // Already in APIResponse format
}

// frontend/src/views/elections/CurrentElection.tsx
const { data, loading, error } = useApi(() => electionsService.getCurrent());
```

---

## 🔐 Authentication Flow

### 1. Login

**Frontend**:
```typescript
// POST /api/auth/login/
const response = await authService.login(email, password);

// Store tokens
localStorage.setItem('access_token', response.data.access);
localStorage.setItem('refresh_token', response.data.refresh);
```

**Backend**:
```python
# Returns JWT tokens + user data
{
  "status": "success",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "ADMIN"
    }
  }
}
```

### 2. Authenticated Requests

**Frontend** (Automatic via Axios Interceptor):
```typescript
// Interceptor adds token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Backend** (Validates Token):
```python
# DRF Simple JWT automatically validates
@permission_classes([IsAuthenticated])
class MyViewSet(ViewSet):
    # request.user is automatically populated
    pass
```

### 3. Token Refresh

**Frontend** (Automatic on 401):
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto-refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh/', { refresh: refreshToken });
      localStorage.setItem('access_token', response.data.data.access);
      
      // Retry original request
      return apiClient(originalRequest);
    }
  }
);
```

---

## 🗂️ Data Models Mapping

### Election Model

**Backend** (Python):
```python
# backend/apps/elections/models.py
class Election(models.Model):
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    election_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
```

**Frontend** (TypeScript):
```typescript
// frontend/src/types/models.ts
export interface Election {
  id: number;
  name: string;
  status: ElectionStatus;
  election_date: string; // ISO date string
  created_at: string;    // ISO datetime string
}

export type ElectionStatus = 
  | 'SETUP' 
  | 'GUARANTEE_PHASE' 
  | 'VOTING_DAY' 
  | 'COUNTING' 
  | 'CLOSED';
```

**Key Points**:
- ✅ Backend dates → Frontend ISO strings
- ✅ Backend enums → Frontend literal types
- ✅ Field names match exactly (snake_case in both)
- ✅ Serializer output = TypeScript interface

---

## 🔄 CRUD Operations Flow

### Create Operation

**Frontend**:
```typescript
// 1. User submits form
const formData: Partial<Election> = {
  name: 'New Election',
  status: 'SETUP',
  election_date: '2025-11-01',
};

// 2. Call API service
const response = await electionsService.create(formData);

// 3. Handle response
if (response.status === 'success') {
  toast.success('Election created!');
  navigate(`/elections/${response.data.id}`);
}
```

**Backend**:
```python
# 1. ViewSet receives request
@StandardResponseMixin
class ElectionViewSet(ModelViewSet):
    def create(self, request):
        # 2. Serializer validates
        serializer = ElectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 3. Save to database
        election = serializer.save(created_by=request.user)
        
        # 4. Return response (automatic via StandardResponseMixin)
        return APIResponse.created(
            data=ElectionSerializer(election).data,
            message='Election created successfully'
        )
```

### Read Operation

**Frontend**:
```typescript
// Use custom hook
const { data: elections, loading, error } = useApi(
  () => electionsService.getAll()
);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorAlert error={error} />;
return <ElectionsList elections={elections} />;
```

**Backend**:
```python
# Automatic via StandardResponseMixin
class ElectionViewSet(StandardResponseMixin, ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    # list() method automatically wraps response in APIResponse
```

---

## 📍 API Endpoints Mapping

### Current Endpoints (October 2025)

| Resource | Frontend Service | Backend ViewSet | URL |
|----------|-----------------|-----------------|-----|
| Elections | `electionsService` | `ElectionViewSet` | `/api/elections/` |
| Electors | `electorsService` | `ElectorViewSet` | `/api/electors/` |
| Candidates | `candidatesService` | `CandidateViewSet` | `/api/candidates/` |
| Parties | `candidatesService.getParties()` | `PartyViewSet` | `/api/candidates/parties/` |
| Attendees | `attendeesService` | `AttendanceViewSet` | `/api/attendees/` |
| Guarantees | `guaranteesService` | `GuaranteeViewSet` | `/api/guarantees/` |
| Voting | `votingService` | `VoteCountViewSet` | `/api/voting/vote-counts/` |
| Reports | `reportsService` | `DashboardViewSet` | `/api/reports/dashboard/` |

---

## ✅ Validation Flow

### Frontend Validation (First Line of Defense)

```typescript
// Using Yup + React Hook Form
const schema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(3, 'Minimum 3 characters'),
  election_date: yup.date()
    .required('Date is required')
    .min(new Date(), 'Must be future date'),
}).required();

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

### Backend Validation (Authoritative)

```python
# Using DRF Serializers
class ElectionSerializer(serializers.ModelSerializer):
    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError('Minimum 3 characters')
        return value
    
    def validate_election_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError('Must be future date')
        return value
```

**Key Principle**: 
- Frontend validation = **User Experience** (immediate feedback)
- Backend validation = **Security** (authoritative, never bypass)

---

## 🔒 Permission Handling

### Backend Permissions

```python
# Backend defines who can do what
class ElectionViewSet(StandardResponseMixin, ModelViewSet):
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrAbove()]
        return [IsAuthenticated()]
```

### Frontend Permission Checks

```typescript
// Frontend respects backend permissions
function CreateElectionButton() {
  const { user } = useAuth();
  
  // Hide button if not admin
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return null;
  }
  
  return <Button onClick={handleCreate}>Create Election</Button>;
}
```

**Important**: 
- Frontend hides UI elements for better UX
- Backend enforces permissions (security)
- Never rely on frontend permission checks alone

---

## 🚨 Error Handling

### Backend Error Response

```python
# Backend returns structured errors
{
  "status": "error",
  "data": null,
  "message": "Validation failed",
  "errors": {
    "name": ["This field is required"],
    "election_date": ["Must be future date"]
  }
}
```

### Frontend Error Handling

```typescript
try {
  await electionsService.create(data);
} catch (error: any) {
  const apiError = error.response?.data;
  
  if (apiError?.errors) {
    // Field-specific errors
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      setError(field, { message: messages[0] });
    });
  } else {
    // General error
    toast.error(apiError?.message || 'An error occurred');
  }
}
```

---

## 📊 Pagination Handling

### Backend Pagination

```python
# Automatic via StandardResponseMixin
{
  "status": "success",
  "data": [...],  # Array of items
  "meta": {
    "pagination": {
      "count": 100,
      "next": "http://api/elections/?page=2",
      "previous": null
    }
  }
}
```

### Frontend Pagination

```typescript
function ElectionsList() {
  const [page, setPage] = useState(1);
  
  const { data, loading } = useApi(
    () => electionsService.getAll({ page }),
    [page]
  );
  
  return (
    <>
      <List items={data?.data} />
      <Pagination
        count={Math.ceil((data?.meta?.pagination?.count || 0) / 25)}
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </>
  );
}
```

---

## 🧪 Testing Integration

### Backend API Tests

```python
# backend/apps/elections/tests/test_views.py
def test_create_election_success(self):
    data = {
        'name': 'Test Election',
        'status': 'SETUP',
        'election_date': '2025-11-01'
    }
    response = self.client.post('/api/elections/', data)
    
    self.assertEqual(response.status_code, 201)
    self.assertEqual(response.data['status'], 'success')
    self.assertEqual(response.data['data']['name'], 'Test Election')
```

### Frontend API Integration Tests

```typescript
// frontend/src/api/services/__tests__/elections.service.test.ts
describe('ElectionsService', () => {
  it('creates election successfully', async () => {
    const mockData = { name: 'Test Election', status: 'SETUP' };
    
    mock.onPost('/elections/').reply(201, {
      status: 'success',
      data: { id: 1, ...mockData },
    });
    
    const response = await electionsService.create(mockData);
    
    expect(response.status).toBe('success');
    expect(response.data.name).toBe('Test Election');
  });
});
```

---

## 📋 Development Checklist

### Adding New Feature (Full Stack)

#### Backend Tasks
1. [ ] Create/update model
2. [ ] Create migration
3. [ ] Create serializer
4. [ ] Create ViewSet with StandardResponseMixin
5. [ ] Add URL route
6. [ ] Add permissions
7. [ ] Write tests
8. [ ] Document in BACKEND-STANDARDIZATION-GUIDE.md

#### Frontend Tasks
1. [ ] Create TypeScript interface matching model
2. [ ] Create API service class
3. [ ] Create custom hook (if needed)
4. [ ] Create components
5. [ ] Add form validation
6. [ ] Handle loading/error/empty states
7. [ ] Write tests
8. [ ] Document in COMPONENT-LIBRARY.md

#### Integration Testing
1. [ ] Test API communication
2. [ ] Verify error handling
3. [ ] Check permission enforcement
4. [ ] Test edge cases
5. [ ] Verify responsive design

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: CORS Errors

**Symptom**: Browser blocks API requests

**Backend Fix**:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
]
```

**Frontend Check**:
```typescript
// Ensure correct base URL
VITE_API_BASE_URL=http://localhost:8000/api
```

#### Issue: 401 Unauthorized

**Cause**: Token expired or invalid

**Frontend Solution**: Token refresh interceptor (already implemented)

**Backend Check**: Verify JWT settings

#### Issue: Type Mismatch

**Symptom**: TypeScript errors with API data

**Solution**: Ensure TypeScript interfaces match backend serializers exactly

---

## 📖 Reference Documentation

### Backend
- **[Backend Standardization Guide](../backend/docs/BACKEND-STANDARDIZATION-GUIDE.md)**
- **[Backend API Structure](../backend/docs/APP-STRUCTURE.md)**
- **[Standardization Audit](../backend/docs/STANDARDIZATION-AUDIT-REPORT.md)**

### Frontend
- **[Frontend Standardization Guide](./frontend/FRONTEND-STANDARDIZATION-GUIDE.md)**
- **[API Integration Guide](./frontend/API-INTEGRATION-GUIDE.md)**
- **[Component Library](./frontend/COMPONENT-LIBRARY.md)**

---

## ✅ Success Criteria

Your frontend-backend integration is successful when:

- ✅ All API calls use correct endpoints (plural: `/elections/`, `/attendees/`)
- ✅ All responses match APIResponse format
- ✅ TypeScript types match backend models
- ✅ Authentication flows work smoothly
- ✅ Errors are handled gracefully on both sides
- ✅ Validation works on both frontend and backend
- ✅ Permissions are enforced consistently
- ✅ No CORS issues
- ✅ All tests pass

---

**Maintained by**: Full Stack Team  
**Last Updated**: October 27, 2025  
**Status**: ✅ Standards Established

