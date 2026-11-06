import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Shield,
  BookOpen,
  Heart,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  X,
  IdCard,
  Award,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import memberHeroRally from '../../../assets/images/member-hero-rally.jpg';

export const MemberDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { member, fetchMember } = useCurrentMember();
  const [kitModalOpen, setKitModalOpen] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  // Executive KPI Stat Cards (Matching Image 2)
  const kpiStats = [
    {
      id: 'donations',
      value: `₹${(member.stats?.totalDonated || 18500).toLocaleString('en-IN')}`,
      label: 'Total Contributions (80G)',
      sub: '3 Receipts Issued • Tax Exempted',
      icon: Heart,
      iconBg: '#FFF9E6',
      iconColor: '#C9971A',
      action: () => navigate('/member/passbook'),
    },
    {
      id: 'causes',
      value: `${member.stats?.donationCount || 6} Causes`,
      label: 'Mission Campaigns Supported',
      sub: 'Active Aid • 2 Relief Drives',
      icon: TrendingUp,
      iconBg: '#EDF2F7',
      iconColor: '#06294D',
      action: () => navigate('/member/causes'),
    },
    {
      id: 'events',
      value: `${member.stats?.eventsAttended || 4} Events`,
      label: 'Rallies & Legal Camps Attended',
      sub: 'Upcoming: National Convention',
      icon: Calendar,
      iconBg: '#FFF9E6',
      iconColor: '#C9971A',
      action: () => navigate('/member/events'),
    },
    {
      id: 'tickets',
      value: `${member.stats?.activeTicketsCount ?? 0} Active`,
      label: `Grievance Tickets Filed (${member.stats?.ticketsCount || 2} Total)`,
      sub: '100% Resolution Rate • Legal Cell',
      icon: MessageSquare,
      iconBg: '#EDF2F7',
      iconColor: '#06294D',
      action: () => navigate('/member/support'),
    },
  ];

  // Member Services Hub Cards (Matching Image 2)
  const servicePrivileges = [
    {
      id: 'id-card',
      title: 'Digital ID Card',
      desc: 'Interactive 3D flip card with QR verification & print PDF',
      icon: IdCard,
      iconBg: '#06294D',
      iconColor: '#FAD465',
      action: () => navigate('/member/id-card'),
    },
    {
      id: 'certificate',
      title: 'Membership Certificate',
      desc: 'Download & verify official government-recognized credential',
      icon: Award,
      iconBg: '#FFF9E6',
      iconColor: '#C9971A',
      action: () => navigate('/member/certificate'),
    },
    {
      id: 'renew',
      title: 'Renewal Center',
      desc: 'Extend active validity & maintain continuous member seniority',
      icon: RefreshCw,
      iconBg: '#06294D',
      iconColor: '#FAD465',
      action: () => navigate('/member/renew'),
    },
    {
      id: 'rights',
      title: 'Know Your Rights Library',
      desc: 'Constitutional, civil & legal empowerment guides for citizens',
      icon: BookOpen,
      iconBg: '#FFF9E6',
      iconColor: '#C9971A',
      action: () => navigate('/member/rights'),
    },
    {
      id: 'support',
      title: 'Help & Support Grievance Desk',
      desc: 'Lodge human rights violation complaints with direct legal cell dispatch',
      icon: MessageSquare,
      iconBg: '#06294D',
      iconColor: '#FAD465',
      action: () => navigate('/member/support'),
    },
  ];

  // Official Bulletins (Matching Image 2)
  const bulletins = [
    {
      id: 'bulletin-1',
      tag: 'AGM',
      date: '1 Nov 2026',
      title: '44th Annual National Human Rights Convention in New Delhi',
      snippet:
        'All state and district accredited members are invited to attend the plenary session at Vigyan Bhawan on November 25, 2026.',
      action: () => navigate('/member/events'),
    },
    {
      id: 'bulletin-2',
      tag: 'LEGAL AID',
      date: '28 Oct 2026',
      title: 'State-Wide Legal Awareness Camp: Right to Free Legal Aid',
      snippet:
        'Over 450 underprivileged citizens assisted at the Rohini District Legal Services Camp organized by accredited HRSJM advocates.',
      action: () => navigate('/member/news'),
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. Executive Hero Section with 2-Column Desktop Grid (Matching Image 2) */}
      <section style={styles.heroSection}>
        <img
          src={memberHeroRally}
          alt="HRSJM Rally Texture"
          style={styles.heroBackground}
        />
        <div style={styles.heroOverlay} />

        <div className="member-hero-grid">
          {/* Left Column: Greeting, Credentials & CTA Actions */}
          <div style={styles.heroLeftCol}>
            {/* Capsule Badges */}
            <div style={styles.heroBadgesRow}>
              <span style={styles.badgeGold}>
                {member.categoryTitle || 'ANNUAL REGULAR MEMBER'}
              </span>
              <span style={styles.badgeGreen}>
                {member.status === 'ACTIVE' ? 'ACTIVE MEMBER' : member.status}
              </span>
            </div>

            {/* Main Greeting Heading */}
            <h1 style={styles.heroTitle}>
              Welcome back, {member.fullName || 'Adv. Rajeshwar Sharma'}
            </h1>

            {/* Member Affiliation Subtitle */}
            <p style={styles.heroSubtitle}>
              Member ID: <strong>{member.membershipNumber || 'HRSJM-MEM-2026-0842'}</strong> • Chapter:{' '}
              {member.chapter || 'National Capital Chapter, New Delhi'}
            </p>

            {/* Validity Pill */}
            <div style={styles.validityPill}>
              <Clock size={14} color="#FAD465" />
              <span>
                Validity: {member.validFrom || '2026-01-01'} to {member.validUpto || '2026-12-31'} (
                {member.daysRemaining || 56} days remaining)
              </span>
            </div>

            {/* Action Buttons Row */}
            <div style={styles.heroButtonsRow}>
              <button
                type="button"
                style={styles.btnPrimaryGold}
                onClick={() => navigate('/member/id-card')}
              >
                <IdCard size={15} color="#06294D" />
                <span>View My ID Card</span>
              </button>

              <button
                type="button"
                style={styles.btnOutlineWhite}
                onClick={() => navigate('/member/certificate')}
              >
                <Award size={15} color="#FFFFFF" />
                <span>Download Certificate</span>
              </button>

              <button
                type="button"
                style={styles.btnGhostGold}
                onClick={() => navigate('/member/renew')}
              >
                <RefreshCw size={14} color="#FAD465" />
                <span>Renewal Center</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Digital ID Card Preview Widget (Image 2) */}
          <div style={styles.heroRightCol}>
            <div
              style={styles.idCardWidget}
              onClick={() => navigate('/member/id-card')}
              role="button"
              tabIndex={0}
              title="Click to view full interactive 3D ID Card"
            >
              {/* Card Header with Verified Badge */}
              <div style={styles.idCardHeader}>
                <span style={styles.idCardLabel}>HRSJM DIGITAL ID</span>
                <span style={styles.idCardVerifiedBadge}>
                  <CheckCircle2 size={11} color="#FFFFFF" />
                  <span>VERIFIED</span>
                </span>
              </div>

              {/* Card Body with Avatar and Details */}
              <div style={styles.idCardBody}>
                <div style={styles.idCardAvatarWrap}>
                  <img
                    src={
                      member.avatarUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
                    }
                    alt={member.fullName}
                    style={styles.idCardAvatar}
                  />
                </div>

                <div style={styles.idCardMeta}>
                  <span style={styles.idCardName}>{member.fullName}</span>
                  <span style={styles.idCardNumber}>{member.membershipNumber}</span>
                  <span style={styles.idCardBlood}>Blood Group: {member.bloodGroup || 'O+'}</span>
                </div>
              </div>

              {/* Card Footer Link */}
              <div style={styles.idCardFooter}>
                <span>Click to view Front &amp; Back Flip Card</span>
                <ArrowRight size={13} color="#FAD465" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Row of 4 Executive KPI Stat Cards (Matching Image 2) */}
      <section style={styles.statsGrid}>
        {kpiStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              style={styles.statCard}
              onClick={stat.action}
              role="button"
              tabIndex={0}
            >
              <div style={styles.statCardTop}>
                <div
                  style={{
                    ...styles.statIconBadge,
                    backgroundColor: stat.iconBg,
                  }}
                >
                  <Icon size={20} color={stat.iconColor} />
                </div>
                <ChevronRight size={16} color="#CBD5E1" style={{ marginLeft: 'auto' }} />
              </div>

              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statSub}>{stat.sub}</div>
            </div>
          );
        })}
      </section>

      {/* 3. Physical Welcome Kit Status Banner */}
      <div style={styles.kitBanner}>
        <div style={styles.kitBannerLeft}>
          <div style={styles.kitBannerIcon}>
            <Shield size={18} color="#06294D" fill="#FAD465" />
          </div>
          <div>
            <div style={styles.kitBannerTitle}>
              Physical Welcome Kit: In Preparation / Dispatch Pending (Speed Post)
            </div>
            <div style={styles.kitBannerSub}>
              Includes embossed smart PVC card, framed certificate, official brass lapel pin &amp; handbook
            </div>
          </div>
        </div>

        <button
          type="button"
          style={styles.kitBannerBtn}
          onClick={() => setKitModalOpen(true)}
        >
          <span>Track Kit Dispatch Details</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 4. Two-Column Main Content Section (Matching Image 2) */}
      <div style={styles.mainContentGrid}>
        {/* Left Column: Member Services Hub (7/12 cols) */}
        <div style={styles.leftMainCol}>
          <div style={styles.sectionHeaderWrap}>
            <h2 style={styles.sectionHeading}>Member Services Hub</h2>
            <p style={styles.sectionSubHeading}>
              Quick access to your official member privileges and credentials
            </p>
          </div>

          <div style={styles.servicesList}>
            {servicePrivileges.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  style={styles.serviceItemCard}
                  onClick={item.action}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    style={{
                      ...styles.serviceIconWrap,
                      backgroundColor: item.iconBg,
                    }}
                  >
                    <Icon size={18} color={item.iconColor} />
                  </div>

                  <div style={styles.serviceTextCol}>
                    <div style={styles.serviceTitle}>{item.title}</div>
                    <div style={styles.serviceDesc}>{item.desc}</div>
                  </div>

                  <ChevronRight size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Official Bulletins & Upcoming Event (5/12 cols) */}
        <div style={styles.rightMainCol}>
          <div style={styles.sectionHeaderWrap}>
            <h2 style={styles.sectionHeading}>Official Bulletins</h2>
            <p style={styles.sectionSubHeading}>
              State &amp; national headquarters updates
            </p>
          </div>

          <div style={styles.bulletinsList}>
            {bulletins.map((item) => (
              <div
                key={item.id}
                style={styles.bulletinCard}
                onClick={item.action}
                role="button"
                tabIndex={0}
              >
                <div style={styles.bulletinMetaRow}>
                  <span style={styles.bulletinTag}>{item.tag}</span>
                  <span style={styles.bulletinDate}>{item.date}</span>
                </div>
                <h4 style={styles.bulletinTitle}>{item.title}</h4>
                <p style={styles.bulletinSnippet}>{item.snippet}</p>
                <div style={styles.bulletinLink}>
                  <span>Read Details</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Event Featured Card */}
          <div style={styles.upcomingFeaturedCard}>
            <div style={styles.upcomingHeaderRow}>
              <div style={styles.eventDateBlock}>
                <span style={styles.eventMonthText}>NOV</span>
                <span style={styles.eventDayText}>25</span>
              </div>
              <div>
                <span style={styles.eventCategoryTag}>NATIONAL CONVENTION</span>
                <h4 style={styles.featuredEventTitle}>
                  44th Annual National Human Rights Convention &amp; Plenary
                </h4>
              </div>
            </div>

            <div style={styles.eventMetaRow}>
              <MapPin size={14} color="#64748B" />
              <span>Vigyan Bhawan, Rajpath Area, New Delhi • 10:00 AM</span>
            </div>

            <button
              type="button"
              style={styles.registerEventBtn}
              onClick={() => navigate('/member/events')}
            >
              <span>Register to Attend</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Physical Welcome Kit Tracking Modal */}
      {kitModalOpen && (
        <div style={styles.modalBackdrop} onClick={() => setKitModalOpen(false)}>
          <div
            style={styles.kitModalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleRow}>
                <Package size={22} color="#FAD465" />
                <h3 style={styles.modalTitle}>Physical Welcome Kit Status</h3>
              </div>
              <button
                type="button"
                style={styles.modalCloseBtn}
                onClick={() => setKitModalOpen(false)}
                aria-label="Close Modal"
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.kitSummaryBox}>
                <div style={styles.kitMemberName}>{member.fullName}</div>
                <div style={styles.kitMemberNo}>Member ID: {member.membershipNumber}</div>
                <div style={styles.kitChapter}>Chapter: {member.chapter}</div>
              </div>

              {/* Kit Contents List */}
              <div style={styles.kitIncludes}>
                <h5 style={styles.kitIncludesTitle}>Package Contents:</h5>
                <ul style={styles.kitIncludesList}>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Embossed PVC Smart ID Card with Hologram &amp; QR Code</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Gold-Embossed Membership Certificate &amp; Accreditation Letter</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Official HRSJM Brass Lapel Pin &amp; Member Badge</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>National Human Rights Handbook &amp; Constitution Primer</span>
                  </li>
                </ul>
              </div>

              {/* Dispatch Timeline */}
              <div style={styles.timelineSection}>
                <h5 style={styles.timelineTitle}>Fulfillment Timeline</h5>
                <div style={styles.timelineSteps}>
                  <div style={styles.timelineStepDone}>
                    <div style={styles.stepDotDone}>
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    </div>
                    <div style={styles.stepInfo}>
                      <div style={styles.stepTitle}>Application Approved &amp; Accreditated</div>
                      <div style={styles.stepDate}>Completed • New Delhi HQ</div>
                    </div>
                  </div>

                  <div style={styles.timelineStepDone}>
                    <div style={styles.stepDotDone}>
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    </div>
                    <div style={styles.stepInfo}>
                      <div style={styles.stepTitle}>PVC Card Embossed &amp; Hologram Stamped</div>
                      <div style={styles.stepDate}>Completed • Security Card Cell</div>
                    </div>
                  </div>

                  <div style={styles.timelineStepActive}>
                    <div style={styles.stepDotActive}>
                      <Clock size={14} color="#FFFFFF" />
                    </div>
                    <div style={styles.stepInfo}>
                      <div style={styles.stepTitleActive}>Package Boxing &amp; Speed Post Manifest</div>
                      <div style={styles.stepDate}>In Progress • Expected Dispatch Nov 12</div>
                    </div>
                  </div>

                  <div style={styles.timelineStepPending}>
                    <div style={styles.stepDotPending}>
                      <Truck size={14} color="#94A3B8" />
                    </div>
                    <div style={styles.stepInfo}>
                      <div style={styles.stepTitlePending}>Speed Post Transit (India Post)</div>
                      <div style={styles.stepDate}>Awaiting Consignment Tracking #</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dispatch Address */}
              <div style={styles.dispatchAddressBox}>
                <div style={styles.addressLabel}>Delivery Address:</div>
                <div style={styles.addressValue}>
                  {member.address
                    ? `${member.address.line}, ${member.address.city}, ${member.address.state} - ${member.address.pincode}`
                    : 'Sector 14, Rohini, New Delhi, Delhi - 110085'}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.modalCloseFooterBtn}
                onClick={() => setKitModalOpen(false)}
              >
                Close Status
              </button>
              <button
                type="button"
                style={styles.modalSupportBtn}
                onClick={() => {
                  setKitModalOpen(false);
                  navigate('/member/support');
                }}
              >
                <span>Support Inquiry</span>
                <ExternalLink size={13} />
              </button>
            </div>
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
    width: '100%',
  },
  /* Hero Banner matching Image 2 */
  heroSection: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#06294D',
    boxShadow: '0 8px 24px rgba(1, 31, 57, 0.16)',
  },
  heroBackground: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.18,
    pointerEvents: 'none',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(6, 41, 77, 0.97) 0%, rgba(1, 31, 57, 0.92) 55%, rgba(6, 41, 77, 0.88) 100%)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'relative',
    zIndex: 1,
    padding: '32px 36px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '32px',
    alignItems: 'center',
  },
  heroLeftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
  },
  heroBadgesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badgeGold: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '999px',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  badgeGreen: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '999px',
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  heroTitle: {
    margin: 0,
    color: '#FFFFFF',
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: 'var(--font-display, Playfair Display, serif)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    margin: 0,
    color: '#DBE5EE',
    fontSize: '13.5px',
    lineHeight: 1.4,
  },
  validityPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    borderRadius: '8px',
    padding: '6px 14px',
    color: '#FFFFFF',
    fontSize: '12.5px',
    marginTop: '2px',
  },
  heroButtonsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  btnPrimaryGold: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FAD465',
    color: '#06294D',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.3)',
    transition: 'all 0.15s ease',
  },
  btnOutlineWhite: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnGhostGold: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: '#FAD465',
    border: 'none',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  /* Right Column: ID Card Preview Widget */
  heroRightCol: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  idCardWidget: {
    backgroundColor: 'rgba(1, 31, 57, 0.75)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(250, 212, 101, 0.35)',
    borderRadius: '14px',
    padding: '16px 20px',
    minWidth: '320px',
    maxWidth: '360px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
  },
  idCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  idCardLabel: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#DBE5EE',
  },
  idCardVerifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  idCardBody: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  idCardAvatarWrap: {
    width: '54px',
    height: '54px',
    borderRadius: '10px',
    padding: '1.5px',
    backgroundColor: '#FAD465',
    flexShrink: 0,
    overflow: 'hidden',
  },
  idCardAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  idCardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  idCardName: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  idCardNumber: {
    color: '#FAD465',
    fontSize: '11.5px',
    fontWeight: 600,
  },
  idCardBlood: {
    color: '#94A3B8',
    fontSize: '11px',
  },
  idCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#DBE5EE',
    fontSize: '11.5px',
    fontWeight: 500,
  },

  /* 2. 4-Column KPI Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #DCE4EC',
    padding: '18px 20px',
    boxShadow: '0 2px 6px rgba(1, 31, 57, 0.04)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  statCardTop: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statIconBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1, "cv05" 1, "cv11" 1',
    color: '#06294D',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#34516D',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '11.5px',
    color: '#718096',
  },

  /* 3. Welcome Kit Status Banner */
  kitBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #DCE4EC',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    boxShadow: '0 2px 6px rgba(1, 31, 57, 0.03)',
  },
  kitBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  kitBannerIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#FFF9E6',
    border: '1px solid #FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kitBannerTitle: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#06294D',
  },
  kitBannerSub: {
    fontSize: '12px',
    color: '#64748B',
  },
  kitBannerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FAF7F0',
    color: '#06294D',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  },

  /* 4. Two-Column Main Grid */
  mainContentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  leftMainCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  rightMainCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sectionHeaderWrap: {
    marginBottom: '2px',
  },
  sectionHeading: {
    margin: 0,
    fontSize: '19px',
    fontWeight: 700,
    fontFamily: 'var(--font-display, Playfair Display, serif)',
    color: '#06294D',
  },
  sectionSubHeading: {
    margin: '3px 0 0',
    fontSize: '12.5px',
    color: '#718096',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  serviceItemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '14px 18px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(1, 31, 57, 0.02)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  serviceIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  serviceTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#06294D',
  },
  serviceDesc: {
    fontSize: '12px',
    color: '#64748B',
    lineHeight: 1.35,
  },

  /* Bulletins & Events */
  bulletinsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bulletinCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(1, 31, 57, 0.02)',
    transition: 'transform 0.15s ease',
  },
  bulletinMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  bulletinTag: {
    fontSize: '10px',
    fontWeight: 700,
    backgroundColor: '#EDF2F7',
    color: '#06294D',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  },
  bulletinDate: {
    fontSize: '11px',
    color: '#94A3B8',
  },
  bulletinTitle: {
    margin: '0 0 4px',
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#06294D',
    lineHeight: 1.3,
  },
  bulletinSnippet: {
    margin: '0 0 8px',
    fontSize: '12px',
    color: '#64748B',
    lineHeight: 1.4,
  },
  bulletinLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#06294D',
  },
  upcomingFeaturedCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(1, 31, 57, 0.02)',
  },
  upcomingHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  eventDateBlock: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventMonthText: {
    fontSize: '9.5px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: '#FAD465',
    textTransform: 'uppercase',
    lineHeight: 1,
  },
  eventDayText: {
    fontSize: '16px',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  eventCategoryTag: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    color: '#D97706',
    letterSpacing: '0.04em',
    marginBottom: '2px',
  },
  featuredEventTitle: {
    margin: 0,
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#06294D',
    lineHeight: 1.25,
  },
  eventMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11.5px',
    color: '#64748B',
    marginBottom: '12px',
  },
  registerEventBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  /* 5. Modal */
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  },
  kitModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '540px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(1, 31, 57, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #DCE4EC',
    backgroundColor: '#06294D',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
  modalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    padding: '4px',
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  kitSummaryBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  kitMemberName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#06294D',
  },
  kitMemberNo: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
  kitChapter: {
    fontSize: '11.5px',
    color: '#718096',
    marginTop: '2px',
  },
  kitIncludes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kitIncludesTitle: {
    margin: 0,
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#06294D',
  },
  kitIncludesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12.5px',
    color: '#34516D',
  },
  timelineSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  timelineTitle: {
    margin: 0,
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#06294D',
  },
  timelineSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingLeft: '6px',
  },
  timelineStepDone: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  stepDotDone: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#16A34A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepTitle: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#06294D',
  },
  stepDate: {
    fontSize: '11px',
    color: '#718096',
  },
  timelineStepActive: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  stepDotActive: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#D97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepTitleActive: {
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#D97706',
  },
  timelineStepPending: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  stepDotPending: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepTitlePending: {
    fontSize: '12.5px',
    color: '#94A3B8',
  },
  dispatchAddressBox: {
    backgroundColor: '#EDF2F7',
    borderRadius: '8px',
    padding: '10px 14px',
  },
  addressLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    marginBottom: '2px',
  },
  addressValue: {
    fontSize: '12px',
    color: '#34516D',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '14px 20px',
    borderTop: '1px solid #DCE4EC',
    backgroundColor: '#FAF7F0',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  },
  modalCloseFooterBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSupportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
