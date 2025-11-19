# Frontend Documentation

React + TypeScript + Material UI frontend application with Redux state management.

## Overview

Simplified User Management App built with React 19, TypeScript, Material UI, and Redux. Features clean architecture, focused state management for authentication and user management, and production-ready patterns.

**Current Focus**: User Management Application
- Authentication (Login, Register, Password Reset)
- User CRUD Operations
- Profile Management

---

## 🎯 Simplified Architecture (October 2025)

This frontend has been streamlined to focus exclusively on **User Management**:

### What's Included ✅
- **Store**: Auth, User, Snackbar only
- **Types**: Auth, User, Config, Menu, Snackbar
- **Selectors**: Auth and User selectors
- **Menu**: Dashboard and Users only
- **Routes**: Dashboard, Authentication, and User Management routes

### What Was Removed 🗑️
- ❌ Business, Booking, CRM, HR, Marketing, Finance modules
- ❌ 40+ store modules (campaigns, inventory, projects, etc.)
- ❌ 40+ type files (calendar, invoice, products, etc.)
- ❌ Unnecessary selectors and menu items
- ❌ Complex application routes

### Benefits 🚀
- **Cleaner Codebase**: Easier to navigate and understand
- **Faster Build Times**: Fewer files to compile
- **Easier Maintenance**: Focus on core functionality
- **Better Performance**: Smaller bundle size
- **Simpler Onboarding**: Less cognitive overhead

---

## Tech Stack

### Core Technologies
- **Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **UI Library**: Material UI (MUI) 7.0.2
- **State Management**: Redux Toolkit 2.8.2 + Redux Saga 1.3.0
- **Routing**: React Router 7.5.2
- **Build Tool**: Vite 6.3.3
- **HTTP Client**: Axios 1.9.0

### Key Dependencies
- **Form Management**: Formik 2.4.6 + Yup 1.6.1, React Hook Form 7.56.1
- **Date/Time**: date-fns 4.1.0, moment 2.30.1
- **Charts**: ApexCharts 4.7.0, Recharts 3.2.1
- **Calendar**: FullCalendar 6.1.17
- **Data Grid**: MUI X Data Grid 8.1.0
- **Notifications**: Notistack 3.0.2, React Toastify 11.0.5
- **Icons**: Tabler Icons 3.31.0, MUI Icons 7.0.2
- **Authentication**: JWT (Default), Auth0, Firebase, AWS Cognito, Supabase support

### Development Tools
- **Linting**: ESLint 9.25.1 + TypeScript ESLint 8.31.0
- **Code Formatting**: Prettier 3.5.3
- **Type Checking**: TypeScript strict mode
- **Testing**: Storybook 8.6.14
- **Package Manager**: Yarn 4.9.1

---

## Directory Structure

