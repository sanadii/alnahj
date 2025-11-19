// types
import { ConfigProps } from 'types/config';

export const DASHBOARD_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 10;

export enum MenuOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum AuthProvider {
  JWT = 'jwt',
  FIREBASE = 'firebase',
  AUTH0 = 'auth0',
  AWS = 'aws',
  SUPABASE = 'supabase'
}

export enum DropzopType {
  default = 'DEFAULT',
  standard = 'STANDARD'
}

export const APP_AUTH: AuthProvider = AuthProvider.JWT;

// API Base URL
export const API_BASE = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000';

const config: ConfigProps & { api: { API_URL: string; API_MEDIA: string } } = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  outlinedFilled: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: true,
  api: {
    API_URL: 'http://127.0.0.1:8000',
    API_MEDIA: 'http://127.0.0.1:8000/media/'
  }
};

export default config;
