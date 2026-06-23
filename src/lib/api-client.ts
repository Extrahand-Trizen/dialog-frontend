import axios, { type AxiosError } from 'axios';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import type { ApiErrorBody, ApiSuccessBody } from '@/types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:4010/api/v1';

export const AUTH_TOKEN_KEY = 'trizendialog_auth_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && !isDevMockAuthEnabled()) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiSuccessBody<T>>(url, { params });
  return response.data.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<{ items: T[]; meta: NonNullable<ApiSuccessBody<T[]>['meta']> }> {
  const response = await apiClient.get<ApiSuccessBody<T[]>>(url, { params });
  const meta = response.data.meta;
  if (!meta) {
    throw new Error('Paginated response missing meta');
  }
  return { items: response.data.data, meta };
}

export async function post<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await apiClient.post<ApiSuccessBody<T>>(url, body);
  return response.data.data;
}

export async function patch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await apiClient.patch<ApiSuccessBody<T>>(url, body);
  return response.data.data;
}

export async function put<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await apiClient.put<ApiSuccessBody<T>>(url, body);
  return response.data.data;
}

export async function del<T = null>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiSuccessBody<T>>(url);
  return response.data.data;
}
