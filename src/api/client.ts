/**
 * HRSJM Universal API Client
 * Enterprise-grade fetch wrapper with Bearer token authentication,
 * error normalization, and query parameter handling.
 */

import { ApiError, type ApiResponse, type RequestOptions } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const getAuthToken = (): string | null => {
  try {
    return (
      localStorage.getItem('hrsjm_auth_token') ||
      localStorage.getItem('auth_token') ||
      null
    );
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem('hrsjm_auth_token', token);
    localStorage.setItem('auth_token', token);
  } catch (err) {
    console.warn('Failed to persist auth token:', err);
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem('hrsjm_auth_token');
    localStorage.removeItem('auth_token');
  } catch (err) {
    console.warn('Failed to clear auth token:', err);
  }
};

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const cleanEndpoint = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (!params) return cleanEndpoint;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${cleanEndpoint}${cleanEndpoint.includes('?') ? '&' : '?'}${queryString}` : cleanEndpoint;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, skipAuth, headers: customHeaders, ...fetchInit } = options;
  const url = buildUrl(endpoint, params);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string> || {}),
  };

  if (!isFormData && body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getAuthToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchInit,
    headers,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with HTTP status ${response.status}`;
    let errorCode: string | undefined;
    let errorDetails: unknown;

    try {
      const errorJson = await response.json();
      if (errorJson?.message) {
        errorMessage = Array.isArray(errorJson.message)
          ? errorJson.message.join('; ')
          : String(errorJson.message);
      }
      if (errorJson?.error?.code) {
        errorCode = errorJson.error.code;
      }
      errorDetails = errorJson?.error?.details || errorJson?.details;
    } catch {
      // Body is not valid JSON
    }

    throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  const resJson = await response.json();

  // If response matches backend TransformInterceptor format ({ success: true, data: ... })
  if (resJson && typeof resJson === 'object' && 'data' in resJson && 'success' in resJson) {
    return (resJson as ApiResponse<T>).data;
  }

  return resJson as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  upload: <T>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: formData }),
};

export default apiClient;

