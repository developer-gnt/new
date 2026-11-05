import type React from 'react';
import type { MemberFilterTab, MemberStats } from '../types/members.types';

interface MemberStatusTabsProps {
  selectedTab: MemberFilterTab;
  onSelectTab: (tab: MemberFilterTab) => void;
  stats: MemberStats;
}

export const MemberStatusTabs: React.FC<MemberStatusTabsProps> = ({
  selectedTab,
  onSelectTab,
  stats,
}) => {
  const tabs: { key: MemberFilterTab; label: string; count: number }[] = [
    { key: 'ALL', label: 'All Members', count: stats.total },
    { key: 'ACTIVE', label: 'Active', count: stats.active },
    { key: 'EXPIRING_SOON', label: 'Expiring Soon', count: stats.expiringSoon },
    { key: 'INACTIVE', label: 'Inactive', count: stats.inactive },
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

