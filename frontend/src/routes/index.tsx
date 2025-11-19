import { createBrowserRouter, Navigate } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import SimpleRoutes from './SimpleRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [{ path: '/', element: <Navigate to="/dashboard" replace /> }, AuthenticationRoutes, LoginRoutes, SimpleRoutes, MainRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
