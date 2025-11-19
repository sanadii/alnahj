// assets
import { IconClipboardCheck } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - ATTENDANCE ||============================== //

const attendance: NavItemType = {
  id: 'attendance',
  title: 'Attendance',
  type: 'item',
  url: '/attendance',
  icon: IconClipboardCheck,
  breadcrumbs: false
};

export default attendance;
