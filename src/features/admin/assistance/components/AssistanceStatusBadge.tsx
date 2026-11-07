import type React from 'react';
import type { AssistanceStatus } from '../types/assistance.types';

interface AssistanceStatusBadgeProps {
  status: AssistanceStatus;
  size?: 'sm' | 'md';
}

export const AssistanceStatusBadge: React.FC<AssistanceStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  let label = 'Under Review';
  let bg = '#FEF3C7';
  let color = '#B45309';
  let border = '#FDE68A';

  switch (status) {
    case 'APPROVED':
      label = 'Approved';
      bg = '#ECFDF5';
      color = '#059669';
      border = '#A7F3D0';
      break;
    case 'REJECTED':
      label = 'Rejected';
      bg = '#FEF2F2';
      color = '#DC2626';
      border = '#FECACA';
      break;
    case 'CLOSED':
      label = 'Closed / Disbursed';
      bg = '#F1F5F9';
      color = '#475569';
      border = '#CBD5E1';
      break;
    case 'UNDER_REVIEW':
      label = 'Under Review';
      bg = '#EFF6FF';
      color = '#1D4ED8';
      border = '#BFDBFE';
      break;
    case 'PENDING':
    default:
      label = 'Pending Review';
      bg = '#FEF3C7';
      color = '#B45309';
      border = '#FDE68A';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  );
};

