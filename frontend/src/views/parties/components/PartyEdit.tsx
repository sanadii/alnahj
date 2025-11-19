import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const PartyEdit = () => (
  <Box component="form" sx={{ p: { xs: 2, md: 3 }, maxWidth: 560 }}>
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={600}>
        Edit Party
      </Typography>
      <Typography color="text.secondary">
        This screen will mirror the create view but with existing data pre-filled. Hook it to the updateParty endpoint
        when the backend is ready.
      </Typography>
      <TextField label="Party Name" name="name" fullWidth required defaultValue="Sample Party" />
      <TextField label="Party Leader" name="leader" fullWidth defaultValue="Leader name" />
      <TextField label="Description" name="description" fullWidth multiline minRows={3} defaultValue="Notes..." />
      <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
        Update Party
      </Button>
    </Stack>
  </Box>
);

export default PartyEdit;

