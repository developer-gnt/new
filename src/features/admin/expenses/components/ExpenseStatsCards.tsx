import type React from 'react';
import { CreditCard, FileText, CheckCircle2, X } from 'lucide-react';
import type { ExpenseStatsSummary } from '../types/expenses.types';
import { formatINR } from '../types/expenses.types';

interface ExpenseStatsCardsProps {
  stats: ExpenseStatsSummary;
  activeStatus: string;
  onSelectStatus?: (status: string) => void;
}

export const ExpenseStatsCards: React.FC<ExpenseStatsCardsProps> = ({
  stats,
  activeStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'TOTAL_EXPENSES',
      statusTarget: 'ALL',
      label: 'Total Expenses',
      value: formatINR(stats.totalAmount),
      icon: CreditCard,
      surfaceBg: '#FEF2F2',
      iconBg: '#DC2626',
      numColor: '#991B1B',
      labelColor: '#B91C1C',
      borderColor: '#FECACA',
    },
    {
      key: 'ALL',
      statusTarget: 'ALL',
      label: 'Total Records',
      value: String(stats.all),
      icon: FileText,
      surfaceBg: '#EFF6FF',
      iconBg: '#06294D',
      numColor: '#0B2F52',
      labelColor: '#34516D',
      borderColor: '#BFDBFE',
    },
    {
      key: 'POSTED',
      statusTarget: 'POSTED',
      label: 'Posted Records',
      value: String(stats.posted),
      icon: CheckCircle2,
      surfaceBg: '#F0FDF4',
      iconBg: '#16A34A',
      numColor: '#15803D',
      labelColor: '#16A34A',
      borderColor: '#BBF7D0',
    },
    {
      key: 'CANCELLED',
      statusTarget: 'CANCELLED',
      label: 'Cancelled',
      value: String(stats.cancelled),
      icon: X,
      surfaceBg: '#FFF7ED',
      iconBg: '#EA580C',
      numColor: '#C2410C',
      labelColor: '#EA580C',
      borderColor: '#FED7AA',
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((c) => {
        const IconComponent = c.icon;
        const isSelected = activeStatus === c.statusTarget && c.key !== 'TOTAL_EXPENSES';

        return (
          <div
            key={c.key}
            style={{
              ...styles.card,
              backgroundColor: c.surfaceBg,
              borderColor: isSelected ? c.iconBg : c.borderColor,
              borderWidth: isSelected ? '2px' : '1px',
              cursor: onSelectStatus ? 'pointer' : 'default',
            }}
            onClick={() => onSelectStatus && onSelectStatus(c.statusTarget)}
            role={onSelectStatus ? 'button' : undefined}
            tabIndex={onSelectStatus ? 0 : undefined}
          >
            <div style={{ ...styles.iconCircle, backgroundColor: c.iconBg }}>
              <IconComponent size={18} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={styles.info}>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '14px',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderStyle: 'solid',
    transition: 'all 0.15s ease',
  },
  iconCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  value: {
    fontSize: '20px',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
  },
};
