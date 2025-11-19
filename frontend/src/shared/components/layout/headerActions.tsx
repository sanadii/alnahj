import React from 'react';
import {
  IconEye,
  IconPlus,
  IconPrinter,
  IconDownload,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconFilter,
  IconSettings
} from '@tabler/icons-react';

export type HeaderActionPreset =
  | 'viewAll'
  | 'view'
  | 'add'
  | 'create'
  | 'print'
  | 'export'
  | 'edit'
  | 'delete'
  | 'refresh'
  | 'filter'
  | 'settings';

export interface HeaderActionConfig {
  preset?: HeaderActionPreset;
  type?: 'button' | 'iconButton';
  label?: string;
  variant?: 'text' | 'outlined' | 'contained';
  icon?: React.ReactNode;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: () => void;
  show?: boolean;
  disabled?: boolean;
  tooltip?: string;
  underline?: boolean;
}

export type HeaderActionInput = HeaderActionPreset | HeaderActionConfig;

const ACTION_PRESETS: Record<HeaderActionPreset, Omit<HeaderActionConfig, 'preset'>> = {
  viewAll: {
    type: 'button',
    label: 'View all',
    variant: 'text',
    icon: <IconEye size={16} />,
    underline: true
  },
  view: {
    type: 'iconButton',
    icon: <IconEye size={18} />,
    tooltip: 'View details'
  },
  add: {
    type: 'iconButton',
    icon: <IconPlus size={18} />,
    color: 'primary',
    tooltip: 'Add new'
  },
  create: {
    type: 'button',
    label: 'Create',
    variant: 'contained',
    icon: <IconPlus size={16} />,
    color: 'primary'
  },
  print: {
    type: 'button',
    label: 'Print',
    variant: 'outlined',
    icon: <IconPrinter size={16} />
  },
  export: {
    type: 'button',
    label: 'Export',
    variant: 'outlined',
    icon: <IconDownload size={16} />
  },
  edit: {
    type: 'iconButton',
    icon: <IconEdit size={18} />,
    tooltip: 'Edit'
  },
  delete: {
    type: 'iconButton',
    icon: <IconTrash size={18} />,
    color: 'error',
    tooltip: 'Delete'
  },
  refresh: {
    type: 'iconButton',
    icon: <IconRefresh size={18} />,
    tooltip: 'Refresh'
  },
  filter: {
    type: 'iconButton',
    icon: <IconFilter size={18} />,
    tooltip: 'Filter'
  },
  settings: {
    type: 'iconButton',
    icon: <IconSettings size={18} />,
    tooltip: 'Settings'
  }
};

export const resolveHeaderAction = (action: HeaderActionInput): HeaderActionConfig | null => {
  if (typeof action === 'string') {
    return { ...ACTION_PRESETS[action], preset: action };
  }

  if (action.preset) {
    return {
      ...ACTION_PRESETS[action.preset],
      ...action
    };
  }

  return action;
};

