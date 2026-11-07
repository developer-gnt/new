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
  const cards: Array<{
    key: string;
    statusTarget: string;
    label: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconBg: string;
    iconColor: string;
    isFilterable: boolean;
  }> = [
    {
      key: 'TOTAL_EXPENSES',
      statusTarget: 'ALL',
      label: 'Total Expenses',
      value: formatINR(stats.totalAmount),
      subtitle: 'Net posted organizational spend',
      icon: CreditCard,
      iconBg: 'bg-[#FAF7F0] border border-[#DCE4EC]',
      iconColor: 'text-[#C9971A]',
      isFilterable: false,
    },
    {
      key: 'ALL',
      statusTarget: 'ALL',
      label: 'Total Vouchers',
      value: String(stats.all),
      subtitle: 'All expenditure vouchers',
      icon: FileText,
      iconBg: 'bg-[#EDF2F7] border border-[#DBE5EE]',
      iconColor: 'text-[#06294D]',
      isFilterable: true,
    },
    {
      key: 'POSTED',
      statusTarget: 'POSTED',
      label: 'Posted Records',
      value: String(stats.posted),
      subtitle: 'Audited & ledger-posted',
      icon: CheckCircle2,
      iconBg: 'bg-[#EDF2F7] border border-[#DBE5EE]',
      iconColor: 'text-[#06294D]',
      isFilterable: true,
    },
    {
      key: 'CANCELLED',
      statusTarget: 'CANCELLED',
      label: 'Cancelled',
      value: String(stats.cancelled),
      subtitle: 'Voided payment vouchers',
      icon: X,
      iconBg: 'bg-[#FAF7F0] border border-[#DCE4EC]',
      iconColor: 'text-[#718096]',
      isFilterable: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const IconComponent = c.icon;
        const isSelected = c.isFilterable && activeStatus === c.statusTarget;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => c.isFilterable && onSelectStatus && onSelectStatus(c.statusTarget)}
            className={`text-left bg-white rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'border-[#E9B82E] ring-1 ring-[#FAD465]/60 bg-[#FAF7F0]/30 shadow-xs'
                : 'border-[#DCE4EC] shadow-xs hover:border-[#FAD465] hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
                {c.label}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg} ${c.iconColor}`}
              >
                <IconComponent size={18} />
              </div>
            </div>

            <div className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl lg:text-3xl text-[#0B2F52] tracking-tight leading-tight mb-1 truncate">
              {c.value}
            </div>

            <div className="text-[11px] text-[#718096] font-medium truncate">
              {c.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
};
