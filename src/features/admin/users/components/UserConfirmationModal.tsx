import React from 'react';
import type { UserItem } from '../types/user.types';
import { Lock, Unlock, Trash2, X } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface UserConfirmationModalProps {
  isOpen: boolean;
  user: UserItem | null;
  action: 'block' | 'unblock' | 'delete' | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UserConfirmationModal: React.FC<UserConfirmationModalProps> = ({
  isOpen,
  user,
  action,
  onConfirm,
  onCancel,
}) => {
  useLockBodyScroll(Boolean(isOpen && user && action));

  if (!isOpen || !user || !action) return null;

  const isBlock = action === 'block';
  const isDelete = action === 'delete';

  const title = isDelete
    ? 'Delete User Account?'
    : isBlock
    ? 'Block User Account?'
    : 'Unblock User Account?';

  const message = isDelete
    ? `Are you sure you want to permanently delete ${user.name}? This action cannot be undone and will remove their record from the system.`
    : isBlock
    ? `Are you sure you want to block ${user.name}? This will suspend their access to the HRSJM platform.`
    : `Are you sure you want to restore access for ${user.name}? They will be able to log in and access services again.`;

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
      onClick={onCancel}
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
          onClick={onCancel}
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
              backgroundColor: isBlock || isDelete ? '#FEF2F2' : '#ECFDF5',
              color: isBlock || isDelete ? '#DC2626' : '#059669',
            }}
          >
            {isDelete ? (
              <Trash2 size={28} />
            ) : isBlock ? (
              <Lock size={28} />
            ) : (
              <Unlock size={28} />
            )}
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
            {title}
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: '#34516D',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>

        {/* User preview badge */}
        <div
          style={{
            backgroundColor: '#FAF7F0',
            border: '1px solid #EDF2F7',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#011F39',
              color: '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#011F39',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: '#718096' }}>
              {user.email || user.phone}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
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
              transition: 'background-color 0.15s ease',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: isBlock || isDelete ? '#DC2626' : '#059669',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {isDelete ? (
              'Confirm Delete'
            ) : isBlock ? (
              <>
                <Lock size={15} /> Block User
              </>
            ) : (
              <>
                <Unlock size={15} /> Unblock User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
