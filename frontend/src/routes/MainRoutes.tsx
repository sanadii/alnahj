import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import type { RootState } from 'store';
import { getDefaultLandingPath, canAccessDashboard } from 'utils/roleBasedNavigation';

// ==============================|| MAIN ROUTING ||============================== //
// Election Management System - Main Routes

// user management routing (not in menu but accessible)
const UsersList = Loadable(lazy(() => import('views/users/components/UsersList')));
const UserCreate = Loadable(lazy(() => import('views/users/components/UserCreate')));
const UserEdit = Loadable(lazy(() => import('views/users/components/UserEdit')));
const UserProfile = Loadable(lazy(() => import('views/users/components/UserProfile')));

// dashboard routing
const DashboardPage = Loadable(lazy(() => import('views/dashboard/components/Dashboard')));

// elections routing (for backwards compatibility)
const ElectionsList = Loadable(lazy(() => import('views/elections/components/ElectionsList')));
const ElectionCreate = Loadable(lazy(() => import('views/elections/components/ElectionCreate')));
const ElectionEdit = Loadable(lazy(() => import('views/elections/components/ElectionEdit')));
const ElectionDetail = Loadable(lazy(() => import('views/elections/components/ElectionDetail')));

// guarantees routing
const Guarantees = Loadable(lazy(() => import('views/guarantees/components/Guarantees')));

// strategic routing
const StrategicCommand = Loadable(lazy(() => import('views/strategic/components/Strategic')));

// attendance routing
const Attendance = Loadable(lazy(() => import('views/attendance/components/Attendance')));

// sorting routing
const Sorting = Loadable(lazy(() => import('views/sorting/components/Sorting')));

// committees routing
const CommitteesList = Loadable(lazy(() => import('views/committees/components/CommitteesList')));
const CommitteeCreate = Loadable(lazy(() => import('views/committees/components/CommitteeCreate')));
const CommitteeEdit = Loadable(lazy(() => import('views/committees/components/CommitteeEdit')));
const CommitteeDetail = Loadable(lazy(() => import('views/committees/components/CommitteeDetail')));

// candidates routing
const CandidatesList = Loadable(lazy(() => import('views/candidates/components/CandidatesList')));
const CandidateCreate = Loadable(lazy(() => import('views/candidates/components/CandidateCreate')));
const CandidateEdit = Loadable(lazy(() => import('views/candidates/components/CandidateEdit')));

// parties routing
const PartiesList = Loadable(lazy(() => import('views/parties/PartiesList')));
const PartyCreate = Loadable(lazy(() => import('views/parties/PartyCreate')));
const PartyEdit = Loadable(lazy(() => import('views/parties/PartyEdit')));

// electors routing
const ElectorsList = Loadable(lazy(() => import('views/electors/components/ElectorsList')));
const ElectorEdit = Loadable(lazy(() => import('views/electors/components/ElectorEdit')));
const ElectorImport = Loadable(lazy(() => import('views/electors/components/ElectorImport')));

// voting routing
const VoteEntry = Loadable(lazy(() => import('views/voting/VoteEntry')));
const VotesList = Loadable(lazy(() => import('views/voting/VotesList')));

// results routing
const ElectionResults = Loadable(lazy(() => import('views/results/components/ElectionResults')));

const RoleBasedRedirect = () => {
  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );
  const target = getDefaultLandingPath(currentUserRole);
  return <Navigate to={target} replace />;
};

const DashboardRoute = () => {
  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );
  if (!canAccessDashboard(currentUserRole)) {
    return <Navigate to="/guarantees" replace />;
  }
  return <DashboardPage />;
};

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    // Dashboard (default landing)
    {
      path: '/dashboard',
      element: <DashboardRoute />
    },
    {
      path: '/dashboard/default',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/',
      element: <RoleBasedRedirect />
    },

    // User Management (not in menu but accessible via URL)
    {
      path: '/users/list',
      element: <UsersList />
    },
    {
      path: '/users',
      element: <UsersList />
    },
    {
      path: '/users/create',
      element: <UserCreate />
    },
    {
      path: '/users/edit/:id',
      element: <UserEdit />
    },
    {
      path: '/users/profile/:id',
      element: <UserProfile />
    },
    {
      path: '/profile',
      element: <UserProfile />
    },

    // Current Election (legacy path)
    {
      path: '/election/current',
      element: <DashboardPage />
    },

    // Elections Management (for backwards compatibility)
    {
      path: '/elections/list',
      element: <ElectionsList />
    },
    {
      path: '/elections/create',
      element: <ElectionCreate />
    },
    {
      path: '/elections/:id',
      element: <ElectionDetail />
    },
    {
      path: '/elections/edit/:id',
      element: <ElectionEdit />
    },

    // Electors
    {
      path: '/electors',
      element: <ElectorsList />
    },
    {
      path: '/electors/list',
      element: <ElectorsList />
    },
    {
      path: '/electors/edit/:koc_id',
      element: <ElectorEdit />
    },
    {
      path: '/electors/edit/:id',
      element: <ElectorEdit />
    },
    {
      path: '/electors/import',
      element: <ElectorImport />
    },

    // Guarantees
    {
      path: '/guarantees',
      element: <Guarantees />
    },

    // Strategic Command Center
    {
      path: '/strategic',
      element: <StrategicCommand />
    },

    // Attendance
    {
      path: '/attendance',
      element: <Attendance />
    },

    // Sorting
    {
      path: '/sorting',
      element: <Sorting />
    },

    // Committees
    {
      path: '/committees/list',
      element: <CommitteesList />
    },
    {
      path: '/committees/create',
      element: <CommitteeCreate />
    },
    {
      path: '/committees/edit/:id',
      element: <CommitteeEdit />
    },
    {
      path: '/committees/:id',
      element: <CommitteeDetail />
    },

    // Candidates
    {
      path: '/candidates/list',
      element: <CandidatesList />
    },
    {
      path: '/candidates/create',
      element: <CandidateCreate />
    },
    {
      path: '/candidates/edit/:id',
      element: <CandidateEdit />
    },

    // Parties
    {
      path: '/parties/list',
      element: <PartiesList />
    },
    {
      path: '/parties/create',
      element: <PartyCreate />
    },
    {
      path: '/parties/edit/:id',
      element: <PartyEdit />
    },

    // Voting
    {
      path: '/voting/entry',
      element: <VoteEntry />
    },
    {
      path: '/voting/list',
      element: <VotesList />
    },

    // Results
    {
      path: '/results',
      element: <ElectionResults />
    }
  ]
};

export default MainRoutes;
