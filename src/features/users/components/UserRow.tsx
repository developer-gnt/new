import React from 'react';
import type { UserItem, UserType, UserStatus } from '../types/user.types';
import { Eye, Edit3, ShieldCheck, KeyRound, Lock, Unlock } from 'lucide-react';

interface UserRowProps {
  user: UserItem;
  onView: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onVerify: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onToggleStatus: (user: UserItem, action: 'block' | 'unblock') => void;
}

const USER_TYPE_LABELS: Record<UserType, string> = {
  admin: 'Admin',
  member: 'Member',
  seeker: 'Donation Seeker',
  donor: 'Donor',
  general: 'General User',
};

const USER_TYPE_STYLES: Record<UserType, { bg: string; text: string }> = {
  admin: { bg: '#FDF2F8', text: '#831843' },
  member: { bg: '#EFF6FF', text: '#1D4ED8' },
  seeker: { bg: '#FEF3C7', text: '#B45309' },
  donor: { bg: '#ECFDF5', text: '#047857' },
  general: { bg: '#F1F5F9', text: '#475569' },
};

const STATUS_STYLES: Record<UserStatus, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: '#ECFDF5', text: '#059669', dot: '#10B981', label: 'Approved' },
  pending: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B', label: 'Pending' },
  blocked: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444', label: 'Blocked' },
};

export const UserRow: React.FC<UserRowProps> = ({
  user,
  onView,
  onEdit,
  onVerify,
  onResetPassword,
  onToggleStatus,
}) => {
  const typeStyle = USER_TYPE_STYLES[user.userType] || USER_TYPE_STYLES.general;
  const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.active;
  const statusLabel = user.userType === 'general' && user.status === 'active' ? 'Active' : statusStyle.label;

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  const formattedDate = (() => {
    try {
      const d = new Date(user.joinedDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } catch {
      // Fallback
    }
    return user.joinedDate.split('T')[0] || user.joinedDate;
  })();

  const hasDocs = user.documents && user.documents.length > 0;

  return (
    <tr
      style={{
        borderBottom: '1px solid #EDF2F7',
        transition: 'background-color 0.15s ease',
      }}
      className="table-row-hover"
    >
      {/* User Info */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid #DBE5EE',
              }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#011F39',
                color: '#FAD465',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              {initials || 'U'}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div
              onClick={() => onView(user)}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#011F39',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={user.name}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#718096',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.email || 'No email'}
            </div>
          </div>
        </div>
      </td>

      {/* Member / App ID & Phone */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#123F68' }}>
          {user.memberId || user.applicationNumber || `#${user.id.slice(-6)}`}
        </div>
        <div style={{ fontSize: '12px', color: '#718096' }}>{user.phone || '—'}</div>
      </td>

      {/* Role */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: typeStyle.bg,
            color: typeStyle.text,
            whiteSpace: 'nowrap',
          }}
        >
          {USER_TYPE_LABELS[user.userType]}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: statusStyle.dot,
            }}
          />
          {statusLabel}
        </span>
      </td>

      {/* Joined Date */}
      <td
        style={{
          padding: '14px 16px',
          verticalAlign: 'middle',
          fontSize: '13px',
          color: '#34516D',
          whiteSpace: 'nowrap',
        }}
      >
        {formattedDate}
      </td>

      {/* Action Buttons */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'flex-end',
          }}
        >
          {/* Details */}
          <button
            type="button"
            onClick={() => onView(user)}
            title="View User Details"
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid #DBE5EE',
              backgroundColor: '#FFFFFF',
              color: '#011F39',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Eye size={15} />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(user)}
            title="Edit User"
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid #DBE5EE',
              backgroundColor: '#FFFFFF',
              color: '#123F68',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Edit3 size={15} />
          </button>

          {/* Verify KYC */}
          {(hasDocs || user.status === 'pending' || user.userType === 'seeker') && (
            <button
              type="button"
              onClick={() => onVerify(user)}
              title="Review KYC & Verification"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #A7F3D0',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ShieldCheck size={15} />
            </button>
          )}

          {/* Reset Password */}
          <button
            type="button"
            onClick={() => onResetPassword(user)}
            title="Reset Password"
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid #DBE5EE',
              backgroundColor: '#FFFFFF',
              color: '#34516D',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <KeyRound size={15} />
          </button>

          {/* Block / Unblock */}
          <button
            type="button"
            onClick={() =>
              onToggleStatus(user, user.status === 'blocked' ? 'unblock' : 'block')
            }
            title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: user.status === 'blocked' ? '#A7F3D0' : '#FECACA',
              backgroundColor: user.status === 'blocked' ? '#ECFDF5' : '#FEF2F2',
              color: user.status === 'blocked' ? '#059669' : '#DC2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {user.status === 'blocked' ? <Unlock size={15} /> : <Lock size={15} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

