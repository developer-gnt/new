import React, { useState } from 'react';
import {
  RefreshCw,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Shield,
  Phone,
  MapPin,
} from 'lucide-react';
import type { MemberProfile } from '../types/member.types';
import { generateQrMatrix } from '../../profile/utils/qrGenerator';
import {
  downloadMemberCardPdf,
  printMemberCardHtml,
} from '../utils/memberDocumentGenerator';
import { HrsjmLogo } from '../../../components/common/HrsjmLogo';

interface MemberFlipCardProps {
  member: MemberProfile;
  interactive?: boolean;
}

export const MemberFlipCard: React.FC<MemberFlipCardProps> = ({
  member,
  interactive = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate deterministic scannable QR Matrix
  const qrMatrix = React.useMemo(
    () => generateQrMatrix(member.qrVerificationUrl || member.membershipNumber, 25),
    [member.qrVerificationUrl, member.membershipNumber]
  );

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    printMemberCardHtml(member);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMemberCardPdf(member);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Control Action Bar */}
      {interactive && (
        <div style={styles.actionBar}>
          <div style={styles.cardSideBadge}>
            <span style={styles.badgeDot} />
            <span>{isFlipped ? 'Back Face: Terms & QR Verification' : 'Front Face: Identification'}</span>
          </div>

          <div style={styles.actionsRow}>
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              style={styles.actionBtnOutline}
              title="Flip Card View"
            >
              <RefreshCw size={14} color="#06294D" />
              <span>Flip Card ({isFlipped ? 'Show Front' : 'Show Back'})</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={styles.actionBtnOutline}
              title="Print Card"
            >
              <Printer size={14} color="#06294D" />
              <span>Print Badge</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={styles.actionBtnSolid}
              title="Download CR80 PDF"
            >
              <Download size={14} color="#06294D" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Flip Perspective Container */}
      <div
        style={{
          ...styles.cardPerspective,
          cursor: interactive ? 'pointer' : 'default',
        }}
        onClick={() => interactive && setIsFlipped((prev) => !prev)}
        title={interactive ? 'Click to flip card' : undefined}
      >
        <div
          style={{
            ...styles.cardFlipper,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ════════════════ FRONT SIDE ════════════════ */}
          <div style={{ ...styles.cardFace, ...styles.cardFront }}>
            {/* Top Navy Header Banner */}
            <div style={styles.frontHeader}>
              <div style={styles.headerBrandRow}>
                <HrsjmLogo size="sm" variant="light" showWordmark={false} />
                <div style={styles.brandTitles}>
                  <div style={styles.trustNameEn}>HUMAN RIGHTS & SOCIAL JUSTICE MISSION</div>
                  <div style={styles.trustNameHi}>मानव अधिकार एवं सामाजिक न्याय संरक्षण मिशन</div>
                  <div style={styles.trustRegd}>Regd. Under Societies Registration Act XXI of 1860</div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  ...styles.frontStatusPill,
                  backgroundColor: member.isExpired ? '#FDEEEF' : '#EAF7EE',
                  color: member.isExpired ? '#DC2626' : '#16A34A',
                }}
              >
                {member.isExpired ? (
                  <AlertTriangle size={11} color="#DC2626" />
                ) : (
                  <CheckCircle2 size={11} color="#16A34A" />
                )}
                <span>{member.status}</span>
              </div>
            </div>

            {/* Gold Ribbon Divider */}
            <div style={styles.goldDivider} />

            {/* Front Card Body */}
            <div style={styles.frontBody}>
              <div style={styles.profileSection}>
                <div style={styles.avatarContainer}>
                  <img
                    src={member.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                    alt={member.fullName}
                    style={styles.avatarImg}
                  />
                  <div style={styles.avatarBadge}>
                    <Shield size={12} color="#06294D" />
                  </div>
                </div>

                <div style={styles.memberTitles}>
                  <h3 style={styles.fullName}>{member.fullName}</h3>
                  <div style={styles.membershipNumberPill}>
                    <span>ID: {member.membershipNumber}</span>
                  </div>
                  <div style={styles.designationText}>{member.designation}</div>
                </div>
              </div>

              {/* Information Grid */}
              <div style={styles.infoGrid}>
                <div style={styles.infoCol}>
                  <div style={styles.infoLabel}>CATEGORY</div>
                  <div style={styles.infoVal}>{member.categoryTitle}</div>
                </div>
                <div style={styles.infoCol}>
                  <div style={styles.infoLabel}>BLOOD GROUP</div>
                  <div style={styles.infoValRed}>{member.bloodGroup || 'O+'}</div>
                </div>
                <div style={styles.infoCol}>
                  <div style={styles.infoLabel}>VALID FROM</div>
                  <div style={styles.infoVal}>{member.validFrom}</div>
                </div>
                <div style={styles.infoCol}>
                  <div style={styles.infoLabel}>VALID UPTO</div>
                  <div style={styles.infoValGold}>{member.validUpto}</div>
                </div>
                <div style={{ ...styles.infoCol, gridColumn: 'span 2' }}>
                  <div style={styles.infoLabel}>ACCREDITED CHAPTER</div>
                  <div style={styles.infoValChapter}>{member.chapter}</div>
                </div>
              </div>
            </div>

            {/* Front Card Footer */}
            <div style={styles.frontFooter}>
              <div style={styles.footerNote}>OFFICIAL ACCREDITED IDENTITY CARD • NOT TRANSFERABLE</div>
              <div style={styles.hologramSeal}>★ VERIFIED ★</div>
            </div>
          </div>

          {/* ════════════════ BACK SIDE ════════════════ */}
          <div style={{ ...styles.cardFace, ...styles.cardBack }}>
            {/* Back Header */}
            <div style={styles.backHeader}>
              <div style={styles.backHeaderTitle}>CENTRAL REGISTRY & VERIFICATION</div>
              <div style={styles.backHeaderSub}>National Secretariat, New Delhi, India</div>
            </div>

            {/* Back Body */}
            <div style={styles.backBody}>
              {/* QR Code & Scanning Block */}
              <div style={styles.qrBlock}>
                <div style={styles.qrContainer}>
                  <svg width="105" height="105" viewBox="0 0 25 25" style={{ display: 'block' }}>
                    <rect width="25" height="25" fill="#FFFFFF" />
                    {qrMatrix.map((row, r) =>
                      row.map((filled, c) =>
                        filled ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#06294D" /> : null
                      )
                    )}
                  </svg>
                </div>
                <div style={styles.qrLabel}>
                  <QrCode size={12} color="#06294D" />
                  <span>Scan to verify accreditation</span>
                </div>
              </div>

              {/* Terms & Emergency Contact */}
              <div style={styles.termsBlock}>
                <div style={styles.termsTitle}>AUTHORIZATION & RULES</div>
                <ul style={styles.termsList}>
                  <li>This card certifies active membership in HRSJM.</li>
                  <li>Entitles holder to represent community welfare causes.</li>
                  <li>Must be presented upon request during mission activities.</li>
                </ul>

                <div style={styles.contactCard}>
                  <div style={styles.contactItem}>
                    <Phone size={11} color="#C9971A" />
                    <span>Helpline: +91 11 2345 6789</span>
                  </div>
                  <div style={styles.contactItem}>
                    <MapPin size={11} color="#C9971A" />
                    <span>New Delhi - 110001, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatory Footer */}
            <div style={styles.backFooter}>
              <div style={styles.sigBox}>
                <div style={styles.sigLine} />
                <div style={styles.sigTitle}>National President</div>
                <div style={styles.sigOrg}>HRSJM Governing Council</div>
              </div>

              <div style={styles.backOfficialSeal}>
                <div style={styles.sealCrestText}>HRSJM</div>
                <div style={styles.sealStars}>★★★★★</div>
              </div>

              <div style={styles.sigBox}>
                <div style={styles.sigLine} />
                <div style={styles.sigTitle}>General Secretary</div>
                <div style={styles.sigOrg}>Human Rights Mission</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '440px',
    margin: '0 auto',
  },
  actionBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardSideBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E9B82E',
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionBtnOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#06294D',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  actionBtnSolid: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#FAD465',
    border: '1px solid #E9B82E',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#06294D',
    cursor: 'pointer',
  },
  cardPerspective: {
    perspective: '1200px',
    width: '100%',
    maxWidth: '420px',
    height: '600px',
    userSelect: 'none',
  },
  cardFlipper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '18px',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    boxShadow: '0 12px 36px rgba(1, 31, 57, 0.22)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  cardFront: {
    backgroundColor: '#06294D',
    border: '2px solid rgba(250, 212, 101, 0.4)',
    color: '#FFFFFF',
  },
  frontHeader: {
    backgroundColor: '#011F39',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  headerBrandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandTitles: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  trustNameEn: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '0.03em',
  },
  trustNameHi: {
    fontSize: '9.5px',
    color: '#FAD465',
    fontWeight: 600,
    marginTop: '2px',
  },
  trustRegd: {
    fontSize: '8px',
    color: '#A0AEC0',
    marginTop: '2px',
  },
  frontStatusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '999px',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  goldDivider: {
    height: '3px',
    background: 'linear-gradient(90deg, #C9971A 0%, #FAD465 50%, #C9971A 100%)',
    width: '100%',
  },
  frontBody: {
    padding: '20px 20px 16px 20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '20px',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: '84px',
    height: '84px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '2.5px solid #FAD465',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: '-6px',
    right: '-6px',
    backgroundColor: '#FAD465',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  memberTitles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fullName: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#FFFFFF',
    fontFamily: '"Playfair Display", Georgia, serif',
    margin: 0,
    lineHeight: 1.25,
  },
  membershipNumberPill: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(250, 212, 101, 0.18)',
    border: '1px solid rgba(250, 212, 101, 0.4)',
    color: '#FAD465',
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  },
  designationText: {
    fontSize: '11.5px',
    color: '#DCE4EC',
    fontWeight: 500,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '14px',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  infoLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#FAD465',
    letterSpacing: '0.06em',
  },
  infoVal: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  infoValRed: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#F87171',
  },
  infoValGold: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#FAD465',
  },
  infoValChapter: {
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#EDF2F7',
    lineHeight: 1.3,
  },
  frontFooter: {
    backgroundColor: '#011F39',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerNote: {
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#DCE4EC',
  },
  hologramSeal: {
    fontSize: '8px',
    fontWeight: 800,
    color: '#FAD465',
    letterSpacing: '0.06em',
  },
  cardBack: {
    backgroundColor: '#FAF7F0',
    border: '2px solid #C9971A',
    color: '#06294D',
    transform: 'rotateY(180deg)',
  },
  backHeader: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    padding: '14px 16px',
    textAlign: 'center',
    borderBottom: '2px solid #FAD465',
  },
  backHeaderTitle: {
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: '#FAD465',
  },
  backHeaderSub: {
    fontSize: '9.5px',
    color: '#EDF2F7',
    marginTop: '2px',
  },
  backBody: {
    padding: '18px 20px',
    display: 'flex',
    gap: '16px',
    flex: 1,
  },
  qrBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  qrContainer: {
    padding: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1.5px solid #DCE4EC',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  qrLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '9px',
    color: '#06294D',
    fontWeight: 700,
    textAlign: 'center',
    maxWidth: '110px',
  },
  termsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  termsTitle: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#06294D',
    letterSpacing: '0.04em',
  },
  termsList: {
    margin: 0,
    paddingLeft: '14px',
    fontSize: '10.5px',
    color: '#34516D',
    lineHeight: 1.45,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contactCard: {
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: '#34516D',
    fontWeight: 500,
  },
  backFooter: {
    backgroundColor: '#EDF2F7',
    padding: '14px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: '1px solid #DCE4EC',
  },
  sigBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '110px',
  },
  sigLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#718096',
    marginBottom: '4px',
  },
  sigTitle: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: '#06294D',
  },
  sigOrg: {
    fontSize: '7.5px',
    color: '#718096',
  },
  backOfficialSeal: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#FEF6E7',
    border: '1.5px dashed #C9971A',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCrestText: {
    fontSize: '8px',
    fontWeight: 900,
    color: '#C9971A',
  },
  sealStars: {
    fontSize: '5.5px',
    color: '#C9971A',
    marginTop: '-1px',
  },
};
