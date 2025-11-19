import dashboard from './dashboard';
import electors from './electors';
import guarantees from './guarantees';
import attendance from './attendance';
import sorting from './sorting';
// import strategic from './strategic'; // Strategics temporarily hidden from menu
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //
// Election Management System

const menuItems: { items: NavItemType[] } = {
  items: [
    dashboard, // Dashboard (visible for admin/supervisor only via UI filters)
    // strategic, // Strategic Command Center (disabled temporarily)
    guarantees, // Guarantees
    attendance, // Attendance
    sorting, // Sorting
    electors // Electors
  ]
};

export default menuItems;
