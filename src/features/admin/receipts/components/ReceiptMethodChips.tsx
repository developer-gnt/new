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
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-4 py-2.5 bg-[#FAF7F0]/30 border-b border-[#EDF2F7]">
      <span className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.12em] mr-1 shrink-0">
        Method:
      </span>
      {chips.map((chip) => {
        const isActive = activeMethod === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectMethod(chip.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              isActive
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'bg-white hover:bg-[#EDF2F7] text-[#34516D] border border-[#DBE5EE]'
            }`}
          >
            <span>{chip.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                isActive
                  ? 'bg-white/20 text-[#FAD465]'
                  : 'bg-[#EDF2F7] text-[#718096]'
              }`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
