import type React from 'react';
import { FileText, Heart, TrendingUp, UserCheck } from 'lucide-react';
import { formatINR, type ReceiptStatsSummary } from '../types/receipts.types';

interface ReceiptStatsCardsProps {
  stats: ReceiptStatsSummary;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ReceiptStatsCards: React.FC<ReceiptStatsCardsProps> = ({
  stats,
  activeCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Income',
      count: stats.all,
      amount: stats.allAmount,
      icon: FileText,
      iconColor: '#1D4ED8',
      iconBg: '#EFF6FF',
      iconBorder: '#BFDBFE',
      cardBg: '#FFFFFF',
      accentColor: '#1D4ED8',
      subtitle: 'All inward receipt vouchers',
    },
    {
      id: 'NGO_DONATION',
      title: 'NGO Donations',
      count: stats.ngoDonations,
      amount: stats.ngoAmount,
      icon: Heart,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FDE68A',
      cardBg: '#FFFFFF',
      accentColor: '#D97706',
      subtitle: 'General support & legal aid',
    },
    {
      id: 'CAUSE_DONATION',
      title: 'Cause Donations',
      count: stats.causeDonations,
      amount: stats.causeAmount,
      icon: TrendingUp,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      iconBorder: '#FECACA',
      cardBg: '#FFFFFF',
      accentColor: '#DC2626',
      subtitle: 'Emergency & relief drives',
    },
    {
      id: 'MEMBERSHIP',
      title: 'Membership & Renewals',
      count: stats.membershipAndRenewals,
      amount: stats.membershipAndRenewalsAmount,
      icon: UserCheck,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      iconBorder: '#DDD6FE',
      cardBg: '#FFFFFF',
      accentColor: '#7C3AED',
      subtitle: 'New enrollments & extensions',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeCategory === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectCategory(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectCategory(card.id);
              }
            }}
            style={{
              backgroundColor: card.cardBg,
              borderRadius: '12px',
              border: isSelected ? `2px solid ${card.accentColor}` : '1px solid #E5E7EB',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              boxShadow: isSelected
                ? '0 4px 12px rgba(1, 31, 57, 0.08)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {card.title}
                </span>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#011F39',
                    marginTop: '4px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatINR(card.amount)}
                </div>
              </div>

              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={card.iconColor} />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid #F3F4F6',
              }}
            >
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{card.subtitle}</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: isSelected ? card.accentColor : '#F3F4F6',
                  color: isSelected ? '#FFFFFF' : '#374151',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {card.count} {card.count === 1 ? 'voucher' : 'vouchers'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
