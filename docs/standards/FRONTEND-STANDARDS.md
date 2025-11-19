# Frontend Standardization Guide
**Election Management System - React + TypeScript + Material-UI**

**Version:** 1.0  
**Last Updated:** October 27, 2025  
**Status:** ✅ Standardization Framework Established

---

## 🆕 Recent Updates (v1.0)

**October 27, 2025** - Initial Frontend Standards:
- ✅ **API Integration Standards**: Migrating to new pluralized endpoints
  - `/api/election/` → `/api/elections/`
  - `/api/attendance/` → `/api/attendees/`
  - See backend [APPS-PLURALIZATION-SUMMARY.md](../../backend/APPS-PLURALIZATION-SUMMARY.md)

- ✅ **Component Architecture**: React + TypeScript + Material-UI standards
- ✅ **State Management**: Context API + Custom Hooks patterns
- ✅ **Code Organization**: Feature-based structure

---

## Table of Contents
1. [Overview](#overview)
2. [API Integration Standards](#api-integration-standards)
3. [Component Patterns](#component-patterns)
4. [State Management](#state-management)
5. [TypeScript Standards](#typescript-standards)
6. [Styling Standards](#styling-standards)
7. [Form Handling](#form-handling)
8. [Error Handling](#error-handling)
9. [Testing Standards](#testing-standards)
10. [Best Practices](#best-practices)

---

## Overview

This guide defines standardized patterns for the Election Management System frontend built with React, TypeScript, and Material-UI.

### Core Principles
- ✅ **Consistency**: Same patterns across all features
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Predictability**: Components behave as expected
- ✅ **Maintainability**: Easy to understand and modify
- ✅ **Performance**: Optimized rendering and data fetching
- ✅ **Accessibility**: WCAG 2.1 AA compliant

### Tech Stack
- **React**: 18.x with Hooks
- **TypeScript**: 5.x
- **Material-UI (MUI)**: v5
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Management**: React Hook Form + Yup
- **Build Tool**: Vite

---

## API Integration Standards

### API Client Structure

**Standard Pattern**:
```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);
```

### API Response Type

**All backend responses follow this structure**:
```typescript
// src/types/api.types.ts
export interface APIResponse<T = any> {
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

### API Service Pattern

**Standard Pattern for each resource**:
```typescript
// src/api/services/elections.service.ts
import { apiClient } from '../client';
import { APIResponse } from '@/types/api.types';
import { Election, Committee } from '@/types/models';

class ElectionsService {
  private readonly BASE_PATH = '/elections'; // Plural endpoint

  /**
   * Get all elections
   */
  async getElections(): Promise<APIResponse<Election[]>> {
    const response = await apiClient.get(this.BASE_PATH);
    return response.data;
  }

  /**
   * Get current election
   */
  async getCurrentElection(): Promise<APIResponse<Election>> {
    const response = await apiClient.get(`${this.BASE_PATH}/current/`);
    return response.data;
  }

  /**
   * Get election by ID
   */
  async getElection(id: number): Promise<APIResponse<Election>> {
    const response = await apiClient.get(`${this.BASE_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Create election (admin only)
   */
  async createElection(data: Partial<Election>): Promise<APIResponse<Election>> {
    const response = await apiClient.post(this.BASE_PATH, data);
    return response.data;
  }

  /**
   * Update election
   */
  async updateElection(id: number, data: Partial<Election>): Promise<APIResponse<Election>> {
    const response = await apiClient.put(`${this.BASE_PATH}/${id}/`, data);
    return response.data;
  }

  /**
   * Get committees for election
   */
  async getCommittees(): Promise<APIResponse<Committee[]>> {
    const response = await apiClient.get(`${this.BASE_PATH}/committees/`);
    return response.data;
  }
}

export const electionsService = new ElectionsService();
```

### API Endpoint Reference

**Updated Endpoints (October 2025)**:
```typescript
// src/api/endpoints.ts
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login/',
    logout: '/auth/logout/',
    refresh: '/auth/refresh/',
  },
  
  // Users
  users: {
    list: '/users/',
    me: '/users/me/',
    detail: (id: number) => `/users/${id}/`,
  },
  
  // Elections (UPDATED - now plural)
  elections: {
    list: '/elections/',
    current: '/elections/current/',
    detail: (id: number) => `/elections/${id}/`,
    committees: '/elections/committees/',
  },
  
  // Electors
  electors: {
    list: '/electors/',
    search: '/electors/search/',
    detail: (kocId: string) => `/electors/${kocId}/`,
    import: '/electors/import/',
    export: '/electors/export/',
  },
  
  // Candidates (NEW module)
  candidates: {
    list: '/candidates/',
    parties: '/candidates/parties/',
    detail: (id: number) => `/candidates/${id}/`,
  },
  
  // Guarantees
  guarantees: {
    list: '/guarantees/',
    groups: '/guarantees/groups/',
    statistics: '/guarantees/statistics/',
    detail: (id: number) => `/guarantees/${id}/`,
  },
  
  // Attendees (UPDATED - now plural)
  attendees: {
    list: '/attendees/',
    mark: '/attendees/mark_attendance/',
    byCommittee: (code: string) => `/attendees/committee/${code}/`,
    statistics: (code: string) => `/attendees/statistics/${code}/`,
  },
  
  // Voting
  voting: {
    voteCounts: '/voting/vote-counts/',
    entries: '/voting/committee-entries/',
    results: '/voting/results/',
  },
  
  // Reports
  reports: {
    dashboard: {
      personal: '/reports/dashboard/personal/',
      supervisor: '/reports/dashboard/supervisor/',
      admin: '/reports/dashboard/admin/',
    },
    coverage: '/reports/coverage/',
    accuracy: '/reports/accuracy/',
  },
} as const;
```

### Custom Hook for API Calls

**Standard Pattern**:
```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import { APIResponse } from '@/types/api.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<APIResponse<T>>,
  deps: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

// Usage example:
// const { data, loading, error } = useApi(() => electionsService.getCurrentElection());
```

---

## Component Patterns

### Component Structure

**Standard File Organization**:
```
src/
├── components/
│   ├── common/              # Shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   └── Modal/
│   │
│   ├── layout/              # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   │
│   └── features/            # Feature-specific components
│       ├── elections/
│       ├── electors/
│       └── candidates/
│
├── views/                   # Page-level components
│   ├── elections/
│   │   ├── CurrentElection.tsx
│   │   ├── ElectionsList.tsx
│   │   └── CommitteesView.tsx
│   │
│   └── dashboard/
│
├── hooks/                   # Custom React hooks
├── contexts/                # React Context providers
├── utils/                   # Utility functions
├── types/                   # TypeScript types
├── api/                     # API services
└── assets/                  # Static assets
```

### Component Template

**Standard Pattern**:
```typescript
// src/components/features/elections/ElectionCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Election } from '@/types/models';

/**
 * Props for ElectionCard component
 */
export interface ElectionCardProps {
  election: Election;
  onSelect?: (election: Election) => void;
  className?: string;
}

/**
 * ElectionCard - Displays election information in a card format
 * 
 * @component
 * @example
 * ```tsx
 * <ElectionCard 
 *   election={currentElection} 
 *   onSelect={handleSelect}
 * />
 * ```
 */
export const ElectionCard: React.FC<ElectionCardProps> = ({
  election,
  onSelect,
  className,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(election);
    }
  };

  return (
    <Card className={className} onClick={handleClick}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {election.name}
        </Typography>
        
        <Chip 
          label={election.status} 
          color={getStatusColor(election.status)}
          size="small"
        />
        
        <Typography variant="body2" color="text.secondary">
          {new Date(election.election_date).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' {
  const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    SETUP: 'info',
    GUARANTEE_PHASE: 'warning',
    VOTING_DAY: 'success',
    COUNTING: 'warning',
    CLOSED: 'error',
  };
  return colors[status] || 'info';
}

// Export from index.ts
// export { ElectionCard } from './ElectionCard';
// export type { ElectionCardProps } from './ElectionCard';
```

### Page Component Pattern

**Standard Pattern**:
```typescript
// src/views/elections/CurrentElection.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { ElectionCard } from '@/components/features/elections';
import { useApi } from '@/hooks/useApi';
import { electionsService } from '@/api/services/elections.service';

/**
 * CurrentElection - View for displaying the current election
 * 
 * Features:
 * - Displays current election information
 * - Shows committees list
 * - Handles loading and error states
 */
export const CurrentElection: React.FC = () => {
  const { 
    data: election, 
    loading, 
    error 
  } = useApi(() => electionsService.getCurrentElection());

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!election) {
    return (
      <Container>
        <Alert severity="info">No active election found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Current Election
      </Typography>
      
      <ElectionCard election={election} />
      
      {/* Additional content */}
    </Container>
  );
};
```

---

## State Management

### Context Pattern

**Standard Pattern**:
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/api/services/auth.service';
import { User } from '@/types/models';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await authService.getProfile();
        if (response.status === 'success' && response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.status === 'success' && response.data) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setUser(response.data.user);
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Custom Hook for Data Fetching

**Standard Pattern**:
```typescript
// src/hooks/useElections.ts
import { useState, useEffect } from 'react';
import { Election } from '@/types/models';
import { electionsService } from '@/api/services/elections.service';

export function useElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await electionsService.getElections();
      if (response.status === 'success' && response.data) {
        setElections(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return { elections, loading, error, refetch: fetchElections };
}
```

---

## TypeScript Standards

### Type Definitions

**Standard Pattern**:
```typescript
// src/types/models.ts

/**
 * User model matching backend CustomUser
 */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'STAFF' | 'OBSERVER';

/**
 * Election model
 */
export interface Election {
  id: number;
  name: string;
  description: string;
  status: ElectionStatus;
  voting_mode: VotingMode;
  election_date: string;
  max_candidates_per_ballot: number;
  allow_partial_voting: boolean;
  minimum_votes_required: number;
  created_at: string;
  updated_at: string;
}

export type ElectionStatus = 
  | 'SETUP' 
  | 'GUARANTEE_PHASE' 
  | 'VOTING_DAY' 
  | 'COUNTING' 
  | 'CLOSED';

export type VotingMode = 'FULL_PARTY' | 'MIXED' | 'BOTH';

/**
 * Committee model
 */
export interface Committee {
  id: number;
  election: number;
  code: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  elector_count: number;
  attendance_count: number;
  attendance_percentage: number;
  created_at: string;
  updated_at: string;
}

/**
 * Elector model
 */
export interface Elector {
  koc_id: string; // Primary key
  name_first: string;
  name_second: string;
  name_third: string;
  name_fourth: string;
  name_fifth: string;
  name_before_last: string;
  name_last: string;
  designation: string;
  section: string;
  extension: string;
  mobile: string;
  area: string;
  team: string;
  committee: number;
  gender: 'MALE' | 'FEMALE';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Candidate model
 */
export interface Candidate {
  id: number;
  election: number;
  elector: string; // KOC ID
  candidate_number: number;
  party_affiliation: string | null;
  is_active: boolean;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

/**
 * Party model
 */
export interface Party {
  id: number;
  election: number;
  name: string;
  abbreviation: string;
  color: string;
  created_at: string;
  updated_at: string;
}
```

### Utility Types

**Standard Pattern**:
```typescript
// src/types/utils.ts

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract subset of type T with only keys K
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit keys K from type T
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Form values type (for create/update forms)
 */
export type FormValues<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
```

---

## Styling Standards

### Material-UI Theme

**Standard Pattern**:
```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f33a73',
      dark: '#9a0036',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  spacing: 8, // 8px base spacing
  shape: {
    borderRadius: 4,
  },
});
```

### Component Styling

**Use MUI's sx prop for styling**:
```typescript
// Good ✅
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 1,
  }}
>
  {/* Content */}
</Box>

// For complex/reusable styles, use styled()
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));
```

---

## Form Handling

### React Hook Form Pattern

**Standard Pattern**:
```typescript
// src/components/features/elections/ElectionForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Election } from '@/types/models';

// Validation schema
const schema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Minimum 3 characters'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  voting_mode: yup.string().required('Voting mode is required'),
  election_date: yup.date().required('Election date is required'),
}).required();

type ElectionFormData = yup.InferType<typeof schema>;

interface ElectionFormProps {
  initialData?: Partial<Election>;
  onSubmit: (data: ElectionFormData) => Promise<void>;
  onCancel?: () => void;
}

export const ElectionForm: React.FC<ElectionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ElectionFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Election Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select {...field} label="Status">
              <MenuItem value="SETUP">Setup</MenuItem>
              <MenuItem value="GUARANTEE_PHASE">Guarantee Phase</MenuItem>
              <MenuItem value="VOTING_DAY">Voting Day</MenuItem>
              <MenuItem value="COUNTING">Counting</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};
```

---

## Error Handling

### Error Boundary

**Standard Pattern**:
```typescript
// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={3}
        >
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
```

### Toast Notifications

**Standard Pattern**:
```typescript
// src/hooks/useToast.ts
import { useSnackbar, VariantType } from 'notistack';

export function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  const toast = {
    success: (message: string) => {
      enqueueSnackbar(message, { variant: 'success' });
    },
    error: (message: string) => {
      enqueueSnackbar(message, { variant: 'error' });
    },
    warning: (message: string) => {
      enqueueSnackbar(message, { variant: 'warning' });
    },
    info: (message: string) => {
      enqueueSnackbar(message, { variant: 'info' });
    },
  };

  return toast;
}

// Usage:
// const toast = useToast();
// toast.success('Operation completed successfully');
```

---

## Testing Standards

### Component Testing

**Standard Pattern**:
```typescript
// src/components/features/elections/ElectionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ElectionCard } from './ElectionCard';
import { Election } from '@/types/models';

const mockElection: Election = {
  id: 1,
  name: 'Test Election',
  status: 'VOTING_DAY',
  election_date: '2025-10-27',
  // ... other required fields
};

describe('ElectionCard', () => {
  it('renders election name', () => {
    render(<ElectionCard election={mockElection} />);
    expect(screen.getByText('Test Election')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(<ElectionCard election={mockElection} onSelect={handleSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith(mockElection);
  });

  it('displays correct status chip', () => {
    render(<ElectionCard election={mockElection} />);
    expect(screen.getByText('VOTING_DAY')).toBeInTheDocument();
  });
});
```

---

## Best Practices

### Component Best Practices

✅ **DO**:
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Document complex logic
- Use memo() for expensive components
- Extract reusable logic into custom hooks

❌ **DON'T**:
- Create class components (use hooks)
- Put business logic in components
- Mutate props or state directly
- Use inline styles (use sx prop or styled())
- Forget error boundaries
- Skip prop validation

### Performance Best Practices

✅ **DO**:
- Use React.memo() for expensive components
- Implement virtualization for long lists
- Lazy load routes and components
- Debounce search inputs
- Use proper key props in lists
- Optimize images and assets

```typescript
// Lazy loading example
const ElectionsList = lazy(() => import('./views/elections/ElectionsList'));

// Memoization example
export const ExpensiveComponent = memo(({ data }) => {
  // Complex rendering logic
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

### Accessibility Best Practices

✅ **DO**:
- Use semantic HTML
- Add proper ARIA labels
- Ensure keyboard navigation
- Provide alt text for images
- Use sufficient color contrast
- Test with screen readers

```typescript
// Good accessibility example
<Button
  aria-label="Submit election form"
  onClick={handleSubmit}
>
  Submit
</Button>

<img 
  src={logoUrl} 
  alt="Election Management System Logo"
/>
```

---

## Code Review Checklist

### Before Submitting PR

- [ ] TypeScript types defined for all props and data
- [ ] Components documented with JSDoc comments
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Responsive design checked
- [ ] Accessibility requirements met
- [ ] Tests written and passing
- [ ] No console.log() or debugging code
- [ ] API endpoints use new plural format
- [ ] Form validation implemented
- [ ] Toast notifications for user feedback

---

## Migration Guide

### Updating API Endpoints

**Old (Before Oct 2025)**:
```typescript
// ❌ Old endpoints
const response = await axios.get('/api/election/');
const response = await axios.get('/api/attendance/');
```

**New (After Oct 2025)**:
```typescript
// ✅ New endpoints (plural)
const response = await axios.get('/api/elections/');
const response = await axios.get('/api/attendees/');
```

**Migration Steps**:
1. Update `src/api/endpoints.ts` with new plural endpoints
2. Update all service files to use new endpoints
3. Test all API calls
4. Update documentation

---

## Resources

### Documentation
- **Backend Standards**: `backend/docs/BACKEND-STANDARDIZATION-GUIDE.md`
- **API Response Format**: See backend APIResponse class
- **Material-UI Docs**: https://mui.com/
- **React Hook Form**: https://react-hook-form.com/
- **TypeScript**: https://www.typescriptlang.org/

### Code Examples
- See `src/views/` for page examples
- See `src/components/features/` for feature components
- See `src/api/services/` for API integration

---

**Maintained by**: Development Team  
**Last Updated**: October 27, 2025  
**Status**: ✅ Standards Established

