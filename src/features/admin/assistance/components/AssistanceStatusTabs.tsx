import type React from 'react';
import type { AssistanceTabKey, AssistanceSummaryStats } from '../types/assistance.types';

interface AssistanceStatusTabsProps {
  selectedTab: AssistanceTabKey;
  onSelectTab: (tab: AssistanceTabKey) => void;
  stats: AssistanceSummaryStats;
}

export const AssistanceStatusTabs: React.FC<AssistanceStatusTabsProps> = ({
  selectedTab,
  onSelectTab,
  stats,
}) => {
  const tabs: { key: AssistanceTabKey; label: string; count: number }[] = [
    { key: 'ALL', label: 'All Approved Causes', count: stats.total || 0 },
    { key: 'ACTIVE', label: 'Active Fundraising', count: stats.active || 0 },
    { key: 'URGENT', label: 'Urgent Relief', count: stats.urgent || 0 },
    { key: 'COMPLETED', label: 'Fully Funded / Disbursed', count: stats.completed || 0 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '16px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#011F39' : '#6B7280',
              borderBottom: isActive ? '3px solid #011F39' : '3px solid transparent',
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
                padding: '2px 7px',
                borderRadius: '9999px',
                backgroundColor: isActive ? '#011F39' : '#F3F4F6',
                color: isActive ? '#FFFFFF' : '#4B5563',
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

