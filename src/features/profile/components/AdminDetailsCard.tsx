import React from 'react';
import { ShieldCheck, Award, Briefcase, Building, CheckCircle2, Clock, Calendar, Edit3 } from 'lucide-react';
import type { AdminProfile } from '../types/profile.types';

interface AdminDetailsCardProps {
  profile: AdminProfile;
  onEdit: () => void;
}

export const AdminDetailsCard: React.FC<AdminDetailsCardProps> = ({ profile, onEdit }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrap}>
            <ShieldCheck size={18} color="#06294D" />
          </div>
          <div>
            <h2 style={styles.title}>Admin & Governance Details</h2>
            <p style={styles.subtitle}>Trust designations, administrative privileges, and validity tenures.</p>
          </div>
        </div>

        <button type="button" onClick={onEdit} style={styles.editBtn}>
          <Edit3 size={14} color="#06294D" />
          <span>Edit Governance</span>
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Award size={14} color="#64748B" />
            <span style={styles.fieldLabel}>Administrator ID</span>
          </div>
          <span style={{ ...styles.fieldVal, color: '#06294D' }}>{profile.adminId}</span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Briefcase size={14} color="#64748B" />
            <span style={styles.fieldLabel}>Administrative Role</span>
          </div>
          <span style={styles.fieldVal}>{profile.role}</span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Building size={14} color="#64748B" />
            <span style={styles.fieldLabel}>Executive Department</span>
          </div>
          <span style={styles.fieldVal}>{profile.department || 'Central Executive Committee'}</span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Award size={14} color="#64748B" />
            <span style={styles.fieldLabel}>Official Designation</span>
          </div>
          <span style={styles.fieldVal}>{profile.designation || 'Trustee & Board Officer'}</span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <CheckCircle2 size={14} color="#059669" />
            <span style={styles.fieldLabel}>Account Status</span>
          </div>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>{profile.accountStatus}</span>
          </div>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Clock size={14} color="#64748B" />
            <span style={styles.fieldLabel}>Member Since</span>
          </div>
          <span style={styles.fieldVal}>{profile.memberSince}</span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <Calendar size={14} color="#D97706" />
            <span style={styles.fieldLabel}>Card Expiration / Valid Till</span>
          </div>
          <span style={{ ...styles.fieldVal, color: '#B45309', fontWeight: 700 }}>
            {profile.validTill}
          </span>
        </div>

        <div style={styles.fieldItem}>
          <div style={styles.fieldHeader}>
            <ShieldCheck size={14} color="#059669" />
            <span style={styles.fieldLabel}>Central ID Authority</span>
          </div>
          <span style={{ ...styles.fieldVal, color: '#047857' }}>
            Verified Central Governing Council
          </span>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '18px',
    borderBottom: '1px solid #F1F5F9',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#F0F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748B',
    margin: '2px 0 0 0',
  },
  editBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '6px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #CBD5E1',
    color: '#06294D',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px 24px',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  fieldVal: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0F172A',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ECFDF5',
    border: '1px solid #A7F3D0',
    padding: '4px 10px',
    borderRadius: '16px',
    width: 'fit-content',
    marginTop: '2px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#059669',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#065F46',
  },
};
