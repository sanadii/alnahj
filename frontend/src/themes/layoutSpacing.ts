import { Theme } from '@mui/material/styles';
import { LayoutSpacing } from 'types/default-theme';

const createLayoutSpacing = (theme: Theme): LayoutSpacing => ({
  shell: {
    padding: {
      base: theme.spacing(2.5),
      xs: theme.spacing(0),
      sm: theme.spacing(2),
      md: theme.spacing(3)
    },
    marginX: {
      base: theme.spacing(1.5),
      xs: theme.spacing(0),
      sm: theme.spacing(1),
      md: theme.spacing(2.5)
    },
    paddingBottom: {
      base: theme.spacing(8),
      xs: theme.spacing(10),
      sm: theme.spacing(10),
      md: theme.spacing(8)
    }
  }
});

export default createLayoutSpacing;

