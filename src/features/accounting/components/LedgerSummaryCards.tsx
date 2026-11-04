import type React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';
import { formatINR, type LedgerSummary } from '../types/accounting.types';

interface LedgerSummaryCardsProps {
  summary: LedgerSummary;
}

export const LedgerSummaryCards: React.FC<LedgerSummaryCardsProps> = ({ summary }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {/* 1. Opening Balance */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={titleStyle}>Opening Balance</span>
            <div style={amountStyle}>{formatINR(summary.opening_balance)}</div>
          </div>
          <div style={{ ...iconBoxStyle, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <Wallet size={20} color="#1D4ED8" />
          </div>
        </div>
        <div style={subStyle}>Carried forward start balance</div>
      </div>

      {/* 2. Total Inflow / Credits */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={titleStyle}>Total Inflow (Credits)</span>
            <div style={{ ...amountStyle, color: '#059669' }}>
              + {formatINR(summary.total_debit)}
            </div>
          </div>
          <div style={{ ...iconBoxStyle, backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <ArrowDownLeft size={20} color="#059669" />
          </div>
        </div>
        <div style={subStyle}>Donations, memberships & grants</div>
      </div>

      {/* 3. Total Outflow / Debits */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={titleStyle}>Total Outflow (Debits)</span>
            <div style={{ ...amountStyle, color: '#DC2626' }}>
              - {formatINR(summary.total_credit)}
            </div>
          </div>
          <div style={{ ...iconBoxStyle, backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <ArrowUpRight size={20} color="#DC2626" />
          </div>
        </div>
        <div style={subStyle}>Operations, aid relief & legal costs</div>
      </div>

      {/* 4. Closing Net Balance */}
      <div
        style={{
          backgroundColor: '#011F39',
          borderRadius: '12px',
          border: '1px solid #06294D',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(1, 31, 57, 0.15)',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ ...titleStyle, color: '#93C5FD' }}>Closing Net Balance</span>
            <div style={{ ...amountStyle, color: '#FAD465' }}>
              {formatINR(summary.closing_balance)}
            </div>
          </div>
          <div style={{ ...iconBoxStyle, backgroundColor: 'rgba(250, 212, 101, 0.15)', border: '1px solid #FAD465' }}>
            <Scale size={20} color="#FAD465" />
          </div>
        </div>
        <div style={{ ...subStyle, color: '#DBE5EE', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Net liquid cash & bank reserve
        </div>
      </div>
    </div>
  );
};

const titleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const amountStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#011F39',
  marginTop: '4px',
  letterSpacing: '-0.02em',
};

const iconBoxStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const subStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6B7280',
  marginTop: '12px',
  paddingTop: '8px',
  borderTop: '1px solid #F3F4F6',
};
