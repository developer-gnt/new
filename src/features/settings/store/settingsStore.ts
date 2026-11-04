import { useSyncExternalStore } from 'react';
import type {
  AdminSettingsState,
  NotificationPreferences,
  OrganizationSettings,
  SecuritySettings,
  SystemSettings,
} from '../types/settings.types';
import { settingsService } from '../services/settingsService';

interface SettingsStoreState {
  settings: AdminSettingsState;
  savedMessage: string | null;
}

class SettingsStore {
  private state: SettingsStoreState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = {
      settings: settingsService.getSettings(),
      savedMessage: null,
    };
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): SettingsStoreState => {
    return this.state;
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public updateOrganization = (org: Partial<OrganizationSettings>): void => {
    const updated = settingsService.updateOrganization(org);
    this.state = {
      ...this.state,
      settings: updated,
      savedMessage: 'Organization profile updated successfully.',
    };
    this.notify();
  };

  public updateNotifications = (notifs: Partial<NotificationPreferences>): void => {
    const updated = settingsService.updateNotifications(notifs);
    this.state = {
      ...this.state,
      settings: updated,
      savedMessage: 'Notification preferences saved.',
    };
    this.notify();
  };

  public updateSecurity = (sec: Partial<SecuritySettings>): void => {
    const updated = settingsService.updateSecurity(sec);
    this.state = {
      ...this.state,
      settings: updated,
      savedMessage: 'Security and session policy updated.',
    };
    this.notify();
  };

  public updateSystem = (sys: Partial<SystemSettings>): void => {
    const updated = settingsService.updateSystem(sys);
    this.state = {
      ...this.state,
      settings: updated,
      savedMessage: 'System configuration updated.',
    };
    this.notify();
  };

  public resetToDefaults = (): void => {
    const updated = settingsService.resetToDefaults();
    this.state = {
      ...this.state,
      settings: updated,
      savedMessage: 'Settings reset to factory defaults.',
    };
    this.notify();
  };

  public dismissSavedMessage = (): void => {
    if (this.state.savedMessage) {
      this.state = {
        ...this.state,
        savedMessage: null,
      };
      this.notify();
    }
  };
}

export const settingsStore = new SettingsStore();

export function useSettingsStore(): SettingsStoreState & {
  updateOrganization: (org: Partial<OrganizationSettings>) => void;
  updateNotifications: (notifs: Partial<NotificationPreferences>) => void;
  updateSecurity: (sec: Partial<SecuritySettings>) => void;
  updateSystem: (sys: Partial<SystemSettings>) => void;
  resetToDefaults: () => void;
  dismissSavedMessage: () => void;
} {
  const state = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getSnapshot
  );

  return {
    settings: state.settings,
    savedMessage: state.savedMessage,
    updateOrganization: settingsStore.updateOrganization,
    updateNotifications: settingsStore.updateNotifications,
    updateSecurity: settingsStore.updateSecurity,
    updateSystem: settingsStore.updateSystem,
    resetToDefaults: settingsStore.resetToDefaults,
    dismissSavedMessage: settingsStore.dismissSavedMessage,
  };
}
