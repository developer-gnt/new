import { apiClient } from '../../../services/apiClient';
import type {
  AuthSession,
  ChangePasswordPayload,
  CheckDuplicatesPayload,
  ResetPasswordPayload,
  VerifyResetTokenResult,
  CheckDuplicatesResult,
  ForgotPasswordResult,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '../types/auth.types';

const TOKEN_KEY = 'hrsjm_auth_token';
const REFRESH_TOKEN_KEY = 'hrsjm_refresh_token';
const USER_KEY = 'hrsjm_user_profile';

/**
 * Resolves the appropriate destination route according to the user's authenticated account type and roles:
 * - Admin -> /admin/dashboard
 * - Member -> /member/dashboard
 * - Donation Seeker -> /seeker/home
 * - General User -> /user/dashboard
 *
 * Never defaults an unknown or general account to /admin/dashboard.
 */
export function resolveUserDestination(user: UserProfile | null | undefined): string {
  if (!user) {
    return '/login';
  }

  // 1. Direct account_type property as returned by backend /auth/me or /users/toProfile
  const accountType = (user.account_type || '').toLowerCase().trim();
  if (accountType === 'admin') return '/admin/dashboard';
  if (accountType === 'member') return '/member/dashboard';
  if (accountType === 'seeker') return '/seeker/home';
  if (accountType === 'general') return '/user/dashboard';

  // 2. Extract and normalize role names
  const roleNames = (user.roles || []).map((r: any) => {
    if (typeof r === 'string') return r.toUpperCase().trim();
    return (r?.name || '').toUpperCase().trim();
  });

  // Admin takes top priority
  if (
    roleNames.includes('ADMIN') ||
    roleNames.includes('SUPER_ADMIN') ||
    roleNames.includes('SUPERADMIN')
  ) {
    return '/admin/dashboard';
  }

  // Member
  if (
    roleNames.includes('MEMBER') ||
    user.membership_status === 'ACTIVE' ||
    user.membership_status === 'APPROVED'
  ) {
    return '/member/dashboard';
  }

  // Donation Seeker
  if (
    roleNames.includes('SEEKER') ||
    roleNames.includes('DONATION_SEEKER') ||
    user.assistance_status === 'APPROVED'
  ) {
    return '/seeker/home';
  }

  // General user or default fallback
  return '/user/dashboard';
}

/**
 * Validates whether an authenticated user is permitted to access a specific target route.
 */
export function isPathAllowedForUser(path: string, user: UserProfile | null | undefined): boolean {
  if (!user || !path || !path.startsWith('/')) return false;

  const roleNames = (user.roles || []).map((r: any) => {
    if (typeof r === 'string') return r.toUpperCase().trim();
    return (r?.name || '').toUpperCase().trim();
  });

  const isAdmin =
    user.account_type === 'admin' ||
    roleNames.includes('ADMIN') ||
    roleNames.includes('SUPER_ADMIN') ||
    roleNames.includes('SUPERADMIN');

  if (isAdmin) {
    return true; // Admins have cross-portal privileges
  }

  const isMember =
    user.account_type === 'member' ||
    roleNames.includes('MEMBER') ||
    user.membership_status === 'ACTIVE' ||
    user.membership_status === 'APPROVED';

  const isSeeker =
    user.account_type === 'seeker' ||
    roleNames.includes('SEEKER') ||
    roleNames.includes('DONATION_SEEKER') ||
    user.assistance_status === 'APPROVED';

  if (path.startsWith('/admin')) {
    return false; // Non-admin cannot access /admin
  }

  if (path.startsWith('/member')) {
    return isMember;
  }

  if (path.startsWith('/seeker')) {
    return isSeeker;
  }

  // All authenticated users can access /user/* or general public paths
  return true;
}

export const authService = {
  getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getAuthToken(): string | null {
    return this.getStoredToken();
  },

  getStoredRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    return this.getStoredRefreshToken();
  },

  getStoredUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): UserProfile | null {
    return this.getStoredUser();
  },

  saveSession(session: AuthSession, rememberMe = true): void {
    try {
      if (session.access_token) {
        localStorage.setItem(TOKEN_KEY, session.access_token);
      }
      if (session.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      }
      if (rememberMe && session.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  },

  setSession(session: AuthSession, rememberMe = true): void {
    this.saveSession(session, rememberMe);
  },

  clearSession(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('auth_token');
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('hrsjm_last_app_no');
      localStorage.removeItem('hrsjm_user_role');
      sessionStorage.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('hrsjm:auth:logout'));
      }
    } catch {
      // Ignore storage errors
    }
  },

  updateStoredUser(user: Partial<UserProfile>): UserProfile | null {
    try {
      const current = this.getStoredUser();
      if (!current) return null;
      const updated = { ...current, ...user };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return null;
    }
  },

  /**
   * Checks whether mobile number or email already exists in the backend database.
   */
  async checkDuplicates(payload: CheckDuplicatesPayload): Promise<CheckDuplicatesResult> {
    const res = await apiClient.post<CheckDuplicatesResult>('/auth/check-duplicates', {
      mobile_number: payload.mobile_number ? payload.mobile_number.replace(/\D/g, '').slice(-10) : undefined,
      email: payload.email ? payload.email.trim().toLowerCase() : undefined,
      exclude_user_id: payload.exclude_user_id,
    });
    return res;
  },

  /**
   * Validates credentials against POST /auth/login and stores session tokens.
   * Connects exclusively to the authentic backend API without password substitution or mock sessions.
   */
  async login(payload: LoginPayload): Promise<AuthSession> {
    const res = await apiClient.post<any>('/auth/login', {
      identifier: payload.identifier.trim(),
      password: payload.password,
    });

    const session: AuthSession = res?.data || res;
    if (session?.access_token && session?.user) {
      this.saveSession(session, payload.rememberMe ?? true);
      return session;
    }
    throw new Error(res?.message || 'Invalid login response from server.');
  },

  /**
   * Registers a new user account via POST /auth/register and sets session tokens.
   */
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const res = await apiClient.post<any>('/auth/register', {
      full_name: payload.full_name.trim(),
      mobile_number: payload.mobile_number.replace(/\D/g, '').slice(-10),
      email: payload.email ? payload.email.trim().toLowerCase() : undefined,
      dob: payload.dob || payload.date_of_birth,
      password: payload.password,
      confirm_password: payload.confirm_password || payload.password,
      role_name: payload.role_name || 'USER',
    });

    const session: AuthSession = res?.data || res;
    if (session?.access_token && session?.user) {
      this.saveSession(session);
      return session;
    }
    throw new Error(res?.message || 'Registration failed.');
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
   * Validates if a password reset token is active and unexpired via GET /auth/verify-reset-token.
   */
  async verifyResetToken(token: string): Promise<VerifyResetTokenResult> {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { valid: false, message: 'Missing reset token' };
    }
    const res = await apiClient.get<VerifyResetTokenResult>('/auth/verify-reset-token', {
      params: { token: cleanToken },
    });
    return res;
  },

  /**
   * Resets account password using valid reset token via POST /auth/reset-password.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<any>('/auth/reset-password', {
      token: payload.token.trim(),
      password: payload.password,
      confirm_password: payload.confirm_password,
    });
    return {
      success: true,
      message: res?.message || 'Password updated successfully.',
    };
  },

  async fetchMe(): Promise<UserProfile | null> {
    try {
      const res = await apiClient.get<any>('/auth/me');
      const user: UserProfile = res?.data || res;
      if (user && user.id) {
        this.updateStoredUser(user);
        return user;
      }
      this.clearSession();
      return null;
    } catch (err: any) {
      if (err?.status === 401 || err?.statusCode === 401) {
        this.clearSession();
      }
      return null;
    }
  },

  async updateMe(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await apiClient.patch<any>('/auth/me', {
      full_name: data.full_name,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });
    const updated = res?.data || res || data;
    this.updateStoredUser(updated);
    return updated;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<any>('/auth/change-password', payload);
    return {
      success: true,
      message: res?.message || 'Password changed successfully.',
    };
  },

  /**
   * Revokes refresh token server-side and clears local storage.
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (refreshToken) {
        // Race with a 1-second timeout so sign-out is never blocked or frozen by network issues
        await Promise.race([
          apiClient.post('/auth/logout', { refresh_token: refreshToken }),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]).catch(() => {});
      }
    } catch {
      // Ignore errors on logout
    } finally {
      this.clearSession();
    }
  },
};
