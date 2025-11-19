// assets
import { IconTargetArrow } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - STRATEGIC COMMAND CENTER ||============================== //

const strategic: NavItemType = {
  id: 'strategic-command-center',
  title: 'Strategic Command',
  type: 'item',
  url: '/strategic',
  icon: IconTargetArrow,
  breadcrumbs: false
};

export default strategic;
