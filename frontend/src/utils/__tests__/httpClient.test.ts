import { clearStoredAuth, getStoredAuth, persistAuthTokens, shouldAttemptTokenRefresh } from '../httpClient';

describe('httpClient utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('persists tokens to storage', () => {
    persistAuthTokens({ access: 'ACCESS_TOKEN', refresh: 'REFRESH_TOKEN' });

    expect(localStorage.getItem('accessToken')).toBe('ACCESS_TOKEN');
    expect(localStorage.getItem('refreshToken')).toBe('REFRESH_TOKEN');

    const auth = getStoredAuth();
    expect(auth?.accessToken).toBe('ACCESS_TOKEN');
    expect(auth?.refreshToken).toBe('REFRESH_TOKEN');
  });

  it('clears stored auth data', () => {
    persistAuthTokens({ access: 'ACCESS_TOKEN', refresh: 'REFRESH_TOKEN' });
    clearStoredAuth();

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(getStoredAuth()).toBeNull();
  });

  it('shouldAttemptTokenRefresh guards refresh routes', () => {
    expect(shouldAttemptTokenRefresh(undefined)).toBe(false);
    expect(shouldAttemptTokenRefresh({ url: '/api/auth/login/' })).toBe(false);
    expect(shouldAttemptTokenRefresh({ url: '/api/auth/refresh/' })).toBe(false);
    expect(shouldAttemptTokenRefresh({ url: '/api/secure/', _retry: true })).toBe(false);
    expect(shouldAttemptTokenRefresh({ url: '/api/secure/' })).toBe(true);
  });
});

