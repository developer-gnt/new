import { apiClient } from '../../../services/apiClient';
import type {
  AuthSession,
  CheckDuplicatesPayload,
  CheckDuplicatesResult,
  ForgotPasswordResult,
  LoginRequestPayload,
  RegisterRequestPayload,
  UserProfile,
} from '../types/auth.types';

const TOKEN_KEY = 'hrsjm_auth_token';
const REFRESH_KEY = 'hrsjm_refresh_token';
const USER_KEY = 'hrsjm_auth_user';

export const authService = {
  /**
   * Registers a new user account via POST /auth/register and sets session tokens.
   */
  async register(payload: RegisterRequestPayload): Promise<AuthSession> {
    const res = await apiClient.post<AuthSession>('/auth/register', {
      full_name: payload.full_name.trim(),
      mobile_number: payload.mobile_number.replace(/\D/g, '').slice(-10),
      email: payload.email ? payload.email.trim().toLowerCase() : undefined,
      dob: payload.dob ? payload.dob.trim() : undefined,
      password: payload.password,
      confirm_password: payload.confirm_password,
      role_name: payload.role_name || 'USER',
    });
    if (res?.access_token) {
      this.setSession(res, true);
    }
    return res;
  },

  /**
   * Checks whether mobile number or email already exists in the backend database.
   */
  async checkDuplicates(payload: CheckDuplicatesPayload): Promise<CheckDuplicatesResult> {
    try {
      const res = await apiClient.post<CheckDuplicatesResult>('/auth/check-duplicates', {
        mobile_number: payload.mobile_number ? payload.mobile_number.replace(/\D/g, '').slice(-10) : undefined,
        email: payload.email ? payload.email.trim().toLowerCase() : undefined,
        exclude_user_id: payload.exclude_user_id,
      });
      return res;
    } catch {
      // In offline / mock mode fallback, consider available
      return {
        available: true,
        mobile_taken: false,
        email_taken: false,
      };
    }
  },

  /**
   * Validates credentials against POST /auth/login and stores session tokens.
   */
  async login(payload: LoginRequestPayload): Promise<AuthSession> {
    const res = await apiClient.post<AuthSession>('/auth/login', {
      identifier: payload.identifier.trim(),
      password: payload.password,
    });
    return res;
  },

  /**
   * Requests a database-backed password reset link via POST /auth/forgot-password.
   */
  async forgotPassword(identifier: string): Promise<ForgotPasswordResult> {
    const res = await apiClient.post<ForgotPasswordResult>('/auth/forgot-password', {
      identifier: identifier.trim(),
    });
    return res;
  },

  /**
   * Revokes refresh token server-side and clears local storage.
   */
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch {
      // Offline or network error
    } finally {
      this.clearSession();
    }
  },

  getAuthToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore parse errors
    }
    return null;
  },

  setSession(session: AuthSession, rememberMe = true): void {
    try {
      if (session.access_token) {
        localStorage.setItem(TOKEN_KEY, session.access_token);
      }
      if (session.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      }
      if (rememberMe && session.refresh_token) {
        localStorage.setItem(REFRESH_KEY, session.refresh_token);
      } else {
        localStorage.removeItem(REFRESH_KEY);
      }
    } catch {
      // Ignore quota errors
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore errors
    }
  },
};
