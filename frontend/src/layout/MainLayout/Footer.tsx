import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
  const theme = useTheme();
  const shellSpacing = theme.layoutSpacing?.shell;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        width: '100%',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        pt: shellSpacing?.padding.md ?? theme.spacing(3),
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography variant="caption" color="text.secondary">
        &copy; All rights reserved{' '}
        <Typography component={Link} href="https://codedthemes.com" underline="hover" target="_blank" color="secondary.main" sx={{ fontWeight: 500 }}>
          CodedThemes
        </Typography>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Link
          component={RouterLink}
          to="https://x.com/codedthemes"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          Twitter
        </Link>
        <Link
          component={RouterLink}
          to="https://discord.com/invite/p2E2WhCb6s"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          Discord
        </Link>
      </Stack>
    </Stack>
  );
}
