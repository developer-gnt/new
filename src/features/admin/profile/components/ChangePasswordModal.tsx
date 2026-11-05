import React, { useState } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';
import type { ChangePasswordInput } from '../types/profile.types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChangePasswordInput) => { success: boolean; message: string };
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ChangePasswordInput>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.currentPassword) {
      setErrorMsg('Please provide your current administrator password.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters in length.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    const result = onSave(formData);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  const hasLength = formData.newPassword.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(formData.newPassword);
  const passwordsMatch = Boolean(
    formData.newPassword && formData.newPassword === formData.confirmPassword
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <KeyRound size={18} color="#06294D" />
            <h3 style={styles.headerTitle}>Change Administrator Password</h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.body}>
            {errorMsg && (
              <div style={styles.errorAlert}>
                <ShieldAlert size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Current Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password *</label>
              <div style={styles.inputWrap}>
                <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  style={styles.input}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowCurrent((prev) => !prev)}
                >
                  {showCurrent ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password *</label>
              <div style={styles.inputWrap}>
                <KeyRound size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  style={styles.input}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowNew((prev) => !prev)}
                >
                  {showNew ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm New Password *</label>
              <div style={styles.inputWrap}>
                <KeyRound size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={styles.input}
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            {/* Password Requirement Checks */}
            <div style={styles.rulesBox}>
              <div style={styles.ruleItem}>
                <Check size={13} color={hasLength ? '#059669' : '#94A3B8'} />
                <span style={{ color: hasLength ? '#059669' : '#64748B', fontWeight: hasLength ? 600 : 400 }}>
                  Minimum 6 characters
                </span>
              </div>
              <div style={styles.ruleItem}>
                <Check size={13} color={hasNumberOrSymbol ? '#059669' : '#94A3B8'} />
                <span style={{ color: hasNumberOrSymbol ? '#059669' : '#64748B', fontWeight: hasNumberOrSymbol ? 600 : 400 }}>
                  Includes a number or special symbol
                </span>
              </div>
              <div style={styles.ruleItem}>
                <Check size={13} color={passwordsMatch ? '#059669' : '#94A3B8'} />
                <span style={{ color: passwordsMatch ? '#059669' : '#64748B', fontWeight: passwordsMatch ? 600 : 400 }}>
                  Passwords match perfectly
                </span>
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '18px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    color: '#991B1B',
    fontSize: '12.5px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 38px 10px 38px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13.5px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  rulesBox: {
    backgroundColor: '#F8FAFC',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11.5px',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '9px 22px',
    borderRadius: '8px',
    backgroundColor: '#06294D',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};
