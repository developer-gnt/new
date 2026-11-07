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
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-none">
      {methods.map((m) => {
        const isSelected = activeMethod === m.key;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onSelectMethod(m.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              isSelected
                ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};
