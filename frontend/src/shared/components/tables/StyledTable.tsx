import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Skeleton,
  Stack,
  Chip
} from '@mui/material';
import { ReactNode } from 'react';

/**
 * StyledTable Component
 *
 * Reusable table with consistent styling, sorting, loading, and empty states
 * Used in: All client detail tabs (Appointments, Vouchers, Documents, etc.)
 *
 * Replaces duplicate table implementations across 10+ tabs
 */

export interface TableColumn<T = any> {
  /** Unique column ID */
  id: string;
  /** Column header label */
  label: string;
  /** Width of column (e.g., '150px', '20%') */
  width?: string;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Enable sorting */
  sortable?: boolean;
  /** Custom render function */
  render?: (row: T) => ReactNode;
  /** Show on mobile (default: true) */
  showOnMobile?: boolean;
}

export interface StyledTableProps<T = any> {
  /** Array of column definitions */
  columns: TableColumn<T>[];
  /** Array of data rows */
  data: T[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Sort configuration */
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Maximum height */
  maxHeight?: string | number;
  /** Loading rows count */
  loadingRows?: number;
  /** Custom empty state component */
  emptyStateComponent?: ReactNode;
}

function StyledTable<T = any>({
  columns,
  data,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  sortBy,
  sortOrder = 'asc',
  onSort,
  onRowClick,
  striped = true,
  hoverable = true,
  stickyHeader = false,
  maxHeight,
  loadingRows = 5,
  emptyStateComponent
}: StyledTableProps<T>) {
  // Loading state
  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'background.paper',
                    width: column.width
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: loadingRows }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Chip label="Error" color="error" />
          <Typography variant="body1" color="error" textAlign="center">
            {error}
          </Typography>
        </Stack>
      </Paper>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    if (emptyStateComponent) {
      return <Paper sx={{ p: 4 }}>{emptyStateComponent}</Paper>;
    }

    return (
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {emptyMessage}
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight }}>
      <Table stickyHeader={stickyHeader}>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  fontWeight: 600,
                  bgcolor: 'background.paper',
                  width: column.width,
                  display: {
                    xs: column.showOnMobile === false ? 'none' : 'table-cell',
                    sm: 'table-cell'
                  }
                }}
              >
                {column.sortable && onSort ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortOrder : 'asc'}
                    onClick={() => onSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                bgcolor: striped && rowIndex % 2 === 1 ? 'action.hover' : 'transparent',
                '&:hover': hoverable
                  ? {
                      bgcolor: 'action.selected'
                    }
                  : {}
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    display: {
                      xs: column.showOnMobile === false ? 'none' : 'table-cell',
                      sm: 'table-cell'
                    }
                  }}
                >
                  {column.render ? column.render(row) : (row as any)[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StyledTable;
