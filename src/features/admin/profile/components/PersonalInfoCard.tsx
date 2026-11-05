import React from 'react';
import { User, Mail, Phone, Calendar, Heart, MapPin, Edit3 } from 'lucide-react';
import type { AdminProfile } from '../types/profile.types';

interface PersonalInfoCardProps {
  profile: AdminProfile;
  onEdit: () => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile, onEdit }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrap}>
            <User size={18} color="#06294D" />
          </div>
          <div>
            <h2 style={styles.title}>Personal Information</h2>
            <p style={styles.subtitle}>Your official identity credentials and communication records.</p>
          </div>
        </div>

        <button type="button" onClick={onEdit} style={styles.editBtn}>
          <Edit3 size={14} color="#06294D" />
          <span>Edit Details</span>
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.fieldCol}>
          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <User size={14} color="#64748B" />
              <span style={styles.fieldLabel}>Full Legal Name</span>
            </div>
            <span style={styles.fieldVal}>{profile.fullName}</span>
          </div>

          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <Mail size={14} color="#64748B" />
              <span style={styles.fieldLabel}>Email Address</span>
            </div>
            <span style={styles.fieldVal}>{profile.email}</span>
          </div>

          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <Phone size={14} color="#64748B" />
              <span style={styles.fieldLabel}>Contact Number</span>
            </div>
            <span style={styles.fieldVal}>{profile.phone}</span>
          </div>
        </div>

        <div style={styles.fieldCol}>
          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <Calendar size={14} color="#64748B" />
              <span style={styles.fieldLabel}>Date of Birth</span>
            </div>
            <span style={styles.fieldVal}>{profile.dateOfBirth || '15 Aug 1988'}</span>
          </div>

          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <Heart size={14} color="#EF4444" />
              <span style={styles.fieldLabel}>Blood Group</span>
            </div>
            <span style={{ ...styles.fieldVal, color: '#B91C1C', fontWeight: 700 }}>
              {profile.bloodGroup || 'O+'}
            </span>
          </div>

          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <Phone size={14} color="#D97706" />
              <span style={styles.fieldLabel}>Emergency Contact</span>
            </div>
            <span style={styles.fieldVal}>{profile.emergencyContact || '+91 98765 43211'}</span>
          </div>
        </div>

        <div style={{ ...styles.fieldCol, gridColumn: 'span 2' }}>
          <div style={styles.fieldItem}>
            <div style={styles.fieldHeader}>
              <MapPin size={14} color="#64748B" />
              <span style={styles.fieldLabel}>Official Residential / Postal Address</span>
            </div>
            <span style={styles.fieldVal}>
              {profile.address || 'Plot No. 14, Human Rights Bhavan, Institutional Area, Lodhi Road'},{' '}
              {profile.city || 'New Delhi'}, {profile.state || 'Delhi'} - {profile.pincode || '110003'}
            </span>
          </div>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px 28px',
  },
  fieldCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
};
