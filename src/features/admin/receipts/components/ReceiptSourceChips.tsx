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
    { id: 'ALL', label: 'All Sources', count: sourceCounts.ALL },
    { id: 'WEBSITE', label: '🌐 Website', count: sourceCounts.WEBSITE },
    { id: 'WEB_APP', label: '💻 Web App', count: sourceCounts.WEB_APP },
    { id: 'APPLICATION', label: '📱 Application', count: sourceCounts.APPLICATION },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        marginBottom: '12px',
        padding: '2px 0',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        Channel:
      </span>
      {chips.map((chip) => {
        const isActive = activeSource === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectSource(chip.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? '#011F39' : '#F9FAFB',
              color: isActive ? '#FFFFFF' : '#374151',
              border: isActive ? '1px solid #011F39' : '1px solid #E5E7EB',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{chip.label}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '1px 5px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB',
                color: isActive ? '#FFFFFF' : '#4B5563',
              }}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
