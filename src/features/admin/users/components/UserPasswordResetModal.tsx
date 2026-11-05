import React, { useState } from 'react';
import type { UserItem } from '../types/user.types';
import { usersStore } from '../store/usersStore';
import { KeyRound, Eye, EyeOff, Copy, Check, X, RefreshCw } from 'lucide-react';

interface UserPasswordResetModalProps {
  isOpen: boolean;
  user: UserItem | null;
  onClose: () => void;
}

const generateRandomPassword = (): string => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Hrsjm@${rand}`;
};

export const UserPasswordResetModal: React.FC<UserPasswordResetModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleGenerate = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setShowPassword(true);
    setErrorMessage(null);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed || trimmed.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await usersStore.resetPassword(user.id, trimmed);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMessage(res.message || 'Failed to update user password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(password.trim());
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModalClose = () => {
    setPassword('');
    setShowPassword(false);
    setErrorMessage(null);
    setSuccess(false);
    setCopied(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        padding: '16px',
      }}
      onClick={handleModalClose}
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
          onClick={handleModalClose}
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
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
            }}
          >
            <KeyRound size={28} />
          </div>

          <h3
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 6px',
            }}
          >
            Reset User Password
          </h3>

          <p
            style={{
              fontSize: '13px',
              color: '#34516D',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Set a new password for <strong>{user.name}</strong> ({user.email || user.phone}).
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Check size={26} />
            </div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#059669',
                margin: '0 0 6px',
              }}
            >
              Password Reset Successfully!
            </h4>
            <p style={{ fontSize: '13px', color: '#34516D', margin: '0 0 20px' }}>
              The new credentials are saved. Make sure to securely share this password with the user.
            </p>
            <button
              type="button"
              onClick={handleModalClose}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#011F39',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <label
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#011F39',
                  }}
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={handleGenerate}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#123F68',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <RefreshCw size={12} /> Auto-generate
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter or generate password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 80px 10px 14px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #DBE5EE',
                    backgroundColor: '#FFFFFF',
                    color: '#011F39',
                    outline: 'none',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {password && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copy password"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copied ? '#059669' : '#718096',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#718096',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div
                  style={{
                    color: '#DC2626',
                    fontSize: '12px',
                    marginTop: '6px',
                    fontWeight: 500,
                  }}
                >
                  {errorMessage}
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#718096',
                backgroundColor: '#FAF7F0',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              Tip: Passwords should be at least 6 characters long. For security, inform the user to update their password after initial login.
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleModalClose}
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
                type="submit"
                disabled={isSubmitting || !password.trim()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#011F39',
                  backgroundColor: '#FAD465',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting || !password.trim() ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || !password.trim() ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