```
frontend/
├── src/
│   ├── api/                    # API service layer (28 files)
│   │   ├── account.ts          # Account/auth endpoints
│   │   ├── booking.ts          # Booking services
│   │   ├── crm.ts              # CRM endpoints
│   │   ├── marketing.ts        # Marketing APIs
│   │   └── ...
│   ├── assets/                 # Static assets
│   │   ├── images/             # SVG images (87 files)
│   │   └── scss/               # Global styles (SCSS)
│   ├── config.ts               # App configuration
│   ├── contexts/               # React Context providers
│   │   ├── JWTContext.tsx      # JWT authentication (default)
│   │   ├── FirebaseContext.tsx # Firebase auth
│   │   ├── Auth0Context.tsx    # Auth0 integration
│   │   ├── AWSCognitoContext.tsx
│   │   ├── SupabaseContext.tsx
│   │   └── ConfigContext.tsx   # Theme/config context
│   ├── data/                   # Static data
│   │   └── location.ts
│   ├── helpers/                # API helpers and utilities
│   │   ├── api/                # API endpoint helpers (34 files)
│   │   ├── api_client.ts       # Axios client wrapper
│   │   ├── api_helper.ts       # API helper functions
│   │   ├── backend_helper.ts   # Backend integration
│   │   ├── url_helper.ts       # URL constants
│   │   └── urls/               # Endpoint URL definitions (18 files)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useBusinessContext.ts
│   │   ├── useConfig.ts        # Theme configuration
│   │   ├── useDataGrid.ts      # Data grid utilities
│   │   ├── useLocalStorage.ts
│   │   ├── useMenuCollapse.ts
│   │   └── useScriptRef.ts
│   ├── layout/                 # Layout components
│   │   ├── MainLayout/         # Main app layout (25 files)
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Drawer/
│   │   │   └── LogoSection/
│   │   ├── MinimalLayout/      # Auth pages layout
│   │   ├── SimpleLayout/       # Simple layout
│   │   ├── Customization/      # Theme customization (10 files)
│   │   ├── NavigationScroll.tsx
│   │   └── NavMotion.tsx
│   ├── menu-items/             # Menu configuration (SIMPLIFIED)
│   │   ├── index.ts            # Menu aggregator
│   │   ├── dashboard.ts        # Dashboard menu
│   │   └── users.ts            # User management menu
│   ├── metrics/                # Analytics tracking
│   │   ├── GTag.tsx            # Google Analytics
│   │   ├── MicrosoftClarity.tsx
│   │   └── Notify.tsx
│   ├── routes/                 # Route configuration
│   │   ├── index.tsx           # Route aggregator
│   │   ├── MainRoutes.tsx      # Protected routes
│   │   ├── AuthenticationRoutes.tsx
│   │   ├── LoginRoutes.tsx
│   │   ├── SimpleRoutes.tsx
│   │   └── ErrorBoundary.tsx
│   ├── selectors/              # Redux selectors (SIMPLIFIED)
│   │   ├── index.ts            # Selector exports
│   │   ├── authSelector.ts     # Auth selectors
│   │   └── userSelector.ts     # User selectors
│   ├── shared/                 # Shared components & utilities
│   │   ├── components/         # Reusable components (80 files)
│   │   ├── hooks/              # Shared hooks (15 files)
│   │   ├── utils/              # Shared utilities (8 files)
│   │   └── constants/          # Constants (9 files)
│   ├── store/                  # Redux store (SIMPLIFIED)
│   │   ├── index.ts            # Store configuration
│   │   ├── rootReducer.ts      # Combined reducers (auth, user, snackbar only)
│   │   ├── rootSaga.ts         # Combined sagas (auth, user only)
│   │   ├── actions.ts          # Action types
│   │   ├── types.ts            # Store types
│   │   ├── accountReducer.ts   # Legacy account reducer
│   │   ├── constant.ts         # Constants
│   │   ├── auth/               # Auth module
│   │   │   ├── reducer.ts
│   │   │   ├── saga.ts
│   │   │   ├── actions.ts
│   │   │   ├── actionTypes.ts
│   │   │   └── types.ts
│   │   ├── user/               # User module
│   │   │   ├── reducer.ts
│   │   │   ├── saga.ts
│   │   │   └── actions.ts
│   │   └── snackbar/           # Notifications module
│   │       ├── reducer.ts
│   │       └── actions.ts
│   ├── themes/                 # MUI theme configuration
│   │   ├── index.tsx           # Theme provider
│   │   ├── palette.tsx         # Color palette
│   │   ├── typography.tsx      # Typography
│   │   ├── shadows.tsx         # Shadows
│   │   ├── compStyleOverride.tsx
│   │   └── overrides/
│   ├── types/                  # TypeScript type definitions (SIMPLIFIED)
│   │   ├── index.ts            # Main type exports
│   │   ├── auth.ts             # Authentication types
│   │   ├── user.ts             # User types
│   │   ├── user-profile.ts     # User profile types
│   │   ├── config.ts           # App configuration types
│   │   ├── menu.ts             # Menu structure types
│   │   ├── snackbar.ts         # Notification types
│   │   ├── default-theme.ts    # Theme types
│   │   └── overrides/          # MUI type overrides (6 files)
│   ├── ui-component/           # UI components (100 files)
│   │   ├── cards/              # Card components (57 files)
│   │   ├── extended/           # Extended components (23 files)
│   │   ├── third-party/        # Third-party wrappers (15 files)
│   │   ├── Loadable.tsx        # Lazy loading wrapper
│   │   ├── Loader.tsx          # Loading spinner
│   │   ├── Locales.tsx         # Internationalization
│   │   ├── Logo.tsx
│   │   └── RTLLayout.tsx       # RTL support
│   ├── utils/                  # Utility functions
│   │   ├── axios.ts            # Axios instance & interceptors
│   │   ├── route-guard/        # Auth guards (2 files)
│   │   ├── locales/            # Translation files (4 files)
│   │   ├── exportUtils.ts
│   │   ├── imageUtils.ts
│   │   └── password-strength.ts
│   ├── views/                  # Page components (515 files)
│   │   ├── dashboard/          # Dashboard pages (15 files)
│   │   ├── application/        # Application pages (78 files)
│   │   ├── settings/           # Settings pages (99 files)
│   │   ├── forms/              # Form pages (111 files)
│   │   ├── pages/              # Auth & static pages (79 files)
│   │   ├── ui-elements/        # UI demo pages (71 files)
│   │   ├── widget/             # Widget pages (48 files)
│   │   ├── utilities/          # Utility pages (13 files)
│   │   └── sample-page/        # Sample page template
│   ├── App.tsx                 # Root component
│   ├── index.tsx               # Entry point
│   └── vite-env.d.ts           # Vite types
├── public/                     # Public assets
├── dist/                       # Build output
├── .storybook/                 # Storybook config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.mts             # Vite config
├── eslint.config.mjs           # ESLint config
└── README.md
```

