import React from 'react';
import type { ApplicationStatus } from '../types/applications.types';

export type StatusTabKey = 'all' | ApplicationStatus;

interface ApplicationsStatusTabsProps {
  activeTab: StatusTabKey;
  onSelectTab: (tab: StatusTabKey) => void;
  counts: {
    all: number;
    under_review: number;
    approved: number;
    rejected: number;
  };
}

export const ApplicationsStatusTabs: React.FC<ApplicationsStatusTabsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const tabs: { key: StatusTabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All Applications', count: counts.all },
    { key: 'under_review', label: 'Under Review', count: counts.under_review },
    { key: 'approved', label: 'Approved', count: counts.approved },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
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
            onClick={() => onSelectTab(tab.key)}
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

