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
    { id: 'ALL', label: 'All Income', count: stats.all },
    { id: 'NGO_DONATION', label: 'NGO Donations', count: stats.ngoDonations },
    { id: 'CAUSE_DONATION', label: 'Cause Donations', count: stats.causeDonations },
    { id: 'MEMBERSHIP_PAYMENT', label: 'Membership', count: stats.membership },
    { id: 'RENEWAL_PAYMENT', label: 'Renewals', count: stats.renewals },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '16px',
        paddingBottom: '2px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '13.5px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#011F39' : '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid #011F39' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              marginBottom: '-1px',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '1px 6px',
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
