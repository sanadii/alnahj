// assets
import { IconSortDescending } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SORTING ||============================== //

const sorting: NavItemType = {
  id: 'sorting',
  title: 'Sorting',
  type: 'item',
  url: '/sorting',
  icon: IconSortDescending,
  breadcrumbs: false
};

export default sorting;
