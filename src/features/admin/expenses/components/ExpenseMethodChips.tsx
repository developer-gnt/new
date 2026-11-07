import type React from 'react';

interface ExpenseMethodChipsProps {
  activeMethod: string;
  onSelectMethod: (method: string) => void;
}

export const ExpenseMethodChips: React.FC<ExpenseMethodChipsProps> = ({
  activeMethod,
  onSelectMethod,
}) => {
  const methods = [
    { key: 'ALL', label: 'All Methods' },
    { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { key: 'CASH', label: 'Cash' },
    { key: 'UPI', label: 'UPI' },
    { key: 'CHEQUE', label: 'Cheque' },
    { key: 'CARD', label: 'Card' },
  ];

  return (
    <div style={styles.scroll}>
      {methods.map((m) => {
        const isSelected = activeMethod === m.key;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onSelectMethod(m.key)}
            style={{
              ...styles.chip,
              backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
              color: isSelected ? '#1D4ED8' : '#64748B',
              borderColor: isSelected ? '#93C5FD' : '#E2E8F0',
              fontWeight: isSelected ? 600 : 500,
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
    marginBottom: '16px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
};
