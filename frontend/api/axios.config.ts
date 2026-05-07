import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';

import { ApiError, type ApiErrorBody } from '@/api/types';
import { getApiBaseUrl } from '@/services/config/env';
import { queryClient } from '@/services/query/queryClient';
import { clearAccessToken, getAccessToken } from '@/services/storage/secureStore';

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isPublic = config.headers?.['x-public-request'] === 'true';
    if (isPublic) {
      delete config.headers['x-public-request'];
      return config;
    }
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as ApiErrorBody | undefined;
    const message = toMessage(body, error.message || `Erreur ${String(status)}`);
    if (status === 401) {
      await clearAccessToken();
      queryClient.clear();
      router.replace('/(auth)/login');
    }
    return Promise.reject(new ApiError(message, status, body ?? null));
  },
);

function toMessage(body: ApiErrorBody | undefined, fallback: string): string {
  if (!body) return fallback;
  if (typeof body.message === 'string' && body.message.length > 0) return body.message;
  if (Array.isArray(body.message) && body.message.length > 0) return body.message[0] ?? fallback;
  return fallback;
}

export default axiosInstance;
