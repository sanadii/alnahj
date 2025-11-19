import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const PartyCreate = () => (
  <Box component="form" sx={{ p: { xs: 2, md: 3 }, maxWidth: 560 }}>
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={600}>
        Create Party
      </Typography>
      <Typography color="text.secondary">
        The final flow is still under construction. For now, you can capture the intended data points below. Wire the
        submit handler to the voting API once it is available.
      </Typography>
      <TextField label="Party Name" name="name" fullWidth required />
      <TextField label="Party Leader" name="leader" fullWidth />
      <TextField label="Description" name="description" fullWidth multiline minRows={3} />
      <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
        Save
      </Button>
    </Stack>
  </Box>
);

export default PartyCreate;

