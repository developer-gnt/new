import React from 'react';
import type { UserTypeTabKey } from '../types/user.types';

interface UsersTypeTabsProps {
  activeTab: UserTypeTabKey;
  onTabChange: (tab: UserTypeTabKey) => void;
  counts: {
    all: number;
    admin: number;
    member: number;
    seeker: number;
    donor: number;
    general: number;
  };
}

export const UsersTypeTabs: React.FC<UsersTypeTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { key: UserTypeTabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All Users', count: counts.all },
    { key: 'admin', label: 'Admins', count: counts.admin },
    { key: 'member', label: 'Members', count: counts.member },
    { key: 'seeker', label: 'Donation Seekers', count: counts.seeker },
    { key: 'donor', label: 'Donors', count: counts.donor },
    { key: 'general', label: 'General Users', count: counts.general },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '16px',
        scrollbarWidth: 'thin',
      }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: isActive ? '1px solid #011F39' : '1px solid #DBE5EE',
              backgroundColor: isActive ? '#011F39' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#34516D',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '10px',
                backgroundColor: isActive ? '#FAD465' : '#EDF2F7',
                color: isActive ? '#011F39' : '#718096',
                fontWeight: 700,
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

