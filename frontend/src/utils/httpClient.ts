import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { ACCOUNT_REFRESH } from 'helpers/urls/account';
import { normalizeApiError, NormalizedApiError } from './apiError';

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000/';
const AUTH_USER_KEY = 'authUser';

export interface RefreshableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type AuthPayload = {
  access_token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
};

/**
 * Lightweight token storage helpers (exported for tests)
 */
export const getStoredAuth = (): AuthPayload | null => {
  const raw = sessionStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
};

export const persistAuthTokens = (tokens: { access?: string | null; refresh?: string | null }) => {
  const auth = getStoredAuth() || {};
  const updated: AuthPayload = {
    ...auth,
    access_token: tokens.access ?? auth.access_token ?? auth.accessToken ?? undefined,
    accessToken: tokens.access ?? auth.accessToken ?? auth.access_token ?? undefined,
    refreshToken: tokens.refresh ?? auth.refreshToken
  };

  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));

  if (tokens.access) {
    localStorage.setItem('accessToken', tokens.access);
  }
  if (tokens.refresh) {
    localStorage.setItem('refreshToken', tokens.refresh);
  }
};

export const clearStoredAuth = () => {
  sessionStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const shouldAttemptTokenRefresh = (config?: RefreshableRequestConfig): boolean => {
  if (!config) return false;
  if (config._retry) return false;
  const url = config.url || '';
  if (!url) return false;
  return !url.includes('/auth/login') && !url.includes('/auth/register') && !url.includes('/auth/refresh');
};

class HttpClient {
  private axiosInstance: AxiosInstance;
  private refreshInstance: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });
    this.refreshInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });

    this.axiosInstance.interceptors.request.use(this.attachAuthorization);
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error as AxiosError)
    );
  }

  get axios(): AxiosInstance {
    return this.axiosInstance;
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data as T;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'get', url });
  }

  async post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'post', url, data });
  }

  async put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'put', url, data });
  }

  async patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'patch', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'delete', url });
  }

  private attachAuthorization = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = this.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  private handleError = async (error: AxiosError) => {
    const status = error.response?.status;
    const requestConfig = error.config as RefreshableRequestConfig | undefined;

    if (status === 401 && shouldAttemptTokenRefresh(requestConfig)) {
      try {
        requestConfig!._retry = true;
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken && requestConfig) {
          requestConfig.headers = requestConfig.headers || {};
          requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          return this.axiosInstance(requestConfig);
        }
      } catch (refreshError) {
        clearStoredAuth();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401) {
      clearStoredAuth();
    }

    return Promise.reject(normalizeApiError(error));
  };

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || getStoredAuth()?.accessToken || null;
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || getStoredAuth()?.refreshToken || null;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshPromise = this.refreshInstance
      .post(ACCOUNT_REFRESH, { refresh: refreshToken })
      .then((response: AxiosResponse<any>) => {
        const payload = response.data?.data || response.data;
        const newAccess = payload?.access ?? payload?.token ?? null;
        const newRefresh = payload?.refresh ?? refreshToken;

        if (newAccess) {
          persistAuthTokens({ access: newAccess, refresh: newRefresh });
        }

        return newAccess;
      })
      .catch((err) => {
        const normalized = normalizeApiError(err);
        clearStoredAuth();
        throw normalized;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }
}

const httpClient = new HttpClient();

export default httpClient;

