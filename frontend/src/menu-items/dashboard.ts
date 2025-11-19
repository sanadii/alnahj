// assets
import { IconCalendarEvent } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'item',
  url: '/dashboard',
  icon: IconCalendarEvent,
  breadcrumbs: false
};

export default dashboard;
