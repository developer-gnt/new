import type React from 'react';
import { MessageSquare, Clock, CheckCircle2, Archive, AlertCircle } from 'lucide-react';
import type { TicketStatsData } from '../types/support.types';

interface SupportStatsCardsProps {
  stats: TicketStatsData;
  activeTab: string;
  onSelectTab: (tabKey: any) => void;
}

export const SupportStatsCards: React.FC<SupportStatsCardsProps> = ({
  stats,
  activeTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Tickets',
      count: stats.total,
      subtitle: 'All support grievances',
      icon: MessageSquare,
      accentColor: '#011F39',
      bgColor: '#EDF2F7',
      borderColor: '#DBE5EE',
    },
    {
      id: 'SUBMITTED',
      title: 'Open / Submitted',
      count: stats.open,
      subtitle: 'Awaiting triage or review',
      icon: AlertCircle,
      accentColor: '#D97706',
      bgColor: '#FFF9E6',
      borderColor: '#FDE68A',
    },
    {
      id: 'UNDER_REVIEW',
      title: 'In Progress',
      count: stats.inProgress,
      subtitle: 'Under active investigation',
      icon: Clock,
      accentColor: '#0284C7',
      bgColor: '#EFF6FF',
      borderColor: '#BAE6FD',
    },
    {
      id: 'RESOLVED',
      title: 'Resolved',
      count: stats.resolved,
      subtitle: 'Solutions delivered to citizens',
      icon: CheckCircle2,
      accentColor: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      id: 'CLOSED',
      title: 'Closed',
      count: stats.closed,
      subtitle: 'Archived resolved cases',
      icon: Archive,
      accentColor: '#475569',
      bgColor: '#F1F5F9',
      borderColor: '#CBD5E1',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeTab === c.id;
        return (
          <div
            key={c.id}
            onClick={() => onSelectTab(c.id)}
            style={{
              ...styles.card,
              border: isActive ? `2px solid ${c.accentColor}` : `1px solid ${c.borderColor}`,
              boxShadow: isActive ? '0 4px 14px rgba(1, 31, 57, 0.12)' : '0 2px 6px rgba(1, 31, 57, 0.04)',
            }}
          >
            <div style={styles.topRow}>
              <div>
                <span style={styles.cardTitle}>{c.title}</span>
                <div style={{ ...styles.countText, color: c.accentColor }}>{c.count}</div>
              </div>
              <div style={{ ...styles.iconBadge, backgroundColor: c.bgColor, color: c.accentColor }}>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    textTransform: 'uppercase',
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

