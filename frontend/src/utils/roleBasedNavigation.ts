const DASHBOARD_ACCESS_ROLES = ['ADMIN', 'SUPERVISOR', 'SUPER_ADMIN'] as const;

export const canAccessDashboard = (role?: string): boolean => {
  const normalized = (role || '').toUpperCase();
  return !normalized || DASHBOARD_ACCESS_ROLES.includes(normalized as typeof DASHBOARD_ACCESS_ROLES[number]);
};

export const getDefaultLandingPath = (role?: string): string => {
  return canAccessDashboard(role) ? '/dashboard' : '/guarantees';
};

export { DASHBOARD_ACCESS_ROLES };
