import { useSyncExternalStore } from 'react';
import type { LoginPayload, RegisterPayload, UserProfile } from '../types/auth.types';
import { authService, resolveUserDestination, isPathAllowedForUser } from '../services/authService';
import { userAuthStore } from '../../user/store/userAuthStore';

export { resolveUserDestination, isPathAllowedForUser };

interface AuthStoreState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isSeeker: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isGeneralUser: boolean;
  version: number;
}

class AuthStore {
  private user: UserProfile | null = null;
  private token: string | null = null;
  private listeners: Set<() => void> = new Set();
  private version = 0;
  private cachedSnapshot: AuthStoreState;

  constructor() {
    this.token = authService.getStoredToken();
    this.user = this.token ? authService.getStoredUser() : null;
    this.cachedSnapshot = this.buildSnapshot();

    // Listen to global logout events
    if (typeof window !== 'undefined') {
      window.addEventListener('hrsjm:auth:logout', () => {
        this.user = null;
        this.token = null;
        this.notify();
      });
    }

    // Validate existing session with backend /auth/me on mount
    if (this.token) {
      void this.validateSession();
    }
  }

  public async validateSession(): Promise<boolean> {
    if (!this.token) return false;
    try {
      const freshUser = await authService.fetchMe();
      if (freshUser && freshUser.id) {
        this.user = freshUser;
        this.notify();
        return true;
      }
      this.user = null;
      this.token = null;
      authService.clearSession();
      this.notify();
      return false;
    } catch {
      this.user = null;
      this.token = null;
      authService.clearSession();
      this.notify();
      return false;
    }
  }

  private buildSnapshot(): AuthStoreState {
    const roleNames = (this.user?.roles || []).map((r: any) => {
      if (typeof r === 'string') return r.toUpperCase();
      return (r?.name || '').toUpperCase();
    });

    const accountType = (this.user?.account_type || '').toLowerCase();

    const isAdmin =
      accountType === 'admin' ||
      roleNames.includes('ADMIN') ||
      roleNames.includes('SUPER_ADMIN') ||
      roleNames.includes('SUPERADMIN');

    const isMember =
      accountType === 'member' ||
      roleNames.includes('MEMBER') ||
      this.user?.membership_status === 'ACTIVE' ||
      this.user?.membership_status === 'APPROVED';

    const isSeeker =
      accountType === 'seeker' ||
      roleNames.includes('DONATION_SEEKER') ||
      roleNames.includes('SEEKER') ||
      this.user?.assistance_status === 'APPROVED';

    const isGeneralUser = !isAdmin && !isMember && !isSeeker;

    return {
      user: this.user,
      token: this.token,
      isAuthenticated: Boolean(this.user && this.token),
      isSeeker,
      isAdmin,
      isMember,
      isGeneralUser,
      version: this.version,
    };
  }

  private notify(): void {
    this.version += 1;
    this.cachedSnapshot = this.buildSnapshot();
    this.listeners.forEach((l) => l());
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): AuthStoreState => {
    return this.cachedSnapshot;
  };

  public async login(payload: LoginPayload): Promise<UserProfile> {
    const session = await authService.login(payload);
    this.user = session.user;
    this.token = session.access_token;
    this.notify();
    return session.user;
  }

  public async register(payload: RegisterPayload): Promise<UserProfile> {
    const session = await authService.register(payload);
    this.user = session.user;
    this.token = session.access_token;
    this.notify();
    return session.user;
  }

  public async logout(): Promise<void> {
    await authService.logout();
    this.user = null;
    this.token = null;
    this.notify();
  }

  public async refreshUser(): Promise<UserProfile | null> {
    const updated = await authService.fetchMe();
    if (updated) {
      this.user = updated;
      this.notify();
    }
    return updated;
  }

  public updateUserState(data: Partial<UserProfile>): void {
    const updated = authService.updateStoredUser(data);
    if (updated) {
      this.user = updated;
      this.notify();
    }
  }

  public setUserDirectly(user: UserProfile, token: string, refreshToken?: string): void {
    this.user = user;
    this.token = token;
    const existingRefresh = authService.getStoredRefreshToken();
    authService.saveSession({
      user,
      access_token: token,
      refresh_token: refreshToken || existingRefresh || '',
    });
    this.notify();
  }
}

export const authStore = new AuthStore();

/**
 * Global Sign Out Orchestrator:
 * Clears tokens, resets authStore & userAuthStore, purges storage,
 * and navigates safely to /login?logout=success.
 */
export async function executeSignOut(navigate?: (to: string, options?: any) => void): Promise<void> {
  // 1. Immediately purge all local storage tokens & user sessions synchronously
  authService.clearSession();
  try {
    userAuthStore.signOut();
  } catch (err) {
    console.warn('Error during userAuthStore signOut:', err);
  }

  // 2. Clear any lingering auth keys
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('hrsjm_auth_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('hrsjm_refresh_token');
      localStorage.removeItem('hrsjm_user_profile');
      localStorage.removeItem('hrsjm_user_role');
      localStorage.removeItem('hrsjm_last_app_no');
      sessionStorage.clear();
    } catch {
      // ignore
    }
  }

  // 3. Notify backend (non-blocking with timeout)
  try {
    await authStore.logout();
  } catch (err) {
    console.warn('Error during authStore logout:', err);
  }

  // 4. Dispatch logout event and navigate to login
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hrsjm:auth:logout'));
    if (navigate) {
      navigate('/login?logout=success', { replace: true });
    } else {
      window.location.href = '/login?logout=success';
    }
  }
}

export function useAuth(): AuthStoreState & {
  login: (payload: LoginPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
  updateUserState: (data: Partial<UserProfile>) => void;
  setUserDirectly: (user: UserProfile, token: string, refreshToken?: string) => void;
} {
  const snapshot = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);

  return {
    ...snapshot,
    login: (p) => authStore.login(p),
    register: (p) => authStore.register(p),
    logout: () => authStore.logout(),
    refreshUser: () => authStore.refreshUser(),
    updateUserState: (d) => authStore.updateUserState(d),
    setUserDirectly: (u, t, r) => authStore.setUserDirectly(u, t, r),
  };
}
