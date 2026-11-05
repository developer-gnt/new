import { apiClient } from '../../../services/apiClient';
import type {
  AuthSession,
  ForgotPasswordResult,
  LoginRequestPayload,
  UserProfile,
} from '../types/auth.types';

const TOKEN_KEY = 'hrsjm_auth_token';
const REFRESH_KEY = 'hrsjm_refresh_token';
const USER_KEY = 'hrsjm_auth_user';

export const authService = {
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
      // Ignore
    }
  },
};
