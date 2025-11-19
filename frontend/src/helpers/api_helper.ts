import type { AxiosRequestConfig } from 'axios';
import httpClient from 'utils/httpClient';

class APIClient {
  get = (url: string, params?: Record<string, any>) => {
    return httpClient.axios.get(url, { params });
  };

  create = (url: string, data: Record<string, any>) => {
    return httpClient.axios.post(url, data);
  };

  post = (url: string, data: Record<string, any>) => {
    return httpClient.axios.post(url, data);
  };

  update = (url: string, data: Record<string, any>) => {
    return httpClient.axios.patch(url, data);
  };

  patch = (url: string, data: Record<string, any>) => {
    return httpClient.axios.patch(url, data);
  };

  put = (url: string, data: Record<string, any>) => {
    return httpClient.axios.put(url, data);
  };

  delete = (url: string, config?: AxiosRequestConfig) => {
    return httpClient.axios.delete(url, config);
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

const getToken = () => {
  const authUser = sessionStorage.getItem('authUser');
  if (authUser) {
    try {
      const parsedAuth = JSON.parse(authUser);
      return parsedAuth.access_token || parsedAuth.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export { APIClient, getLoggedinUser, getToken };
