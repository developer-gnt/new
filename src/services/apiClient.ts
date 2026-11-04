/**
 * HRSJM Admin Web API Client
 *
 * Connects with `HRSJM-back-api` endpoints (configured with global prefix /api/v1).
 * Supports Bearer authentication and standard response envelope handling.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T = any> {
  success?: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  statusCode?: number;
  data?: any;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('hrsjm_auth_token');
  } catch {
    return null;
  }
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAuthToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: any = null;
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      // Non-JSON error body
    }
    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  const resJson = await response.json();
  if (resJson && typeof resJson === 'object' && 'data' in resJson && resJson.success !== undefined) {
    return resJson.data as T;
  }
  return resJson as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

