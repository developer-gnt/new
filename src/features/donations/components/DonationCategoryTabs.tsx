import React from 'react';
import type { DonationCategory } from '../types/donations.types';

interface DonationCategoryTabsProps {
  activeTab: DonationCategory;
  onTabChange: (tab: DonationCategory) => void;
  counts: { all: number; oneTime: number; recurring: number; offline: number };
}

export const DonationCategoryTabs: React.FC<DonationCategoryTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { key: DonationCategory; label: string; count: number }[] = [
    { key: 'ALL', label: 'All Donations', count: counts.all },
    { key: 'ONE_TIME', label: 'One-time', count: counts.oneTime },
    { key: 'RECURRING', label: 'Recurring', count: counts.recurring },
    { key: 'OFFLINE', label: 'Offline', count: counts.offline },
  ];

  return (
    <div className="flex border-b border-slate-200 overflow-x-auto">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? 'border-[#011F39] text-[#011F39]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-[#011F39] text-[#FAD465]'
                  : 'bg-slate-100 text-slate-600'
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
