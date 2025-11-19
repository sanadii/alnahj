// assets
import { IconUsersGroup } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - ELECTORS ||============================== //

const electors: NavItemType = {
  id: 'electors',
  title: 'Electors',
  type: 'item',
  url: '/electors',
  icon: IconUsersGroup,
  breadcrumbs: false
};

export default electors;
