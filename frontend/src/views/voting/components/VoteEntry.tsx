import { Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

const VoteEntry = () => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Vote Entry
        </Typography>
        <Typography color="text.secondary">
          Capture live vote totals per committee. This screen is scaffolded and ready for data wiring once the backend
          endpoints are finalized.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Election" defaultValue="">
                <MenuItem value="">Select election</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Committee" defaultValue="">
                <MenuItem value="">Select committee</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Party" defaultValue="">
                <MenuItem value="">Select party</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField type="number" fullWidth label="Votes" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField type="number" fullWidth label="Spoiled ballots" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained">Submit entry</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

export default VoteEntry;

