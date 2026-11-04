import type React from 'react';
import type { RightsFilterTab, RightsStatusFilter } from '../types/rights.types';

interface RightsStatusTabsProps {
  tabs: RightsFilterTab[];
  activeStatus: RightsStatusFilter;
  onSelectTab: (status: RightsStatusFilter) => void;
}

export const RightsStatusTabs: React.FC<RightsStatusTabsProps> = ({
  tabs,
  activeStatus,
  onSelectTab,
}) => {
  return (
    <div style={styles.tabsContainer}>
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            style={{
              ...styles.tabButton,
              backgroundColor: isActive ? '#06294D' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#475569',
              borderColor: isActive ? '#06294D' : '#CBD5E1',
              boxShadow: isActive ? '0 2px 6px rgba(6, 41, 77, 0.15)' : 'none',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: isActive ? '#FAD465' : '#F1F5F9',
                color: isActive ? '#011F39' : '#475569',
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

const styles: Record<string, React.CSSProperties> = {
  tabsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  tabButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
};
