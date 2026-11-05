import React from 'react';
import { Camera, ShieldCheck, IdCard, KeyRound, CheckCircle2, Clock } from 'lucide-react';
import type { AdminProfile } from '../types/profile.types';

interface ProfileSummaryCardProps {
  profile: AdminProfile;
  onChangeAvatar: () => void;
  onViewIdCard: () => void;
  onChangePassword: () => void;
  onEditPersonal: () => void;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  profile,
  onChangeAvatar,
  onViewIdCard,
  onChangePassword,
  onEditPersonal,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.contentWrap}>
        {/* Left: Avatar with Camera Edit Button */}
        <div style={styles.avatarWrap}>
          <div style={styles.avatarCircle} onClick={onChangeAvatar} title="Change Profile Photo">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarInitials}>
                {(profile.fullName || 'AD').slice(0, 2).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              style={styles.cameraBtn}
              onClick={(e) => {
                e.stopPropagation();
                onChangeAvatar();
              }}
              title="Upload new photo"
              aria-label="Upload photo"
            >
              <Camera size={13} color="#FFFFFF" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Center: Name, Badges, Role & Identity Info */}
        <div style={styles.infoCol}>
          <div style={styles.nameRow}>
            <h1 style={styles.fullName}>{profile.fullName}</h1>
            <div style={styles.statusBadge}>
              <CheckCircle2 size={13} color="#059669" />
              <span>{profile.accountStatus}</span>
            </div>
            <div style={styles.adminIdBadge}>
              <span>{profile.adminId}</span>
            </div>
          </div>

          <div style={styles.roleRow}>
            <span style={styles.roleTitle}>{profile.role}</span>
            <span style={styles.dotSeparator}>·</span>
            <span style={styles.designationTitle}>
              {profile.designation || 'National Executive Committee'}
            </span>
          </div>

          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              <ShieldCheck size={14} color="#64748B" />
              <span>Member ID: <strong>{profile.memberId}</strong></span>
            </div>
            <div style={styles.metaItem}>
              <Clock size={14} color="#64748B" />
              <span>Member Since: <strong>{profile.memberSince}</strong></span>
            </div>
            <div style={styles.metaItem}>
              <ShieldCheck size={14} color="#D97706" />
              <span style={{ color: '#B45309' }}>Valid Till: <strong>{profile.validTill}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div style={styles.actionCol}>
          <button
            type="button"
            onClick={onViewIdCard}
            style={styles.primaryIdBtn}
            title="Open Dedicated ID Card View"
          >
            <IdCard size={16} color="#011F39" />
            <span>My ID Card</span>
          </button>

          <button
            type="button"
            onClick={onEditPersonal}
            style={styles.secondaryBtn}
            title="Edit Personal Information"
          >
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={onChangePassword}
            style={styles.textBtn}
            title="Change Account Password"
          >
            <KeyRound size={14} color="#06294D" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    padding: '24px',
    marginBottom: '24px',
  },
  contentWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarCircle: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #FAD465',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(1, 31, 57, 0.15)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarInitials: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#FAD465',
    letterSpacing: '0.5px',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#06294D',
    border: '2px solid #FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '280px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '6px',
  },
  fullName: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#011F39',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ECFDF5',
    border: '1px solid #A7F3D0',
    color: '#065F46',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: '20px',
  },
  adminIdBadge: {
    backgroundColor: '#F1F5F9',
    color: '#06294D',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    letterSpacing: '0.5px',
  },
  roleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#475569',
  },
  roleTitle: {
    fontWeight: 600,
    color: '#06294D',
  },
  dotSeparator: {
    color: '#94A3B8',
  },
  designationTitle: {
    color: '#64748B',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexWrap: 'wrap',
    fontSize: '12.5px',
    color: '#475569',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexShrink: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primaryIdBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
    transition: 'all 0.2s',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#F8FAFC',
    color: '#06294D',
    fontSize: '12.5px',
    fontWeight: 600,
    border: '1px solid #CBD5E1',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  textBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#06294D',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
};
