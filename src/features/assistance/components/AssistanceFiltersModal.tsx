import type React from 'react';
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import type { AssistanceStatus, UrgencyLevel, AssistanceFilterState } from '../types/assistance.types';
import { CAUSE_OPTIONS } from '../data/assistanceFixtures';

interface AssistanceFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  filterState: AssistanceFilterState;
  onApply: (state: AssistanceFilterState) => void;
  onReset: () => void;
}

export const AssistanceFiltersModal: React.FC<AssistanceFiltersModalProps> = ({
  visible,
  onClose,
  filterState,
  onApply,
  onReset,
}) => {
  const [category, setCategory] = useState(filterState.category || 'ALL');
  const [urgency, setUrgency] = useState(filterState.urgency || 'ALL');
  const [status, setStatus] = useState<string>(filterState.status || 'ALL');
  const [minAmount, setMinAmount] = useState<string>(
    filterState.minAmount !== undefined ? String(filterState.minAmount) : ''
  );
  const [maxAmount, setMaxAmount] = useState<string>(
    filterState.maxAmount !== undefined ? String(filterState.maxAmount) : ''
  );

  if (!visible) return null;

  const handleApply = () => {
    onApply({
      category: category !== 'ALL' ? category : undefined,
      urgency: urgency !== 'ALL' ? (urgency as UrgencyLevel) : undefined,
      status: status !== 'ALL' ? (status as AssistanceStatus) : undefined,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setCategory('ALL');
    setUrgency('ALL');
    setStatus('ALL');
    setMinAmount('');
    setMaxAmount('');
    onReset();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '480px',
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
            backgroundColor: '#FAF7F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#011F39',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter size={16} color="#FAD465" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                Filter Aid Requests
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                Refine by cause, urgency, status & financial tier
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
              color: '#6B7280',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Cause Category */}
          <div>
            <label style={labelStyle}>Aid Cause / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="ALL">All Causes</option>
              {CAUSE_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label style={labelStyle}>Urgency Priority</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { key: 'ALL', label: 'All Urgencies' },
                { key: 'CRITICAL', label: 'Critical Emergency' },
                { key: 'HIGH', label: 'High Priority' },
                { key: 'MEDIUM', label: 'Medium' },
                { key: 'NORMAL', label: 'Normal' },
              ].map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => setUrgency(u.key)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: urgency === u.key ? 600 : 500,
                    border: urgency === u.key ? '2px solid #011F39' : '1px solid #D1D5DB',
                    backgroundColor: urgency === u.key ? '#F0F4F8' : '#FFFFFF',
                    color: urgency === u.key ? '#011F39' : '#4B5563',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lifecycle Status */}
          <div>
            <label style={labelStyle}>Lifecycle Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="ALL">All Statuses</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved Causes</option>
              <option value="REJECTED">Rejected / Declined</option>
              <option value="CLOSED">Closed / Disbursed</option>
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <label style={labelStyle}>Requested Amount Range (₹)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="number"
                placeholder="Min ₹ (e.g. 10000)"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max ₹ (e.g. 100000)"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
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
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6B7280',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              style={{
                padding: '8px 20px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#011F39',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Apply Filters
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  outline: 'none',
  boxSizing: 'border-box',
};

