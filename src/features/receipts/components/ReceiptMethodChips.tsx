import type React from 'react';

interface ReceiptMethodChipsProps {
  activeMethod: string;
  onSelectMethod: (method: string) => void;
  methodCounts: {
    ALL: number;
    UPI: number;
    BANK: number;
    CASH: number;
    CHEQUE: number;
    CARD: number;
  };
}

export const ReceiptMethodChips: React.FC<ReceiptMethodChipsProps> = ({
  activeMethod,
  onSelectMethod,
  methodCounts,
}) => {
  const chips = [
    { id: 'ALL', label: 'All Methods', count: methodCounts.ALL },
    { id: 'UPI', label: 'UPI / Cashfree', count: methodCounts.UPI },
    { id: 'BANK', label: 'Bank Transfer', count: methodCounts.BANK },
    { id: 'CASH', label: 'Cash in Hand', count: methodCounts.CASH },
    { id: 'CHEQUE', label: 'Cheque / DD', count: methodCounts.CHEQUE },
    { id: 'CARD', label: 'Card', count: methodCounts.CARD },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        marginBottom: '16px',
        padding: '2px 0',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        Payment:
      </span>
      {chips.map((chip) => {
        const isActive = activeMethod === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectMethod(chip.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? '#011F39' : '#FFFFFF',
              color: isActive ? '#FAD465' : '#4B5563',
              border: isActive ? '1px solid #011F39' : '1px solid #D1D5DB',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{chip.label}</span>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '1px 5px',
                borderRadius: '6px',
                backgroundColor: isActive ? 'rgba(250, 212, 101, 0.2)' : '#F3F4F6',
                color: isActive ? '#FAD465' : '#6B7280',
              }}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
