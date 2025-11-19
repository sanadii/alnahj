import { APIClient } from './api_helper';

const api = new APIClient();

// ==============================|| MENU API ||============================== //

/**
 * Get Menu Master
 */
export const getMenuMaster = async () => {
  const response = await api.get('/api/menu/master/');
  return response;
};

/**
 * Update Menu Master
 */
export const updateMenuMaster = async (data: any) => {
  const response = await api.put('/api/menu/master/', data);
  return response;
};

// ==============================|| MENU HOOKS ||============================== //

/**
 * Menu Hook for React Components
 * Returns menu master state
 */
export const useGetMenuMaster = () => {
  // This is a simplified version - in a real app, this would use React Query or similar
  // For now, return mock data to prevent errors
  return {
    menuMaster: {
      isDashboardDrawerOpened: true,
      menuOrientation: 'vertical'
    },
    menuMasterLoading: false
  };
};

// ==============================|| DRAWER HANDLERS ||============================== //

/**
 * Drawer handler function
 * Updates the menu drawer open/close state
 */
export const handlerDrawerOpen = (open: boolean) => {
  // This would typically update the menu state
  // For now, just log the action in development
  if (import.meta.env.DEV) {
  }
};
