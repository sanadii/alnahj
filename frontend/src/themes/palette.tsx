// material-ui
import { alpha, createTheme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';

// types
import { ColorProps } from 'types';
import { PresetColor } from 'types/config';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode: ThemeMode, presetColor: PresetColor) {
  let colors: ColorProps;
  switch (presetColor) {
    case 'theme1':
      colors = theme1;
      break;
    case 'theme2':
      colors = theme2;
      break;
    case 'theme3':
      colors = theme3;
      break;
    case 'theme4':
      colors = theme4;
      break;
    case 'theme5':
      colors = theme5;
      break;
    case 'theme6':
      colors = theme6;
      break;
    case 'default':
    default:
      colors = defaultColor;
  }

  return createTheme({
    palette: {
      mode,
      common: {
        black: colors.darkPaper
      },
      primary: {
        light: mode === ThemeMode.DARK ? colors.darkPrimaryLight : colors.primaryLight,
        main: mode === ThemeMode.DARK ? colors.darkPrimaryMain : colors.primaryMain,
        dark: mode === ThemeMode.DARK ? colors.darkPrimaryDark : colors.primaryDark,
        50: mode === ThemeMode.DARK ? colors.darkPrimary50 : colors.primary50,
        100: mode === ThemeMode.DARK ? colors.darkPrimary100 : colors.primary100,
        200: mode === ThemeMode.DARK ? colors.darkPrimary200 : colors.primary200,
        300: mode === ThemeMode.DARK ? colors.darkPrimary300 : colors.primary300,
        400: mode === ThemeMode.DARK ? colors.darkPrimary400 : colors.primary400,
        500: mode === ThemeMode.DARK ? colors.darkPrimary500 : colors.primary500,
        600: mode === ThemeMode.DARK ? colors.darkPrimary600 : colors.primary600,
        700: mode === ThemeMode.DARK ? colors.darkPrimary700 : colors.primary700,
        800: mode === ThemeMode.DARK ? colors.darkPrimary800 : colors.primary800,
        900: mode === ThemeMode.DARK ? colors.darkPrimary900 : colors.primary900
      },
      secondary: {
        light: mode === ThemeMode.DARK ? colors.darkSecondaryLight : colors.secondaryLight,
        main: mode === ThemeMode.DARK ? colors.darkSecondaryMain : colors.secondaryMain,
        dark: mode === ThemeMode.DARK ? colors.darkSecondaryDark : colors.secondaryDark,
        50: mode === ThemeMode.DARK ? colors.darkSecondary50 : colors.secondary50,
        100: mode === ThemeMode.DARK ? colors.darkSecondary100 : colors.secondary100,
        200: mode === ThemeMode.DARK ? colors.darkSecondary200 : colors.secondary200,
        300: mode === ThemeMode.DARK ? colors.darkSecondary300 : colors.secondary300,
        400: mode === ThemeMode.DARK ? colors.darkSecondary400 : colors.secondary400,
        500: mode === ThemeMode.DARK ? colors.darkSecondary500 : colors.secondary500,
        600: mode === ThemeMode.DARK ? colors.darkSecondary600 : colors.secondary600,
        700: mode === ThemeMode.DARK ? colors.darkSecondary700 : colors.secondary700,
        800: mode === ThemeMode.DARK ? colors.darkSecondary800 : colors.secondary800,
        900: mode === ThemeMode.DARK ? colors.darkSecondary900 : colors.secondary900
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark,
        50: colors.error50,
        100: colors.error100,
        200: colors.error200,
        300: colors.error300,
        400: colors.error400,
        500: colors.error500,
        600: colors.error600,
        700: colors.error700,
        800: colors.error800,
        900: colors.error900
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark,
        50: colors.orange50,
        100: colors.orange100,
        200: colors.orange200,
        300: colors.orange300,
        400: colors.orange400,
        500: colors.orange500,
        600: colors.orange600,
        700: colors.orange700,
        800: colors.orange800,
        900: colors.orange900
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark,
        // contrastText: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey700,
        contrastText: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey200,
        50: colors.warning50,
        100: colors.warning100,
        200: colors.warning200,
        300: colors.warning300,
        400: colors.warning400,
        500: colors.warning500,
        600: colors.warning600,
        700: colors.warning700,
        800: colors.warning800,
        900: colors.warning900
      },
      success: {
        light: colors.successLight,
        main: colors.successMain,
        dark: colors.successDark,
        50: colors.success50,
        100: colors.success100,
        200: colors.success200,
        300: colors.success300,
        400: colors.success400,
        500: colors.success500,
        600: colors.success600,
        700: colors.success700,
        800: colors.success800,
        900: colors.success900
      },
      grey: {
        50: colors.grey50,
        100: colors.grey100,
        500: mode === ThemeMode.DARK ? colors.darkTextSecondary : colors.grey500,
        600: mode === ThemeMode.DARK ? colors.darkTextTitle : colors.grey600,
        700: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey700,
        900: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey700,
        secondary: mode === ThemeMode.DARK ? colors.darkTextSecondary : colors.grey500,
        dark: mode === ThemeMode.DARK ? colors.darkTextPrimary : colors.grey900,
        hint: colors.grey100
      },
      divider: mode === ThemeMode.DARK ? alpha(colors.grey200, 0.2) : colors.grey200,
      background: {
        paper: mode === ThemeMode.DARK ? colors.darkLevel2 : colors.paper,
        default: mode === ThemeMode.DARK ? colors.darkPaper : colors.paper
      }
    }
  });
}
