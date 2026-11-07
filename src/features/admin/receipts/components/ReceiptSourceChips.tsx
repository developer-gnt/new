import type React from 'react';

interface ReceiptSourceChipsProps {
  activeSource: string;
  onSelectSource: (source: string) => void;
  sourceCounts: {
    ALL: number;
    WEBSITE: number;
    WEB_APP: number;
    APPLICATION: number;
  };
}

export const ReceiptSourceChips: React.FC<ReceiptSourceChipsProps> = ({
  activeSource,
  onSelectSource,
  sourceCounts,
}) => {
  const chips = [
    { id: 'ALL', label: 'All Channels', count: sourceCounts.ALL },
    { id: 'WEBSITE', label: 'Website Portal', count: sourceCounts.WEBSITE },
    { id: 'WEB_APP', label: 'Web Application', count: sourceCounts.WEB_APP },
    { id: 'APPLICATION', label: 'Mobile Application', count: sourceCounts.APPLICATION },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-4 py-2.5 bg-[#FAF7F0]/30 border-b border-[#EDF2F7]">
      <span className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.12em] mr-1 shrink-0">
        Channel:
      </span>
      {chips.map((chip) => {
        const isActive = activeSource === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectSource(chip.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              isActive
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'bg-white hover:bg-[#EDF2F7] text-[#34516D] border border-[#DBE5EE]'
            }`}
          >
            <span>{chip.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                isActive
                  ? 'bg-white/20 text-[#FAD465]'
                  : 'bg-[#EDF2F7] text-[#718096]'
              }`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
