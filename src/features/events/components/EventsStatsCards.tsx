import type React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { EventStatsSummary, EventStatusFilter } from '../types/events.types';

interface EventsStatsCardsProps {
  stats: EventStatsSummary;
  selectedStatus: EventStatusFilter;
  onSelectStatus: (status: EventStatusFilter) => void;
}

export const EventsStatsCards: React.FC<EventsStatsCardsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'ALL' as EventStatusFilter,
      label: 'TOTAL EVENTS',
      count: stats.total,
      subtitle: 'All organized activities',
      icon: Calendar,
      color: '#011F39',
      bg: '#EDF2F7',
      borderColor: '#DBE5EE',
    },
    {
      key: 'UPCOMING' as EventStatusFilter,
      label: 'UPCOMING',
      count: stats.upcoming,
      subtitle: 'Open for registration',
      icon: Clock,
      color: '#D97706',
      bg: '#FFF9E6',
      borderColor: '#FDE68A',
    },
    {
      key: 'COMPLETED' as EventStatusFilter,
      label: 'COMPLETED',
      count: stats.completed,
      subtitle: 'Successfully concluded',
      icon: CheckCircle2,
      color: '#16A34A',
      bg: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      key: 'CANCELLED' as EventStatusFilter,
      label: 'CANCELLED',
      count: stats.cancelled,
      subtitle: 'Withdrawn or rescheduled',
      icon: XCircle,
      color: '#DC2626',
      bg: '#FDEEEF',
      borderColor: '#FECACA',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedStatus === c.key;
        return (
          <div
            key={c.key}
            onClick={() => onSelectStatus(c.key)}
            style={{
              ...styles.card,
              border: isSelected ? `2px solid ${c.color}` : `1px solid ${c.borderColor}`,
              boxShadow: isSelected ? '0 4px 14px rgba(1, 31, 57, 0.12)' : '0 2px 6px rgba(1, 31, 57, 0.04)',
            }}
          >
            <div style={styles.topRow}>
              <div>
                <span style={styles.cardTitle}>{c.label}</span>
                <div style={{ ...styles.countText, color: c.color }}>{c.count}</div>
              </div>
              <div style={{ ...styles.iconBadge, backgroundColor: c.bg, color: c.color }}>
                <Icon size={20} />
              </div>
            </div>
            <div style={styles.subtitleText}>{c.subtitle}</div>
          </div>
        );
      })}
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
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#718096',
    letterSpacing: '0.04em',
  },
  countText: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '28px',
    fontWeight: 700,
    marginTop: '4px',
    lineHeight: 1.1,
  },
  iconBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: '12px',
    color: '#718096',
  },
};

