import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { IconChevronRight } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface EntityBreadcrumbsProps {
  items: BreadcrumbItem[];
  currentLabel: string;
}

/**
 * Reusable breadcrumb navigation component
 * Can be used across all entity detail pages
 *
 * @example
 * ```typescript
 * <EntityBreadcrumbs
 *   items={[
 *     { label: "Dashboard", path: "/dashboard" },
 *     { label: "Clients", path: "/clients" },
 *     { label: "List", onClick: handleNavigateToList }
 *   ]}
 *   currentLabel="John Doe"
 * />
 * ```
 */
const EntityBreadcrumbs: React.FC<EntityBreadcrumbsProps> = ({ items, currentLabel }) => {
  return (
    <MainCard sx={{ mb: 2 }}>
      <Breadcrumbs separator={<IconChevronRight size={16} />} aria-label="breadcrumb">
        {items.map((item, index) => {
          if (item.onClick) {
            return (
              <Link key={index} onClick={item.onClick} to="#" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {item.label}
                </Typography>
              </Link>
            );
          }

          if (item.path) {
            return (
              <Link key={index} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {item.label}
                </Typography>
              </Link>
            );
          }

          return (
            <Typography key={index} variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          );
        })}
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {currentLabel}
        </Typography>
      </Breadcrumbs>
    </MainCard>
  );
};

export default EntityBreadcrumbs;
