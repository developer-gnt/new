import React from 'react';
import { Search, CheckCheck, Plus, Filter } from 'lucide-react';

interface NotificationsSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
  onMarkAllRead: () => void;
  onCreateBroadcast: () => void;
  unreadCount: number;
  isBroadcastView: boolean;
}

export const NotificationsSearchBar: React.FC<NotificationsSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  onMarkAllRead,
  onCreateBroadcast,
  unreadCount,
  isBroadcastView,
}) => {
  return (
    <div style={styles.container}>
      {/* Search Input */}
      <div style={styles.searchWrap}>
        <Search size={16} color="#94A3B8" style={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isBroadcastView
              ? 'Search announcements by subject or target...'
              : 'Search notifications by title or description...'
          }
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={styles.clearBtn}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter and Actions Group */}
      <div style={styles.actionsWrap}>
        {/* Priority Filter */}
        <div style={styles.filterWrap}>
          <Filter size={14} color="#64748B" style={styles.filterIcon} />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Alerts</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal Priority</option>
          </select>
        </div>

        {/* Mark All Read Button (inbox view) */}
        {!isBroadcastView && (
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            style={{
              ...styles.secondaryBtn,
              opacity: unreadCount === 0 ? 0.6 : 1,
              cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
            }}
            title="Mark all notifications as read"
          >
            <CheckCheck size={15} color="#06294D" />
            <span>Mark All Read</span>
          </button>
        )}

        {/* New Broadcast Announcement Button */}
        <button
          type="button"
          onClick={onCreateBroadcast}
          style={styles.primaryBtn}
          title="Create central circular announcement"
        >
          <Plus size={16} color="#011F39" strokeWidth={2.5} />
          <span>New Announcement</span>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 36px 9px 36px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13.5px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px',
  },
  actionsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  filterIcon: {
    position: 'absolute',
    left: '10px',
    pointerEvents: 'none',
  },
  select: {
    padding: '9px 12px 9px 30px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '12.5px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 14px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    color: '#06294D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
    transition: 'all 0.15s',
  },
};

