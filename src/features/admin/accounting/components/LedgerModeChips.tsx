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
    { id: 'CREDIT', label: '📥 Income (Inflows)', count: counts.CREDIT },
    { id: 'EXPENSE', label: '📤 Expenses (Outflows)', count: counts.EXPENSE },
    { id: 'ANALYTICS', label: '📊 Stream Breakdown' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
        View Mode:
      </span>

      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelectMode(mode.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>{mode.label}</span>
            {mode.count !== undefined && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${
                  isActive
                    ? 'bg-[#FAD465] text-[#011F39]'
                    : 'bg-slate-100 text-slate-600'
                }`}
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
