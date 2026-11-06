import type React from 'react';
import { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import type { AssistanceRequest } from '../types/assistance.types';
import { assistanceStore } from '../store/assistanceStore';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface RejectAssistanceModalProps {
  visible: boolean;
  onClose: () => void;
  request: AssistanceRequest | null;
  onSuccess?: () => void;
}

export const RejectAssistanceModal: React.FC<RejectAssistanceModalProps> = ({
  visible,
  onClose,
  request,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLockBodyScroll(Boolean(visible && request));

  if (!visible || !request) return null;

  const handleReject = async () => {
    if (!reason.trim()) {
      setErrorMsg('Please state a reason for declining this request.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await assistanceStore.updateStatus(request.id, 'REJECTED', reason.trim());
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
            backgroundColor: '#FEF2F2',
            borderBottom: '1px solid #FECACA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={20} color="#DC2626" />
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#DC2626' }}>
              Decline Assistance Request
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
            Are you sure you want to decline the request for <b>{request.full_name}</b>?
            The applicant will be informed with the reason provided below.
          </p>

          {errorMsg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontSize: '12.5px',
                marginBottom: '12px',
              }}
            >
              {errorMsg}
            </div>
          )}

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
              Reason for Declining / Ineligibility *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Existing government grant coverage, incomplete medical proof, or invalid documents..."
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
              onClick={handleReject}
              disabled={isSubmitting}
              style={{
                padding: '8px 20px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#DC2626',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Declining...' : 'Confirm Decline'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

