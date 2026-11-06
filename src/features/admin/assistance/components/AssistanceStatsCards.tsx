import type React from 'react';
import { HeartHandshake, Clock, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';
import type { AssistanceSummaryStats, AssistanceTabKey } from '../types/assistance.types';

interface AssistanceStatsCardsProps {
  stats: AssistanceSummaryStats;
  selectedTab: AssistanceTabKey;
  onSelectTab: (tab: AssistanceTabKey) => void;
}

export const AssistanceStatsCards: React.FC<AssistanceStatsCardsProps> = ({
  stats,
  selectedTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: 'ALL' as AssistanceTabKey,
      title: 'Approved Causes',
      count: stats.total || 0,
      description: 'Verified causes open for aid',
      icon: HeartHandshake,
      color: '#011F39',
      bgColor: '#F0F4F8',
      borderColor: '#D0DBE5',
      isActive: selectedTab === 'ALL',
      isCurrency: false,
    },
    {
      id: 'ACTIVE' as AssistanceTabKey,
      title: 'Active Fundraising',
      count: stats.active || 0,
      description: 'Ongoing citizen aid campaigns',
      icon: Clock,
      color: '#1D4ED8',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      isActive: selectedTab === 'ACTIVE',
      isCurrency: false,
    },
    {
      id: 'URGENT' as AssistanceTabKey,
      title: 'Urgent Relief',
      count: stats.urgent || 0,
      description: 'Critical & emergency aid causes',
      icon: AlertCircle,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      isActive: selectedTab === 'URGENT',
      isCurrency: false,
    },
    {
      id: 'COMPLETED' as AssistanceTabKey,
      title: 'Fully Funded / Disbursed',
      count: stats.completed || 0,
      description: 'Completed humanitarian grants',
      icon: CheckCircle2,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      isActive: selectedTab === 'COMPLETED',
      isCurrency: false,
    },
    {
      id: 'ALL' as AssistanceTabKey,
      title: 'Aid Raised / Disbursed',
      count: stats.totalAmount || 0,
      description: 'Cumulative humanitarian support',
      icon: IndianRupee,
      color: '#B45309',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      isActive: false,
      isCurrency: true,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '20px',
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={`${card.title}-${idx}`}
            onClick={() => {
              if (!card.isCurrency) {
                onSelectTab(card.id);
              }
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px 18px',
              border: card.isActive
                ? `2px solid ${card.color}`
                : '1px solid #E5E7EB',
              boxShadow: card.isActive
                ? '0 6px 16px rgba(1, 31, 57, 0.08)'
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
              cursor: card.isCurrency ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#4B5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {card.title}
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  backgroundColor: card.bgColor,
                  border: `1px solid ${card.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={card.color} strokeWidth={2.2} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: card.isCurrency ? '22px' : '26px',
                  fontWeight: 700,
                  color: '#011F39',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}
              >
                {card.isCurrency
                  ? `₹${card.count.toLocaleString('en-IN')}`
                  : card.count.toLocaleString('en-IN')}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#6B7280',
                  lineHeight: 1.3,
                }}
              >
                {card.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

