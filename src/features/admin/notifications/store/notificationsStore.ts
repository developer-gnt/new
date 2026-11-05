import { useSyncExternalStore } from 'react';
import type {
  AdminBroadcastItem,
  CreateBroadcastInput,
  NotificationItem,
  NotificationStats,
} from '../types/notifications.types';
import { notificationsService } from '../services/notificationsService';

interface NotificationsStoreState {
  notifications: NotificationItem[];
  broadcasts: AdminBroadcastItem[];
  unreadCount: number;
  stats: NotificationStats;
}

class NotificationsStore {
  private state: NotificationsStoreState;
  private listeners = new Set<() => void>();

  constructor() {
    const notifications = notificationsService.getNotifications();
    const broadcasts = notificationsService.getBroadcasts();
    const stats = notificationsService.getStats();

    this.state = {
      notifications,
      broadcasts,
      unreadCount: stats.unread,
      stats,
    };
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): NotificationsStoreState => {
    return this.state;
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public markRead = (recipientId: string): void => {
    const updated = notificationsService.markRead(recipientId);
    const stats = notificationsService.getStats();
    this.state = {
      ...this.state,
      notifications: updated,
      unreadCount: stats.unread,
      stats,
    };
    this.notify();
  };

  public markAllRead = (): void => {
    const updated = notificationsService.markAllRead();
    const stats = notificationsService.getStats();
    this.state = {
      ...this.state,
      notifications: updated,
      unreadCount: stats.unread,
      stats,
    };
    this.notify();
  };

  public deleteNotification = (recipientId: string): void => {
    const updated = notificationsService.deleteNotification(recipientId);
    const stats = notificationsService.getStats();
    this.state = {
      ...this.state,
      notifications: updated,
      unreadCount: stats.unread,
      stats,
    };
    this.notify();
  };

  public createBroadcast = (input: CreateBroadcastInput): void => {
    const { broadcast, notifications } = notificationsService.createBroadcast(input);
    const broadcasts = [broadcast, ...this.state.broadcasts];
    const stats = notificationsService.getStats();
    this.state = {
      ...this.state,
      notifications,
      broadcasts,
      unreadCount: stats.unread,
      stats,
    };
    this.notify();
  };
}

export const notificationsStore = new NotificationsStore();

export function useNotificationsStore(): NotificationsStoreState & {
  markRead: (recipientId: string) => void;
  markAllRead: () => void;
  deleteNotification: (recipientId: string) => void;
  createBroadcast: (input: CreateBroadcastInput) => void;
} {
  const state = useSyncExternalStore(
    notificationsStore.subscribe,
    notificationsStore.getSnapshot,
    notificationsStore.getSnapshot
  );

  return {
    notifications: state.notifications,
    broadcasts: state.broadcasts,
    unreadCount: state.unreadCount,
    stats: state.stats,
    markRead: notificationsStore.markRead,
    markAllRead: notificationsStore.markAllRead,
    deleteNotification: notificationsStore.deleteNotification,
    createBroadcast: notificationsStore.createBroadcast,
  };
}

export function useUnreadCount(): number {
  const state = useSyncExternalStore(
    notificationsStore.subscribe,
    notificationsStore.getSnapshot,
    notificationsStore.getSnapshot
  );
  return state.unreadCount;
}

