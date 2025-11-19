# API Integration Guide

**Election Management System - Frontend API Integration**

**Last Updated:** October 27, 2025

---

## Overview

This guide provides patterns and examples for integrating with the backend API from the frontend application.

---

## 🚨 Important: API Endpoint Updates (October 2025)

The backend has been refactored with **pluralized app names**. All frontend code must use the new endpoints:

### Updated Endpoints

| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `/api/election/*` | `/api/elections/*` | ✅ Update Required |
| `/api/attendance/*` | `/api/attendees/*` | ✅ Update Required |
| `/api/candidates/*` | `/api/candidates/*` | ✅ Already Correct |
| `/api/electors/*` | `/api/electors/*` | ✅ Already Correct |

---

## API Client Setup

### Base Configuration

```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data.data;
        localStorage.setItem('access_token', access);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Service Layer Pattern

### Base Service Class

```typescript
// src/api/services/base.service.ts
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';

export class BaseService<T> {
  constructor(protected basePath: string) {}

  async getAll(): Promise<APIResponse<T[]>> {
    const response = await apiClient.get(this.basePath);
    return response.data;
  }

  async getById(id: number | string): Promise<APIResponse<T>> {
    const response = await apiClient.get(`${this.basePath}/${id}/`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<APIResponse<T>> {
    const response = await apiClient.post(this.basePath, data);
    return response.data;
  }

  async update(id: number | string, data: Partial<T>): Promise<APIResponse<T>> {
    const response = await apiClient.put(`${this.basePath}/${id}/`, data);
    return response.data;
  }

  async partialUpdate(id: number | string, data: Partial<T>): Promise<APIResponse<T>> {
    const response = await apiClient.patch(`${this.basePath}/${id}/`, data);
    return response.data;
  }

  async delete(id: number | string): Promise<APIResponse<void>> {
    const response = await apiClient.delete(`${this.basePath}/${id}/`);
    return response.data;
  }
}
```

---

## Service Implementations

### Elections Service

```typescript
// src/api/services/elections.service.ts
import { BaseService } from './base.service';
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';
import { Election, Committee } from '@/types/models';

class ElectionsService extends BaseService<Election> {
  constructor() {
    super('/elections'); // UPDATED: Now plural
  }

  /**
   * Get current active election
   */
  async getCurrent(): Promise<APIResponse<Election>> {
    const response = await apiClient.get(`${this.basePath}/current/`);
    return response.data;
  }

  /**
   * Get all committees
   */
  async getCommittees(): Promise<APIResponse<Committee[]>> {
    const response = await apiClient.get(`${this.basePath}/committees/`);
    return response.data;
  }

  /**
   * Get committee by ID
   */
  async getCommittee(id: number): Promise<APIResponse<Committee>> {
    const response = await apiClient.get(`${this.basePath}/committees/${id}/`);
    return response.data;
  }

  /**
   * Get committee statistics
   */
  async getCommitteeStats(id: number): Promise<APIResponse<any>> {
    const response = await apiClient.get(`${this.basePath}/committees/${id}/statistics/`);
    return response.data;
  }
}

export const electionsService = new ElectionsService();
```

### Electors Service

```typescript
// src/api/services/electors.service.ts
import { BaseService } from './base.service';
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';
import { Elector } from '@/types/models';

class ElectorsService extends BaseService<Elector> {
  constructor() {
    super('/electors');
  }

  /**
   * Search electors with query
   */
  async search(query: string): Promise<APIResponse<Elector[]>> {
    const response = await apiClient.get(`${this.basePath}/search/`, {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Advanced search with multiple fields
   */
  async advancedSearch(params: {
    name?: string;
    koc_id?: string;
    mobile?: string;
    committee?: number;
    section?: string;
  }): Promise<APIResponse<Elector[]>> {
    const response = await apiClient.get(`${this.basePath}/search/`, { params });
    return response.data;
  }

  /**
   * Import electors from CSV
   */
  async importCSV(file: File): Promise<APIResponse<{ success: number; errors: any[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`${this.basePath}/import/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Export electors to Excel
   */
  async exportExcel(params?: { committee?: number }): Promise<Blob> {
    const response = await apiClient.get(`${this.basePath}/export/`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get elector statistics
   */
  async getStatistics(): Promise<APIResponse<any>> {
    const response = await apiClient.get(`${this.basePath}/statistics/`);
    return response.data;
  }
}

export const electorsService = new ElectorsService();
```

### Candidates Service

```typescript
// src/api/services/candidates.service.ts
import { BaseService } from './base.service';
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';
import { Candidate, Party } from '@/types/models';

class CandidatesService extends BaseService<Candidate> {
  constructor() {
    super('/candidates');
  }

  /**
   * Get all parties
   */
  async getParties(): Promise<APIResponse<Party[]>> {
    const response = await apiClient.get(`${this.basePath}/parties/`);
    return response.data;
  }

  /**
   * Get party by ID
   */
  async getParty(id: number): Promise<APIResponse<Party>> {
    const response = await apiClient.get(`${this.basePath}/parties/${id}/`);
    return response.data;
  }

  /**
   * Get candidates by party
   */
  async getByParty(partyId: number): Promise<APIResponse<Candidate[]>> {
    const response = await apiClient.get(this.basePath, {
      params: { party: partyId },
    });
    return response.data;
  }

  /**
   * Get candidate statistics
   */
  async getStatistics(): Promise<APIResponse<any>> {
    const response = await apiClient.get(`${this.basePath}/statistics/`);
    return response.data;
  }
}

export const candidatesService = new CandidatesService();
```

### Attendees Service

```typescript
// src/api/services/attendees.service.ts
import { BaseService } from './base.service';
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';
import { Attendance, AttendanceStatistics } from '@/types/models';

class AttendeesService extends BaseService<Attendance> {
  constructor() {
    super('/attendees'); // UPDATED: Now plural
  }

  /**
   * Mark elector attendance
   */
  async markAttendance(data: {
    koc_id: string;
    committee_code: string;
    is_walk_in?: boolean;
    notes?: string;
  }): Promise<APIResponse<Attendance>> {
    const response = await apiClient.post(`${this.basePath}/mark_attendance/`, data);
    return response.data;
  }

  /**
   * Get attendance by committee
   */
  async getByCommittee(committeeCode: string): Promise<APIResponse<Attendance[]>> {
    const response = await apiClient.get(`${this.basePath}/committee/${committeeCode}/`);
    return response.data;
  }

  /**
   * Get attendance statistics for committee
   */
  async getStatistics(committeeCode: string): Promise<APIResponse<AttendanceStatistics>> {
    const response = await apiClient.get(`${this.basePath}/statistics/${committeeCode}/`);
    return response.data;
  }

  /**
   * Refresh statistics
   */
  async refreshStatistics(committeeCode: string): Promise<APIResponse<AttendanceStatistics>> {
    const response = await apiClient.post(`${this.basePath}/statistics/${committeeCode}/refresh/`);
    return response.data;
  }
}

export const attendeesService = new AttendeesService();
```

---

## Custom Hooks for API Integration

### useApi Hook

```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { APIResponse } from '@/types/api.types';

interface UseApiOptions {
  immediate?: boolean; // Fetch immediately on mount
}

export function useApi<T>(
  apiCall: () => Promise<APIResponse<T>>,
  deps: any[] = [],
  options: UseApiOptions = { immediate: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(options.immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();

      if (response.status === 'success' && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'An error occurred');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Network error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, execute, refetch: execute };
}
```

### useMutation Hook

```typescript
// src/hooks/useMutation.ts
import { useState } from 'react';
import { APIResponse } from '@/types/api.types';

export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<APIResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (variables: V): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await mutationFn(variables);

      if (response.status === 'success' && response.data) {
        setData(response.data);
        return response.data;
      } else {
        const errorMsg = response.message || 'Mutation failed';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Network error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, loading, error, data, reset };
}
```

---

## Usage Examples

### Fetching Data

```typescript
// In component
import { useApi } from '@/hooks/useApi';
import { electionsService } from '@/api/services/elections.service';

function CurrentElectionView() {
  const { 
    data: election, 
    loading, 
    error, 
    refetch 
  } = useApi(() => electionsService.getCurrent());

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} onRetry={refetch} />;
  if (!election) return <EmptyState title="No active election" />;

  return <ElectionCard election={election} />;
}
```

### Creating Data

```typescript
// In component
import { useMutation } from '@/hooks/useMutation';
import { electionsService } from '@/api/services/elections.service';
import { useToast } from '@/hooks/useToast';

function CreateElectionForm() {
  const toast = useToast();
  const { mutate, loading } = useMutation(electionsService.create.bind(electionsService));

  const handleSubmit = async (formData: Partial<Election>) => {
    try {
      await mutate(formData);
      toast.success('Election created successfully');
      navigate('/elections');
    } catch (error) {
      toast.error('Failed to create election');
    }
  };

  return <ElectionForm onSubmit={handleSubmit} loading={loading} />;
}
```

### Searching

```typescript
// In component
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { electorsService } from '@/api/services/electors.service';

function ElectorSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, loading } = useApi(
    () => electorsService.search(debouncedQuery),
    [debouncedQuery],
    { immediate: !!debouncedQuery }
  );

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      {loading && <LoadingSpinner />}
      {results && <ElectorSearchResults results={results} />}
    </>
  );
}
```

---

## Error Handling

### Handling API Errors

```typescript
// src/utils/errorHandler.ts
import { AxiosError } from 'axios';
import { APIResponse } from '@/types/api.types';

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIResponse>;

    if (axiosError.response) {
      // Server responded with error
      const response = axiosError.response.data;
      
      if (response.errors) {
        // Field validation errors
        return Object.values(response.errors).flat().join(', ');
      }
      
      return response.message || 'Server error occurred';
    } else if (axiosError.request) {
      // Request made but no response
      return 'No response from server. Please check your connection.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred';
}
```

---

## Best Practices

### DO ✅

1. **Use Service Layer**: Always use service classes, never call apiClient directly in components
2. **Type Everything**: Use TypeScript interfaces for all API responses
3. **Handle Errors**: Always handle loading, error, and empty states
4. **Use Custom Hooks**: Leverage useApi and useMutation for consistency
5. **Validate Responses**: Check response.status before using data
6. **Token Management**: Let interceptors handle auth automatically
7. **Error Boundaries**: Wrap API calls in try-catch blocks

### DON'T ❌

1. **Don't** make API calls directly in components
2. **Don't** ignore error states
3. **Don't** store sensitive data in localStorage without encryption
4. **Don't** forget to handle 401 responses
5. **Don't** make unnecessary API calls (use caching)
6. **Don't** use old endpoint names (use plural: elections, attendees)

---

## Migration Checklist

### Updating to New Endpoints

- [ ] Update `src/api/services/elections.service.ts` basePath to `/elections`
- [ ] Update `src/api/services/attendees.service.ts` basePath to `/attendees`
- [ ] Search codebase for `/api/election/` and replace with `/api/elections/`
- [ ] Search codebase for `/api/attendance/` and replace with `/api/attendees/`
- [ ] Update all import statements
- [ ] Test all API calls
- [ ] Update tests to use new endpoints

---

**Maintained by**: Frontend Team  
**Last Updated**: October 27, 2025  
**Backend Standards**: See `backend/docs/BACKEND-STANDARDIZATION-GUIDE.md`

