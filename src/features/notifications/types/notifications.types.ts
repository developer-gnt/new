/**
 * Notifications Domain Types for HRSJM Admin Web Application.
 * Parity with mobile APK src/features/admin/notifications/types/notifications.types.ts
 * and NestJS backend src/modules/notifications/
 */

export type NotificationAudience =
  | 'ALL_USERS'
  | 'MEMBERS'
  | 'DONORS'
  | 'DONATION_SEEKERS'
  | 'SPECIFIC_USER';

export type NotificationStatus = 'SENT' | 'SCHEDULED';

export type NotificationCategory =
  | 'APPLICATION'
  | 'SUPPORT'
  | 'DONATION'
  | 'EVENT'
  | 'SECURITY'
  | 'ANNOUNCEMENT'
  | 'SYSTEM';

export type NotificationPriority = 'NORMAL' | 'HIGH' | 'URGENT';

/** Single notification row in admin inbox matching backend wire format */
export interface NotificationItem {
  recipient_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  notification: {
    id: string;
    title: string;
    body: string;
    target_audience: NotificationAudience;
    sent_at: string | null;
    category?: NotificationCategory;
    priority?: NotificationPriority;
    deepLinkUrl?: string;
    actionLabel?: string;
  };
}

/** Admin broadcast announcement matching NestJS NotificationEntity */
export interface AdminBroadcastItem {
  id: string;
  title: string;
  body: string;
  target_audience: NotificationAudience;
  status: NotificationStatus;
  created_at: string;
  sent_at: string | null;
  scheduled_at: string | null;
  category: NotificationCategory;
  priority: NotificationPriority;
  total_recipients: number;
  read_count: number;
  recipient_user_ids?: string[];
}

export interface CreateBroadcastInput {
  title: string;
  body: string;
  target_audience: NotificationAudience;
  category: NotificationCategory;
  priority: NotificationPriority;
  scheduled_at?: string | null;
  recipient_user_ids?: string[];
}

export interface NotificationFilterState {
  searchQuery: string;
  tab: 'ALL' | 'UNREAD' | 'APPLICATIONS' | 'SUPPORT' | 'FINANCE' | 'SYSTEM';
  category: string;
  priority: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  broadcastsSent: number;
}
