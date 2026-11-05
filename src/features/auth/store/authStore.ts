import { useSyncExternalStore } from 'react';
import type { LoginPayload, RegisterPayload, UserProfile } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthStoreState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isSeeker: boolean;
  isAdmin: boolean;
  isMember: boolean;
  version: number;
}

class AuthStore {
  private user: UserProfile | null = null;
  private token: string | null = null;
  private listeners: Set<() => void> = new Set();
  private version = 0;
  private cachedSnapshot: AuthStoreState;

  constructor() {
    this.user = authService.getStoredUser();
    this.token = authService.getStoredToken();
    this.cachedSnapshot = this.buildSnapshot();
  }

  private buildSnapshot(): AuthStoreState {
    const roleNames = (this.user?.roles || []).map((r: any) => {
      if (typeof r === 'string') return r.toUpperCase();
      return (r?.name || '').toUpperCase();
    });

    const isSeeker =
      roleNames.includes('DONATION_SEEKER') ||
      roleNames.includes('SEEKER') ||
      (this.user as any)?.account_type === 'seeker';

    const isAdmin =
      roleNames.includes('ADMIN') ||
      roleNames.includes('SUPER_ADMIN') ||
      roleNames.includes('SUPERADMIN');

    const isMember = roleNames.includes('MEMBER');

    return {
      user: this.user,
      token: this.token,
      isAuthenticated: Boolean(this.user && this.token),
      isSeeker,
      isAdmin,
      isMember,
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

  public setUserDirectly(user: UserProfile, token: string): void {
    this.user = user;
    this.token = token;
    authService.saveSession({ user, access_token: token, refresh_token: 'direct-token' });
    this.notify();
  }
}

export const authStore = new AuthStore();

export function useAuth(): AuthStoreState & {
  login: (payload: LoginPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
  updateUserState: (data: Partial<UserProfile>) => void;
  setUserDirectly: (user: UserProfile, token: string) => void;
} {
  const snapshot = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);

  return {
    ...snapshot,
    login: (p) => authStore.login(p),
    register: (p) => authStore.register(p),
    logout: () => authStore.logout(),
    refreshUser: () => authStore.refreshUser(),
    updateUserState: (d) => authStore.updateUserState(d),
    setUserDirectly: (u, t) => authStore.setUserDirectly(u, t),
  };
}

