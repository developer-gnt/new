import React, { useState } from 'react';
import { RefreshCw, Printer, ShieldCheck, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import type { AdminProfile } from '../types/profile.types';
import { generateQrMatrix } from '../utils/qrGenerator';
import { profileService } from '../services/profileService';
import { HrsjmLogo } from '@/components/common/HrsjmLogo';

interface IdCardSvgPreviewProps {
  profile: AdminProfile;
  interactive?: boolean;
}

export const IdCardSvgPreview: React.FC<IdCardSvgPreviewProps> = ({
  profile,
  interactive = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const qrMatrix = React.useMemo(() => generateQrMatrix(profile.memberId || 'HRSJM-00001', 25), [profile.memberId]);

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    profileService.printIdCard(profile);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Action Bar */}
      {interactive && (
        <div style={styles.actionBar}>
          <div style={styles.cardSideBadge}>
            <span style={styles.badgeIndicator} />
            {isFlipped ? 'Back Side: Terms & Seal' : 'Front Side: Identification'}
          </div>

          <div style={styles.actionsGroup}>
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              style={styles.actionBtn}
              title="Flip Card"
            >
              <RefreshCw size={15} color="#06294D" />
              <span>Flip Card ({isFlipped ? 'Show Front' : 'Show Back'})</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{ ...styles.actionBtn, backgroundColor: '#06294D', color: '#FFFFFF', borderColor: '#06294D' }}
              title="Print or Save PDF"
            >
              <Printer size={15} color="#FAD465" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Card 3D Flip Perspective Container */}
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
                <HrsjmLogo size="sm" variant="light" showWordmark={false} showIcon={true} />
                <div style={styles.brandTitles}>
                  <div style={styles.trustNameEn}>Human Rights &  Social Justice Mission</div>
                  <div style={styles.trustNameHi}>मानव अधिकार · सामाजिक न्याय संरक्षण ट्रस्ट</div>
                  <div style={styles.trustRegd}>Regd No. HR/0092/2019 · Central Secretariat</div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={styles.frontStatusPill}>
                <CheckCircle2 size={11} color="#10B981" />
                <span>{profile.accountStatus.toUpperCase()}</span>
              </div>
            </div>

            {/* Gold Ribbon Divider */}
            <div style={styles.goldDivider} />

            {/* Front Card Body */}
            <div style={styles.frontBody}>
              {/* Photo & Role Section */}
              <div style={styles.topProfileSection}>
                <div style={styles.photoContainer}>
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      style={styles.photoImg}
                    />
                  ) : (
                    <div style={styles.photoFallback}>
                      <span style={styles.fallbackInitials}>
                        {(profile.fullName || 'AD').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div style={styles.photoGoldBorder} />
                </div>

                <div style={styles.profileHeading}>
                  <div style={styles.personName}>{profile.fullName}</div>
                  <div style={styles.personRole}>{profile.role}</div>
                  <div style={styles.personDesignation}>
                    {profile.designation || 'National Executive Committee'}
                  </div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.gridCol}>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Member ID</span>
                    <span style={{ ...styles.metaVal, color: '#FAD465', fontWeight: 700 }}>
                      {profile.memberId}
                    </span>
                  </div>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Date of Birth</span>
                    <span style={styles.metaVal}>{profile.dateOfBirth || '15 Aug 1988'}</span>
                  </div>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Issue Date</span>
                    <span style={styles.metaVal}>{profile.issueDate || '12 Oct 2024'}</span>
                  </div>
                </div>

                <div style={styles.gridCol}>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Admin Badge</span>
                    <span style={styles.metaVal}>{profile.adminId}</span>
                  </div>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Blood Group</span>
                    <span style={{ ...styles.metaVal, color: '#EF4444', fontWeight: 700 }}>
                      {profile.bloodGroup || 'O+'}
                    </span>
                  </div>
                  <div style={styles.gridItem}>
                    <span style={styles.metaLabel}>Valid Till</span>
                    <span style={{ ...styles.metaVal, color: '#FAD465', fontWeight: 700 }}>
                      {profile.validTill || '31 Dec 2027'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Scannable QR & Verification Strip */}
              <div style={styles.bottomQrStrip}>
                <div style={styles.qrBlock}>
                  {/* Vector SVG Scannable QR */}
                  <svg
                    viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                    width={56}
                    height={56}
                    style={styles.qrSvg}
                  >
                    <rect width="100%" height="100%" fill="#FFFFFF" rx="2" />
                    {qrMatrix.map((row, r) =>
                      row.map((val, c) =>
                        val ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width={1}
                            height={1}
                            fill="#011F39"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>

                <div style={styles.verificationTextWrap}>
                  <div style={styles.verifyTitle}>SECURE DIGITAL IDENTITY</div>
                  <div style={styles.verifySub}>Scan with any scanner to verify official credential</div>
                  <div style={styles.authorityNote}>Authorized by Central Governing Council</div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════ BACK SIDE ════════════════ */}
          <div style={{ ...styles.cardFace, ...styles.cardBack }}>
            {/* Top Back Header */}
            <div style={styles.backHeader}>
              <div style={styles.backHeaderTitle}>TERMS & IDENTITY GOVERNANCE</div>
              <div style={styles.backHeaderSub}>HRSJM Central Administrative Protocol</div>
            </div>

            {/* Back Card Body */}
            <div style={styles.backBody}>
              <div style={styles.termsBox}>
                <ul style={styles.termsList}>
                  <li>This credential certifies the holder as an accredited administrative officer of HRSJM.</li>
                  <li>The card remains the exclusive property of Human Rights &  Social Justice Mission.</li>
                  <li>Unauthorized reproduction, duplication, or tampering is strictly prohibited by law.</li>
                  <li>In case of loss or damage, report immediately to the Central Secretariat.</li>
                </ul>
              </div>

              {/* Emergency & Address Block */}
              <div style={styles.backContactBlock}>
                <div style={styles.contactRow}>
                  <MapPin size={13} color="#06294D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>
                    <strong>Secretariat:</strong> {profile.address || 'Human Rights Bhavan, Lodhi Road'},{' '}
                    {profile.city || 'New Delhi'} - {profile.pincode || '110003'}
                  </span>
                </div>
                <div style={styles.contactRow}>
                  <Phone size={13} color="#06294D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>
                    <strong>Emergency:</strong> {profile.emergencyContact || '+91 98765 43211'} ·{' '}
                    <strong>Helpline:</strong> +91 11 2345 6789
                  </span>
                </div>
              </div>

              {/* Signatures & Seal Area */}
              <div style={styles.signatureArea}>
                <div style={styles.sigCol}>
                  <div style={styles.sigLine} />
                  <div style={styles.sigName}>{profile.fullName}</div>
                  <div style={styles.sigRole}>Holder Signature</div>
                </div>

                {/* Golden Trust Seal */}
                <div style={styles.goldSeal}>
                  <div style={styles.sealInnerRing}>
                    <ShieldCheck size={18} color="#C9971A" />
                    <span style={styles.sealText}>TRUST SEAL</span>
                  </div>
                </div>

                <div style={styles.sigCol}>
                  <div style={styles.sigLine} />
                  <div style={styles.sigName}>National Registrar</div>
                  <div style={styles.sigRole}>Authorized Signatory</div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div style={styles.backFooterBar}>
                <span>Registration No. HR/0092/2019 · Valid Across India</span>
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
  },
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '380px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  cardSideBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#06294D',
    backgroundColor: '#EEF2F6',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  badgeIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#059669',
  },
  actionsGroup: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    color: '#06294D',
    transition: 'all 0.2s',
  },
  cardPerspective: {
    perspective: '1200px',
    width: '360px',
    height: '540px',
    maxWidth: '100%',
  },
  cardFlipper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(1, 31, 57, 0.22), 0 2px 6px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    border: '1.5px solid rgba(250, 212, 101, 0.4)',
  },
  cardFront: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
  },
  frontHeader: {
    backgroundColor: '#011F39',
    padding: '14px 14px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
  headerBrandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandTitles: {
    display: 'flex',
    flexDirection: 'column',
  },
  trustNameEn: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#FFFFFF',
    letterSpacing: '0.4px',
    lineHeight: 1.2,
  },
  trustNameHi: {
    fontSize: '9.5px',
    fontWeight: 600,
    color: '#FAD465',
    lineHeight: 1.2,
    marginTop: '2px',
  },
  trustRegd: {
    fontSize: '7.5px',
    color: '#94A3B8',
    marginTop: '1px',
  },
  frontStatusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid #10B981',
    color: '#10B981',
    fontSize: '8.5px',
    fontWeight: 800,
    padding: '3px 7px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  goldDivider: {
    height: '3px',
    background: 'linear-gradient(90deg, #FAD465 0%, #E9B82E 50%, #C9971A 100%)',
    width: '100%',
  },
  frontBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#06294D',
  },
  topProfileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  photoContainer: {
    position: 'relative',
    width: '84px',
    height: '96px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#0F2D4A',
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2D4A',
  },
  fallbackInitials: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#FAD465',
  },
  photoGoldBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '10px',
    border: '2px solid #FAD465',
    pointerEvents: 'none',
  },
  profileHeading: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  personName: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.25,
    marginBottom: '3px',
    letterSpacing: '0.2px',
  },
  personRole: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#FAD465',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  personDesignation: {
    fontSize: '10px',
    color: '#DBE5EE',
    lineHeight: 1.3,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px 12px',
    backgroundColor: 'rgba(1, 31, 57, 0.6)',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(250, 212, 101, 0.2)',
    marginBottom: '14px',
  },
  gridCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: '9.5px',
    color: '#94A3B8',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  metaVal: {
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginTop: '1px',
  },
  bottomQrStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#011F39',
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1px solid rgba(250, 212, 101, 0.25)',
  },
  qrBlock: {
    backgroundColor: '#FFFFFF',
    padding: '3px',
    borderRadius: '6px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrSvg: {
    display: 'block',
    borderRadius: '2px',
  },
  verificationTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  verifyTitle: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#FAD465',
    letterSpacing: '0.4px',
  },
  verifySub: {
    fontSize: '8.5px',
    color: '#CBD5E1',
    lineHeight: 1.3,
    marginTop: '1px',
  },
  authorityNote: {
    fontSize: '7.5px',
    color: '#94A3B8',
    marginTop: '2px',
  },
  // BACK FACE STYLES
  cardBack: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    transform: 'rotateY(180deg)',
  },
  backHeader: {
    backgroundColor: '#011F39',
    padding: '12px 14px',
    textAlign: 'center',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    borderBottom: '3px solid #FAD465',
  },
  backHeaderTitle: {
    fontSize: '12px',
    fontWeight: 800,
    color: '#FFFFFF',
    letterSpacing: '0.5px',
  },
  backHeaderSub: {
    fontSize: '9px',
    color: '#FAD465',
    marginTop: '2px',
    fontWeight: 500,
  },
  backBody: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  termsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '10px 12px',
    border: '1px solid #E2E8F0',
  },
  termsList: {
    margin: 0,
    paddingLeft: '16px',
    fontSize: '9.5px',
    color: '#334155',
    lineHeight: 1.45,
  },
  backContactBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backgroundColor: '#EEF2F6',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '9.5px',
    color: '#334155',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    lineHeight: 1.35,
  },
  signatureArea: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: '8px',
    borderTop: '1px dashed #CBD5E1',
  },
  sigCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90px',
  },
  sigLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#94A3B8',
    marginBottom: '4px',
  },
  sigName: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#06294D',
    textAlign: 'center',
  },
  sigRole: {
    fontSize: '8px',
    color: '#64748B',
    textAlign: 'center',
  },
  goldSeal: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: '2px double #C9971A',
    backgroundColor: '#FAF5EA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(201, 151, 26, 0.25)',
  },
  sealInnerRing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: '6.5px',
    fontWeight: 800,
    color: '#C9971A',
    letterSpacing: '0.5px',
    marginTop: '1px',
  },
  backFooterBar: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '8px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
};
