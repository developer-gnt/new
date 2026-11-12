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
    { key: 'POSTED', label: 'Audited & Posted', count: counts.posted },
    { key: 'CANCELLED', label: 'Voided / Cancelled', count: counts.cancelled },
  ];

  return (
    <div className="flex items-center border-b border-[#DBE5EE] px-4 overflow-x-auto scrollbar-none bg-[#FAF7F0]/40">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectStatus(tab.key)}
            className={`inline-flex items-center gap-2 py-3.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              isActive
                ? 'border-[#E9B82E] text-[#06294D] font-bold bg-white shadow-2xs'
                : 'border-transparent text-[#718096] hover:text-[#0B2F52] hover:bg-white/60'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight transition-colors ${
                isActive
                  ? 'bg-[#06294D] text-[#FAD465]'
                  : 'bg-[#EDF2F7] text-[#718096]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
