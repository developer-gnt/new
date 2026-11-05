import type React from 'react';
import { useState } from 'react';
import { X, Check } from 'lucide-react';

export interface ReceiptFiltersState {
  category: string;
  source: string;
  method: string;
  status: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

interface ReceiptFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ReceiptFiltersState;
  onApply: (filters: ReceiptFiltersState) => void;
  onReset: () => void;
}

export const ReceiptFilterModal: React.FC<ReceiptFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<ReceiptFiltersState>(filters);

  if (!visible) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultState: ReceiptFiltersState = {
      category: 'ALL',
      source: 'ALL',
      method: 'ALL',
      status: 'ALL',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    };
    setLocalFilters(defaultState);
    onReset();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#011F39' }}>
              Filter Receipt Vouchers
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#6B7280' }}>
              Filter by income stream, source channel, payment method and date
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Income Stream */}
          <div>
            <label style={labelStyle}>Income Stream / Stream</label>
            <select
              value={localFilters.category}
              onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
              style={selectStyle}
            >
              <option value="ALL">All Streams & Contributions</option>
              <option value="NGO_DONATION">NGO General Support Donations</option>
              <option value="CAUSE_DONATION">Specific Cause Donations</option>
              <option value="MEMBERSHIP_PAYMENT">New Membership Registration</option>
              <option value="RENEWAL_PAYMENT">Annual Membership Renewal</option>
              <option value="OTHER_INCOME">Other Incidental Income</option>
            </select>
          </div>

          {/* Origin Channel */}
          <div>
            <label style={labelStyle}>Origin Source Channel</label>
            <select
              value={localFilters.source}
              onChange={(e) => setLocalFilters({ ...localFilters, source: e.target.value })}
              style={selectStyle}
            >
              <option value="ALL">All Channels</option>
              <option value="WEBSITE">🌐 Website (Public Portal)</option>
              <option value="WEB_APP">💻 Web App (Admin Portal)</option>
              <option value="APPLICATION">📱 Application (Mobile App)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label style={labelStyle}>Payment Method</label>
            <select
              value={localFilters.method}
              onChange={(e) => setLocalFilters({ ...localFilters, method: e.target.value })}
              style={selectStyle}
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI / Cashfree / Online</option>
              <option value="BANK">Bank Transfer (IMPS/NEFT/RTGS)</option>
              <option value="CASH">Cash in Hand</option>
              <option value="CHEQUE">Cheque / Demand Draft</option>
              <option value="CARD">Debit / Credit Card</option>
            </select>
          </div>

          {/* Voucher Status */}
          <div>
            <label style={labelStyle}>Voucher Status</label>
            <select
              value={localFilters.status}
              onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              style={selectStyle}
            >
              <option value="ALL">All Statuses</option>
              <option value="POSTED">Received / Posted Only</option>
              <option value="CANCELLED">Cancelled / Voided Only</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label style={labelStyle}>Receipt Date Range</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>From:</span>
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>To:</span>
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label style={labelStyle}>Amount Range (₹)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="number"
                placeholder="Min Amount"
                value={localFilters.minAmount}
                onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value })}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={localFilters.maxAmount}
                onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6B7280',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Reset All
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#011F39',
                backgroundColor: '#FAD465',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Check size={16} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13.5px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  outline: 'none',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  boxSizing: 'border-box',
  outline: 'none',
};
