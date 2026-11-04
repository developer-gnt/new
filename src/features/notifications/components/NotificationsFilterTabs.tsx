import React from 'react';
import { Bell, Inbox, FileText, MessageSquare, HeartHandshake, Radio } from 'lucide-react';

export type MainTabType = 'INBOX' | 'BROADCASTS';
export type InboxSubTab = 'ALL' | 'UNREAD' | 'APPLICATIONS' | 'SUPPORT' | 'FINANCE';

interface NotificationsFilterTabsProps {
  mainTab: MainTabType;
  onSelectMainTab: (tab: MainTabType) => void;
  inboxTab: InboxSubTab;
  onSelectInboxTab: (tab: InboxSubTab) => void;
  unreadCount: number;
}

export const NotificationsFilterTabs: React.FC<NotificationsFilterTabsProps> = ({
  mainTab,
  onSelectMainTab,
  inboxTab,
  onSelectInboxTab,
  unreadCount,
}) => {
  return (
    <div style={styles.container}>
      {/* Primary Module Switcher (Inbox vs Broadcasts) */}
      <div style={styles.primaryTabs}>
        <button
          type="button"
          onClick={() => onSelectMainTab('INBOX')}
          style={{
            ...styles.primaryTabBtn,
            backgroundColor: mainTab === 'INBOX' ? '#06294D' : '#FFFFFF',
            color: mainTab === 'INBOX' ? '#FFFFFF' : '#475569',
            borderColor: mainTab === 'INBOX' ? '#06294D' : '#CBD5E1',
          }}
        >
          <Inbox size={15} color={mainTab === 'INBOX' ? '#FAD465' : '#64748B'} />
          <span>My Notifications Inbox</span>
          {unreadCount > 0 && (
            <span
              style={{
                ...styles.counterBadge,
                backgroundColor: mainTab === 'INBOX' ? '#FAD465' : '#EF4444',
                color: mainTab === 'INBOX' ? '#011F39' : '#FFFFFF',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectMainTab('BROADCASTS')}
          style={{
            ...styles.primaryTabBtn,
            backgroundColor: mainTab === 'BROADCASTS' ? '#06294D' : '#FFFFFF',
            color: mainTab === 'BROADCASTS' ? '#FFFFFF' : '#475569',
            borderColor: mainTab === 'BROADCASTS' ? '#06294D' : '#CBD5E1',
          }}
        >
          <Radio size={15} color={mainTab === 'BROADCASTS' ? '#FAD465' : '#64748B'} />
          <span>Broadcast Announcements</span>
        </button>
      </div>

      {/* Inbox Sub-filters (Only shown when viewing Inbox) */}
      {mainTab === 'INBOX' && (
        <div style={styles.subTabsRow}>
          <button
            type="button"
            onClick={() => onSelectInboxTab('ALL')}
            style={{
              ...styles.subTabBtn,
              borderBottomColor: inboxTab === 'ALL' ? '#06294D' : 'transparent',
              color: inboxTab === 'ALL' ? '#06294D' : '#64748B',
              fontWeight: inboxTab === 'ALL' ? 700 : 500,
            }}
          >
            <Bell size={14} />
            <span>All Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('UNREAD')}
            style={{
              ...styles.subTabBtn,
              borderBottomColor: inboxTab === 'UNREAD' ? '#06294D' : 'transparent',
              color: inboxTab === 'UNREAD' ? '#06294D' : '#64748B',
              fontWeight: inboxTab === 'UNREAD' ? 700 : 500,
            }}
          >
            <span>Unread Only</span>
            {unreadCount > 0 && (
              <span style={styles.unreadPill}>{unreadCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('APPLICATIONS')}
            style={{
              ...styles.subTabBtn,
              borderBottomColor: inboxTab === 'APPLICATIONS' ? '#06294D' : 'transparent',
              color: inboxTab === 'APPLICATIONS' ? '#06294D' : '#64748B',
              fontWeight: inboxTab === 'APPLICATIONS' ? 700 : 500,
            }}
          >
            <FileText size={14} />
            <span>Applications & Members</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('SUPPORT')}
            style={{
              ...styles.subTabBtn,
              borderBottomColor: inboxTab === 'SUPPORT' ? '#06294D' : 'transparent',
              color: inboxTab === 'SUPPORT' ? '#06294D' : '#64748B',
              fontWeight: inboxTab === 'SUPPORT' ? 700 : 500,
            }}
          >
            <MessageSquare size={14} />
            <span>Support & Complaints</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('FINANCE')}
            style={{
              ...styles.subTabBtn,
              borderBottomColor: inboxTab === 'FINANCE' ? '#06294D' : 'transparent',
              color: inboxTab === 'FINANCE' ? '#06294D' : '#64748B',
              fontWeight: inboxTab === 'FINANCE' ? 700 : 500,
            }}
          >
            <HeartHandshake size={14} />
            <span>Donations & Accounting</span>
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  primaryTabs: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryTabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  counterBadge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: '12px',
  },
  subTabsRow: {
    display: 'flex',
    gap: '16px',
    borderBottom: '1px solid #E2E8F0',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  subTabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 4px 12px',
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  unreadPill: {
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '10px',
  },
};
