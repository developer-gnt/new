import React from 'react';
import type { ApplicationStatsData, ApplicationStatus } from '../types/applications.types';
import { FileText, Clock3, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicationsStatsCardsProps {
  stats: ApplicationStatsData;
  selectedStatus: 'all' | ApplicationStatus;
  onSelectStatus: (status: 'all' | ApplicationStatus) => void;
}

export const ApplicationsStatsCards: React.FC<ApplicationsStatsCardsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'all' as const,
      title: 'Total Applications',
      count: stats.total,
      subtitle: 'All incoming membership and aid requests',
      icon: FileText,
      color: '#011F39',
      bgLight: '#EDF2F7',
      borderActive: '#011F39',
    },
    {
      key: 'under_review' as const,
      title: 'Under Review',
      count: stats.underReview,
      subtitle: 'Awaiting administrator verification',
      icon: Clock3,
      color: '#D97706',
      bgLight: '#FFFBEB',
      borderActive: '#D97706',
    },
    {
      key: 'approved' as const,
      title: 'Approved',
      count: stats.approved,
      subtitle: 'Credentials verified and approved',
      icon: CheckCircle2,
      color: '#059669',
      bgLight: '#ECFDF5',
      borderActive: '#059669',
    },
    {
      key: 'rejected' as const,
      title: 'Rejected',
      count: stats.rejected,
      subtitle: 'Applications declined or incomplete',
      icon: AlertCircle,
      color: '#DC2626',
      bgLight: '#FEF2F2',
      borderActive: '#DC2626',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {cards.map(card => {
        const isSelected = selectedStatus === card.key;
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            onClick={() => onSelectStatus(isSelected && card.key !== 'all' ? 'all' : card.key)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '18px 20px',
              border: isSelected ? `2px solid ${card.borderActive}` : '1px solid #EDF2F7',
              boxShadow: isSelected
                ? '0 6px 16px rgba(1, 31, 57, 0.08)'
                : '0 1px 3px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#718096',
                  marginBottom: '6px',
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#011F39',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}
              >
                {card.count.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#718096' }}>{card.subtitle}</div>
            </div>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: card.bgLight,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

