import type React from 'react';
import type { ReceiptStatsSummary } from '../types/receipts.types';

interface ReceiptStatusTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  stats: ReceiptStatsSummary;
}

export const ReceiptStatusTabs: React.FC<ReceiptStatusTabsProps> = ({
  activeTab,
  onSelectTab,
  stats,
}) => {
  const tabs = [
    { id: 'ALL', label: 'All Revenue Streams', count: stats.all },
    { id: 'NGO_DONATION', label: 'NGO Donations', count: stats.ngoDonations },
    { id: 'CAUSE_DONATION', label: 'Cause Drives', count: stats.causeDonations },
    { id: 'MEMBERSHIP_PAYMENT', label: 'Membership Fees', count: stats.membership },
    { id: 'RENEWAL_PAYMENT', label: 'Renewals', count: stats.renewals },
  ];

  return (
    <div className="flex items-center border-b border-[#DBE5EE] px-4 overflow-x-auto scrollbar-none bg-[#FAF7F0]/40">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
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
