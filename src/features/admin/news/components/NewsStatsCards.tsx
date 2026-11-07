import type React from 'react';
import { Newspaper, Send, FileEdit, Archive } from 'lucide-react';
import type { NewsStatsSummary } from '../types/news.types';

interface NewsStatsCardsProps {
  stats: NewsStatsSummary;
  selectedStatus: string;
  onSelectStatus: (status: any) => void;
}

export const NewsStatsCards: React.FC<NewsStatsCardsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'ALL',
      label: 'TOTAL ARTICLES',
      count: stats.total,
      icon: Newspaper,
      iconBg: '#EBF3FA',
      iconColor: '#011F39',
      borderActive: '#011F39',
    },
    {
      key: 'PUBLISHED',
      label: 'PUBLISHED',
      count: stats.published,
      icon: Send,
      iconBg: '#DCFCE7',
      iconColor: '#166534',
      borderActive: '#166534',
    },
    {
      key: 'DRAFT',
      label: 'DRAFTS',
      count: stats.drafts,
      icon: FileEdit,
      iconBg: '#FEF3C7',
      iconColor: '#92400E',
      borderActive: '#F59E0B',
    },
    {
      key: 'ARCHIVED',
      label: 'ARCHIVED',
      count: stats.archived,
      icon: Archive,
      iconBg: '#F1F5F9',
      iconColor: '#475569',
      borderActive: '#64748B',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = selectedStatus === c.key;
        return (
          <div
            key={c.key}
            onClick={() => onSelectStatus(c.key)}
            style={{
              ...styles.card,
              borderColor: isActive ? c.borderActive : '#DCE4EC',
              boxShadow: isActive
                ? `0 4px 12px ${c.borderActive}22`
                : '0 2px 8px rgba(1, 31, 57, 0.04)',
            }}
          >
            <div style={styles.topRow}>
              <span style={styles.label}>{c.label}</span>
              <div style={{ ...styles.iconWrapper, backgroundColor: c.iconBg }}>
                <Icon size={18} color={c.iconColor} />
              </div>
            </div>
            <div style={styles.count}>{c.count}</div>
          </div>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1.5px solid #DCE4EC',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#34516D',
    letterSpacing: '0.06em',
  },
  iconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '28px',
    fontWeight: 700,
    color: '#011F39',
  },
};

