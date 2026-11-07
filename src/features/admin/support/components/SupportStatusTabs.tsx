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
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
      {TICKET_TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full leading-tight ${
                isActive
                  ? 'bg-[#FAD465] text-[#011F39]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
