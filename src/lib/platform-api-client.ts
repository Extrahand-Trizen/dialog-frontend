import axios, { type AxiosError } from 'axios';
import { getApiBaseUrl } from '@/config/runtime-config';
import { isOnAppPath, redirectToAppPath } from '@/lib/app-navigation';
import type { ApiErrorBody, ApiSuccessBody } from '@/types/api';

const API_BASE_URL = getApiBaseUrl();

/**
 * Deliberately separate from AUTH_TOKEN_KEY / apiClient (lib/api-client.ts).
 * A Platform Super Admin belongs to no organization, so its token and this
 * client are kept fully independent of the org-scoped auth channel — mirrors
 * the backend's platformAdminAuth vs jwtAuth separation.
 */
export const PLATFORM_AUTH_TOKEN_KEY = 'trizendialog_platform_auth_token';

export const platformApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

platformApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(PLATFORM_AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

platformApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(PLATFORM_AUTH_TOKEN_KEY);
      if (!isOnAppPath('/platform/login')) {
        redirectToAppPath('/platform/login');
      }
    }
    return Promise.reject(error);
  },
);

export async function platformGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await platformApiClient.get<ApiSuccessBody<T>>(url, { params });
  return response.data.data;
}

export async function platformGetPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<{ items: T[]; meta: NonNullable<ApiSuccessBody<T[]>['meta']> }> {
  const response = await platformApiClient.get<ApiSuccessBody<T[]>>(url, { params });
  const meta = response.data.meta;
  if (!meta) {
    throw new Error('Paginated response missing meta');
  }
  return { items: response.data.data, meta };
}

export async function platformPost<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await platformApiClient.post<ApiSuccessBody<T>>(url, body);
  return response.data.data;
}

export async function platformPatch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await platformApiClient.patch<ApiSuccessBody<T>>(url, body);
  return response.data.data;
}

export async function platformDelete<T = null>(url: string): Promise<T> {
  const response = await platformApiClient.delete<ApiSuccessBody<T>>(url);
  return response.data.data;
}
