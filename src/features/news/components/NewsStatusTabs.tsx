import type React from 'react';
import type { NewsStatusFilter, NewsFilterTab } from '../types/news.types';

interface NewsStatusTabsProps {
  tabs: NewsFilterTab[];
  activeTab: NewsStatusFilter;
  onTabChange: (tab: NewsStatusFilter) => void;
}

export const NewsStatusTabs: React.FC<NewsStatusTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div style={styles.tabsContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              ...styles.tabButton,
              backgroundColor: isActive ? '#011F39' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#34516D',
              borderColor: isActive ? '#011F39' : '#DCE4EC',
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
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
    marginBottom: '20px',
  },
  tabButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 700,
  },
};

