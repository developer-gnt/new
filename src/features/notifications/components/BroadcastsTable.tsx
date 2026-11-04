import React from 'react';
import { Calendar, Users, Eye } from 'lucide-react';
import type { AdminBroadcastItem } from '../types/notifications.types';

interface BroadcastsTableProps {
  broadcasts: AdminBroadcastItem[];
  searchQuery: string;
}

export const BroadcastsTable: React.FC<BroadcastsTableProps> = ({
  broadcasts,
  searchQuery,
}) => {
  const filtered = broadcasts.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.body.toLowerCase().includes(q);
  });

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (filtered.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <Users size={36} color="#CBD5E1" />
        <h4 style={styles.emptyTitle}>No Broadcast Announcements Found</h4>
        <p style={styles.emptySub}>
          Create a circular or broad announcement using the "New Announcement" button.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headRow}>
            <th style={styles.th}>Announcement Details</th>
            <th style={styles.th}>Target Audience</th>
            <th style={styles.th}>Delivery Status</th>
            <th style={styles.th}>Priority</th>
            <th style={styles.th}>Dispatched / Scheduled</th>
            <th style={styles.th}>Read Rate</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => {
            const readPercentage =
              b.total_recipients > 0 ? Math.round((b.read_count / b.total_recipients) * 100) : 0;

            return (
              <tr key={b.id} style={styles.row}>
                {/* Title & Body Snippet */}
                <td style={styles.td}>
                  <div style={styles.titleCol}>
                    <div style={styles.titleRow}>
                      <span style={styles.categoryBadge}>{b.category}</span>
                      <strong style={styles.broadcastTitle}>{b.title}</strong>
                    </div>
                    <p style={styles.broadcastBody}>{b.body}</p>
                  </div>
                </td>

                {/* Audience */}
                <td style={styles.td}>
                  <div style={styles.audiencePill}>
                    <Users size={12} color="#06294D" />
                    <span>{b.target_audience.replace('_', ' ')}</span>
                  </div>
                </td>

                {/* Status */}
                <td style={styles.td}>
                  {b.status === 'SENT' ? (
                    <span style={styles.statusSent}>DISPATCHED</span>
                  ) : (
                    <span style={styles.statusScheduled}>SCHEDULED</span>
                  )}
                </td>

                {/* Priority */}
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.priorityPill,
                      backgroundColor:
                        b.priority === 'URGENT'
                          ? '#FEE2E2'
                          : b.priority === 'HIGH'
                          ? '#FEF3C7'
                          : '#F1F5F9',
                      color:
                        b.priority === 'URGENT'
                          ? '#991B1B'
                          : b.priority === 'HIGH'
                          ? '#92400E'
                          : '#475569',
                    }}
                  >
                    {b.priority}
                  </span>
                </td>

                {/* Date */}
                <td style={styles.td}>
                  <div style={styles.dateCol}>
                    <Calendar size={12} color="#64748B" />
                    <span>{formatDate(b.sent_at || b.scheduled_at)}</span>
                  </div>
                </td>

                {/* Delivery & Read count */}
                <td style={styles.td}>
                  <div style={styles.deliveryCol}>
                    <div style={styles.deliveryMetrics}>
                      <span style={styles.readCount}>
                        <Eye size={12} color="#64748B" />
                        {b.read_count} / {b.total_recipients}
                      </span>
                      <span style={styles.percentageText}>{readPercentage}%</span>
                    </div>

                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${readPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tableWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
  },
  headRow: {
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  th: {
    padding: '14px 16px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
  },
  row: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.15s',
  },
  td: {
    padding: '14px 16px',
    verticalAlign: 'top',
  },
  titleCol: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '380px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  categoryBadge: {
    backgroundColor: '#EEF2F6',
    color: '#06294D',
    fontSize: '9.5px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.4px',
    flexShrink: 0,
  },
  broadcastTitle: {
    fontSize: '13.5px',
    color: '#011F39',
    lineHeight: 1.3,
  },
  broadcastBody: {
    fontSize: '12px',
    color: '#64748B',
    lineHeight: 1.45,
    margin: 0,
  },
  audiencePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #CBD5E1',
    color: '#06294D',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  },
  statusSent: {
    display: 'inline-block',
    backgroundColor: '#ECFDF5',
    color: '#059669',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid #A7F3D0',
    letterSpacing: '0.4px',
  },
  statusScheduled: {
    display: 'inline-block',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid #FDE68A',
    letterSpacing: '0.4px',
  },
  priorityPill: {
    display: 'inline-block',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
  },
  dateCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#475569',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  deliveryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '120px',
  },
  deliveryMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
  },
  readCount: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#64748B',
  },
  percentageText: {
    fontWeight: 700,
    color: '#06294D',
  },
  progressBar: {
    width: '100%',
    height: '5px',
    backgroundColor: '#E2E8F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: '4px',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '48px 24px',
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
    margin: '12px 0 4px 0',
  },
  emptySub: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
};
