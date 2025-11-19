import httpClient from './httpClient';
import type { AxiosRequestConfig } from 'axios';

export default httpClient.axios;
export const http = httpClient;

export { getStoredAuth, persistAuthTokens, clearStoredAuth, shouldAttemptTokenRefresh } from './httpClient';

export async function fetcher(args: string | [string, AxiosRequestConfig]) {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await httpClient.axios.get(url, { ...config });
  return res.data;
}
