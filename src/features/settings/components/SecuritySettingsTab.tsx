import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, KeyRound, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import type { SecuritySettings } from '../types/settings.types';

interface SecuritySettingsTabProps {
  security: SecuritySettings;
  onUpdate: (sec: Partial<SecuritySettings>) => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({
  security,
  onUpdate,
}) => {
  const navigate = useNavigate();

  const toggleItem = (key: keyof SecuritySettings) => {
    onUpdate({ [key]: !security[key] });
  };

  return (
    <div style={styles.container}>
      {/* Session & Authentication Security */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>
            <ShieldCheck size={18} color="#06294D" />
          </div>
          <div>
            <h3 style={styles.cardTitle}>Administrator Authentication & Access Governance</h3>
            <p style={styles.cardSubtitle}>
              Two-factor enforcement, idle session timeouts, and brute-force defenses.
            </p>
          </div>
        </div>

        <div style={styles.list}>
          {/* 2FA Toggle */}
          <div style={styles.itemRow}>
            <div style={styles.itemLeft}>
              <div style={styles.itemIconBadge}>
                <Shield size={16} color="#06294D" />
              </div>
              <div>
                <span style={styles.itemTitle}>Enforce Two-Factor Authentication (2FA)</span>
                <p style={styles.itemDesc}>Mandate OTP code verification upon every administrator login session.</p>
              </div>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={() => toggleItem('twoFactorAuth')}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  ...styles.slider,
                  backgroundColor: security.twoFactorAuth ? '#06294D' : '#CBD5E1',
                }}
              >
                <span
                  style={{
                    ...styles.knob,
                    transform: security.twoFactorAuth ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </span>
            </label>
          </div>

          <div style={styles.divider} />

          {/* Session Timeout */}
          <div style={styles.itemRow}>
            <div style={styles.itemLeft}>
              <div style={styles.itemIconBadge}>
                <Clock size={16} color="#06294D" />
              </div>
              <div>
                <span style={styles.itemTitle}>Idle Session Auto-Logout Timeout</span>
                <p style={styles.itemDesc}>Automatically lock inactive sessions to protect sensitive human rights case files.</p>
              </div>
            </div>

            <select
              value={security.sessionTimeoutMinutes}
              onChange={(e) => onUpdate({ sessionTimeoutMinutes: Number(e.target.value) })}
              style={styles.select}
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={240}>240 Minutes (4 Hours)</option>
            </select>
          </div>

          <div style={styles.divider} />

          {/* Strong Password */}
          <div style={styles.itemRow}>
            <div style={styles.itemLeft}>
              <div style={styles.itemIconBadge}>
                <Lock size={16} color="#06294D" />
              </div>
              <div>
                <span style={styles.itemTitle}>Enforce Complex Password Policy</span>
                <p style={styles.itemDesc}>Require alphanumeric combinations, uppercase chars and symbols.</p>
              </div>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={security.enforceStrongPassword}
                onChange={() => toggleItem('enforceStrongPassword')}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  ...styles.slider,
                  backgroundColor: security.enforceStrongPassword ? '#06294D' : '#CBD5E1',
                }}
              >
                <span
                  style={{
                    ...styles.knob,
                    transform: security.enforceStrongPassword ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </span>
            </label>
          </div>

          <div style={styles.divider} />

          {/* Audit Logging */}
          <div style={styles.itemRow}>
            <div style={styles.itemLeft}>
              <div style={styles.itemIconBadge}>
                <ShieldCheck size={16} color="#06294D" />
              </div>
              <div>
                <span style={styles.itemTitle}>Central Administrative Audit Trail</span>
                <p style={styles.itemDesc}>Log all record modifications, voucher creations, and approval actions.</p>
              </div>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={security.auditLoggingEnabled}
                onChange={() => toggleItem('auditLoggingEnabled')}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  ...styles.slider,
                  backgroundColor: security.auditLoggingEnabled ? '#06294D' : '#CBD5E1',
                }}
              >
                <span
                  style={{
                    ...styles.knob,
                    transform: security.auditLoggingEnabled ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Password Management Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>
            <KeyRound size={18} color="#06294D" />
          </div>
          <div>
            <h3 style={styles.cardTitle}>Administrator Credentials & Password</h3>
            <p style={styles.cardSubtitle}>
              Update your account credentials, security questions, or biometric unlock.
            </p>
          </div>
        </div>

        <div style={styles.actionRow}>
          <div style={styles.actionPrompt}>
            <strong>Need to rotate your administrator password?</strong>
            <p style={styles.actionPromptSub}>
              Password updates are managed inside your central profile & credentials dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/profile')}
            style={styles.profileBtn}
          >
            <span>Open Profile & Security</span>
            <ExternalLink size={14} color="#011F39" />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: '1px solid #F1F5F9',
    marginBottom: '16px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#EEF2F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#64748B',
    margin: '3px 0 0 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    gap: '16px',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  itemIconBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0F172A',
    display: 'block',
  },
  itemDesc: {
    fontSize: '12px',
    color: '#64748B',
    margin: '2px 0 0 0',
  },
  divider: {
    height: '1px',
    backgroundColor: '#F1F5F9',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '42px',
    height: '24px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    transition: '0.2s',
  },
  knob: {
    position: 'absolute',
    height: '18px',
    width: '18px',
    left: '3px',
    bottom: '3px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    transition: '0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    backgroundColor: '#F8FAFC',
    padding: '16px 20px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  actionPrompt: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  actionPromptSub: {
    fontSize: '12px',
    color: '#64748B',
    margin: 0,
  },
  profileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
  },
};