---

## Architecture Patterns

### 1. Component Architecture

**Pattern**: Functional components with TypeScript

```typescript
// Basic component structure
import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

interface MyComponentProps {
  title: string;
  data?: any;
  onAction?: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, data, onAction }) => {
  return (
    <MainCard title={title}>
      <Typography variant="body2">
        {/* Component content */}
      </Typography>
    </MainCard>
  );
};

export default MyComponent;
```

**Key Principles**:
- ✅ Functional components only (no class components)
- ✅ TypeScript interfaces for all props
- ✅ Use Material UI components
- ✅ Lazy loading for routes with `Loadable`
- ✅ Proper component composition

### 2. State Management (Redux + Saga)

**Store Structure**: Modular Redux with Redux Toolkit and Redux Saga for async operations

```typescript
// Store configuration (store/index.ts)
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Module Pattern**: Each feature has its own Redux module

```
store/
├── auth/
│   ├── reducer.ts        # Redux reducer
│   ├── saga.ts           # Redux saga for async
│   ├── actions.ts        # Action creators
│   ├── actionTypes.ts    # Action type constants
│   └── types.ts          # TypeScript types
├── crm/
│   ├── clients/
│   │   ├── reducer.ts
│   │   ├── saga.ts
│   │   └── actions.ts
│   └── ...
└── rootReducer.ts        # Combine all reducers
```

**Example Module Structure**:

```typescript
// actionTypes.ts
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_ERROR = 'AUTH_LOGIN_ERROR';

// actions.ts
export const loginUser = (credentials: any) => ({
  type: AUTH_LOGIN_REQUEST,
  payload: credentials
});

// reducer.ts
const initialState = {
  user: {},
  isLoggedIn: false,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return { ...state, user: action.payload, isLoggedIn: true, loading: false };
    case AUTH_LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// saga.ts
import { call, put, takeEvery } from 'redux-saga/effects';
import { loginApi } from 'api/account';

function* loginSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(loginApi, action.payload);
    yield put({ type: AUTH_LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: AUTH_LOGIN_ERROR, payload: error });
  }
}

