import type React from 'react';
import { useState } from 'react';
import {
  Shield,
  Bell,
  Lock,
  Smartphone,
  Eye,
  CheckCircle2,
  Save,
  KeyRound,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import { authService } from '@/features/auth/services/authService';

export const MemberSettingsPage: React.FC = () => {
  const { member } = useCurrentMember();

  const [activeTab, setActiveTab] = useState<'SECURITY' | 'NOTIFICATIONS' | 'PRIVACY'>('SECURITY');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [urgentDirectives, setUrgentDirectives] = useState(true);

  // Privacy toggles
  const [directoryVisibility, setDirectoryVisibility] = useState(true);
  const [maskPhone, setMaskPhone] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordError('');
      await authService.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessToast('Account password updated securely on server.');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password. Please check your current password.');
    }
  };

  const handleSavePreferences = () => {
    setSuccessToast('Preferences saved successfully.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {successToast && (
        <div style={styles.toast}>
          <CheckCircle2 size={18} color="#FFFFFF" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>ACCOUNT & PREFERENCES</div>
          <h1 style={styles.heroTitle}>Settings & Security</h1>
          <p style={styles.heroSub}>
            Manage your credentials, 2-factor authentication, communication channels,
            and member directory privacy settings.
          </p>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.securityPill}>
            <Shield size={16} color="#16A34A" />
            <span>Account Protected (256-Bit SSL)</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={styles.tabsCard}>
        <button
          type="button"
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'SECURITY' ? styles.tabBtnActive : {}),
          }}
          onClick={() => setActiveTab('SECURITY')}
        >
          <Lock size={15} />
          <span>Password & Security</span>
        </button>
        <button
          type="button"
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'NOTIFICATIONS' ? styles.tabBtnActive : {}),
          }}
          onClick={() => setActiveTab('NOTIFICATIONS')}
        >
          <Bell size={15} />
          <span>Notification Channels</span>
        </button>
        <button
          type="button"
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'PRIVACY' ? styles.tabBtnActive : {}),
          }}
          onClick={() => setActiveTab('PRIVACY')}
        >
          <Eye size={15} />
          <span>Directory & Privacy</span>
        </button>
      </div>

      {/* Tab 1: Password & Security */}
      {activeTab === 'SECURITY' && (
        <div style={styles.tabContentCard}>
          <div style={styles.cardHeader}>
            <KeyRound size={22} color="#06294D" />
            <div>
              <h3 style={styles.cardTitle}>Change Account Password</h3>
              <p style={styles.cardSub}>Ensure your password contains letters, digits, and special characters</p>
            </div>
          </div>

          {passwordError && (
            <div style={styles.errorBox}>
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current account password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn}>
                <Save size={15} />
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Active Sessions */}
          <div style={styles.sessionsBox}>
            <h4 style={styles.sessionsTitle}>Active Authorized Sessions</h4>
            <div style={styles.sessionItem}>
              <Smartphone size={20} color="#06294D" />
              <div>
                <div style={styles.sessionDevice}>Current Web Browser Session (Vite / Chrome)</div>
                <div style={styles.sessionMeta}>IP: 194.164.151.17 • Delhi NCR, India • Active Now</div>
              </div>
              <span style={styles.activeTag}>This Device</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notification Channels */}
      {activeTab === 'NOTIFICATIONS' && (
        <div style={styles.tabContentCard}>
          <div style={styles.cardHeader}>
            <Bell size={22} color="#06294D" />
            <div>
              <h3 style={styles.cardTitle}>Communication & Alert Preferences</h3>
              <p style={styles.cardSub}>Control how national headquarters delivers urgent notices and event passes</p>
            </div>
          </div>

          <div style={styles.togglesList}>
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>SMS Urgent Dispatch Alerts</div>
                <div style={styles.toggleSub}>Receive SMS text messages for emergency aid calls and welcome kit courier dispatch.</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>WhatsApp Official Channel Notifications</div>
                <div style={styles.toggleSub}>Direct WhatsApp delivery for 80G tax receipt PDF and convention entry passes.</div>
              </div>
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>Monthly Human Rights Journal & Digest</div>
                <div style={styles.toggleSub}>Email newsletter summarizing key Supreme Court rulings and HRSJM interventions.</div>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>State Executive Directives</div>
                <div style={styles.toggleSub}>Notices requiring chapter member voting or attendance at state plenary sessions.</div>
              </div>
              <input
                type="checkbox"
                checked={urgentDirectives}
                onChange={(e) => setUrgentDirectives(e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.saveBtn}
              onClick={handleSavePreferences}
            >
              <Save size={15} />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Directory & Privacy */}
      {activeTab === 'PRIVACY' && (
        <div style={styles.tabContentCard}>
          <div style={styles.cardHeader}>
            <Eye size={22} color="#06294D" />
            <div>
              <h3 style={styles.cardTitle}>Directory & Member Privacy</h3>
              <p style={styles.cardSub}>Manage your public listing in the national verified member registry</p>
            </div>
          </div>

          <div style={styles.togglesList}>
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>Show in Public Verified Members Directory</div>
                <div style={styles.toggleSub}>
                  Allows courts, NGOs, and police stations to verify your active credential via QR scan or member directory.
                </div>
              </div>
              <input
                type="checkbox"
                checked={directoryVisibility}
                onChange={(e) => setDirectoryVisibility(e.target.checked)}
                style={styles.checkbox}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>Mask Contact Phone Number</div>
                <div style={styles.toggleSub}>
                  Displays phone as +91 •••••••{member.phone.slice(-3)} on digital verification pages for privacy.
                </div>
              </div>
              <input
                type="checkbox"
                checked={maskPhone}
                onChange={(e) => setMaskPhone(e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          </div>

          <div style={styles.memberKycSummary}>
            <div style={styles.kycSummaryTitle}>Member Identity Record:</div>
            <div style={styles.kycRow}>
              <span>Accreditation ID: <strong>{member.membershipNumber}</strong></span>
              <span>Chapter: <strong>{member.chapter}</strong></span>
              <span>Blood Group: <strong>{member.bloodGroup}</strong></span>
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.saveBtn}
              onClick={handleSavePreferences}
            >
              <Save size={15} />
              <span>Save Privacy Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '36px',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    padding: '12px 20px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 90,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13.5px',
    fontWeight: 600,
  },
  heroBanner: {
    backgroundColor: '#06294D',
    borderRadius: '16px',
    padding: '28px 32px',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 6px 20px rgba(1, 31, 57, 0.15)',
  },
  heroLeft: {
    flex: 1,
    minWidth: '320px',
  },
  heroBadge: {
    display: 'inline-block',
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#FAD465',
    backgroundColor: 'rgba(250, 212, 101, 0.15)',
    padding: '3px 10px',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  heroTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '26px',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  heroSub: {
    fontSize: '13px',
    color: '#DCE4EC',
    lineHeight: 1.5,
    margin: 0,
    maxWidth: '650px',
  },
  heroRight: {
    display: 'flex',
  },
  securityPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#EDF2F7',
  },

  /* Tabs */
  tabsCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '8px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
  },

  /* Card */
  tabContentCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '16px',
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '14px',
  },
  cardTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '18px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  cardSub: {
    margin: '2px 0 0',
    fontSize: '12.5px',
    color: '#64748B',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    color: '#DC2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  label: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FAF7F0',
    fontSize: '13px',
    color: '#1E293B',
    outline: 'none',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: '8px',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  /* Sessions */
  sessionsBox: {
    marginTop: '10px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sessionsTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  sessionDevice: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F172A',
  },
  sessionMeta: {
    fontSize: '11.5px',
    color: '#64748B',
    marginTop: '2px',
  },
  activeTag: {
    marginLeft: 'auto',
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#16A34A',
    backgroundColor: '#EAF7EE',
    padding: '3px 8px',
    borderRadius: '4px',
  },

  /* Toggles */
  togglesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    paddingBottom: '14px',
    borderBottom: '1px solid #F1F5F9',
  },
  toggleTitle: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  toggleSub: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
    maxWidth: '560px',
    lineHeight: 1.4,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#06294D',
    flexShrink: 0,
  },

  /* KYC Summary */
  memberKycSummary: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kycSummaryTitle: {
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  kycRow: {
    display: 'flex',
    gap: '20px',
    fontSize: '12px',
    color: '#475569',
    flexWrap: 'wrap',
  },
};
