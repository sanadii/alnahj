# Frontend Quick Start Guide

**Project**: Kuwait Oil Company Election Management System  
**Target**: Frontend Developers  
**Time to Setup**: 15-30 minutes  
**Last Updated**: October 24, 2025

---

## 🎯 What You'll Build

A modern React TypeScript application with:
- ✅ Material-UI design system
- ✅ Redux Toolkit for state management
- ✅ RTK Query for API integration
- ✅ Role-based access control
- ✅ Responsive design (mobile-first)
- ✅ Real-time data updates

---

## 📋 Prerequisites

Before starting, ensure you have:

```bash
# Node.js 18+ (check version)
node --version
# Should output: v18.x.x or higher

# npm 9+ (check version)
npm --version
# Should output: 9.x.x or higher

# Git (check version)
git --version
```

**Optional but recommended**:
- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - ESLint
  - Prettier
  - TypeScript
  - Material-UI snippets

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Project (3 minutes)

```bash
# Navigate to project root
cd d:\React\election

# Create Vite + React + TypeScript project
npm create vite@latest frontend -- --template react-ts

# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

### Step 2: Install Core Dependencies (5 minutes)

```bash
# UI Library (Material-UI)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# State Management (Redux)
npm install @reduxjs/toolkit react-redux

# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# Forms
npm install react-hook-form yup @hookform/resolvers

# Date Utilities
npm install date-fns

# Notifications
npm install react-hot-toast

# TypeScript Types
npm install -D @types/node
```

### Step 3: Configure Environment (2 minutes)

Create `.env` file:

```bash
# Copy example
cp .env.example .env
```

**Contents of `.env`**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Election Management System
```

### Step 4: Configure TypeScript (2 minutes)

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 5: Configure Vite (2 minutes)

Update `vite.config.ts`:

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

### Step 6: Start Development Server (1 minute)

```bash
# Start dev server
npm run dev

# App will be available at:
# http://localhost:3000
```

---

## 📁 Create Folder Structure (5 minutes)

Create the following folders in `src/`:

```bash
# Create all folders at once
mkdir -p src/app
mkdir -p src/features/auth/{api,components,pages,hooks,types,utils}
mkdir -p src/features/users
mkdir -p src/features/elections
mkdir -p src/features/electors
mkdir -p src/features/guarantees
mkdir -p src/features/attendance
mkdir -p src/features/voting
mkdir -p src/features/reports
mkdir -p src/features/dashboard
mkdir -p src/shared/{components/{ui,forms,tables,layout,charts},hooks,utils,constants,types,api}
mkdir -p src/assets
mkdir -p src/styles
mkdir -p src/i18n
```

Your structure should look like:

```
src/
├── app/                 # App configuration
├── features/            # Feature modules
│   ├── auth/
│   ├── users/
│   ├── elections/
│   ├── electors/
│   ├── guarantees/
│   ├── attendance/
│   ├── voting/
│   ├── reports/
│   └── dashboard/
├── shared/              # Shared resources
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── api/
├── assets/              # Images, fonts
├── styles/              # Global styles
├── i18n/                # Translations
├── App.tsx
└── main.tsx
```

---

## 🎨 Setup Theme (10 minutes)

### Create Theme Configuration

**`src/app/theme.ts`**:

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // KOC Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Accent Red
      light: '#e33371',
      dark: '#9a0036',
    },
    success: {
      main: '#2e7d32', // Green (Strong guarantees)
    },
    warning: {
      main: '#ed6c02', // Orange (Medium guarantees)
    },
    error: {
      main: '#d32f2f', // Red (Weak guarantees)
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none', // No uppercase buttons
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

### Apply Theme in App

**`src/App.tsx`**:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './app/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h1>Election Management System</h1>
        <p>Frontend is ready!</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

---

## 🗄️ Setup Redux Store (10 minutes)

### Create Store Configuration

**`src/app/store.ts`**:

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Create Typed Hooks

**`src/app/hooks.ts`**:

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Apply Store in App

**`src/main.tsx`**:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## 🔐 Create Login Page (15 minutes)

### Create Auth Slice

**`src/features/auth/authSlice.ts`**:

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
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

### Create Login Page

**`src/features/auth/pages/LoginPage.tsx`**:

```typescript
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '../authSlice';
import axios from 'axios';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
        { email, password }
      );
      
      dispatch(setCredentials({
        user: response.data.user,
        accessToken: response.data.access,
      }));
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Election Management System
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Kuwait Oil Company
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
```

---

## 🧭 Setup Routing (10 minutes)

### Install React Router

```bash
npm install react-router-dom
```

### Create Routes

**`src/app/routes.tsx`**:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { useAppSelector } from './hooks';

// Placeholder components
const DashboardPage = () => <h1>Dashboard</h1>;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Update App Component

**`src/App.tsx`**:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './app/theme';
import { AppRoutes } from './app/routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
```

### Update Store

**`src/app/store.ts`** (add auth reducer):

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## ✅ Test Your Setup

### 1. Start Backend (if not running)

```bash
# In backend directory
cd backend
python manage.py runserver

# Backend should be at: http://localhost:8000
```

### 2. Start Frontend

```bash
# In frontend directory
cd frontend
npm run dev

# Frontend should be at: http://localhost:3000
```

### 3. Test Login

1. Open http://localhost:3000
2. You should be redirected to `/login`
3. Enter credentials (create superuser in backend first)
4. Click "Sign In"
5. You should be redirected to `/dashboard`

---

## 🎉 Success!

If you can log in and see the dashboard, your setup is complete!

### Next Steps

1. **Read Documentation**:
   - `docs/project/frontend-implementation-plan.md` - Complete implementation plan
   - `docs/project/idea.md` - Project specification

2. **Start Building**:
   - Follow Phase 1 in the implementation plan
   - Create shared components
   - Build user management module

3. **Backend Integration**:
   - Review backend API documentation
   - See `backend/README.md` for API endpoints
   - Check app READMEs for detailed API docs

---

## 🆘 Troubleshooting

### Issue: `Cannot find module '@/*'`
**Solution**: Make sure you've updated `tsconfig.json` and `vite.config.ts` with path aliases.

### Issue: `CORS error when calling API`
**Solution**: Backend should have CORS enabled. Check `backend/core/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
```

### Issue: Login fails with 401
**Solution**: Check that:
1. Backend is running
2. You've created a superuser
3. Credentials are correct

### Issue: `npm install` fails
**Solution**: 
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- **Material-UI Docs**: https://mui.com/
- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **React Router Docs**: https://reactrouter.com/
- **React Hook Form Docs**: https://react-hook-form.com/
- **Vite Docs**: https://vitejs.dev/

---

**Setup Time**: 30-45 minutes  
**Status**: Ready for Phase 1 Development  
**Last Updated**: October 24, 2025

**🚀 You're ready to start building the frontend! 🚀**

