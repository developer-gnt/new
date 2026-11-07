import type React from 'react';
import { TrendingUp, Heart, FileText, UserCheck } from 'lucide-react';
import { formatINR, type ReceiptStatsSummary } from '../types/receipts.types';

interface ReceiptStatsCardsProps {
  stats: ReceiptStatsSummary;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ReceiptStatsCards: React.FC<ReceiptStatsCardsProps> = ({
  stats,
  activeCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Inward Revenue',
      count: stats.all,
      amount: stats.allAmount,
      icon: TrendingUp,
      iconColor: 'text-[#C9971A]',
      iconBg: 'bg-[#FAF7F0] border border-[#DCE4EC]',
      subtitle: 'All receipt vouchers',
    },
    {
      id: 'NGO_DONATION',
      title: 'General & NGO Donations',
      count: stats.ngoDonations,
      amount: stats.ngoAmount,
      icon: Heart,
      iconColor: 'text-[#06294D]',
      iconBg: 'bg-[#EDF2F7] border border-[#DBE5EE]',
      subtitle: 'General mission & legal aid',
    },
    {
      id: 'CAUSE_DONATION',
      title: 'Cause & Emergency Drives',
      count: stats.causeDonations,
      amount: stats.causeAmount,
      icon: FileText,
      iconColor: 'text-[#06294D]',
      iconBg: 'bg-[#EDF2F7] border border-[#DBE5EE]',
      subtitle: 'Targeted humanitarian relief',
    },
    {
      id: 'MEMBERSHIP',
      title: 'Membership & Renewals',
      count: stats.membershipAndRenewals,
      amount: stats.membershipAndRenewalsAmount,
      icon: UserCheck,
      iconColor: 'text-[#C9971A]',
      iconBg: 'bg-[#FAF7F0] border border-[#DCE4EC]',
      subtitle: 'New enrollments & extensions',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeCategory === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCategory(card.id)}
            className={`text-left bg-white rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'border-[#E9B82E] ring-1 ring-[#FAD465]/60 bg-[#FAF7F0]/30 shadow-xs'
                : 'border-[#DCE4EC] shadow-xs hover:border-[#FAD465] hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl lg:text-3xl text-[#0B2F52] tracking-tight leading-tight mb-2 truncate">
              {formatINR(card.amount)}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EDF2F7] text-[11px] text-[#718096]">
              <span className="truncate">{card.subtitle}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                  isSelected
                    ? 'bg-[#06294D] text-[#FAD465]'
                    : 'bg-[#EDF2F7] text-[#06294D]'
                }`}
              >
                {card.count} {card.count === 1 ? 'slip' : 'slips'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
