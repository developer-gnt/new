import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export type ConfirmationType = 'approve' | 'reject';

interface ApplicationStatusConfirmationModalProps {
  isOpen: boolean;
  type: ConfirmationType | null;
  applicantName?: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export const ApplicationStatusConfirmationModal: React.FC<ApplicationStatusConfirmationModalProps> = ({
  isOpen,
  type,
  applicantName,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('Incomplete documents');

  if (!isOpen || !type) return null;

  const isApprove = type === 'approve';

  const handleConfirmClick = () => {
    onConfirm(isApprove ? undefined : reason);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        padding: '16px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #EDF2F7',
          padding: '28px 24px 24px',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#718096',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isApprove ? '#ECFDF5' : '#FEF2F2',
              color: isApprove ? '#059669' : '#DC2626',
            }}
          >
            {isApprove ? <Check size={32} /> : <X size={32} />}
          </div>

          <h3
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 8px',
            }}
          >
            {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: '#34516D',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {isApprove
              ? `After approving the status you cannot change the status. Are you sure you want to approve this application${applicantName ? ` for ${applicantName}` : ''}?`
              : `After rejecting the status you cannot change the status. Are you sure you want to reject this application${applicantName ? ` for ${applicantName}` : ''}?`}
          </p>
        </div>

        {!isApprove && (
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#011F39',
                marginBottom: '6px',
              }}
            >
              Rejection Reason <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason for rejection"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #DBE5EE',
                outline: 'none',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#34516D',
              backgroundColor: '#EDF2F7',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={!isApprove && !reason.trim()}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: isApprove ? '#059669' : '#DC2626',
              border: 'none',
              borderRadius: '8px',
              cursor: !isApprove && !reason.trim() ? 'not-allowed' : 'pointer',
              opacity: !isApprove && !reason.trim() ? 0.6 : 1,
            }}
          >
            {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