export function* watchAuth() {
  yield takeEvery(AUTH_LOGIN_REQUEST, loginSaga);
}
```

**Usage in Components**:

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { loginUser } from 'store/auth/actions';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  const handleLogin = (credentials: any) => {
    dispatch(loginUser(credentials));
  };
  
  return <div>...</div>;
};
```

### 3. API Integration

**APIClient Pattern**: Centralized Axios wrapper with interceptors

```typescript
// helpers/api_helper.ts
import axios from 'axios';
import config from '../config';

axios.defaults.baseURL = config.api.API_URL;
axios.defaults.withCredentials = true;

// Request interceptor - Auto-inject JWT token
axios.interceptors.request.use((config) => {
  const authUser = sessionStorage.getItem('authUser');
  if (authUser) {
    const { access_token } = JSON.parse(authUser);
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  
  // CSRF token for Django
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
});

// Response interceptor - Handle 401 & refresh token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Attempt token refresh
      const refreshToken = getRefreshToken();
      const response = await axios.post('/api/account/refresh/', { refresh: refreshToken });
      // Update token and retry
      sessionStorage.setItem('authUser', JSON.stringify(response.data));
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

class APIClient {
  get = (url: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return axios.get(`${url}${query}`);
  };
  
  post = (url: string, data: Record<string, any>) => axios.post(url, data);
  patch = (url: string, data: Record<string, any>) => axios.patch(url, data);
  put = (url: string, data: Record<string, any>) => axios.put(url, data);
  delete = (url: string) => axios.delete(url);
}

export const apiClient = new APIClient();
```

**API Service Pattern**:

```typescript
// api/account.ts
import { apiClient } from 'helpers/api_helper';

export const loginApi = (credentials: any) => 
  apiClient.post('/api/account/login/', credentials);

export const getUserProfile = () => 
  apiClient.get('/api/account/profile/');

export const updateProfile = (data: any) => 
  apiClient.patch('/api/account/profile/', data);
```

### 4. Routing

**Route Configuration**: React Router v7 with lazy loading

```typescript
// routes/index.tsx
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));

const router = createBrowserRouter([
  { path: '/', element: <PagesLanding /> },
  AuthenticationRoutes,
  LoginRoutes,
  MainRoutes,
  SimpleRoutes
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
```

**Protected Routes**: Route guards with authentication

```typescript
// routes/MainRoutes.tsx
import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const Dashboard = Loadable(lazy(() => import('views/dashboard')));

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ]
};
```

### 5. Authentication

**Context-Based Auth**: Multiple auth providers supported

```typescript
// App.tsx
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// Alternative providers:
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

export default function App() {
  return (
    <ThemeCustomization>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeCustomization>
  );
}
```

**useAuth Hook**:

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { JWTContext } from 'contexts/JWTContext';

