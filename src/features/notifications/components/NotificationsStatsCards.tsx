import React from 'react';
import { Bell, AlertTriangle, Radio, CheckCircle2 } from 'lucide-react';
import type { NotificationStats } from '../types/notifications.types';

interface NotificationsStatsCardsProps {
  stats: NotificationStats;
}

export const NotificationsStatsCards: React.FC<NotificationsStatsCardsProps> = ({ stats }) => {
  return (
    <div style={styles.grid}>
      {/* Total Alerts */}
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.label}>Inbox Notifications</span>
          <div style={{ ...styles.iconWrap, backgroundColor: '#EEF2F6' }}>
            <Bell size={18} color="#06294D" />
          </div>
        </div>
        <div style={styles.val}>{stats.total}</div>
        <span style={styles.sub}>Total received in administrator inbox</span>
      </div>

      {/* Unread Alerts */}
      <div style={{ ...styles.card, borderColor: stats.unread > 0 ? '#FAD465' : '#E2E8F0' }}>
        <div style={styles.header}>
          <span style={styles.label}>Unread Alerts</span>
          <div style={{ ...styles.iconWrap, backgroundColor: '#FEF3C7' }}>
            <CheckCircle2 size={18} color="#D97706" />
          </div>
        </div>
        <div style={{ ...styles.val, color: stats.unread > 0 ? '#B45309' : '#0F172A' }}>
          {stats.unread}
        </div>
        <span style={styles.sub}>Awaiting administrative review</span>
      </div>

      {/* Urgent & High Priority */}
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.label}>High Priority & Urgent</span>
          <div style={{ ...styles.iconWrap, backgroundColor: '#FEE2E2' }}>
            <AlertTriangle size={18} color="#DC2626" />
          </div>
        </div>
        <div style={{ ...styles.val, color: stats.highPriority > 0 ? '#DC2626' : '#0F172A' }}>
          {stats.highPriority}
        </div>
        <span style={styles.sub}>Require expedited grievance attention</span>
      </div>

      {/* Sent Broadcasts */}
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.label}>Announcements Sent</span>
          <div style={{ ...styles.iconWrap, backgroundColor: '#ECFDF5' }}>
            <Radio size={18} color="#059669" />
          </div>
        </div>
        <div style={{ ...styles.val, color: '#059669' }}>{stats.broadcastsSent}</div>
        <span style={styles.sub}>Central circulars & broad notifications</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '18px 20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  iconWrap: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  val: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#011F39',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  sub: {
    fontSize: '11.5px',
    color: '#94A3B8',
  },
};

