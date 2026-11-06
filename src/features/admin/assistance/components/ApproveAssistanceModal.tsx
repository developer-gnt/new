import type React from 'react';
import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { AssistanceRequest } from '../types/assistance.types';
import { assistanceStore } from '../store/assistanceStore';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface ApproveAssistanceModalProps {
  visible: boolean;
  onClose: () => void;
  request: AssistanceRequest | null;
  onSuccess?: () => void;
}

export const ApproveAssistanceModal: React.FC<ApproveAssistanceModalProps> = ({
  visible,
  onClose,
  request,
  onSuccess,
}) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLockBodyScroll(Boolean(visible && request));

  if (!visible || !request) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await assistanceStore.updateStatus(
        request.id,
        'APPROVED',
        remark.trim() || 'Approved for public fundraising & direct grant assistance.'
      );
      onSuccess?.();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1100,
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
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            padding: '16px 20px',
            backgroundColor: '#ECFDF5',
            borderBottom: '1px solid #A7F3D0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#059669' }}>
              Approve Assistance Request
            </h3>
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

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: '#374151', lineHeight: 1.5 }}>
            Are you sure you want to approve the aid request for <b>{request.full_name}</b> for{' '}
            <b>₹{Number(request.requested_amount || 0).toLocaleString('en-IN')}</b>?
            This will verify the cause and open it for organizational grant allocation and community donations.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '5px',
              }}
            >
              Approval Remark / Disbursement Instructions (Optional)
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. Verified by hospital coordination desk..."
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#4B5563',
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
              onClick={handleApprove}
              disabled={isSubmitting}
              style={{
                padding: '8px 20px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#059669',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

