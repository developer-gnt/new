/**
 * Profile & ID Card Store for HRSJM Web Application.
 * Safe concurrent React 19 store using useSyncExternalStore.
 */

import { useSyncExternalStore } from 'react';
import type { AdminDetailsInput, AdminProfile, ChangePasswordInput, PersonalInfoInput } from '../types/profile.types';
import { profileService } from '../services/profileService';

interface ProfileState {
  profile: AdminProfile;
  stagedMessage: string | null;
}

class ProfileStore {
  private state: ProfileState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = {
      profile: profileService.getProfile(),
      stagedMessage: null,
    };
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): ProfileState => {
    return this.state;
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public getProfile(): AdminProfile {
    return this.state.profile;
  }

  public updatePersonalInfo = (input: PersonalInfoInput): void => {
    const updated = profileService.updatePersonalInfo(input);
    this.state = {
      ...this.state,
      profile: updated,
      stagedMessage: 'Personal information updated successfully.',
    };
    this.notify();
  };

  public updateAdminDetails = (input: AdminDetailsInput): void => {
    const updated = profileService.updateAdminDetails(input);
    this.state = {
      ...this.state,
      profile: updated,
      stagedMessage: 'Administrative details updated successfully.',
    };
    this.notify();
  };

  public updateAvatar = (avatar: string | null): void => {
    const updated = profileService.updateAvatar(avatar);
    this.state = {
      ...this.state,
      profile: updated,
      stagedMessage: 'Profile avatar updated successfully.',
    };
    this.notify();
  };

  public changePassword = (input: ChangePasswordInput): { success: boolean; message: string } => {
    const res = profileService.changePassword(input);
    if (res.success) {
      this.state = {
        ...this.state,
        stagedMessage: res.message,
      };
      this.notify();
    }
    return res;
  };

  public stageMessage = (message: string): void => {
    this.state = {
      ...this.state,
      stagedMessage: message,
    };
    this.notify();
  };

  public consumeStagedMessage = (): string | null => {
    const msg = this.state.stagedMessage;
    if (msg) {
      this.state = {
        ...this.state,
        stagedMessage: null,
      };
      this.notify();
    }
    return msg;
  };
}

export const profileStore = new ProfileStore();

export function useProfile(): {
  profile: AdminProfile;
  stagedMessage: string | null;
  updatePersonalInfo: (input: PersonalInfoInput) => void;
  updateAdminDetails: (input: AdminDetailsInput) => void;
  updateAvatar: (avatar: string | null) => void;
  changePassword: (input: ChangePasswordInput) => { success: boolean; message: string };
  consumeStagedMessage: () => string | null;
  stageMessage: (msg: string) => void;
} {
  const state = useSyncExternalStore(
    profileStore.subscribe,
    profileStore.getSnapshot,
    profileStore.getSnapshot
  );

  return {
    profile: state.profile,
    stagedMessage: state.stagedMessage,
    updatePersonalInfo: profileStore.updatePersonalInfo,
    updateAdminDetails: profileStore.updateAdminDetails,
    updateAvatar: profileStore.updateAvatar,
    changePassword: profileStore.changePassword,
    consumeStagedMessage: profileStore.consumeStagedMessage,
    stageMessage: profileStore.stageMessage,
  };
}
