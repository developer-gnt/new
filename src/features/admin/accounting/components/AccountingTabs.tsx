import type React from 'react';
import { BookOpen, Network, FileCheck } from 'lucide-react';

export type AccountingActiveTab = 'passbook' | 'accounts' | 'journals';

interface AccountingTabsProps {
  activeTab: AccountingActiveTab;
  onSelectTab: (tab: AccountingActiveTab) => void;
  journalCount: number;
  accountCount: number;
  txCount: number;
}

export const AccountingTabs: React.FC<AccountingTabsProps> = ({
  activeTab,
  onSelectTab,
  journalCount,
  accountCount,
  txCount,
}) => {
  const tabs: Array<{
    id: AccountingActiveTab;
    label: string;
    icon: typeof BookOpen;
    count: number;
  }> = [
    {
      id: 'passbook',
      label: 'General Ledger / Passbook',
      icon: BookOpen,
      count: txCount,
    },
    {
      id: 'accounts',
      label: 'Chart of Accounts',
      icon: Network,
      count: accountCount,
    },
    {
      id: 'journals',
      label: 'Journal Vouchers',
      icon: FileCheck,
      count: journalCount,
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer -mb-px ${
              isActive
                ? 'border-[#011F39] text-[#011F39]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-[#011F39]' : 'text-slate-400'} />
            <span>{tab.label}</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
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
