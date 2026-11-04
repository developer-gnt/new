import type React from 'react';
import { X, BookOpen, Landmark, Calendar } from 'lucide-react';
import type { AccountItem } from '../types/accounting.types';
import { formatINR, ACCOUNT_TYPE_LABELS } from '../types/accounting.types';

interface AccountDetailModalProps {
  visible: boolean;
  onClose: () => void;
  account: AccountItem | null;
  onViewLedger: (account: AccountItem) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  visible,
  onClose,
  account,
  onViewLedger,
}) => {
  if (!visible || !account) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={20} color="#FAD465" />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FAD465' }}>
                Account Information
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#93C5FD' }}>
                Chart of Accounts Ledger Master
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Account Code & Name</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#011F39', marginTop: '2px' }}>
              [{account.account_code || '—'}] {account.account_name}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: '#F9FAFB',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            <div>
              <span style={{ color: '#6B7280', fontSize: '11.5px' }}>Classification</span>
              <div style={{ fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                {ACCOUNT_TYPE_LABELS[account.account_type]}
              </div>
            </div>

            <div>
              <span style={{ color: '#6B7280', fontSize: '11.5px' }}>Status</span>
              <div
                style={{
                  fontWeight: 600,
                  color: account.is_active ? '#059669' : '#DC2626',
                  marginTop: '2px',
                }}
              >
                {account.is_active ? 'Active' : 'Disabled'}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#6B7280', fontSize: '11.5px' }}>Current Account Balance</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#011F39', marginTop: '2px' }}>
                {formatINR(account.balance || 0)}
              </div>
            </div>
          </div>

          {account.description && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Description</span>
              <div style={{ fontSize: '13px', color: '#374151', marginTop: '4px', lineHeight: '1.4' }}>
                {account.description}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '20px' }}>
            <Calendar size={13} />
            <span>Created on: {account.created_at.slice(0, 10)}</span>
          </div>

          {/* Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewLedger(account);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#011F39',
                color: '#FAD465',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={15} color="#FAD465" />
              <span>View Account Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
