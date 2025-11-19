import React, { Fragment, useState, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Pagination, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TableContainerProps {
  columns?: any[];
  data?: any[];
  isGlobalFilter?: boolean;
  customPageSize?: number;
  tableClass?: string;
  theadClass?: string;
  trClass?: string;
  thClass?: string;
  divClass?: string;
  SearchPlaceholder?: string;
  [key: string]: any;
}

const TableContainer: React.FC<TableContainerProps> = ({
  columns = [],
  data = [],
  isGlobalFilter = false,
  customPageSize = 10,
  tableClass = '',
  theadClass = '',
  trClass = '',
  thClass = '',
  divClass = '',
  SearchPlaceholder = 'Search...',
  ...rest
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(customPageSize);

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;

    return data.filter((row) => {
      return Object.values(row).some((value) => String(value).toLowerCase().includes(globalFilter.toLowerCase()));
    });
  }, [data, globalFilter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage]);

  // Calculate total pages
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <Fragment>
      {/* Search Filter */}
      {isGlobalFilter && (
        <Box sx={{ mb: 3, py: 2, borderTop: '1px dashed', borderBottom: '1px dashed' }}>
          <TextField
            fullWidth
            size="small"
            placeholder={SearchPlaceholder}
            value={globalFilter}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
      )}

      {/* Table */}
      <div className={divClass}>
        <Table className={tableClass} sx={{ minWidth: 650 }}>
          <TableHead className={theadClass}>
            <TableRow className={trClass}>
              {columns.map((column, index) => (
                <TableCell key={column.id || column.accessorKey || index} className={thClass} sx={{ fontWeight: 600 }}>
                  {typeof column.header === 'function' ? column.header() : column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {columns.map((column, colIndex) => {
                    const cellValue = row[column.accessorKey];
                    const cellContent = column.cell ? column.cell({ getValue: () => cellValue, row: { original: row } }) : cellValue;

                    return <TableCell key={column.id || column.accessorKey || colIndex}>{cellContent}</TableCell>;
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {Math.min(rowsPerPage, filteredData.length)}
            </Box>{' '}
            of{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {filteredData.length}
            </Box>{' '}
            results
          </Typography>

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default TableContainer;
