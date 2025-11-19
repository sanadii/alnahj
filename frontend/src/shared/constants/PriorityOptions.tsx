import React from 'react';

type PriorityOption = {
  id: number;
  name: string;
  value: string;
  badgeClass: string;
};

export const PriorityOptions: PriorityOption[] = [
  {
    id: 1,
    name: 'Low',
    value: 'low',
    badgeClass: 'badge bg-info'
  },
  {
    id: 2,
    name: 'Medium',
    value: 'medium',
    badgeClass: 'badge bg-warning'
  },
  {
    id: 3,
    name: 'High',
    value: 'high',
    badgeClass: 'badge bg-danger'
  }
];

type PriorityBadgeProps = {
  priority: number; // Changed from 'status' to 'priority'
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const entryPriority = PriorityOptions.find((option) => option.id === priority);
  if (!entryPriority) return null;

  return <div className={`badge rounded-pill ${entryPriority.badgeClass} fs-12`}>{entryPriority.name}</div>;
};
