import type {
  AdminSettingsState,
  NotificationPreferences,
  OrganizationSettings,
  SecuritySettings,
  SystemSettings,
} from '../types/settings.types';
import { INITIAL_SETTINGS } from '../data/settingsFixtures';

const SETTINGS_STORAGE_KEY = 'hrsjm_admin_settings_data_v1';

export class SettingsService {
  private static instance: SettingsService;

  private constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public getSettings(): AdminSettingsState {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return {
          ...INITIAL_SETTINGS,
          ...JSON.parse(stored),
        };
      }
    } catch {
      // fallback
    }
    return { ...INITIAL_SETTINGS };
  }

  public saveSettings(settings: AdminSettingsState): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  public updateOrganization(org: Partial<OrganizationSettings>): AdminSettingsState {
    const current = this.getSettings();
    const updated: AdminSettingsState = {
      ...current,
      organization: {
        ...current.organization,
        ...org,
      },
    };
    this.saveSettings(updated);
    return updated;
  }

  public updateNotifications(notifs: Partial<NotificationPreferences>): AdminSettingsState {
    const current = this.getSettings();
    const updated: AdminSettingsState = {
      ...current,
      notifications: {
        ...current.notifications,
        ...notifs,
      },
    };
    this.saveSettings(updated);
    return updated;
  }

  public updateSecurity(sec: Partial<SecuritySettings>): AdminSettingsState {
    const current = this.getSettings();
    const updated: AdminSettingsState = {
      ...current,
      security: {
        ...current.security,
        ...sec,
      },
    };
    this.saveSettings(updated);
    return updated;
  }

  public updateSystem(sys: Partial<SystemSettings>): AdminSettingsState {
    const current = this.getSettings();
    const updated: AdminSettingsState = {
      ...current,
      system: {
        ...current.system,
        ...sys,
      },
    };
    this.saveSettings(updated);
    return updated;
  }

  public resetToDefaults(): AdminSettingsState {
    this.saveSettings(INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  }

  /**
   * Generates a downloadable JSON backup file of all administrative configurations.
   */
  public exportBackup(): void {
    const settings = this.getSettings();
    const exportData = {
      organization: settings.organization.trustName,
      timestamp: new Date().toISOString(),
      version: settings.system.appVersion,
      settings,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HRSJM_System_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public clearCache(): void {
    try {
      sessionStorage.clear();
      // Keep primary auth / credentials intact while clearing transient cached caches
    } catch {
      // ignore
    }
  }
}

export const settingsService = SettingsService.getInstance();