const useAuth = () => {
  const context = useContext(JWTContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default useAuth;
```

**Usage**:

```typescript
import useAuth from 'hooks/useAuth';

const MyComponent = () => {
  const { user, login, logout, isLoggedIn } = useAuth();
  
  return <div>{user?.email}</div>;
};
```

### 6. Theme & Styling

**Material UI Theme**: Customized theme with multiple modes

```typescript
// themes/index.tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import compStyleOverride from './compStyleOverride';

const theme = createTheme({
  palette: palette(config.mode),
  typography: typography,
  components: compStyleOverride
});

export default function ThemeCustomization({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

**SCSS Support**: Global styles with SCSS

```
assets/scss/
├── _themes-vars.module.scss
├── style.scss
└── ...
```

### 7. Menu System

**Dynamic Menu Configuration**:

```typescript
// menu-items/index.ts
import dashboard from './dashboard';
import users from './users';

const menuItems = {
  items: [dashboard, users]
};

export default menuItems;
```

**Menu Item Structure**:

```typescript
// menu-items/dashboard.ts
import { IconDashboard } from '@tabler/icons-react';
import { NavItemType } from 'types';

const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
```

---

## Configuration

### Environment Variables

```env
# .env.local
VITE_APP_BASE_NAME=/
VITE_APP_API_URL=http://127.0.0.1:8000
```

### Config File

```typescript
// src/config.ts
export const API_BASE = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000';

const config = {
  menuOrientation: 'vertical',
  miniDrawer: false,
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  mode: 'light',
  presetColor: 'default',
  i18n: 'en',
  themeDirection: 'ltr',
  container: true,
  api: {
    API_URL: 'http://127.0.0.1:8000',
    API_MEDIA: 'http://127.0.0.1:8000/media/'
  }
};

export default config;
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
cd frontend
yarn install

# Start development server (http://localhost:3000)
yarn start

# Build for production
yarn build

# Preview production build
yarn preview
```

### Code Quality

```bash
# Lint code
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Format code
yarn prettier

# Type check
tsc --noEmit
```

### Storybook

```bash
# Run Storybook
yarn storybook

# Build Storybook
yarn build-storybook
```

---

## Building a New App/Module

### Step 1: Create Types

```typescript
// src/types/my-module.ts
export interface MyItem {
  id: number;
  name: string;
  description: string;
}

export interface MyModuleState {
  items: MyItem[];
  loading: boolean;
  error: string | null;
}
```

### Step 2: Create Redux Module

```bash
# Create module structure
store/
└── my-module/
    ├── actionTypes.ts
    ├── actions.ts
    ├── reducer.ts
    ├── saga.ts
    └── index.ts
```

```typescript
// store/my-module/actionTypes.ts
export const FETCH_ITEMS_REQUEST = 'my-module/FETCH_ITEMS_REQUEST';
export const FETCH_ITEMS_SUCCESS = 'my-module/FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_ERROR = 'my-module/FETCH_ITEMS_ERROR';

// store/my-module/actions.ts
export const fetchItems = () => ({ type: FETCH_ITEMS_REQUEST });

// store/my-module/reducer.ts
const initialState: MyModuleState = {
  items: [],
  loading: false,
  error: null
};

export const myModuleReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_ITEMS_REQUEST:
      return { ...state, loading: true };
    case FETCH_ITEMS_SUCCESS:
      return { ...state, items: action.payload, loading: false };
    case FETCH_ITEMS_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// store/my-module/saga.ts
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchItemsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.fetchItems);
    yield put({ type: FETCH_ITEMS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: FETCH_ITEMS_ERROR, payload: error.message });
  }
}

export function* watchMyModule() {
  yield takeEvery(FETCH_ITEMS_REQUEST, fetchItemsSaga);
}
```

### Step 3: Register in Root

```typescript
// store/rootReducer.ts
import myModuleReducer from './my-module/reducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  snackbar: snackbarReducer,
  myModule: myModuleReducer  // Add your new module here
});

// store/rootSaga.ts
import { watchMyModule } from './my-module/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    watchMyModule()  // Add your new saga here
  ]);
}
```

### Step 4: Create API Service

```typescript
// api/my-module.ts
import { apiClient } from 'helpers/api_helper';

export const fetchItems = () => apiClient.get('/api/my-module/items/');
export const createItem = (data: any) => apiClient.post('/api/my-module/items/', data);
export const updateItem = (id: number, data: any) => apiClient.patch(`/api/my-module/items/${id}/`, data);
export const deleteItem = (id: number) => apiClient.delete(`/api/my-module/items/${id}/`);
```

### Step 5: Create Selector

```typescript
// selectors/myModuleSelector.ts
import { RootState } from 'store';

export const selectMyModuleItems = (state: RootState) => state.myModule.items;
export const selectMyModuleLoading = (state: RootState) => state.myModule.loading;
export const selectMyModuleError = (state: RootState) => state.myModule.error;
```

### Step 6: Create Views

```typescript
// views/my-module/MyModuleList.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { fetchItems } from 'store/my-module/actions';
import { selectMyModuleItems, selectMyModuleLoading } from 'selectors/myModuleSelector';

const MyModuleList = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectMyModuleItems);
  const loading = useSelector(selectMyModuleLoading);
  
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <MainCard title="My Module">
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Typography>{item.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default MyModuleList;
```

### Step 7: Create Routes

```typescript
// routes/MyModuleRoutes.tsx
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

const MyModuleList = Loadable(lazy(() => import('views/my-module/MyModuleList')));
const MyModuleDetail = Loadable(lazy(() => import('views/my-module/MyModuleDetail')));

export const MyModuleRoutes = {
  path: '/my-module',
  children: [
    { path: 'list', element: <MyModuleList /> },
    { path: ':id', element: <MyModuleDetail /> }
  ]
};

// Add to routes/MainRoutes.tsx
children: [
  // ... existing routes
  ...MyModuleRoutes.children
]
```

### Step 8: Add to Menu

```typescript
// menu-items/my-module.ts
import { IconList } from '@tabler/icons-react';

const myModule = {
  id: 'my-module',
  title: 'My Module',
  type: 'group',
  children: [
    {
      id: 'my-module-list',
      title: 'Items',
      type: 'item',
      url: '/my-module/list',
      icon: IconList,
      breadcrumbs: true
    }
  ]
};

export default myModule;

// Add to menu-items/index.ts
import myModule from './my-module';

const menuItems = {
  items: [
    dashboard,
    users,
    myModule  // Add your new menu item here
  ]
};
```

---

## Best Practices

### Component Guidelines

✅ **DO**:
- Use functional components with hooks
- Define TypeScript interfaces for all props
- Use Material UI components
- Implement proper loading and error states
- Use lazy loading for routes
- Follow the established folder structure
- Use `MainCard` wrapper for page content
- Implement responsive layouts

❌ **DON'T**:
- Use class components
- Use inline styles (use MUI's `sx` prop)
- Hardcode API URLs (use config)
- Leave unused imports
- Skip TypeScript types
- Ignore linting errors

### State Management Guidelines

✅ **DO**:
- Create separate Redux modules for each feature
- Use Redux Saga for async operations
- Define action types as constants
- Use selectors to access state
- Keep reducers pure
- Handle loading and error states
- Use TypeScript for state types

❌ **DON'T**:
- Mutate state directly
- Make API calls in reducers
- Store derived data in state
- Use global state for local UI state
- Skip error handling

### API Guidelines

✅ **DO**:
- Use the `APIClient` class
- Define API services in `api/` directory
- Handle errors consistently
- Use TypeScript for request/response types
- Implement loading states
- Show user-friendly error messages

❌ **DON'T**:
- Make direct axios calls in components
- Hardcode API endpoints
- Ignore error responses
- Skip CSRF token for Django

### File Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`apiHelper.ts`)
- **Types**: kebab-case (`my-module.ts`)
- **Constants**: UPPER_SNAKE_CASE

---

## Common Patterns & Examples

### Form Handling (Formik + Yup)

```typescript
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
});

const MyForm = () => (
  <Formik
    initialValues={{ name: '', email: '' }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {({ values, errors, touched, handleChange, handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <Button type="submit">Submit</Button>
      </form>
    )}
  </Formik>
);
```

### Data Grid

```typescript
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 }
];

const MyDataGrid = () => (
  <DataGrid
    rows={items}
    columns={columns}
    pageSize={10}
    checkboxSelection
  />
);
```

### Notifications

```typescript
import { useSnackbar } from 'notistack';

const MyComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const showNotification = () => {
    enqueueSnackbar('Success!', { variant: 'success' });
  };
};
```

---

## Troubleshooting

### Common Issues

**Issue**: CORS errors
**Solution**: Ensure backend has proper CORS headers and credentials are enabled

**Issue**: Authentication not working
**Solution**: Check token storage in sessionStorage and Authorization header

**Issue**: Build errors
**Solution**: Run `yarn install` and check for TypeScript errors with `tsc --noEmit`

**Issue**: Linting errors
**Solution**: Run `yarn lint:fix` to auto-fix most issues

---

## Resources

- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Saga Documentation](https://redux-saga.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: October 24, 2025

