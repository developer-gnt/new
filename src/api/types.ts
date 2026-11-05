/**
 * HRSJM Universal API Types & Response Contracts
 * Formatted to match NestJS TransformInterceptor and HttpExceptionFilter
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

export interface PaginatedData<T> {
  items: T[];
  totalCount?: number;
  total?: number;
  page?: number;
  limit?: number;
  stats?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  code: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: ApiErrorDetail;
}

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  skipAuth?: boolean;
}

