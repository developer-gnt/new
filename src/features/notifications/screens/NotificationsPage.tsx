import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Radio, RefreshCw } from 'lucide-react';
import { useNotificationsStore } from '../store/notificationsStore';
import { NotificationsStatsCards } from '../components/NotificationsStatsCards';
import {
  NotificationsFilterTabs,
  type MainTabType,
  type InboxSubTab,
} from '../components/NotificationsFilterTabs';
import { NotificationsSearchBar } from '../components/NotificationsSearchBar';
import { NotificationRow } from '../components/NotificationRow';
import { NotificationDetailsModal } from '../components/NotificationDetailsModal';
import { CreateBroadcastModal } from '../components/CreateBroadcastModal';
import { BroadcastsTable } from '../components/BroadcastsTable';
import type { NotificationItem } from '../types/notifications.types';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    broadcasts,
    unreadCount,
    stats,
    markRead,
    markAllRead,
    deleteNotification,
    createBroadcast,
  } = useNotificationsStore();

  const [mainTab, setMainTab] = useState<MainTabType>('INBOX');
  const [inboxTab, setInboxTab] = useState<InboxSubTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals state
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [createBroadcastOpen, setCreateBroadcastOpen] = useState(false);

  // Filter inbox notifications based on active tab, search query, priority
  const filteredNotifications = notifications.filter((item) => {
    // 1. Sub-tab filter
    if (inboxTab === 'UNREAD' && item.is_read) return false;
    if (inboxTab === 'APPLICATIONS' && item.notification.category !== 'APPLICATION') return false;
    if (inboxTab === 'SUPPORT' && item.notification.category !== 'SUPPORT') return false;
    if (inboxTab === 'FINANCE' && item.notification.category !== 'DONATION') return false;

    // 2. Priority filter
    if (priorityFilter !== 'ALL' && item.notification.priority !== priorityFilter) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.notification.title.toLowerCase().includes(q);
      const bodyMatch = item.notification.body.toLowerCase().includes(q);
      if (!titleMatch && !bodyMatch) return false;
    }

    return true;
  });

  const handleOpenNotification = (item: NotificationItem) => {
    // Mark as read automatically
    markRead(item.recipient_id);
    setSelectedNotification(item);
  };

  return (
    <div style={styles.container}>
      {/* Header & Breadcrumb */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </span>
          <ChevronRight size={13} color="#94A3B8" />
          <span style={styles.breadcrumbActive}>Notifications & Announcements</span>
        </div>

        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Notifications & Announcements</h1>
            <p style={styles.subtitle}>
              Monitor real-time system alerts, member applications, grievance tickets, and broadcast central circulars.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={() => setCreateBroadcastOpen(true)}
              style={styles.primaryActionBtn}
            >
              <Radio size={15} color="#011F39" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <NotificationsStatsCards stats={stats} />

      {/* Module Navigation Tabs */}
      <NotificationsFilterTabs
        mainTab={mainTab}
        onSelectMainTab={setMainTab}
        inboxTab={inboxTab}
        onSelectInboxTab={setInboxTab}
        unreadCount={unreadCount}
      />

      {/* Search Bar & Actions */}
      <NotificationsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onMarkAllRead={markAllRead}
        onCreateBroadcast={() => setCreateBroadcastOpen(true)}
        unreadCount={unreadCount}
        isBroadcastView={mainTab === 'BROADCASTS'}
      />

      {/* Main View Area */}
      {mainTab === 'INBOX' ? (
        <div style={styles.inboxListWrap}>
          {filteredNotifications.length === 0 ? (
            <div style={styles.emptyContainer}>
              <RefreshCw size={36} color="#CBD5E1" />
              <h4 style={styles.emptyTitle}>
                {inboxTab === 'UNREAD' ? 'You are all caught up!' : 'No Notifications Found'}
              </h4>
              <p style={styles.emptySub}>
                {inboxTab === 'UNREAD'
                  ? 'There are no pending unread notifications in your inbox.'
                  : 'No alerts match your current filter criteria.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <NotificationRow
                key={item.recipient_id}
                item={item}
                onOpen={handleOpenNotification}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      ) : (
        <BroadcastsTable
          broadcasts={broadcasts}
          searchQuery={searchQuery}
        />
      )}

      {/* Notification Details Modal */}
      <NotificationDetailsModal
        item={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />

      {/* Create Broadcast Modal */}
      <CreateBroadcastModal
        isOpen={createBroadcastOpen}
        onClose={() => setCreateBroadcastOpen(false)}
        onSubmit={createBroadcast}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px 32px 60px',
    maxWidth: '1440px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '24px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    color: '#64748B',
    marginBottom: '10px',
  },
  breadcrumbLink: {
    cursor: 'pointer',
    color: '#06294D',
    fontWeight: 500,
  },
  breadcrumbActive: {
    color: '#0F172A',
    fontWeight: 600,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#011F39',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13.5px',
    color: '#64748B',
    margin: '4px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  primaryActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
  },
  inboxListWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '54px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: '14px 0 4px 0',
  },
  emptySub: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
    maxWidth: '380px',
    lineHeight: 1.45,
  },
};
