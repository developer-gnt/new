import type React from 'react';

interface ExpenseStatusTabsProps {
  activeStatus: string;
  onSelectStatus: (status: string) => void;
  counts: { all: number; posted: number; cancelled: number };
}

export const ExpenseStatusTabs: React.FC<ExpenseStatusTabsProps> = ({
  activeStatus,
  onSelectStatus,
  counts,
}) => {
  const tabs = [
    { key: 'ALL', label: 'All Vouchers', count: counts.all },
    { key: 'POSTED', label: 'Posted', count: counts.posted },
    { key: 'CANCELLED', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <div style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectStatus(tab.key)}
            style={{
              ...styles.tabBtn,
              backgroundColor: isActive ? '#06294D' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#475569',
              borderColor: isActive ? '#06294D' : '#CBD5E1',
              boxShadow: isActive ? '0 2px 6px rgba(6, 41, 77, 0.15)' : 'none',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: isActive ? '#FAD465' : '#F1F5F9',
                color: isActive ? '#011F39' : '#475569',
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 700,
  },
};
