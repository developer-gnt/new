import type React from 'react';
import { FileText, Clock, Check, X } from 'lucide-react';
import type { RightsStatsSummary } from '../types/rights.types';

interface RightsStatsCardsProps {
  stats: RightsStatsSummary;
  activeStatus: string;
  onSelectStatus?: (status: any) => void;
}

export const RightsStatsCards: React.FC<RightsStatsCardsProps> = ({
  stats,
  activeStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'ALL',
      label: 'Total Articles',
      value: stats.total,
      icon: FileText,
      surfaceBg: '#EFF6FF',
      iconBg: '#06294D',
      numColor: '#0B2F52',
      labelColor: '#34516D',
      border: '#BFDBFE',
    },
    {
      key: 'DRAFT',
      label: 'Drafts',
      value: stats.drafts,
      icon: Clock,
      surfaceBg: '#FFF7ED',
      iconBg: '#EA580C',
      numColor: '#0B2F52',
      labelColor: '#34516D',
      border: '#FED7AA',
    },
    {
      key: 'PUBLISHED',
      label: 'Published',
      value: stats.published,
      icon: Check,
      surfaceBg: '#F0FDF4',
      iconBg: '#16A34A',
      numColor: '#16A34A',
      labelColor: '#15803D',
      border: '#BBF7D0',
    },
    {
      key: 'ARCHIVED',
      label: 'Archived',
      value: stats.archived,
      icon: X,
      surfaceBg: '#FEF2F2',
      iconBg: '#DC2626',
      numColor: '#DC2626',
      labelColor: '#B91C1C',
      border: '#FECACA',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c) => {
        const IconComponent = c.icon;
        const isSelected = activeStatus === c.key;

        return (
          <div
            key={c.key}
            style={{
              ...styles.card,
              backgroundColor: c.surfaceBg,
              border: isSelected ? `2px solid ${c.iconBg}` : `1px solid ${c.border}`,
              cursor: onSelectStatus ? 'pointer' : 'default',
              boxShadow: isSelected ? '0 4px 12px rgba(6, 41, 77, 0.12)' : 'none',
            }}
            onClick={() => onSelectStatus && onSelectStatus(c.key)}
            role={onSelectStatus ? 'button' : undefined}
            tabIndex={onSelectStatus ? 0 : undefined}
          >
            <div style={{ ...styles.iconBadge, backgroundColor: c.iconBg }}>
              <IconComponent size={18} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={styles.content}>
              <div style={{ ...styles.value, color: c.numColor }}>{c.value}</div>
              <div style={{ ...styles.label, color: c.labelColor }}>{c.label}</div>
            </div>
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
    gap: '14px',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '10px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    transition: 'all 0.15s ease',
  },
  iconBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  value: {
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: '1.2',
    fontFamily: 'Inter, sans-serif',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.01em',
  },
};
