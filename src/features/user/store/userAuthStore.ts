import { useSyncExternalStore } from 'react';
import type { UserProfile } from '../types/userHome.types';
import { usersStore } from '../../users/store/usersStore';
import { applicationsStore } from '../../applications/store/applicationsStore';

const STORAGE_KEY = 'hrsjm_user_profile';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-001',
  full_name: 'Mohd. Ayaan Shaikh',
  email: 'ayaan.shaikh@hrsjm.org',
  mobile_number: '+91 98765 43210',
  status: 'ACTIVE',
  roles: [{ id: 'role-user', name: 'USER' }],
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-10-20T10:00:00Z',
  account_type: 'general',
  membership_status: null, // change to 'PENDING' to test pending membership banner
  assistance_status: null, // change to 'PENDING', 'APPROVED', or 'REJECTED' to test seeker banner
  assistance_application_number: 'HRSJM-SEK-2026-0042',
};

interface UserAuthState {
  user: UserProfile | null;
  status: 'authenticated' | 'unauthenticated';
  unreadNotificationsCount: number;
}

class UserAuthStore {
  private state: UserAuthState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = {
      user: this.loadPersistedUser(),
      status: 'authenticated',
      unreadNotificationsCount: 3,
    };
  }

  private loadPersistedUser(): UserProfile | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEMO_USER;
  }

  private persistUser(user: UserProfile | null): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore
    }
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): UserAuthState => {
    return this.state;
  };

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  public setUser = (user: UserProfile | null): void => {
    this.state = {
      ...this.state,
      user,
      status: user ? 'authenticated' : 'unauthenticated',
    };
    this.persistUser(user);
    this.notify();
  };

  public signOut = (): void => {
    this.setUser(null);
  };

  public restoreDemoSession = (): void => {
    this.setUser(DEFAULT_DEMO_USER);
  };

  public updateAssistanceStatus = (status: 'PENDING' | 'APPROVED' | 'REJECTED' | null): void => {
    if (!this.state.user) return;
    const updated: UserProfile = {
      ...this.state.user,
      assistance_status: status,
      account_type: status === 'APPROVED' ? 'seeker' : this.state.user.account_type,
    };
    this.setUser(updated);
  };

  public updateMembershipStatus = (status: 'PENDING' | 'ACTIVE' | 'REJECTED' | null): void => {
    if (!this.state.user) return;
    const updated: UserProfile = {
      ...this.state.user,
      membership_status: status,
      account_type: status === 'ACTIVE' ? 'member' : this.state.user.account_type,
    };
    this.setUser(updated);
  };

  public getMatchedSeekerApplication = () => {
    const user = this.state.user;
    if (!user) return undefined;
    const phone = user.mobile_number?.replace(/\D/g, '').slice(-10);
    const email = user.email?.toLowerCase().trim();
    const appNo = user.assistance_application_number;

    try {
      const allUsers = usersStore.getAllUsers();
      const matched = allUsers.find(u => {
        if (u.userType !== 'seeker') return false;
        if (appNo && u.applicationNumber === appNo) return true;
        if (phone && u.phone && u.phone.replace(/\D/g, '').includes(phone)) return true;
        if (email && u.email && u.email.toLowerCase().trim() === email) return true;
        return false;
      });
      if (matched) return matched;
    } catch {
      // fallback
    }

    try {
      const storeApps = applicationsStore.getAllApplications();
      const matchedApp = storeApps.find(
        (a: any) =>
          a.accountType === 'seeker' &&
          ((appNo && a.applicationId === appNo) ||
            (email && a.email && a.email.toLowerCase().trim() === email) ||
            (phone && a.phone && a.phone.replace(/\D/g, '').includes(phone)))
      );
      if (matchedApp) {
        return {
          id: matchedApp.id,
          name: matchedApp.applicantName,
          email: matchedApp.email || '',
          phone: matchedApp.phone || '',
          userType: 'seeker' as const,
          status: matchedApp.status === 'approved' ? ('active' as const) : matchedApp.status === 'rejected' ? ('blocked' as const) : ('pending' as const),
          applicationNumber: matchedApp.applicationId,
          joinedDate: matchedApp.submittedAt || new Date().toISOString(),
          remarks: (matchedApp as any).rejectionReason || '',
          documents: [],
        };
      }
    } catch {
      // fallback
    }

    return undefined;
  };
}

export const userAuthStore = new UserAuthStore();

export const useUserAuth = () => {
  const state = useSyncExternalStore(
    userAuthStore.subscribe,
    userAuthStore.getSnapshot,
    userAuthStore.getSnapshot
  );

  return {
    ...state,
    setUser: userAuthStore.setUser,
    signOut: userAuthStore.signOut,
    restoreDemoSession: userAuthStore.restoreDemoSession,
    updateAssistanceStatus: userAuthStore.updateAssistanceStatus,
    updateMembershipStatus: userAuthStore.updateMembershipStatus,
    getMatchedSeekerApplication: userAuthStore.getMatchedSeekerApplication,
  };
};
