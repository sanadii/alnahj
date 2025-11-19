import { Box, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const rows = [
  { id: 1, election: 'National 2024', committee: 'Kuwait City 01', party: 'Progressive', votes: 5230, status: 'Synced' },
  { id: 2, election: 'National 2024', committee: 'Kuwait City 02', party: 'Unity', votes: 4980, status: 'Pending' }
];

const VotesList = () => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Vote Submissions
        </Typography>
        <Typography color="text.secondary">
          Monitor every entry captured from the vote entry workflow. Hook this table to the votes API to render real
          data, pagination, and filters.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Election</TableCell>
                  <TableCell>Committee</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell align="right">Votes</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.election}</TableCell>
                    <TableCell>{row.committee}</TableCell>
                    <TableCell>{row.party}</TableCell>
                    <TableCell align="right">{row.votes.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status}
                        color={row.status === 'Synced' ? 'success' : 'warning'}
                        variant={row.status === 'Synced' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

export default VotesList;

