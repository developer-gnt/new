import React from 'react';
import {
  MessageSquare,
  FileText,
  HeartHandshake,
  Calendar,
  ShieldCheck,
  Bell,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { NotificationItem } from '../types/notifications.types';

interface NotificationRowProps {
  item: NotificationItem;
  onOpen: (item: NotificationItem) => void;
  onDelete: (recipientId: string) => void;
}

function renderCategoryIcon(category?: string) {
  switch (category) {
    case 'SUPPORT':
      return <MessageSquare size={18} color="#06294D" />;
    case 'APPLICATION':
      return <FileText size={18} color="#059669" />;
    case 'DONATION':
      return <HeartHandshake size={18} color="#D97706" />;
    case 'EVENT':
      return <Calendar size={18} color="#7C3AED" />;
    case 'SECURITY':
      return <ShieldCheck size={18} color="#2563EB" />;
    default:
      return <Bell size={18} color="#06294D" />;
  }
}

// Format relative time helper
function formatTimeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const NotificationRow: React.FC<NotificationRowProps> = ({
  item,
  onOpen,
  onDelete,
}) => {
  const { notification, is_read, created_at, recipient_id } = item;

  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        ...styles.row,
        backgroundColor: !is_read ? '#F0F6FA' : '#FFFFFF',
        borderColor: !is_read ? '#BAE6FD' : '#E2E8F0',
      }}
    >
      {/* Unread Left Border / Dot */}
      {!is_read && <div style={styles.unreadDot} />}

      {/* Category Icon Wrap */}
      <div
        style={{
          ...styles.iconContainer,
          backgroundColor: !is_read ? '#FFFFFF' : '#F8FAFC',
        }}
      >
        {renderCategoryIcon(notification.category)}
      </div>

      {/* Content Column */}
      <div style={styles.contentCol}>
        <div style={styles.headerRow}>
          <div style={styles.titleWrap}>
            <span
              style={{
                ...styles.title,
                fontWeight: !is_read ? 700 : 600,
                color: !is_read ? '#011F39' : '#334155',
              }}
            >
              {notification.title}
            </span>

            {/* Priority Badges */}
            {notification.priority === 'URGENT' && (
              <span style={styles.urgentBadge}>URGENT</span>
            )}
            {notification.priority === 'HIGH' && (
              <span style={styles.highBadge}>HIGH</span>
            )}
          </div>

          <span style={styles.timestamp}>{formatTimeAgo(created_at)}</span>
        </div>

        {/* Body snippet */}
        <p style={styles.bodyText}>{notification.body}</p>

        {/* Action Link Footer */}
        <div style={styles.footerRow}>
          {notification.actionLabel && (
            <div style={styles.actionPrompt}>
              <span>{notification.actionLabel}</span>
              <ExternalLink size={12} color="#06294D" />
            </div>
          )}

          <div style={styles.itemControls}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipient_id);
              }}
              style={styles.deleteBtn}
              title="Delete notification"
              aria-label="Delete"
            >
              <Trash2 size={13} color="#94A3B8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '10px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.15s ease-in-out',
  },
  unreadDot: {
    position: 'absolute',
    left: '8px',
    top: '22px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#0284C7',
  },
  iconContainer: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  contentCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '4px',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '14.5px',
    letterSpacing: '-0.2px',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 6px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
  },
  highBadge: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '6px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#94A3B8',
    whiteSpace: 'nowrap',
  },
  bodyText: {
    fontSize: '13px',
    color: '#64748B',
    lineHeight: 1.45,
    margin: '0 0 8px 0',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPrompt: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#06294D',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
