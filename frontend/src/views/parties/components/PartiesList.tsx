import { Box, Stack, Typography } from '@mui/material';

const PartiesList = () => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Stack spacing={1.5}>
      <Typography variant="h4" fontWeight={600}>
        Parties
      </Typography>
      <Typography color="text.secondary">
        This section is not wired into the API yet. When the voting module goes live, this page will show the list of
        registered parties along with management actions.
      </Typography>
    </Stack>
  </Box>
);

export default PartiesList;

