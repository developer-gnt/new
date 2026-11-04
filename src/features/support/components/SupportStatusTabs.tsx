import type React from 'react';
import { TICKET_TABS, type TicketTabKey } from '../types/support.types';

interface SupportStatusTabsProps {
  activeTab: TicketTabKey;
  onSelectTab: (tab: TicketTabKey) => void;
  counts: Record<TicketTabKey, number>;
}

export const SupportStatusTabs: React.FC<SupportStatusTabsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  return (
    <div style={styles.container}>
      {TICKET_TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            style={{
              ...styles.tabButton,
              backgroundColor: isActive ? '#011F39' : 'transparent',
              color: isActive ? '#FFFFFF' : '#34516D',
              borderColor: isActive ? '#011F39' : '#DCE4EC',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: isActive ? '#FAD465' : '#EDF2F7',
                color: isActive ? '#011F39' : '#34516D',
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
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
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: '10px',
    lineHeight: 1.2,
  },
};

