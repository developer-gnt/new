import React, { useState } from 'react';
import { X, ShieldCheck, Briefcase, Building, Award } from 'lucide-react';
import type { AccountStatus, AdminDetailsInput, AdminProfile } from '../types/profile.types';
import { ADMIN_ROLES } from '../data/profileFixtures';

interface EditAdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile;
  onSave: (data: AdminDetailsInput) => void;
}

export const EditAdminDetailsModal: React.FC<EditAdminDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<AdminDetailsInput>({
    role: profile.role || 'Super Admin',
    accountStatus: profile.accountStatus || 'Active',
    designation: profile.designation || '',
    department: profile.department || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <ShieldCheck size={18} color="#06294D" />
            <h3 style={styles.headerTitle}>Edit Administrative Details</h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.body}>
            {/* Role Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Administrative Role *</label>
              <div style={styles.inputWrap}>
                <Briefcase size={16} color="#94A3B8" style={styles.inputIcon} />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.select}
                >
                  {ADMIN_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official Designation */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Official Designation</label>
              <div style={styles.inputWrap}>
                <Award size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. National General Secretary & Trustee"
                />
              </div>
            </div>

            {/* Executive Department */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Executive Department / Council</label>
              <div style={styles.inputWrap}>
                <Building size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. Central Executive Committee"
                />
              </div>
            </div>

            {/* Account Status */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Account Status *</label>
              <div style={styles.statusOptions}>
                {(['Active', 'Inactive', 'Suspended'] as AccountStatus[]).map((status) => {
                  const isSelected = formData.accountStatus === status;
                  return (
                    <label
                      key={status}
                      style={{
                        ...styles.statusRadioLabel,
                        backgroundColor: isSelected ? '#F0FDF4' : '#F8FAFC',
                        borderColor: isSelected ? '#10B981' : '#CBD5E1',
                      }}
                    >
                      <input
                        type="radio"
                        name="accountStatus"
                        value={status}
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, accountStatus: status })}
                        style={{ accentColor: '#10B981' }}
                      />
                      <span
                        style={{
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#065F46' : '#334155',
                          fontSize: '13px',
                        }}
                      >
                        {status}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Update Governance
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
    maxWidth: '520px',
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
    padding: '10px 12px 10px 38px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13.5px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13.5px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  statusOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  statusRadioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
