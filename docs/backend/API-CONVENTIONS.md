# API Conventions & Standards

**Last Updated**: October 28, 2025

## Table of Contents

1. [Overview](#overview)
2. [Field Naming Convention](#field-naming-convention)
3. [Standard Response Format](#standard-response-format)
4. [Request/Response Examples](#requestresponse-examples)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)

---

## Overview

This document outlines the API conventions and standards used across the Election Management System backend. Following these conventions ensures consistency, maintainability, and a better developer experience.

### Key Principles

- ✅ **Consistent Structure**: All responses follow the same format
- ✅ **JavaScript-Friendly**: camelCase for frontend integration
- ✅ **Type-Safe**: Clear data contracts between frontend and backend
- ✅ **Self-Documenting**: Descriptive field names and messages
- ✅ **Error Handling**: Structured error responses

---

## Field Naming Convention

### camelCase for API (Frontend ↔ Backend)

**We use `djangorestframework-camel-case` to automatically convert between:**
- **Frontend/API**: `camelCase` (JavaScript convention)
- **Backend/Database**: `snake_case` (Python convention)

```json
// Frontend sends (camelCase)
{
  "electionDate": "2025-10-31",
  "votingMode": "MIXED",
  "maxCandidatesPerBallot": 15,
  "allowPartialVoting": true
}

// Backend receives and converts to snake_case
{
  "election_date": "2025-10-31",
  "voting_mode": "MIXED",
  "max_candidates_per_ballot": 15,
  "allow_partial_voting": true
}

// Backend responds (converts back to camelCase)
{
  "status": "success",
  "data": {
    "id": 1,
    "electionDate": "2025-10-31",
    "votingMode": "MIXED",
    "maxCandidatesPerBallot": 15,
    "allowPartialVoting": true
  }
}
```

### Why camelCase?

1. **JavaScript Standard**: Frontend developers expect camelCase
2. **Type Safety**: TypeScript interfaces match exactly
3. **Consistency**: No manual transformation needed
4. **Industry Standard**: Common practice for REST APIs consumed by JavaScript

### Backend Implementation

The conversion is handled automatically by Django REST Framework settings:

```python
# backend/core/settings.py
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
}
```

### What Gets Converted?

✅ **Converted**:
- Request body fields
- Response data fields
- Query parameters
- Nested object fields

❌ **NOT Converted**:
- HTTP headers
- URL paths
- File uploads (field names)
- Custom metadata keys (if specified)

---

## Standard Response Format

### Success Response Structure

All successful API responses follow this format:

```typescript
{
  status: "success",           // Status indicator
  data: T,                     // Response data (object, array, or null)
  message?: string,            // Optional user-friendly message
  meta?: {                     // Optional metadata
    timestamp?: string,
    requestId?: string,
    pagination?: {
      count?: number,
      next?: string | null,
      previous?: string | null
    }
  }
}
```

### Error Response Structure

```typescript
{
  status: "error",             // Status indicator
  data: null,                  // Always null for errors
  message: string,             // Error message
  error?: string,              // Technical error details
  errors?: {                   // Field-level validation errors
    [field: string]: string[]
  },
  meta?: {
    timestamp?: string,
    requestId?: string
  }
}
```

---

## Request/Response Examples

### Example 1: Create Election

**Request**:
```http
POST /api/elections/
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Kuwait National Assembly 2025",
  "description": "National election for assembly members",
  "electionDate": "2025-12-01",
  "votingMode": "BOTH",
  "maxCandidatesPerBallot": 19,
  "minimumVotesRequired": 1,
  "allowPartialVoting": true
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Kuwait National Assembly 2025",
    "description": "National election for assembly members",
    "votingMode": "BOTH",
    "votingModeDisplay": "Both Options",
    "maxCandidatesPerBallot": 19,
    "allowPartialVoting": true,
    "minimumVotesRequired": 1,
    "status": "SETUP",
    "statusDisplay": "Setup",
    "electionDate": "2025-12-01",
    "committeeCount": 0,
    "createdBy": 1,
    "createdByName": "Admin User",
    "createdAt": "2025-10-28T10:00:00.000000+03:00",
    "updatedAt": "2025-10-28T10:00:00.000000+03:00"
  },
  "message": "Election created successfully",
  "meta": {
    "timestamp": "2025-10-28T07:00:00.000000+00:00",
    "requestId": "abc123"
  }
}
```

### Example 2: Update Election

**Request**:
```http
PATCH /api/elections/1/
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Kuwait National Assembly Election 2025",
  "electionDate": "2025-12-15",
  "maxCandidatesPerBallot": 20
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Kuwait National Assembly Election 2025",
    "electionDate": "2025-12-15",
    "maxCandidatesPerBallot": 20,
    "votingMode": "BOTH",
    "allowPartialVoting": true,
    "minimumVotesRequired": 1,
    "status": "SETUP",
    "committeeCount": 0,
    "createdAt": "2025-10-28T10:00:00.000000+03:00",
    "updatedAt": "2025-10-28T10:15:00.000000+03:00"
  },
  "message": "Updated successfully"
}
```

### Example 3: List with Pagination

**Request**:
```http
GET /api/electors/?page=1&pageSize=20&search=john
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": 1,
        "civilId": "12345678901",
        "fullName": "John Doe",
        "gender": "MALE",
        "isActive": true
      },
      {
        "id": 2,
        "civilId": "12345678902",
        "fullName": "John Smith",
        "gender": "MALE",
        "isActive": true
      }
    ],
    "count": 42
  },
  "message": "Electors retrieved successfully",
  "meta": {
    "timestamp": "2025-10-28T07:00:00.000000+00:00",
    "requestId": "def456",
    "pagination": {
      "count": 42,
      "next": "http://localhost:8000/api/electors/?page=2",
      "previous": null
    }
  }
}
```

### Example 4: Validation Error

**Request**:
```http
POST /api/elections/
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "",
  "maxCandidatesPerBallot": -5
}
```

**Response** (400 Bad Request):
```json
{
  "status": "error",
  "data": null,
  "message": "Validation failed",
  "errors": {
    "name": ["This field may not be blank."],
    "maxCandidatesPerBallot": ["Ensure this value is greater than or equal to 1."],
    "votingMode": ["This field is required."]
  },
  "meta": {
    "timestamp": "2025-10-28T07:00:00.000000+00:00",
    "requestId": "ghi789"
  }
}
```

### Example 5: Not Found Error

**Request**:
```http
GET /api/elections/999/
Authorization: Bearer <token>
```

**Response** (404 Not Found):
```json
{
  "status": "error",
  "data": null,
  "message": "Not found.",
  "meta": {
    "timestamp": "2025-10-28T07:00:00.000000+00:00",
    "requestId": "jkl012"
  }
}
```

---

## Configuration

### Installation

The camelCase conversion is handled by the `djangorestframework-camel-case` package:

```bash
pip install djangorestframework-camel-case
```

Add to `requirements.txt`:
```text
djangorestframework-camel-case==1.4.2
```

### Django Settings

Configure in `backend/core/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
    'EXCEPTION_HANDLER': 'apps.utils.exceptions.custom_exception_handler',
}
```

### Serializer Example

Backend serializers use snake_case (standard Django):

```python
from rest_framework import serializers
from .models import Election

class ElectionSerializer(serializers.ModelSerializer):
    """
    Backend uses snake_case, but API returns camelCase automatically
    """
    
    voting_mode_display = serializers.CharField(
        source='get_voting_mode_display', 
        read_only=True
    )
    committee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Election
        fields = [
            'id',
            'name',
            'description',
            'voting_mode',              # → votingMode in API
            'voting_mode_display',      # → votingModeDisplay in API
            'max_candidates_per_ballot', # → maxCandidatesPerBallot in API
            'allow_partial_voting',     # → allowPartialVoting in API
            'minimum_votes_required',   # → minimumVotesRequired in API
            'election_date',            # → electionDate in API
            'created_at',              # → createdAt in API
            'updated_at',              # → updatedAt in API
        ]
```

### Frontend TypeScript Interface

Frontend interfaces use camelCase (matches API):

```typescript
export interface Election {
  id: number;
  name: string;
  description: string | null;
  votingMode: 'FULL_PARTY' | 'MIXED' | 'BOTH';
  votingModeDisplay?: string;
  maxCandidatesPerBallot: number;
  allowPartialVoting: boolean;
  minimumVotesRequired: number;
  status: 'SETUP' | 'GUARANTEE_PHASE' | 'VOTING_DAY' | 'COUNTING' | 'CLOSED';
  statusDisplay?: string;
  electionDate: string | null;
  committeeCount?: number;
  createdBy?: number;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Best Practices

### 1. Always Use TypeScript Interfaces

```typescript
// ✅ Good: Type-safe API calls
import { Election, ElectionFormData } from 'types/elections';

export const updateElection = async (
  id: number, 
  data: Partial<ElectionFormData>
): Promise<APIResponse<Election>> => {
  const response = await axios.patch(`/api/elections/${id}/`, data);
  return response.data;
};
```

```typescript
// ❌ Bad: Untyped API calls
export const updateElection = async (id, data) => {
  const response = await axios.patch(`/api/elections/${id}/`, data);
  return response.data;
};
```

### 2. Handle Errors Consistently

```typescript
try {
  const response = await api.updateElection(id, data);
  if (response.status === 'success') {
    toast.success(response.message);
    return response.data;
  }
} catch (error) {
  if (error.response?.data?.errors) {
    // Field-level validation errors
    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
      console.error(`${field}: ${messages.join(', ')}`);
    });
  } else {
    // General error
    toast.error(error.response?.data?.message || 'An error occurred');
  }
}
```

### 3. Use Standard Response Utilities (Backend)

```python
from apps.utils.responses import APIResponse

# ✅ Good: Using standard responses
class ElectionViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    
    create_message = "Election created successfully"
    update_message = "Updated successfully"
    delete_message = "Election deleted successfully"
```

```python
# ❌ Bad: Inconsistent responses
def create(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    instance = serializer.save()
    return Response(serializer.data, status=201)  # Missing message, meta
```

### 4. Document Field Names

```python
class ElectionSerializer(serializers.ModelSerializer):
    """
    Election serializer.
    
    API Fields (camelCase):
    - electionDate: Date of the election
    - votingMode: Voting method (FULL_PARTY, MIXED, BOTH)
    - maxCandidatesPerBallot: Maximum candidates voters can select
    - allowPartialVoting: Whether partial ballots are accepted
    
    Note: Fields are automatically converted from snake_case to camelCase
    """
    
    class Meta:
        model = Election
        fields = ['election_date', 'voting_mode', 'max_candidates_per_ballot']
```

### 5. Test with Actual Field Names

```python
# Backend tests - use snake_case
def test_create_election(self):
    data = {
        'name': 'Test Election',
        'voting_mode': 'BOTH',
        'max_candidates_per_ballot': 10,
        'allow_partial_voting': True,
    }
    response = self.client.post('/api/elections/', data)
    self.assertEqual(response.status_code, 201)
```

```typescript
// Frontend tests - use camelCase
test('creates election', async () => {
  const data = {
    name: 'Test Election',
    votingMode: 'BOTH',
    maxCandidatesPerBallot: 10,
    allowPartialVoting: true,
  };
  const response = await api.createElection(data);
  expect(response.status).toBe('success');
});
```

---

## Troubleshooting

### Issue: Fields not converting

**Problem**: API still returns snake_case fields

**Solution**: 
1. Verify `djangorestframework-camel-case` is installed
2. Check REST_FRAMEWORK settings include camelCase renderer/parser
3. Restart Django server after configuration changes

### Issue: Nested objects not converting

**Problem**: Nested objects still in snake_case

**Solution**:
```python
# Use SerializerMethodField for custom nested data
class ElectionSerializer(serializers.ModelSerializer):
    committees = serializers.SerializerMethodField()
    
    def get_committees(self, obj):
        # This will be automatically converted to camelCase
        from apps.elections.serializers import CommitteeListSerializer
        committees = obj.committees.all()
        return CommitteeListSerializer(committees, many=True).data
```

### Issue: Query parameters not converting

**Problem**: Query params like `?pageSize=20` not working

**Solution**: Query parameters ARE converted. Use camelCase in frontend:
```typescript
// ✅ Correct
const response = await axios.get('/api/electors/', {
  params: { pageSize: 20, searchTerm: 'john' }
});

// ❌ Wrong
const response = await axios.get('/api/electors/', {
  params: { page_size: 20, search_term: 'john' }
});
```

---

## References

- [djangorestframework-camel-case Documentation](https://github.com/vbabiy/djangorestframework-camel-case)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Standard Response Format](./00-BACKEND-OVERVIEW.md#api-standards)
- [Building a New App](./01-BUILDING-NEW-APP.md)

---

**Last Updated**: October 28, 2025
**Maintainer**: Development Team

