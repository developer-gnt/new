import React, { useState, useSyncExternalStore } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersStore } from '../store/usersStore';
import type { UserType, UserStatus, UserVerificationDocument } from '../types/user.types';
import { UserConfirmationModal } from '../components/UserConfirmationModal';
import { UserPasswordResetModal } from '../components/UserPasswordResetModal';
import { UserDocumentViewerModal } from '../components/UserDocumentViewerModal';
import {
  ChevronLeft,
  Edit3,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  CreditCard,
  Clock,
  Calendar,
  IdCard,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
} from 'lucide-react';

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

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useSyncExternalStore(usersStore.subscribe, usersStore.getSnapshot);

  const user = id ? usersStore.getUserById(id) : undefined;

  // Modals state
  const [confirmAction, setConfirmAction] = useState<'block' | 'unblock' | 'delete' | null>(null);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<UserVerificationDocument | null>(null);

  if (!user) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '60px auto',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          padding: '40px 30px',
          borderRadius: '16px',
          border: '1px solid #EDF2F7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
        <h2
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '22px',
            color: '#011F39',
            margin: '0 0 8px',
          }}
        >
          User Not Found
        </h2>
        <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 24px' }}>
          The user record you are looking for does not exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Return to Users List
        </button>
      </div>
    );
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const action = confirmAction;
    setConfirmAction(null);

    if (action === 'delete') {
      usersStore.deleteUser(user.id);
      navigate('/admin/users');
    } else if (action === 'block') {
      await usersStore.updateStatus(user.id, 'blocked');
    } else if (action === 'unblock') {
      await usersStore.updateStatus(user.id, 'active');
    }
  };

  const isMember = user.userType === 'member';
  const typeStyle = USER_TYPE_STYLES[user.userType] || USER_TYPE_STYLES.general;
  const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.active;
  const statusLabel = user.userType === 'general' && user.status === 'active' ? 'Active' : statusStyle.label;

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  const formatJoined = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return {
          date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
      }
    } catch {
      // Fallback
    }
    return { date: dateStr.split('T')[0] || dateStr, time: '' };
  };

  const joinedInfo = formatJoined(user.joinedDate);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Navigation Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#011F39',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ChevronLeft size={18} />
          <span>Back to Users</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #DBE5EE',
            borderRadius: '8px',
            color: '#011F39',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Edit3 size={15} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Header Block */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #EDF2F7',
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #EDF2F7',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
            }}
          />
        ) : (
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: '#011F39',
              color: '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '28px',
              boxShadow: '0 4px 10px rgba(1, 31, 57, 0.15)',
            }}
          >
            {initials || 'U'}
          </div>
        )}

        {/* Profile Info */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 6px',
            }}
          >
            {user.name}
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              color: '#718096',
              fontSize: '13px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#718096" />
              <span>{user.email || 'No email registered'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#718096" />
              <span>{user.phone || 'No phone registered'}</span>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: typeStyle.bg,
                color: typeStyle.text,
              }}
            >
              {USER_TYPE_LABELS[user.userType]}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
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
          </div>
        </div>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Metric 1 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EDF2F7',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IdCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600 }}>
              {isMember && user.memberId
                ? 'Member ID'
                : user.applicationNumber
                ? 'Application No.'
                : 'User ID'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
              {isMember && user.memberId
                ? user.memberId
                : user.applicationNumber
                ? user.applicationNumber
                : `#${user.id.slice(-8)}`}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EDF2F7',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#FAF7F0',
              color: '#011F39',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600 }}>Joined On</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#011F39' }}>
              {joinedInfo.date}
            </div>
            {joinedInfo.time && (
              <div style={{ fontSize: '11px', color: '#718096' }}>{joinedInfo.time}</div>
            )}
          </div>
        </div>

        {/* Metric 3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EDF2F7',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#FFFBEB',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600 }}>Last Login</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#011F39' }}>
              {user.lastLogin || 'Recently'}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EDF2F7',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600 }}>
              Total Donations
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
              ₹ {(user.totalDonations ?? 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: '#718096' }}>
              {user.donationCount ?? 0} donations
            </div>
          </div>
        </div>
      </div>

      {/* Information Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #EDF2F7',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#011F39',
            margin: '0 0 16px',
            borderBottom: '1px solid #EDF2F7',
            paddingBottom: '12px',
          }}
        >
          Account & Personal Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px 32px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Full Name</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserIcon size={16} color="#123F68" />
              <span>{user.name}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Email Address</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#123F68" />
              <span>{user.email || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Phone Number</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#123F68" />
              <span>{user.phone || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>User Role</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39' }}>
              {USER_TYPE_LABELS[user.userType]}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Date of Birth</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#123F68" />
              <span>{user.dob || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Gender</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39' }}>
              {user.gender || 'Not specified'}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Address</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#123F68" />
              <span>{user.address || 'Not provided'}</span>
            </div>
          </div>

          {user.remarks && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Admin Remarks / Notes</div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#34516D',
                  backgroundColor: '#FAF7F0',
                  padding: '10px 14px',
                  borderRadius: '8px',
                }}
              >
                {user.remarks}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KYC Verification Documents Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #EDF2F7',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid #EDF2F7',
            paddingBottom: '12px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#011F39',
              margin: 0,
            }}
          >
            Verification & Identity Documents
          </h3>

          <button
            type="button"
            onClick={() => navigate(`/admin/users/${user.id}/verification`)}
            style={{
              padding: '6px 14px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              color: '#1D4ED8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} /> Open Verification Portal
          </button>
        </div>

        {user.documents && user.documents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {user.documents.map(doc => (
              <div
                key={doc.id}
                style={{
                  border: '1px solid #EDF2F7',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#FAF7F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <FileText size={24} color="#123F68" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#011F39',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>
                      {doc.fileName} • {doc.fileSize || '1.5 MB'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: doc.verified ? '#ECFDF5' : '#FFFBEB',
                      color: doc.verified ? '#059669' : '#D97706',
                    }}
                  >
                    {doc.verified ? 'Verified' : 'Pending'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewingDoc(doc)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DBE5EE',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#011F39',
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: '#718096', padding: '10px 0' }}>
            No verification documents currently attached for this user account.
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #EDF2F7',
          padding: '18px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* Block / Unblock */}
          <button
            type="button"
            onClick={() => setConfirmAction(user.status === 'blocked' ? 'unblock' : 'block')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: user.status === 'blocked' ? '#A7F3D0' : '#FECACA',
              backgroundColor: user.status === 'blocked' ? '#ECFDF5' : '#FEF2F2',
              color: user.status === 'blocked' ? '#059669' : '#DC2626',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {user.status === 'blocked' ? (
              <>
                <Unlock size={16} /> Unblock User
              </>
            ) : (
              <>
                <Lock size={16} /> Block User
              </>
            )}
          </button>

          {/* Reset Password */}
          <button
            type="button"
            onClick={() => setShowPasswordResetModal(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #DBE5EE',
              backgroundColor: '#FFFFFF',
              color: '#011F39',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <KeyRound size={16} /> Reset Password
          </button>

          {/* Delete Account */}
          <button
            type="button"
            onClick={() => setConfirmAction('delete')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #EDF2F7',
              backgroundColor: 'transparent',
              color: '#718096',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Delete Account
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          style={{
            padding: '10px 22px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Edit3 size={15} /> Edit User
        </button>
      </div>

      {/* Confirmation Modal */}
      <UserConfirmationModal
        isOpen={Boolean(confirmAction)}
        user={user}
        action={confirmAction}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Password Reset Modal */}
      <UserPasswordResetModal
        isOpen={showPasswordResetModal}
        user={user}
        onClose={() => setShowPasswordResetModal(false)}
      />

      {/* Document Viewer Modal */}
      <UserDocumentViewerModal
        isOpen={Boolean(viewingDoc)}
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onVerify={docId => {
          usersStore.updateDocumentVerification(user.id, docId, true);
        }}
      />
    </div>
  );
};
