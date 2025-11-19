import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Box,
  alpha,
  useTheme,
  SxProps,
  Theme,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

export interface ColumnDef<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  format?: (value: any) => string;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  actions?: TableAction<T>[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  totalCount?: number;
  emptyMessage?: string;
  className?: string;
  sx?: SxProps<Theme>;
  stickyHeader?: boolean;
  dense?: boolean;
}

/**
 * DataTable - A comprehensive table component with search, filter, pagination, and actions
 *
 * Features:
 * - Built-in search and filtering
 * - Column sorting
 * - Row selection
 * - Pagination
 * - Action buttons
 * - Loading states
 * - Responsive design
 * - Sticky headers
 * - Dense mode
 *
 * @example
 * ```tsx
 * // Basic table
 * <DataTable
 *   data={clients}
 *   columns={clientColumns}
 *   searchable
 *   pagination
 * />
 *
 * // Advanced table with actions
 * <DataTable
 *   data={products}
 *   columns={productColumns}
 *   searchable
 *   filterable
 *   sortable
 *   selectable
 *   actions={[
 *     { label: 'Edit', icon: <IconEdit />, onClick: handleEdit },
 *     { label: 'Delete', icon: <IconTrash />, onClick: handleDelete }
 *   ]}
 *   onRowClick={handleRowClick}
 * />
 * ```
 */
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  filterable = false,
  sortable = true,
  selectable = false,
  pagination = true,
  actions = [],
  onRowClick,
  onSelectionChange,
  searchValue = '',
  onSearchChange,
  page = 0,
  onPageChange,
  rowsPerPage = 25,
  onRowsPerPageChange,
  totalCount,
  emptyMessage = 'No data available',
  className,
  sx,
  stickyHeader = false,
  dense = false
}: DataTableProps<T>) {
  const theme = useTheme();
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = data;

    // Apply search filter
    if (searchable && searchValue) {
      filteredData = data.filter((row) =>
        columns.some((column) => {
          const value = row[column.id as keyof T];
          return String(value).toLowerCase().includes(searchValue.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortable && sortField) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField as keyof T];
        const bValue = b[sortField as keyof T];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchValue, sortField, sortDirection, columns, searchable, sortable]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, page, rowsPerPage, pagination]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (!sortable) return;

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle row selection
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(paginatedData);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = [...selectedRows, row];
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      const newSelected = selectedRows.filter((item) => item !== row);
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    }
  };

  const isRowSelected = (row: T) => selectedRows.includes(row);
  const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;

  // Render cell content
  const renderCellContent = (column: ColumnDef<T>, row: T) => {
    const value = row[column.id as keyof T];

    if (column.render) {
      return column.render(value, row);
    }

    if (column.format) {
      return column.format(value);
    }

    return String(value || '');
  };

  const tableStyles: SxProps<Theme> = {
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
    boxShadow: 'none',
    ...sx
  };

  if (loading) {
    return (
      <Box
        className={className}
        sx={{
          ...tableStyles,
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper className={className} sx={tableStyles}>
      <TableContainer>
        <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.grey[50], 0.5),
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`
                }
              }}
            >
              {/* Selection column */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {/* Data columns */}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={sortField === column.id ? sortDirection : false}
                >
                  {column.sortable !== false && sortable ? (
                    <TableSortLabel
                      active={sortField === column.id}
                      direction={sortField === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(String(column.id))}
                      IconComponent={sortField === column.id ? (sortDirection === 'asc' ? IconArrowUp : IconArrowDown) : undefined}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Actions column */}
              {actions.length > 0 && (
                <TableCell align="right" padding="none">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover={!!onRowClick}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    backgroundColor: isRowSelected(row) ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02)
                    },
                    '& .MuiTableCell-root': {
                      borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                    }
                  }}
                >
                  {/* Selection cell */}
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isRowSelected(row)}
                        onChange={(event) => handleSelectRow(row, event)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <TableCell key={String(column.id)} align={column.align || 'left'}>
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}

                  {/* Actions cell */}
                  {actions.length > 0 && (
                    <TableCell align="right" padding="none">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {actions.map((action, actionIndex) => (
                          <Box
                            key={actionIndex}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!action.disabled?.(row)) {
                                action.onClick(row);
                              }
                            }}
                            sx={{
                              cursor: action.disabled?.(row) ? 'not-allowed' : 'pointer',
                              opacity: action.disabled?.(row) ? 0.5 : 1,
                              p: 0.5,
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: action.disabled?.(row) ? 'transparent' : alpha(theme.palette.action.hover, 0.04)
                              }
                            }}
                          >
                            {action.icon}
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount || processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(event) => onRowsPerPageChange?.(parseInt(event.target.value, 10))}
        />
      )}
    </Paper>
  );
}

export default DataTable;
