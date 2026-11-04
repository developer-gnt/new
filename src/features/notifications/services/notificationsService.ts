import type {
  AdminBroadcastItem,
  CreateBroadcastInput,
  NotificationItem,
  NotificationStats,
} from '../types/notifications.types';
import { INITIAL_BROADCASTS, INITIAL_NOTIFICATIONS } from '../data/notificationsFixtures';

const NOTIFICATIONS_STORAGE_KEY = 'hrsjm_admin_notifications_v1';
const BROADCASTS_STORAGE_KEY = 'hrsjm_admin_broadcasts_v1';

export class NotificationsService {
  private static instance: NotificationsService;

  private constructor() {}

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  public getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [...INITIAL_NOTIFICATIONS];
  }

  public saveNotifications(items: NotificationItem[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  public getBroadcasts(): AdminBroadcastItem[] {
    try {
      const stored = localStorage.getItem(BROADCASTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [...INITIAL_BROADCASTS];
  }

  public saveBroadcasts(items: AdminBroadcastItem[]): void {
    try {
      localStorage.setItem(BROADCASTS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  public getUnreadCount(): number {
    const items = this.getNotifications();
    return items.filter((n) => !n.is_read).length;
  }

  public markRead(recipientId: string): NotificationItem[] {
    const items = this.getNotifications();
    const updated = items.map((item) => {
      if (item.recipient_id === recipientId) {
        return {
          ...item,
          is_read: true,
          read_at: new Date().toISOString(),
        };
      }
      return item;
    });
    this.saveNotifications(updated);
    return updated;
  }

  public markAllRead(): NotificationItem[] {
    const items = this.getNotifications();
    const updated = items.map((item) => ({
      ...item,
      is_read: true,
      read_at: item.read_at || new Date().toISOString(),
    }));
    this.saveNotifications(updated);
    return updated;
  }

  public deleteNotification(recipientId: string): NotificationItem[] {
    const items = this.getNotifications();
    const updated = items.filter((item) => item.recipient_id !== recipientId);
    this.saveNotifications(updated);
    return updated;
  }

  public createBroadcast(input: CreateBroadcastInput): { broadcast: AdminBroadcastItem; notifications: NotificationItem[] } {
    const broadcasts = this.getBroadcasts();
    const isScheduled = Boolean(input.scheduled_at && new Date(input.scheduled_at) > new Date());

    const newBroadcast: AdminBroadcastItem = {
      id: `bc-${String(broadcasts.length + 1).padStart(3, '0')}`,
      title: input.title.trim(),
      body: input.body.trim(),
      target_audience: input.target_audience,
      status: isScheduled ? 'SCHEDULED' : 'SENT',
      created_at: new Date().toISOString(),
      sent_at: isScheduled ? null : new Date().toISOString(),
      scheduled_at: input.scheduled_at || null,
      category: input.category,
      priority: input.priority,
      total_recipients:
        input.target_audience === 'ALL_USERS'
          ? 8450
          : input.target_audience === 'MEMBERS'
          ? 1240
          : input.target_audience === 'DONORS'
          ? 430
          : 150,
      read_count: 0,
      recipient_user_ids: input.recipient_user_ids,
    };

    const updatedBroadcasts = [newBroadcast, ...broadcasts];
    this.saveBroadcasts(updatedBroadcasts);

    // If sent immediately, also push to current admin notifications inbox
    const notifications = this.getNotifications();
    let updatedNotifications = notifications;
    if (!isScheduled) {
      const inboxEntry: NotificationItem = {
        recipient_id: `rec-${Date.now()}`,
        is_read: false,
        read_at: null,
        created_at: new Date().toISOString(),
        notification: {
          id: newBroadcast.id,
          title: newBroadcast.title,
          body: newBroadcast.body,
          target_audience: newBroadcast.target_audience,
          sent_at: newBroadcast.sent_at,
          category: newBroadcast.category,
          priority: newBroadcast.priority,
        },
      };
      updatedNotifications = [inboxEntry, ...notifications];
      this.saveNotifications(updatedNotifications);
    }

    return { broadcast: newBroadcast, notifications: updatedNotifications };
  }

  public getStats(): NotificationStats {
    const items = this.getNotifications();
    const broadcasts = this.getBroadcasts();
    const unread = items.filter((n) => !n.is_read).length;
    const highPriority = items.filter((n) => n.notification.priority === 'URGENT' || n.notification.priority === 'HIGH').length;
    const broadcastsSent = broadcasts.filter((b) => b.status === 'SENT').length;

    return {
      total: items.length,
      unread,
      highPriority,
      broadcastsSent,
    };
  }
}

export const notificationsService = NotificationsService.getInstance();
