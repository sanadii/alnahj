# Frontend Implementation Plan - Election Management System

**Project**: Kuwait Oil Company Election Management System  
**Framework**: React 18+ with TypeScript  
**Status**: Planning Phase  
**Last Updated**: October 24, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Design System](#design-system)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Component Architecture](#component-architecture)
9. [Implementation Phases](#implementation-phases)
10. [User Roles & Access Control](#user-roles--access-control)
11. [Key Features by Module](#key-features-by-module)
12. [Testing Strategy](#testing-strategy)
13. [Performance Optimization](#performance-optimization)
14. [Deployment](#deployment)

---

## 🎯 Overview

### Project Purpose
Build a modern, responsive web application for managing Kuwait Oil Company employee elections, including guarantee collection, attendance tracking, vote counting, and results management.

### Key Objectives
- ✅ Clean, intuitive user interface following Material Design
- ✅ Role-based access control (4 user roles)
- ✅ Real-time data updates
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Arabic & English support (RTL)
- ✅ Performance optimized
- ✅ Accessible (WCAG 2.1 AA)

### Backend API
- **Base URL**: `http://localhost:8000/api/`
- **Authentication**: JWT (Bearer tokens)
- **Endpoints**: 93+ RESTful endpoints
- **Documentation**: See backend app READMEs

---

## 🛠 Technology Stack

### Core Technologies
```json
{
  "framework": "React 18.2+",
  "language": "TypeScript 5.0+",
  "buildTool": "Vite 4.0+",
  "uiLibrary": "Material-UI (MUI) v5",
  "stateManagement": "Redux Toolkit + RTK Query",
  "routing": "React Router v6",
  "forms": "React Hook Form + Yup",
  "dateHandling": "date-fns",
  "charts": "Chart.js / Recharts",
  "icons": "Material Icons / Heroicons"
}
```

### Development Tools
```json
{
  "codeQuality": "ESLint + Prettier",
  "testing": "Vitest + React Testing Library",
  "e2e": "Cypress",
  "typeChecking": "TypeScript",
  "gitHooks": "Husky + lint-staged"
}
```

### Additional Libraries
- **HTTP Client**: Axios
- **Table Management**: TanStack Table (React Table v8)
- **Date Picker**: MUI Date Pickers
- **File Upload**: react-dropzone
- **CSV Export**: papaparse
- **PDF Generation**: jsPDF / react-pdf
- **Notifications**: react-hot-toast / notistack
- **Loading States**: react-loading-skeleton

---

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── index.html
│   ├── favicon.svg
│   └── locales/               # Translation files
│       ├── en/
│       └── ar/
│
├── src/
│   ├── app/                   # App configuration
│   │   ├── store.ts          # Redux store
│   │   ├── theme.ts          # MUI theme
│   │   └── routes.tsx        # Route definitions
│   │
│   ├── features/              # Feature modules
│   │   ├── auth/             # Authentication
│   │   │   ├── api/          # API slice (RTK Query)
│   │   │   ├── components/   # Auth components
│   │   │   ├── pages/        # Auth pages (Login, etc.)
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── types/        # TypeScript types
│   │   │   └── utils/        # Helper functions
│   │   │
│   │   ├── users/            # User management
│   │   ├── elections/        # Election management
│   │   ├── electors/         # Elector database
│   │   ├── guarantees/       # Guarantee collection
│   │   ├── attendance/       # Attendance tracking
│   │   ├── voting/           # Voting operations
│   │   ├── reports/          # Reports & analytics
│   │   └── dashboard/        # Dashboards
│   │
│   ├── shared/               # Shared resources
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # Basic UI components
│   │   │   ├── forms/       # Form components
│   │   │   ├── tables/      # Table components
│   │   │   ├── layout/      # Layout components
│   │   │   └── charts/      # Chart components
│   │   │
│   │   ├── hooks/           # Shared hooks
│   │   ├── utils/           # Utility functions
│   │   ├── constants/       # Constants
│   │   ├── types/           # Shared TypeScript types
│   │   └── api/             # API configuration
│   │
│   ├── assets/              # Images, fonts, etc.
│   ├── styles/              # Global styles
│   ├── i18n/                # Internationalization
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite types
│
├── .env.example             # Environment variables template
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

---

## 🚀 Setup Instructions

### Prerequisites
```bash
# Required
Node.js 18+
npm 9+ or yarn 1.22+

# Optional but recommended
VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - ESLint
  - Prettier
  - TypeScript
```

### Initial Setup

#### 1. Create Project
```bash
# Create Vite + React + TypeScript project
npm create vite@latest frontend -- --template react-ts

cd frontend
```

#### 2. Install Dependencies
```bash
# Core dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install react-hook-form yup @hookform/resolvers
npm install date-fns
npm install react-hot-toast

# Development dependencies
npm install -D @types/node
npm install -D eslint prettier eslint-config-prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D vitest jsdom
```

#### 3. Configure Environment
```bash
# Create .env file
cp .env.example .env
```

**.env.example**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Election Management System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

#### 4. Configure TypeScript
**tsconfig.json** (additions):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

#### 5. Configure Vite
**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

#### 6. Start Development Server
```bash
npm run dev
# App will be available at http://localhost:3000
```

---

## 🎨 Design System

### Color Palette

#### Primary Colors (Kuwait Oil Company Brand)
```typescript
const colors = {
  primary: {
    main: '#1976d2',      // KOC Blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#dc004e',      // Accent Red
    light: '#e33371',
    dark: '#9a0036',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',      // Green (for "Strong" guarantees)
    light: '#4caf50',
    dark: '#1b5e20',
  },
  warning: {
    main: '#ed6c02',      // Orange (for "Medium" guarantees)
    light: '#ff9800',
    dark: '#e65100',
  },
  error: {
    main: '#d32f2f',      // Red (for "Weak" guarantees)
    light: '#ef5350',
    dark: '#c62828',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
  },
};
```

#### Neutral Colors
```typescript
const neutrals = {
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};
```

### Typography
```typescript
const typography = {
  fontFamily: [
    'Roboto',
    'Arial',
    'sans-serif',
    // Arabic font
    'Cairo',
  ].join(','),
  
  h1: { fontSize: '2.5rem', fontWeight: 500 },
  h2: { fontSize: '2rem', fontWeight: 500 },
  h3: { fontSize: '1.75rem', fontWeight: 500 },
  h4: { fontSize: '1.5rem', fontWeight: 500 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  h6: { fontSize: '1rem', fontWeight: 500 },
  
  body1: { fontSize: '1rem', lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', lineHeight: 1.43 },
  
  button: { textTransform: 'none', fontWeight: 500 },
};
```

### Spacing
```typescript
const spacing = 8; // Base spacing unit (8px)

// Usage:
// spacing(1) = 8px
// spacing(2) = 16px
// spacing(3) = 24px
// etc.
```

### Breakpoints
```typescript
const breakpoints = {
  xs: 0,     // Mobile
  sm: 600,   // Tablet
  md: 960,   // Desktop
  lg: 1280,  // Large desktop
  xl: 1920,  // Extra large
};
```

### Component Variants

#### Buttons
- **Primary**: Main actions (Submit, Save, Create)
- **Secondary**: Secondary actions (Cancel, Back)
- **Outlined**: Tertiary actions (Filter, Export)
- **Text**: Minimal actions (View details, Edit)

#### Cards
- **Elevated**: Main content cards (shadow elevation 2)
- **Outlined**: Secondary cards (border, no shadow)
- **Flat**: Background cards (no border, no shadow)

#### Tables
- **Striped**: Alternating row colors for readability
- **Hover**: Row highlight on hover
- **Dense**: Compact view for large datasets

---

## 🗄️ State Management

### Redux Toolkit Setup

#### Store Configuration
**src/app/store.ts**:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@/features/auth/authSlice';
import { authApi } from '@/features/auth/api/authApi';
import { usersApi } from '@/features/users/api/usersApi';
import { electorsApi } from '@/features/electors/api/electorsApi';
import { guaranteesApi } from '@/features/guarantees/api/guaranteesApi';
// ... import other API slices

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [electorsApi.reducerPath]: electorsApi.reducer,
    [guaranteesApi.reducerPath]: guaranteesApi.reducer,
    // ... other API slices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      electorsApi.middleware,
      guaranteesApi.middleware,
      // ... other API middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Typed Hooks
**src/app/hooks.ts**:
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Auth Slice Example
**src/features/auth/authSlice.ts**:
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SUPERVISOR' | 'USER';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🔌 API Integration

### RTK Query Setup

#### Base API Configuration
**src/shared/api/baseApi.ts**:
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store new token
      api.dispatch(setCredentials(refreshResult.data));
      
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout
      api.dispatch(logout());
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Election',
    'Committee',
    'Elector',
    'Guarantee',
    'GuaranteeGroup',
    'Attendance',
    'VoteCount',
    'Report',
  ],
  endpoints: () => ({}),
});
```

#### Feature API Example (Electors)
**src/features/electors/api/electorsApi.ts**:
```typescript
import { baseApi } from '@/shared/api/baseApi';

interface Elector {
  id: number;
  kocId: string;
  civilId: string;
  nameFirst: string;
  nameSecond: string;
  nameThird: string;
  nameFourth: string;
  nameFifth: string;
  nameBeforeLast: string;
  nameLast: string;
  designation: string;
  section: string;
  location: string;
  mobile: string;
  area: string;
  team: string;
}

interface ElectorListResponse {
  count: number;
  results: Elector[];
}

interface ElectorSearchParams {
  search?: string;
  kocId?: string;
  civilId?: string;
  designation?: string;
  section?: string;
  location?: string;
  area?: string;
  team?: string;
  page?: number;
  limit?: number;
}

export const electorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List electors with search/filter
    listElectors: builder.query<ElectorListResponse, ElectorSearchParams>({
      query: (params) => ({
        url: '/electors/',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Elector' as const, id })),
              { type: 'Elector', id: 'LIST' },
            ]
          : [{ type: 'Elector', id: 'LIST' }],
    }),
    
    // Get single elector
    getElector: builder.query<Elector, number>({
      query: (id) => `/electors/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Elector', id }],
    }),
    
    // Advanced search
    searchElectors: builder.query<ElectorListResponse, ElectorSearchParams>({
      query: (params) => ({
        url: '/electors/search/',
        params,
      }),
    }),
    
    // Create elector
    createElector: builder.mutation<Elector, Partial<Elector>>({
      query: (elector) => ({
        url: '/electors/',
        method: 'POST',
        body: elector,
      }),
      invalidatesTags: [{ type: 'Elector', id: 'LIST' }],
    }),
    
    // Update elector
    updateElector: builder.mutation<Elector, { id: number; data: Partial<Elector> }>({
      query: ({ id, data }) => ({
        url: `/electors/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Elector', id }],
    }),
    
    // Delete elector
    deleteElector: builder.mutation<void, number>({
      query: (id) => ({
        url: `/electors/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Elector', id }],
    }),
    
    // Import CSV
    importElectorsCsv: builder.mutation<{ success: boolean; imported: number }, FormData>({
      query: (formData) => ({
        url: '/electors/import_csv/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Elector', id: 'LIST' }],
    }),
    
    // Export CSV
    exportElectorsCsv: builder.query<Blob, void>({
      query: () => ({
        url: '/electors/export_csv/',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useListElectorsQuery,
  useGetElectorQuery,
  useSearchElectorsQuery,
  useCreateElectorMutation,
  useUpdateElectorMutation,
  useDeleteElectorMutation,
  useImportElectorsCsvMutation,
  useLazyExportElectorsCsvQuery,
} = electorsApi;
```

---

## 🧩 Component Architecture

### Component Categories

#### 1. **Page Components** (Routes)
Location: `src/features/{feature}/pages/`

Example: `ElectorsListPage.tsx`
```typescript
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useListElectorsQuery } from '../api/electorsApi';
import { ElectorsTable } from '../components/ElectorsTable';
import { ElectorSearchForm } from '../components/ElectorSearchForm';

export const ElectorsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = React.useState({});
  const { data, isLoading, error } = useListElectorsQuery(searchParams);
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Electors Database
        </Typography>
        
        <ElectorSearchForm onSearch={setSearchParams} />
      </Box>
      
      <ElectorsTable
        electors={data?.results || []}
        loading={isLoading}
        error={error}
      />
    </Container>
  );
};
```

#### 2. **Feature Components**
Location: `src/features/{feature}/components/`

Example: `ElectorsTable.tsx`
```typescript
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Elector } from '../types';

interface ElectorsTableProps {
  electors: Elector[];
  loading?: boolean;
  error?: any;
  onEdit?: (elector: Elector) => void;
  onDelete?: (id: number) => void;
}

export const ElectorsTable: React.FC<ElectorsTableProps> = ({
  electors,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert error={error} />;
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>KOC ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {electors.map((elector) => (
            <TableRow key={elector.id} hover>
              <TableCell>{elector.kocId}</TableCell>
              <TableCell>
                {`${elector.nameFirst} ${elector.nameSecond} ${elector.nameLast}`}
              </TableCell>
              <TableCell>{elector.designation}</TableCell>
              <TableCell>{elector.section}</TableCell>
              <TableCell>{elector.mobile}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit?.(elector)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete?.(elector.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

#### 3. **Shared UI Components**
Location: `src/shared/components/ui/`

Examples:
- `Button.tsx` - Consistent button styling
- `Card.tsx` - Reusable card component
- `Modal.tsx` - Modal wrapper
- `Tabs.tsx` - Tab navigation
- `Badge.tsx` - Status badges
- `Chip.tsx` - Tag/chip component
- `Avatar.tsx` - User avatars
- `Tooltip.tsx` - Tooltips
- `Alert.tsx` - Alert messages
- `Skeleton.tsx` - Loading skeletons

#### 4. **Form Components**
Location: `src/shared/components/forms/`

Examples:
- `TextField.tsx` - Text input with validation
- `Select.tsx` - Dropdown select
- `DatePicker.tsx` - Date picker
- `Checkbox.tsx` - Checkbox with label
- `Radio.tsx` - Radio button group
- `Switch.tsx` - Toggle switch
- `FileUpload.tsx` - File upload
- `FormSection.tsx` - Form section wrapper

#### 5. **Layout Components**
Location: `src/shared/components/layout/`

Examples:
- `AppLayout.tsx` - Main app layout
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - App header/navbar
- `Footer.tsx` - App footer
- `PageHeader.tsx` - Page title/actions
- `ContentCard.tsx` - Content wrapper

---

## 📅 Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Duration**: 2 weeks  
**Priority**: Critical

#### Tasks
1. **Project Setup** (2 days)
   - [ ] Create Vite + React + TypeScript project
   - [ ] Install and configure dependencies
   - [ ] Setup folder structure
   - [ ] Configure ESLint, Prettier
   - [ ] Setup Git hooks (Husky)

2. **Theme & Design System** (3 days)
   - [ ] Configure MUI theme
   - [ ] Define color palette
   - [ ] Setup typography
   - [ ] Create shared UI components
   - [ ] Implement responsive layout

3. **Authentication** (5 days)
   - [ ] Login page
   - [ ] JWT token management
   - [ ] Auth slice (Redux)
   - [ ] Auth API integration
   - [ ] Protected routes
   - [ ] Auto-logout on token expiry
   - [ ] Remember me functionality

4. **App Layout** (2 days)
   - [ ] Main layout component
   - [ ] Sidebar navigation
   - [ ] Header with user menu
   - [ ] Breadcrumbs
   - [ ] Footer

**Deliverables**:
- ✅ Working authentication system
- ✅ Base layout with navigation
- ✅ Design system established
- ✅ Project structure ready

---

### Phase 2: User Management (Week 3)
**Duration**: 1 week  
**Priority**: High

#### Tasks
1. **Users List** (2 days)
   - [ ] Users table with pagination
   - [ ] Search and filter
   - [ ] Sort by columns
   - [ ] Role badges

2. **User Forms** (2 days)
   - [ ] Create user form
   - [ ] Edit user form
   - [ ] Form validation
   - [ ] Role selection
   - [ ] Team & committee assignment

3. **User Details** (1 day)
   - [ ] User profile page
   - [ ] Activity history
   - [ ] Edit/delete actions

4. **Password Management** (1 day)
   - [ ] Change password form
   - [ ] Password strength indicator
   - [ ] Reset password flow

**Deliverables**:
- ✅ Complete user management CRUD
- ✅ Role-based UI elements
- ✅ User profile pages

---

### Phase 3: Elections & Electors (Week 4-5)
**Duration**: 2 weeks  
**Priority**: High

#### Tasks (Week 4: Elections)
1. **Elections List** (2 days)
   - [ ] Elections table
   - [ ] Status indicators
   - [ ] Active/inactive filters

2. **Election Forms** (2 days)
   - [ ] Create election form
   - [ ] Edit election form
   - [ ] Date range picker
   - [ ] Voting options configuration

3. **Committees Management** (1 day)
   - [ ] Committees list
   - [ ] Create/edit committee
   - [ ] Staff assignment
   - [ ] Committee statistics

#### Tasks (Week 5: Electors)
1. **Electors List** (2 days)
   - [ ] Electors table with advanced search
   - [ ] 13-field search form
   - [ ] Name display (7-part)
   - [ ] Export to CSV/Excel

2. **CSV Import** (2 days)
   - [ ] File upload component
   - [ ] Import preview
   - [ ] Validation errors display
   - [ ] Progress indicator

3. **Elector Details** (1 day)
   - [ ] Elector profile page
   - [ ] Edit elector form
   - [ ] History/activity

**Deliverables**:
- ✅ Election configuration UI
- ✅ Committee management
- ✅ Elector database with advanced search
- ✅ CSV import/export

---

### Phase 4: Guarantee Collection (Week 6-7)
**Duration**: 2 weeks  
**Priority**: Critical (Core Feature)

#### Tasks (Week 6: Core Functionality)
1. **Guarantees List** (2 days)
   - [ ] Personal guarantees table
   - [ ] Status badges (Strong/Medium/Weak)
   - [ ] Group filters
   - [ ] Search by elector

2. **Guarantee Forms** (2 days)
   - [ ] Create guarantee form
   - [ ] Elector search/select
   - [ ] Status selection with colors
   - [ ] Group assignment (multi-select)

3. **Custom Groups** (1 day)
   - [ ] Groups management
   - [ ] Create/edit group
   - [ ] Color picker
   - [ ] Group statistics

#### Tasks (Week 7: Advanced Features)
1. **Notes System** (2 days)
   - [ ] Add note form
   - [ ] Notes timeline
   - [ ] Edit/delete notes
   - [ ] Rich text editor (optional)

2. **History Tracking** (1 day)
   - [ ] Audit trail display
   - [ ] Changes timeline
   - [ ] User attribution

3. **Follow-ups** (1 day)
   - [ ] Schedule follow-up
   - [ ] Overdue indicators
   - [ ] Follow-up reminders

4. **Bulk Operations** (1 day)
   - [ ] Bulk status update
   - [ ] Bulk group assignment
   - [ ] Bulk delete

**Deliverables**:
- ✅ Complete guarantee management system
- ✅ Custom groups with colors
- ✅ Notes and history
- ✅ Follow-up scheduling
- ✅ Bulk operations

---

### Phase 5: Dashboards & Reports (Week 8-9)
**Duration**: 2 weeks  
**Priority**: High

#### Tasks (Week 8: Dashboards)
1. **Personal Dashboard** (2 days)
   - [ ] Statistics cards
   - [ ] Recent guarantees
   - [ ] Overdue follow-ups
   - [ ] Charts (guarantee distribution)

2. **Supervisor Dashboard** (2 days)
   - [ ] Team statistics
   - [ ] Team members list
   - [ ] Team performance charts
   - [ ] Coverage analysis

3. **Admin Dashboard** (1 day)
   - [ ] Overall statistics
   - [ ] Election status
   - [ ] Committee performance
   - [ ] System-wide metrics

#### Tasks (Week 9: Reports)
1. **Coverage Report** (2 days)
   - [ ] Electors vs. guarantees
   - [ ] Coverage percentage
   - [ ] Gap analysis
   - [ ] Export functionality

2. **Accuracy Report** (1 day)
   - [ ] Guarantees vs. attendance
   - [ ] Accuracy metrics
   - [ ] Comparison charts

3. **Committee Performance** (1 day)
   - [ ] Committee comparison
   - [ ] Performance metrics
   - [ ] Visual charts

4. **Chart Components** (1 day)
   - [ ] Bar charts
   - [ ] Pie charts
   - [ ] Line charts
   - [ ] Heatmaps

**Deliverables**:
- ✅ 3-level dashboards (Personal, Supervisor, Admin)
- ✅ Coverage and accuracy reports
- ✅ Committee performance analysis
- ✅ Export functionality
- ✅ Interactive charts

---

### Phase 6: Attendance & Voting (Week 10-11)
**Duration**: 2 weeks  
**Priority**: Critical (Election Day)

#### Tasks (Week 10: Attendance)
1. **Attendance Marking** (2 days)
   - [ ] KOC ID search
   - [ ] Elector confirmation dialog
   - [ ] Mark attendance button
   - [ ] Walk-in elector creation

2. **Attendance List** (1 day)
   - [ ] Attendance records table
   - [ ] Committee filter
   - [ ] Real-time statistics

3. **Attendance Statistics** (1 day)
   - [ ] Total attendance count
   - [ ] Committee breakdown
   - [ ] Turnout percentage
   - [ ] Real-time updates

#### Tasks (Week 11: Voting)
1. **Vote Entry** (3 days)
   - [ ] Committee selection
   - [ ] Candidate list
   - [ ] Vote count input (bulk)
   - [ ] Verification step
   - [ ] Progress indicator

2. **Results Display** (2 days)
   - [ ] Final results page
   - [ ] Committee-wise results
   - [ ] Overall results
   - [ ] Winner badges
   - [ ] Results charts

3. **Audit Trail** (1 day)
   - [ ] Vote entry history
   - [ ] Device information
   - [ ] User attribution
   - [ ] Timeline view

**Deliverables**:
- ✅ Attendance tracking system
- ✅ Vote counting interface
- ✅ Results compilation and display
- ✅ Complete audit trail

---

### Phase 7: Testing & Polish (Week 12)
**Duration**: 1 week  
**Priority**: High

#### Tasks
1. **Testing** (3 days)
   - [ ] Unit tests for key components
   - [ ] Integration tests for workflows
   - [ ] E2E tests for critical paths
   - [ ] Cross-browser testing
   - [ ] Mobile responsiveness testing

2. **Performance Optimization** (2 days)
   - [ ] Code splitting
   - [ ] Lazy loading
   - [ ] Image optimization
   - [ ] Bundle size optimization
   - [ ] Lighthouse audit

3. **Accessibility** (1 day)
   - [ ] Keyboard navigation
   - [ ] Screen reader support
   - [ ] ARIA labels
   - [ ] Color contrast check

4. **Bug Fixes & Polish** (1 day)
   - [ ] Fix reported bugs
   - [ ] UI/UX improvements
   - [ ] Final QA

**Deliverables**:
- ✅ Test coverage > 70%
- ✅ Performance score > 90
- ✅ WCAG 2.1 AA compliance
- ✅ Production-ready application

---

## 👥 User Roles & Access Control

### Role Hierarchy
```
SUPER_ADMIN
    ↓
  ADMIN
    ↓
 SUPERVISOR
    ↓
  USER
```

### Role Capabilities

#### SUPER_ADMIN
**Full System Access**
- ✅ All user management
- ✅ All election configuration
- ✅ All elector operations
- ✅ View all guarantees (system-wide)
- ✅ All reports and analytics
- ✅ System configuration

**UI Access**:
- All pages and features
- System settings
- User role management

---

#### ADMIN
**Operational Management**
- ✅ User management (except super admins)
- ✅ Election configuration
- ✅ Committee management
- ✅ Elector operations
- ✅ View all guarantees
- ✅ All reports
- ✅ Vote aggregation

**UI Access**:
- All pages except system settings
- Admin dashboard
- Full reports access

---

#### SUPERVISOR
**Team Management**
- ✅ View team members
- ✅ View assigned committees
- ✅ View team guarantees
- ✅ Assign staff to committees
- ✅ Mark attendance
- ✅ Enter vote counts
- ✅ Supervisor dashboard

**UI Access**:
- Supervisor dashboard
- Team guarantees
- Assigned committees
- Attendance marking
- Vote entry

---

#### USER
**Guarantee Collection**
- ✅ Personal guarantees only
- ✅ Create/edit/delete own guarantees
- ✅ Custom groups
- ✅ Add notes
- ✅ Schedule follow-ups
- ✅ Personal dashboard
- ✅ Personal statistics

**UI Access**:
- Personal dashboard
- My guarantees
- My statistics
- Profile settings

---

### Implementing Access Control

#### Protected Routes
```typescript
// src/shared/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

#### Usage in Routes
```typescript
// src/app/routes.tsx
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <UsersListPage />
    </ProtectedRoute>
  }
/>
```

#### Conditional UI
```typescript
// Hide buttons based on role
import { useAppSelector } from '@/app/hooks';

const { user } = useAppSelector((state) => state.auth);
const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);

{isAdmin && (
  <Button onClick={handleDelete}>Delete</Button>
)}
```

---

## 🎯 Key Features by Module

### 1. Authentication Module

#### Login Page
- Email/password login
- Remember me checkbox
- Forgot password link
- Form validation
- Error handling
- Loading states

#### Features
- JWT token storage
- Auto-refresh tokens
- Auto-logout on expiry
- Redirect after login
- Protected routes

---

### 2. User Management Module

#### Users List
- Paginated table
- Search by email/name
- Filter by role
- Sort by columns
- Create/edit/delete actions
- Role badges

#### User Form
- Email (unique)
- First name, last name
- Role selection
- Password (create only)
- Supervisor assignment (optional)
- Team assignment (array)
- Committee assignment (array)
- Form validation

#### User Profile
- View user details
- Edit user information
- Change password
- Activity history
- Assigned teams/committees

---

### 3. Elections Module

#### Elections List
- Active/inactive elections
- Status indicators
- Voting dates
- Committee count
- Actions (edit, delete)

#### Election Form
- Election name
- Start/end dates (date picker)
- Status (draft, active, completed)
- Voting options (flexible configuration)
- Is active toggle

#### Committees Management
- List committees per election
- Male/female segregation
- Committee code (unique)
- Assign supervisors
- Assign staff
- Statistics (electors, attendance, votes)

---

### 4. Electors Module

#### Electors List
- Advanced search (13 fields)
- 7-part name display
- Designation, section, location
- Mobile, area, team
- Pagination
- Export to CSV/Excel

#### Advanced Search
- KOC ID
- Civil ID
- All 7 name fields
- Designation
- Section
- Location
- Mobile
- Area
- Team

#### CSV Import
- File upload (drag & drop)
- Preview data (first 10 rows)
- Validation errors display
- Progress indicator
- Success/error summary

#### Elector Details
- Full profile
- All 7 name parts
- All employee information
- Edit form
- Delete action

---

### 5. Guarantees Module

#### Personal Guarantees List
- Table with columns:
  - Elector name
  - Status (Strong/Medium/Weak with colors)
  - Groups (chips)
  - Last contact date
  - Follow-up date
  - Actions
- Filters:
  - Status
  - Groups
  - Overdue follow-ups
- Search by elector name
- Sort by any column

#### Create/Edit Guarantee
- Elector search & select
- Status selection (colored buttons):
  - Strong (green)
  - Medium (orange)
  - Weak (red)
- Group assignment (multi-select)
- Follow-up date picker
- Last contact date
- Notes field

#### Custom Groups
- Create group dialog
- Group name
- Color picker (10+ preset colors)
- Edit/delete groups
- Group statistics (count)

#### Notes System
- Add note dialog
- Notes timeline (newest first)
- Edit/delete notes
- User attribution
- Timestamps

#### History Tracking
- All changes logged
- Field name, old/new value
- User who made change
- Timestamp
- Timeline view

#### Bulk Operations
- Select multiple guarantees (checkboxes)
- Bulk actions:
  - Update status
  - Assign groups
  - Delete
- Confirmation dialog

#### Statistics
- Total guarantees
- By status (Strong/Medium/Weak)
- By group
- Coverage percentage
- Charts (pie/bar)

---

### 6. Dashboards Module

#### Personal Dashboard (All Users)
- Statistics cards:
  - Total guarantees
  - Strong/Medium/Weak counts
  - Overdue follow-ups
- Recent guarantees (last 10)
- Upcoming follow-ups
- Guarantee distribution chart (pie)

#### Supervisor Dashboard
- Team statistics:
  - Total team guarantees
  - Coverage percentage
  - Team members count
- Team members list with individual stats
- Team performance chart
- Overdue follow-ups (team-wide)

#### Admin Dashboard
- System-wide statistics:
  - Total electors
  - Total guarantees
  - Coverage percentage
  - Total attendance
  - Vote counts
- Election status
- Committee performance
- Multiple charts:
  - Coverage by committee
  - Guarantee distribution
  - Attendance trends

---

### 7. Reports Module

#### Coverage Report
- Parameters:
  - Election
  - Committee (optional)
  - Date range
- Displays:
  - Total electors
  - Total guarantees
  - Coverage percentage
  - Gap count
- Table: Electors without guarantees
- Export to CSV/Excel

#### Accuracy Report
- Parameters:
  - Election
  - Committee (optional)
- Displays:
  - Guarantees (Strong/Medium/Weak)
  - Actual attendance
  - Accuracy percentage
- Comparison table
- Export functionality

#### Committee Performance
- All committees comparison
- Metrics:
  - Electors count
  - Guarantees count
  - Attendance count
  - Vote counts
- Performance chart (bar chart)
- Export functionality

#### Chart Components
- Bar charts (Chart.js)
- Pie charts
- Line charts (trends)
- Heatmaps (optional)
- Responsive design
- Legend, tooltips

---

### 8. Attendance Module

#### Mark Attendance Page
- KOC ID search field
- Search button
- Elector details display:
  - Name (7 parts)
  - Designation
  - Section
  - Mobile
- Confirmation dialog
- Mark attendance button
- Walk-in elector creation dialog

#### Attendance List
- Table columns:
  - Elector name
  - Committee
  - Attended at (time)
  - Marked by (user)
  - Is walk-in
- Committee filter
- Date/time range filter
- Real-time updates

#### Attendance Statistics
- Total attendance count
- Committee breakdown
- Turnout percentage
- Real-time charts
- Export attendance list

---

### 9. Voting Module

#### Vote Entry Page
- Committee selection dropdown
- Candidate list (from system)
- Vote count inputs (numeric)
- Bulk entry form
- Notes field
- Device info (auto-captured)
- Submit button
- Progress indicator

#### Results Page
- Tab navigation:
  - Overall results
  - Committee-wise results
- Results table:
  - Rank
  - Candidate name
  - Total votes
  - Winner badge (top 19)
- Charts:
  - Vote distribution (bar chart)
  - Committee comparison
- Export results (PDF/Excel)

#### Audit Trail
- Vote entry history table
- Columns:
  - Candidate
  - Votes
  - Entered by
  - Entry time
  - Device info
  - Notes
- Filter by committee/date
- Timeline view

---

## 🧪 Testing Strategy

### Unit Testing (Vitest + React Testing Library)

#### Test Coverage Goals
- **Components**: 80%+
- **Hooks**: 90%+
- **Utils**: 95%+
- **Redux Slices**: 90%+

#### Example: Component Test
```typescript
// src/features/electors/components/ElectorsTable.test.tsx
import { render, screen } from '@testing-library/react';
import { ElectorsTable } from './ElectorsTable';

describe('ElectorsTable', () => {
  const mockElectors = [
    {
      id: 1,
      kocId: '12345',
      nameFirst: 'Ahmed',
      nameLast: 'Al-Mutairi',
      designation: 'Engineer',
      section: 'IT',
      mobile: '99999999',
    },
  ];
  
  it('renders elector data correctly', () => {
    render(<ElectorsTable electors={mockElectors} />);
    
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText(/Ahmed.*Al-Mutairi/)).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });
  
  it('shows loading skeleton when loading', () => {
    render(<ElectorsTable electors={[]} loading={true} />);
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
  
  it('shows error message when error occurs', () => {
    render(<ElectorsTable electors={[]} error={{ message: 'Failed' }} />);
    
    expect(screen.getByText(/Failed/)).toBeInTheDocument();
  });
});
```

#### Example: Hook Test
```typescript
// src/shared/hooks/useDebounce.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );
    
    expect(result.current).toBe('initial');
    
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still old value
    
    await waitFor(() => expect(result.current).toBe('updated'), {
      timeout: 600,
    });
  });
});
```

---

### Integration Testing

#### Test Critical Workflows
1. **Login → Dashboard**: User can log in and see dashboard
2. **Create Guarantee**: User can create a guarantee from search to save
3. **Mark Attendance**: User can search elector and mark attendance
4. **Vote Entry**: User can enter votes and see results

#### Example: Integration Test
```typescript
// src/features/guarantees/tests/createGuarantee.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { CreateGuaranteePage } from '../pages/CreateGuaranteePage';

describe('Create Guarantee Workflow', () => {
  it('allows user to create a guarantee', async () => {
    const user = userEvent.setup();
    
    render(
      <Provider store={store}>
        <CreateGuaranteePage />
      </Provider>
    );
    
    // Search for elector
    const searchInput = screen.getByLabelText(/search elector/i);
    await user.type(searchInput, '12345');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    // Select elector
    await waitFor(() => screen.getByText('Ahmed Al-Mutairi'));
    await user.click(screen.getByText('Ahmed Al-Mutairi'));
    
    // Select status
    await user.click(screen.getByRole('button', { name: /strong/i }));
    
    // Add note
    const noteInput = screen.getByLabelText(/notes/i);
    await user.type(noteInput, 'Test note');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify success
    await waitFor(() =>
      expect(screen.getByText(/guarantee created/i)).toBeInTheDocument()
    );
  });
});
```

---

### E2E Testing (Cypress)

#### Critical User Journeys
1. **Admin User Journey**:
   - Login as admin
   - Create election
   - Create committees
   - Import electors
   - View admin dashboard

2. **User Guarantee Journey**:
   - Login as user
   - View personal dashboard
   - Create guarantee
   - Add note
   - Schedule follow-up

3. **Voting Day Journey**:
   - Login as supervisor
   - Mark attendance
   - Enter vote counts
   - View results

#### Example: E2E Test
```typescript
// cypress/e2e/admin-create-election.cy.ts
describe('Admin creates election', () => {
  beforeEach(() => {
    cy.login('admin@koc.com', 'password123');
  });
  
  it('creates a new election with committees', () => {
    // Navigate to elections
    cy.visit('/elections');
    cy.contains('Create Election').click();
    
    // Fill election form
    cy.get('[name="name"]').type('2025 Employee Council Election');
    cy.get('[name="startDate"]').type('2025-11-01');
    cy.get('[name="endDate"]').type('2025-11-15');
    cy.contains('Submit').click();
    
    // Verify creation
    cy.contains('Election created successfully');
    cy.contains('2025 Employee Council Election');
    
    // Create committee
    cy.contains('Add Committee').click();
    cy.get('[name="name"]').type('Male Committee - Building A');
    cy.get('[name="code"]').type('M-A-01');
    cy.get('[name="gender"]').select('MALE');
    cy.contains('Submit').click();
    
    // Verify committee
    cy.contains('Male Committee - Building A');
  });
});
```

---

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Lazy load routes
import { lazy, Suspense } from 'react';

const ElectorsListPage = lazy(() => import('./features/electors/pages/ElectorsListPage'));
const GuaranteesListPage = lazy(() => import('./features/guarantees/pages/GuaranteesListPage'));

// In routes
<Route
  path="/electors"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <ElectorsListPage />
    </Suspense>
  }
/>
```

### Memoization
```typescript
import React, { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);

// Memoize callbacks
const handleClick = useCallback((id: number) => {
  // Handle click
}, []);

// Memoize components
const MemoizedTable = React.memo(ElectorsTable);
```

### Virtualization (Large Lists)
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const ElectorsVirtualList: React.FC<{ electors: Elector[] }> = ({ electors }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: electors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {electors[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading
- Use `srcset` for responsive images
- Compress images before deployment

### Bundle Size Optimization
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Tree shaking (automatic with Vite)
# Import only what you need
import { Button } from '@mui/material'; // Good
import * as MUI from '@mui/material'; // Bad
```

---

## 🚀 Deployment

### Build for Production
```bash
# Build
npm run build

# Output: dist/ folder

# Preview build
npm run preview
```

### Environment Variables (Production)
```env
# .env.production
VITE_API_BASE_URL=https://api.koc-election.com/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Election Management System
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

### Hosting Options

#### Option 1: Nginx (Static Hosting)
```nginx
server {
    listen 80;
    server_name election.koc.com;
    
    root /var/www/election/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option 2: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Option 3: Docker
**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 📋 Checklist & Summary

### Development Phases Summary

| Phase | Duration | Status | Priority |
|-------|----------|--------|----------|
| Phase 1: Foundation | 2 weeks | Pending | Critical |
| Phase 2: User Management | 1 week | Pending | High |
| Phase 3: Elections & Electors | 2 weeks | Pending | High |
| Phase 4: Guarantee Collection | 2 weeks | Pending | Critical |
| Phase 5: Dashboards & Reports | 2 weeks | Pending | High |
| Phase 6: Attendance & Voting | 2 weeks | Pending | Critical |
| Phase 7: Testing & Polish | 1 week | Pending | High |
| **Total** | **12 weeks** | **0%** | **-** |

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] All 93+ API endpoints integrated
- [ ] All user roles implemented with proper access control
- [ ] All CRUD operations functional
- [ ] Real-time updates working
- [ ] CSV import/export working
- [ ] Reports generation working
- [ ] Charts and visualizations working

### Non-Functional Requirements
- [ ] Page load time < 2 seconds
- [ ] Lighthouse performance score > 90
- [ ] Mobile responsive (all screen sizes)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Test coverage > 70%

### User Experience
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Loading states for all async operations
- [ ] Confirmation dialogs for destructive actions
- [ ] Helpful tooltips and hints
- [ ] Keyboard navigation support

---

## 📞 Support & Resources

### Documentation
- **Backend API**: See backend app READMEs
- **Design System**: Material-UI documentation
- **State Management**: Redux Toolkit documentation
- **Testing**: React Testing Library + Vitest documentation

### Development Team
- **Backend Lead**: Refer to backend team
- **Frontend Lead**: TBD
- **UI/UX Designer**: TBD
- **QA Lead**: TBD

---

**Document Version**: 1.0  
**Status**: Planning Phase  
**Last Updated**: October 24, 2025  
**Next Review**: After Phase 1 completion

**🚀 READY TO START FRONTEND DEVELOPMENT! 🚀**

