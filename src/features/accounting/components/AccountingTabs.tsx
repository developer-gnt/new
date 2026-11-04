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
    description: string;
  }> = [
    {
      id: 'passbook',
      label: 'General Ledger / Passbook',
      icon: BookOpen,
      count: txCount,
      description: 'Running transaction history & balances',
    },
    {
      id: 'accounts',
      label: 'Chart of Accounts',
      icon: Network,
      count: accountCount,
      description: 'Hierarchical 5-tier account registry',
    },
    {
      id: 'journals',
      label: 'Journal Vouchers',
      icon: FileCheck,
      count: journalCount,
      description: 'Balanced double-entry postings',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '2px solid #E5E7EB',
        marginBottom: '24px',
        paddingBottom: '0',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: isActive ? '3px solid #011F39' : '3px solid transparent',
              color: isActive ? '#011F39' : '#6B7280',
              fontWeight: isActive ? 700 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              marginBottom: '-2px',
            }}
          >
            <Icon size={18} color={isActive ? '#011F39' : '#6B7280'} />
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '10px',
                backgroundColor: isActive ? '#011F39' : '#F3F4F6',
                color: isActive ? '#FAD465' : '#4B5563',
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
