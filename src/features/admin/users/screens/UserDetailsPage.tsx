import React, { useState, useSyncExternalStore, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersStore } from '../store/usersStore';
import type { UserType, UserStatus, UserVerificationDocument } from '../types/user.types';
import { UserConfirmationModal } from '../components/UserConfirmationModal';
import { UserPasswordResetModal } from '../components/UserPasswordResetModal';
import { UserDocumentViewerModal } from '../components/UserDocumentViewerModal';
import { getValidAvatarUrl, getInitials } from '@/utils/avatar';
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
  Copy,
  Check,
  Shield,
  Trash2,
} from 'lucide-react';

const USER_TYPE_CONFIG: Record<
  UserType,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  admin: {
    label: 'Administrator',
    bg: '#FDF2F8',
    text: '#9D174D',
    border: '#FBCFE8',
    icon: '🛡️',
  },
  member: {
    label: 'Official Member',
    bg: '#011F39',
    text: '#FAD465',
    border: '#E9B82E',
    icon: '🎖️',
  },
  seeker: {
    label: 'Donation Seeker',
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    icon: '🤝',
  },
  donor: {
    label: 'Patron Donor',
    bg: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
    icon: '💙',
  },
  general: {
    label: 'General Citizen',
    bg: '#F1F5F9',
    text: '#334155',
    border: '#CBD5E1',
    icon: '👤',
  },
};

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  active: {
    label: 'Active & Verified',
    bg: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
    dot: '#10B981',
  },
  pending: {
    label: 'Pending Review',
    bg: '#FFFBEB',
    text: '#B45309',
    border: '#FDE68A',
    dot: '#F59E0B',
  },
  blocked: {
    label: 'Suspended / Blocked',
    bg: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
    dot: '#EF4444',
  },
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

  // Avatar state
  const [imgError, setImgError] = useState(false);
  const validAvatarUrl = useMemo(() => getValidAvatarUrl(user?.avatarUrl), [user?.avatarUrl]);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatarUrl]);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!user) {
    return (
      <div style={styles.notFoundWrapper}>
        <AlertCircle size={44} color="#DC2626" style={{ margin: '0 auto 16px' }} />
        <h2 style={styles.notFoundTitle}>User Account Not Found</h2>
        <p style={styles.notFoundText}>
          The requested user record #{id} does not exist in the active organization directory.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          style={styles.returnBtn}
        >
          <ChevronLeft size={16} />
          <span>Return to Users Directory</span>
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
  const typeConfig = USER_TYPE_CONFIG[user.userType] || USER_TYPE_CONFIG.general;
  const statusConfig = STATUS_CONFIG[user.status] || STATUS_CONFIG.active;
  const initials = getInitials(user.name, 'U');

  const formatJoined = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return {
          date: d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          time: d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
      }
    } catch {
      // Fallback
    }
    return { date: dateStr.split('T')[0] || dateStr, time: '' };
  };

  const joinedInfo = formatJoined(user.joinedDate);
  const shortId = user.id.replace(/-/g, '').slice(-8).toUpperCase();

  return (
    <div style={styles.pageContainer}>
      {/* Top Header & Breadcrumb Bar */}
      <div style={styles.topBar}>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          style={styles.backBtn}
          title="Return to Users Management Directory"
        >
          <ChevronLeft size={18} />
          <span>Back to Users</span>
        </button>

        <div style={styles.topActions}>
          <button
            type="button"
            onClick={() => setShowPasswordResetModal(true)}
            style={styles.topSecondaryBtn}
            title="Reset user security password"
          >
            <KeyRound size={15} color="#011F39" />
            <span>Reset Password</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
            style={styles.topPrimaryBtn}
            title="Edit user profile information"
          >
            <Edit3 size={15} color="#011F39" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Primary User Identity Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          {/* Avatar Container with bulletproof initials fallback */}
          <div style={styles.avatarWrapper}>
            {validAvatarUrl && !imgError ? (
              <img
                src={validAvatarUrl}
                alt=""
                onError={() => setImgError(true)}
                style={styles.avatarImg}
              />
            ) : (
              <div style={styles.avatarInitials} aria-label={user.name}>
                {initials}
              </div>
            )}
            <span
              style={{
                ...styles.avatarStatusDot,
                backgroundColor: statusConfig.dot,
              }}
              title={`Status: ${statusConfig.label}`}
            />
          </div>

          {/* User Details */}
          <div style={styles.heroInfo}>
            <div style={styles.nameRow}>
              <h1 style={styles.userName}>{user.name}</h1>
              <div
                style={styles.idPill}
                onClick={() => handleCopy(user.id, 'id')}
                title="Click to copy full User UUID"
              >
                <span>ID: #{shortId}</span>
                {copiedKey === 'id' ? (
                  <Check size={12} color="#16A34A" />
                ) : (
                  <Copy size={12} color="#64748B" />
                )}
              </div>
            </div>

            {/* Contact Row */}
            <div style={styles.contactRow}>
              {user.email ? (
                <div
                  style={styles.contactItem}
                  onClick={() => handleCopy(user.email!, 'email')}
                  title="Click to copy email"
                >
                  <Mail size={14} color="#64748B" />
                  <span>{user.email}</span>
                  {copiedKey === 'email' ? (
                    <Check size={11} color="#16A34A" />
                  ) : null}
                </div>
              ) : (
                <span style={styles.contactMissing}>No email provided</span>
              )}

              {user.phone ? (
                <div
                  style={styles.contactItem}
                  onClick={() => handleCopy(user.phone!, 'phone')}
                  title="Click to copy phone number"
                >
                  <Phone size={14} color="#64748B" />
                  <span>{user.phone}</span>
                  {copiedKey === 'phone' ? (
                    <Check size={11} color="#16A34A" />
                  ) : null}
                </div>
              ) : (
                <span style={styles.contactMissing}>No phone registered</span>
              )}
            </div>

            {/* Badges Row */}
            <div style={styles.badgesRow}>
              <span
                style={{
                  ...styles.roleBadge,
                  backgroundColor: typeConfig.bg,
                  color: typeConfig.text,
                  borderColor: typeConfig.border,
                }}
              >
                <span>{typeConfig.icon}</span>
                <span>{typeConfig.label}</span>
              </span>

              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: statusConfig.bg,
                  color: statusConfig.text,
                  borderColor: statusConfig.border,
                }}
              >
                <span
                  style={{
                    ...styles.statusDot,
                    backgroundColor: statusConfig.dot,
                  }}
                />
                <span>{statusConfig.label}</span>
              </span>

              {isMember && user.memberId && (
                <span style={styles.memberIdBadge}>
                  <span>🎖️ {user.memberId}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards in Balanced Row */}
      <div style={styles.metricsGrid} className="user-metrics-grid">
        {/* Metric 1: System ID */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: '#EFF6FF', color: '#0284C7' }}>
            <IdCard size={20} />
          </div>
          <div style={styles.metricContent}>
            <span style={styles.metricLabel}>
              {isMember && user.memberId
                ? 'Member ID'
                : user.applicationNumber
                ? 'Application No.'
                : 'User System ID'}
            </span>
            <span style={styles.metricValue}>
              {isMember && user.memberId
                ? user.memberId
                : user.applicationNumber
                ? user.applicationNumber
                : `#${shortId}`}
            </span>
            <span style={styles.metricSub}>Official Identifier</span>
          </div>
        </div>

        {/* Metric 2: Joined Date */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: '#FFFBEB', color: '#D97706' }}>
            <Calendar size={20} />
          </div>
          <div style={styles.metricContent}>
            <span style={styles.metricLabel}>Joined On</span>
            <span style={styles.metricValue}>{joinedInfo.date}</span>
            <span style={styles.metricSub}>
              {joinedInfo.time ? `${joinedInfo.time} IST` : 'Registration date'}
            </span>
          </div>
        </div>

        {/* Metric 3: Last Login */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: '#F0F9FF', color: '#0369A1' }}>
            <Clock size={20} />
          </div>
          <div style={styles.metricContent}>
            <span style={styles.metricLabel}>Last Active</span>
            <span style={styles.metricValue}>{user.lastLogin || 'Recently'}</span>
            <span style={styles.metricSub}>Account access log</span>
          </div>
        </div>

        {/* Metric 4: Total Donations */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: '#F0FDF4', color: '#16A34A' }}>
            <CreditCard size={20} />
          </div>
          <div style={styles.metricContent}>
            <span style={styles.metricLabel}>Total Donations</span>
            <span style={styles.metricValue}>
              ₹ {(user.totalDonations ?? 0).toLocaleString('en-IN')}
            </span>
            <span style={styles.metricSub}>
              {user.donationCount ?? 0} {user.donationCount === 1 ? 'donation' : 'donations'}
            </span>
          </div>
        </div>
      </div>

      {/* Account & Personal Information Card */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderTitle}>
            <UserIcon size={18} color="#011F39" />
            <h2 style={styles.sectionTitle}>Account & Personal Information</h2>
          </div>
        </div>

        <div style={styles.fieldsGrid}>
          {/* Full Name */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Full Legal Name</span>
            <div style={styles.fieldValueRow}>
              <UserIcon size={15} color="#123F68" />
              <span style={styles.fieldValueText}>{user.name}</span>
            </div>
          </div>

          {/* Email */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Email Address</span>
            <div style={styles.fieldValueRow}>
              <Mail size={15} color="#123F68" />
              <span style={styles.fieldValueText}>{user.email || '—'}</span>
            </div>
          </div>

          {/* Phone */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Mobile Phone Number</span>
            <div style={styles.fieldValueRow}>
              <Phone size={15} color="#123F68" />
              <span style={styles.fieldValueText}>{user.phone || '—'}</span>
            </div>
          </div>

          {/* Role */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Account Role & Access</span>
            <div style={styles.fieldValueRow}>
              <Shield size={15} color="#123F68" />
              <span style={styles.fieldValueText}>{typeConfig.label}</span>
            </div>
          </div>

          {/* Date of Birth */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Date of Birth</span>
            <div style={styles.fieldValueRow}>
              <Calendar size={15} color="#123F68" />
              <span style={styles.fieldValueText}>{user.dob || 'Not specified'}</span>
            </div>
          </div>

          {/* Gender */}
          <div style={styles.fieldItem}>
            <span style={styles.fieldLabel}>Gender</span>
            <div style={styles.fieldValueRow}>
              <span style={styles.fieldValueText}>{user.gender || 'Not specified'}</span>
            </div>
          </div>

          {/* Address */}
          <div style={{ ...styles.fieldItem, gridColumn: '1 / -1' }}>
            <span style={styles.fieldLabel}>Residential Address</span>
            <div style={styles.fieldValueRow}>
              <MapPin size={15} color="#123F68" style={{ flexShrink: 0 }} />
              <span style={styles.fieldValueText}>
                {user.address || 'No registered address on file'}
              </span>
            </div>
          </div>

          {/* Admin Remarks */}
          {user.remarks && (
            <div style={{ ...styles.fieldItem, gridColumn: '1 / -1' }}>
              <span style={styles.fieldLabel}>Administrative Remarks & Notes</span>
              <div style={styles.remarksBox}>
                <span>{user.remarks}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KYC & Identity Verification Documents */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderTitle}>
            <ShieldCheck size={18} color="#011F39" />
            <h2 style={styles.sectionTitle}>Verification & Identity Documents</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/admin/users/${user.id}/verification`)}
            style={styles.verificationBtn}
          >
            <ShieldCheck size={15} />
            <span>Open Verification Portal</span>
          </button>
        </div>

        {user.documents && user.documents.length > 0 ? (
          <div style={styles.docsGrid}>
            {user.documents.map((doc) => (
              <div key={doc.id} style={styles.docCard}>
                <div style={styles.docLeft}>
                  <div style={styles.docIconBox}>
                    <FileText size={20} color="#011F39" />
                  </div>
                  <div style={styles.docMeta}>
                    <span style={styles.docTitle}>{doc.title}</span>
                    <span style={styles.docSub}>
                      {doc.fileName} • {doc.fileSize || '1.2 MB'}
                    </span>
                  </div>
                </div>

                <div style={styles.docActions}>
                  <span
                    style={{
                      ...styles.docBadge,
                      backgroundColor: doc.verified ? '#ECFDF5' : '#FFFBEB',
                      color: doc.verified ? '#059669' : '#D97706',
                      borderColor: doc.verified ? '#BBF7D0' : '#FDE68A',
                    }}
                  >
                    {doc.verified ? 'Verified' : 'Pending'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setViewingDoc(doc)}
                    style={styles.viewDocBtn}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.docsEmptyBox}>
            <FileText size={32} color="#94A3B8" />
            <span style={styles.docsEmptyTitle}>No Verification Documents Uploaded</span>
            <span style={styles.docsEmptySub}>
              This user has not yet submitted Aadhaar, PAN or institutional identity credentials.
            </span>
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div style={styles.footerBar}>
        <div style={styles.footerLeft}>
          {/* Block / Unblock */}
          <button
            type="button"
            onClick={() => setConfirmAction(user.status === 'blocked' ? 'unblock' : 'block')}
            style={{
              ...styles.footerActionBtn,
              backgroundColor: user.status === 'blocked' ? '#ECFDF5' : '#FEF2F2',
              borderColor: user.status === 'blocked' ? '#BBF7D0' : '#FECACA',
              color: user.status === 'blocked' ? '#047857' : '#DC2626',
            }}
          >
            {user.status === 'blocked' ? (
              <>
                <Unlock size={15} />
                <span>Unblock Account</span>
              </>
            ) : (
              <>
                <Lock size={15} />
                <span>Block Account</span>
              </>
            )}
          </button>

          {/* Reset Password */}
          <button
            type="button"
            onClick={() => setShowPasswordResetModal(true)}
            style={styles.footerSecondaryBtn}
          >
            <KeyRound size={15} color="#011F39" />
            <span>Reset Password</span>
          </button>

          {/* Delete Account */}
          <button
            type="button"
            onClick={() => setConfirmAction('delete')}
            style={styles.footerDangerGhostBtn}
          >
            <Trash2 size={15} color="#DC2626" />
            <span>Delete User</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          style={styles.footerPrimaryBtn}
        >
          <Edit3 size={15} color="#011F39" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Modals */}
      <UserConfirmationModal
        isOpen={Boolean(confirmAction)}
        user={user}
        action={confirmAction}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      <UserPasswordResetModal
        isOpen={showPasswordResetModal}
        user={user}
        onClose={() => setShowPasswordResetModal(false)}
      />

      <UserDocumentViewerModal
        isOpen={Boolean(viewingDoc)}
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onVerify={(docId) => {
          usersStore.updateDocumentVerification(user.id, docId, true);
        }}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingBottom: '40px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 14px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.15s ease',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  topSecondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 15px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.15s ease',
  },
  topPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '8px 18px',
    backgroundColor: '#FAD465',
    border: '1px solid #E9B82E',
    borderRadius: '8px',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.35)',
    transition: 'all 0.15s ease',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '24px 28px',
    boxShadow: '0 2px 8px rgba(1, 31, 57, 0.04)',
    marginBottom: '20px',
  },
  heroLeft: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '84px',
    height: '84px',
    flexShrink: 0,
  },
  avatarImg: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #EDF2F7',
    boxShadow: '0 4px 12px rgba(1, 31, 57, 0.08)',
    backgroundColor: '#F8FAFC',
  },
  avatarInitials: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: '#011F39',
    color: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '30px',
    border: '3px solid #FAD465',
    boxShadow: '0 4px 14px rgba(1, 31, 57, 0.15)',
    letterSpacing: '0.04em',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2.5px solid #FFFFFF',
  },
  heroInfo: {
    flex: 1,
    minWidth: '260px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '8px',
  },
  userName: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '26px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
    lineHeight: 1.2,
  },
  idPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 700,
    color: '#011F39',
    backgroundColor: '#EDF2F7',
    border: '1px solid #DCE4EC',
    padding: '3px 9px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '14px',
  },
  contactItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
  contactMissing: {
    fontSize: '13px',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  badgesRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  memberIdBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 700,
    backgroundColor: '#FFF9E6',
    color: '#B45309',
    border: '1px solid #FDE68A',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
    marginBottom: '20px',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.2s ease',
  },
  metricIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '11.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748B',
    marginBottom: '2px',
  },
  metricValue: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '17px',
    fontWeight: 800,
    color: '#011F39',
    lineHeight: 1.2,
  },
  metricSub: {
    fontSize: '11px',
    color: '#94A3B8',
    marginTop: '3px',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    padding: '22px 24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '14px',
    marginBottom: '18px',
  },
  sectionHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '18px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px 28px',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '11.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#64748B',
  },
  fieldValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#011F39',
  },
  fieldValueText: {
    wordBreak: 'break-word',
  },
  remarksBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#334155',
    lineHeight: 1.5,
  },
  verificationBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1px solid #BFDBFE',
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  docsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '14px',
  },
  docCard: {
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px 16px',
    backgroundColor: '#FAF7F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  docLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  docIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  docTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#011F39',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  docSub: {
    fontSize: '11px',
    color: '#64748B',
  },
  docActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  docBadge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '8px',
    border: '1px solid',
  },
  viewDocBtn: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#011F39',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  docsEmptyBox: {
    padding: '28px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF7F0',
    borderRadius: '10px',
    border: '1px dashed #CBD5E1',
  },
  docsEmptyTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#334155',
  },
  docsEmptySub: {
    fontSize: '12px',
    color: '#64748B',
  },
  footerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    padding: '16px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  footerActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  footerSecondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.15s ease',
  },
  footerDangerGhostBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    borderRadius: '8px',
    border: '1px solid #FEE2E2',
    backgroundColor: '#FFF5F5',
    color: '#DC2626',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  footerPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 20px',
    borderRadius: '8px',
    border: '1px solid #E9B82E',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.35)',
    transition: 'all 0.15s ease',
  },
  notFoundWrapper: {
    maxWidth: '560px',
    margin: '60px auto',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    padding: '40px 30px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 16px rgba(1, 31, 57, 0.06)',
  },
  notFoundTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '22px',
    color: '#011F39',
    margin: '0 0 8px',
  },
  notFoundText: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0 0 24px',
  },
  returnBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 22px',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};
