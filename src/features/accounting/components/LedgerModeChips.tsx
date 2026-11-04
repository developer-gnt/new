import type React from 'react';
import type { MainAccountingMode } from '../types/accounting.types';

interface LedgerModeChipsProps {
  activeMode: MainAccountingMode;
  onSelectMode: (mode: MainAccountingMode) => void;
  counts: {
    PASSBOOK: number;
    CREDIT: number;
    EXPENSE: number;
  };
}

export const LedgerModeChips: React.FC<LedgerModeChipsProps> = ({
  activeMode,
  onSelectMode,
  counts,
}) => {
  const modes: Array<{ id: MainAccountingMode; label: string; count?: number }> = [
    { id: 'PASSBOOK', label: '📖 All Transactions (Passbook)', count: counts.PASSBOOK },
    { id: 'CREDIT', label: '📥 Inward Credits Only', count: counts.CREDIT },
    { id: 'EXPENSE', label: '📤 Outward Debits Only', count: counts.EXPENSE },
    { id: 'ANALYTICS', label: '📊 Stream Breakdown' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        marginBottom: '18px',
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
        View Mode:
      </span>

      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelectMode(mode.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? '#011F39' : '#F9FAFB',
              color: isActive ? '#FFFFFF' : '#374151',
              border: isActive ? '1px solid #011F39' : '1px solid #E5E7EB',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{mode.label}</span>
            {mode.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB',
                  color: isActive ? '#FFFFFF' : '#4B5563',
                }}
              >
                {mode.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
