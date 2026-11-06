import type React from 'react';
import { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, KeyRound, Copy, Check } from 'lucide-react';
import type { Member } from '../types/members.types';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export type ConfirmationType = 'TOGGLE_STATUS' | 'RESET_PASSWORD';

interface MemberConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  type: ConfirmationType;
  member: Member | null;
  onConfirm: (notes?: string) => Promise<any>;
}

export const MemberConfirmationModal: React.FC<MemberConfirmationModalProps> = ({
  visible,
  onClose,
  type,
  member,
  onConfirm,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultPass, setResultPass] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useLockBodyScroll(Boolean(visible && member));

  if (!visible || !member) return null;

  const isToggle = type === 'TOGGLE_STATUS';
  const isCurrentlyActive = member.status === 'ACTIVE' || member.status === 'EXPIRING_SOON';
  const actionName = isCurrentlyActive ? 'Suspend / Deactivate' : 'Reactivate';

  const handleAction = async () => {
    setIsSubmitting(true);
    try {
      const res = await onConfirm(notes);
      if (type === 'RESET_PASSWORD' && res?.tempPass) {
        setResultPass(res.tempPass);
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPass = () => {
    if (resultPass) {
      navigator.clipboard.writeText(resultPass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1150,
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
            backgroundColor: isToggle ? (isCurrentlyActive ? '#FEF2F2' : '#E8F8EE') : '#FEF7E6',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isToggle ? (
              isCurrentlyActive ? (
                <ShieldAlert size={20} color="#DC2626" />
              ) : (
                <ShieldCheck size={20} color="#00A859" />
              )
            ) : (
              <KeyRound size={20} color="#D97706" />
            )}
            <h3
              style={{
                margin: 0,
                fontSize: '15.5px',
                fontWeight: 700,
                color: isToggle ? (isCurrentlyActive ? '#DC2626' : '#00A859') : '#B45309',
              }}
            >
              {isToggle ? `${actionName} Member` : 'Reset Member Password'}
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
          {resultPass ? (
            /* Result after reset password */
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F8EE',
                  color: '#00A859',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <Check size={24} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                Password Reset Successfully!
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>
                Share this temporary password with <b>{member.name}</b>.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #F3E8D2',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#011F39',
                  }}
                >
                  {resultPass}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPass}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#011F39',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={13} color="#FAD465" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#011F39',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            /* Prompt */
            <div>
              <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: '#374151', lineHeight: 1.5 }}>
                {isToggle ? (
                  isCurrentlyActive ? (
                    <>
                      Are you sure you want to suspend member <b>{member.name}</b> ({member.membershipId})? They will lose access to member benefits until reactivated.
                    </>
                  ) : (
                    <>
                      Are you sure you want to reactivate membership for <b>{member.name}</b> ({member.membershipId})?
                    </>
                  )
                ) : (
                  <>
                    Are you sure you want to reset password for <b>{member.name}</b>? A secure one-time password will be generated.
                  </>
                )}
              </p>

              {isToggle && (
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
                    Reason / Administrative Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter reason for this action..."
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
              )}

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
                  onClick={handleAction}
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 20px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backgroundColor: isToggle
                      ? isCurrentlyActive
                        ? '#DC2626'
                        : '#00A859'
                      : '#011F39',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

