import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import { MemberFlipCard } from '../components/MemberFlipCard';
import {
  downloadMemberCardPdf,
  printMemberCardHtml,
} from '../utils/memberDocumentGenerator';

export const MemberIdCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { member } = useCurrentMember();

  return (
    <div style={styles.container}>
      {/* Top Header / Back Bar */}
      <div style={styles.topBar}>
        <button
          type="button"
          onClick={() => navigate('/member/dashboard')}
          style={styles.backBtn}
        >
          <ArrowLeft size={16} color="#06294D" />
          <span>Back to Member Dashboard</span>
        </button>

        <div style={styles.topActions}>
          <button
            type="button"
            onClick={() => printMemberCardHtml(member)}
            style={styles.outlineBtn}
          >
            <Printer size={15} color="#06294D" />
            <span>Print PVC Badge</span>
          </button>

          <button
            type="button"
            onClick={() => downloadMemberCardPdf(member)}
            style={styles.primaryBtn}
          >
            <Download size={15} color="#06294D" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={styles.layout}>
        {/* Left Side: Interactive 3D Flip Card */}
        <div style={styles.cardPreviewWrap}>
          <div style={styles.badgeHeader}>
            <span style={styles.badgeLabel}>Digital Member Identity Card</span>
            <div
              style={{
                ...styles.activePill,
                backgroundColor: member.isExpired ? '#FDEEEF' : member.isExpiringSoon ? '#FEF6E7' : '#EAF7EE',
                color: member.isExpired ? '#DC2626' : member.isExpiringSoon ? '#D97706' : '#16A34A',
              }}
            >
              {member.isExpired ? (
                <AlertTriangle size={12} color="#DC2626" />
              ) : (
                <CheckCircle2 size={12} color="#16A34A" />
              )}
              <span>{member.status}</span>
            </div>
          </div>

          <MemberFlipCard member={member} interactive={true} />

          <p style={styles.flipHelpText}>
            💡 Click directly on the card or use the button above to flip between Front and Back views.
          </p>
        </div>

        {/* Right Side: Security Specs & Card Details */}
        <div style={styles.specsWrap}>
          {/* Card Overview Specs */}
          <div style={styles.infoCard}>
            <div style={styles.cardSectionTitleRow}>
              <ShieldCheck size={18} color="#06294D" />
              <h2 style={styles.cardSectionTitle}>Accredited Member Credentials</h2>
            </div>

            <div style={styles.specGrid}>
              <div style={styles.specItem}>
                <span style={styles.specLabel}>Full Legal Name</span>
                <span style={styles.specVal}>{member.fullName}</span>
              </div>

              <div style={styles.specItem}>
                <span style={styles.specLabel}>Member ID Number</span>
                <span style={{ ...styles.specVal, color: '#06294D', fontWeight: 800 }}>
                  {member.membershipNumber}
                </span>
              </div>

              <div style={styles.specItem}>
                <span style={styles.specLabel}>Membership Tier</span>
                <span style={{ ...styles.specVal, color: '#C9971A', fontWeight: 700 }}>
                  {member.categoryTitle}
                </span>
              </div>

              <div style={styles.specItem}>
                <span style={styles.specLabel}>Blood Group</span>
                <span style={{ ...styles.specVal, color: '#DC2626', fontWeight: 700 }}>
                  {member.bloodGroup || 'O+'}
                </span>
              </div>

              <div style={styles.specItem}>
                <span style={styles.specLabel}>Induction Date</span>
                <span style={styles.specVal}>{member.joiningDate}</span>
              </div>

              <div style={styles.specItem}>
                <span style={styles.specLabel}>Valid Upto</span>
                <span style={{ ...styles.specVal, color: member.isExpired ? '#DC2626' : '#06294D' }}>
                  {member.validUpto}
                </span>
              </div>

              <div style={{ ...styles.specItem, gridColumn: 'span 2' }}>
                <span style={styles.specLabel}>Accredited Chapter / Jurisdiction</span>
                <span style={styles.specVal}>{member.chapter}</span>
              </div>
            </div>
          </div>

          {/* Verification & Security Notice */}
          <div style={styles.infoCard}>
            <div style={styles.cardSectionTitleRow}>
              <QrCode size={18} color="#06294D" />
              <h2 style={styles.cardSectionTitle}>Digital QR Verification Protocol</h2>
            </div>

            <p style={styles.qrDescText}>
              Every HRSJM digital card features an encrypted, tamper-evident cryptographic QR code. When scanned by government authorities, event marshals, or the public, it resolves securely to our central ledger at:
            </p>

            <div style={styles.urlBox}>
              <span style={styles.urlText}>{member.qrVerificationUrl}</span>
            </div>

            <div style={styles.securityBulletList}>
              <div style={styles.bulletRow}>
                <FileCheck size={14} color="#16A34A" />
                <span>Protected against digital forgery with centralized database verification.</span>
              </div>
              <div style={styles.bulletRow}>
                <FileCheck size={14} color="#16A34A" />
                <span>Displays real-time membership active/inactive/expired status on scan.</span>
              </div>
              <div style={styles.bulletRow}>
                <FileCheck size={14} color="#16A34A" />
                <span>Includes national emergency helpline and legal counsel dispatch contacts.</span>
              </div>
            </div>
          </div>

          {/* Fast Actions */}
          <div style={styles.actionCardRow}>
            <button
              type="button"
              style={styles.actionSecondaryBtn}
              onClick={() => navigate('/member/certificate')}
            >
              <span>View Official Certificate</span>
            </button>

            <button
              type="button"
              style={styles.actionRenewalBtn}
              onClick={() => navigate('/member/renew')}
            >
              <RefreshCw size={15} />
              <span>Renew / Extend Membership</span>
            </button>
          </div>
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#06294D',
    cursor: 'pointer',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  outlineBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#06294D',
    cursor: 'pointer',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FAD465',
    border: '1px solid #E9B82E',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#06294D',
    cursor: 'pointer',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(340px, 460px) 1fr',
    gap: '32px',
    alignItems: 'start',
  },
  cardPreviewWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #DCE4EC',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },
  badgeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  activePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  flipHelpText: {
    fontSize: '12px',
    color: '#718096',
    textAlign: 'center',
    margin: '4px 0 0 0',
  },
  specsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    padding: '24px',
    border: '1px solid #DCE4EC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  cardSectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #EDF2F7',
    paddingBottom: '14px',
    marginBottom: '16px',
  },
  cardSectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  specGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  specLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  specVal: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  qrDescText: {
    fontSize: '13px',
    color: '#4A5568',
    lineHeight: 1.55,
    margin: '0 0 12px 0',
  },
  urlBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '16px',
    overflowX: 'auto',
  },
  urlText: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#06294D',
    fontWeight: 600,
  },
  securityBulletList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bulletRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '12.5px',
    color: '#34516D',
    lineHeight: 1.45,
  },
  actionCardRow: {
    display: 'flex',
    gap: '14px',
  },
  actionSecondaryBtn: {
    flex: 1,
    padding: '12px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '10px',
    color: '#06294D',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
  },
  actionRenewalBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 18px',
    backgroundColor: '#06294D',
    border: 'none',
    borderRadius: '10px',
    color: '#FAD465',
    fontSize: '13.5px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
