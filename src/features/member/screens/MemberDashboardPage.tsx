import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Star,
  Shield,
  BookOpen,
  FileText,
  Users,
  Heart,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  X,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import memberHeroRally from '../../../assets/images/member-hero-rally.jpg';

export const MemberDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { member, fetchMember } = useCurrentMember();
  const [kitModalOpen, setKitModalOpen] = useState(false);

  useEffect(() => {
    // Attempt background sync if online
    fetchMember();
  }, [fetchMember]);

  // Quick Action navigation
  const quickActions = [
    {
      title: 'Know Your Rights',
      icon: BookOpen,
      action: () => navigate('/member/rights'),
      description: 'Explore legal and civil protection guides',
    },
    {
      title: 'File a Complaint',
      icon: FileText,
      action: () => navigate('/member/support'),
      description: 'Submit human rights grievance for action',
    },
    {
      title: 'Events',
      icon: Calendar,
      action: () => navigate('/member/events'),
      description: 'Upcoming conventions & legal awareness camps',
    },
  ];

  // Impact metrics
  const impactMetrics = [
    {
      value: member.stats.eventsAttended.toString(),
      label: 'Events\nAttended',
      icon: Users,
      action: () => navigate('/member/events'),
    },
    {
      value: member.stats.donationCount.toString(),
      label: 'Causes\nSupported',
      icon: Heart,
      action: () => navigate('/member/causes'),
    },
    {
      value: member.stats.ticketsCount.toString(),
      label: 'Complaint\nSubmitted',
      icon: FileText,
      action: () => navigate('/member/support'),
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. Hero Banner with Rally Crowd Image Overlay (Exact to Image 5) */}
      <section style={styles.heroSection}>
        {/* Background Image */}
        <img
          src={memberHeroRally}
          alt="HRSJM Member Movement"
          style={styles.heroImage}
        />
        {/* Dark Navy Overlay */}
        <div style={styles.heroOverlay} />

        {/* Hero Text Content */}
        <div style={styles.heroContent}>
          <span style={styles.heroGreeting}>Welcome,</span>
          <h1 style={styles.heroName}>{member.fullName}</h1>
          <p style={styles.heroDescription}>
            Thank you for being a valued member of HRSJM. Together, we work for a fairer,
            more just and equal society.
          </p>

          <div style={styles.memberSinceChip}>
            <Calendar size={14} color="#FFFFFF" />
            <span>Member Since | {member.validFrom || '04 Nov 2026'}</span>
          </div>
        </div>
      </section>

      {/* 2. Status Bars Group (Active Member & Welcome Kit Dispatch) */}
      <div style={styles.statusCardsWrap}>
        {/* Active Member Status Card */}
        <div
          style={styles.statusCard}
          onClick={() => navigate('/member/id-card')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.statusCardLeft}>
            <div style={styles.starBadgeGold}>
              <Star size={18} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <div style={styles.statusTextCol}>
              <span style={styles.statusTitle}>
                {member.status === 'ACTIVE' ? 'Active Member' : 'Member Status'}
              </span>
              <span style={styles.statusSub}>
                {member.categoryTitle || 'Individual Member'}
              </span>
            </div>
          </div>

          <button
            type="button"
            style={styles.actionBtnOutline}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/member/id-card');
            }}
          >
            <span>View Membership</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Physical Welcome Kit Dispatch Status Card */}
        <div
          style={styles.statusCard}
          onClick={() => setKitModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          <div style={styles.statusCardLeft}>
            <div style={styles.kitBadgeSquare}>
              <Shield size={16} color="#06294D" fill="#FAD465" />
            </div>
            <div style={styles.statusTextCol}>
              <span style={styles.statusTitle}>Physical Welcome Kit</span>
              <span style={styles.statusSub}>
                In Preparation / Dispatch Pending (Speed Post)
              </span>
            </div>
          </div>

          <button
            type="button"
            style={styles.actionBtnLink}
            onClick={(e) => {
              e.stopPropagation();
              setKitModalOpen(true);
            }}
          >
            <span>View Kit</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 3. Row of 3 Quick Action Cards (Know Your Rights, File a Complaint, Events) */}
      <div style={styles.quickActionsGrid}>
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={styles.quickActionCard}
              onClick={item.action}
              role="button"
              tabIndex={0}
            >
              <div style={styles.quickActionIconCircle}>
                <Icon size={24} color="#0B2F52" />
              </div>
              <h3 style={styles.quickActionTitle}>{item.title}</h3>
            </div>
          );
        })}
      </div>

      {/* 4. "Your Impact" Section with Circular Icon Badges */}
      <section style={styles.impactCard}>
        <div style={styles.impactHeader}>
          <h2 style={styles.impactSectionTitle}>Your Impact</h2>
          <span style={styles.impactSub}>Your contribution towards human dignity and legal empowerment</span>
        </div>

        <div style={styles.impactMetricsRow}>
          {impactMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={styles.impactMetricCol}
                onClick={item.action}
                role="button"
                tabIndex={0}
              >
                <div style={styles.impactIconCircle}>
                  <Icon size={22} color="#06294D" />
                </div>
                <div style={styles.impactValue}>{item.value}</div>
                <div style={styles.impactLabel}>{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Upcoming Events & Mission Drives Preview */}
      <section style={styles.upcomingSection}>
        <div style={styles.upcomingHeader}>
          <div>
            <h2 style={styles.sectionHeading}>Upcoming Events & Drives</h2>
            <p style={styles.sectionSub}>Accredited legal camps and human rights workshops</p>
          </div>
          <button
            type="button"
            style={styles.viewAllBtn}
            onClick={() => navigate('/member/events')}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={styles.eventsGrid}>
          {/* Featured Event Card */}
          <div style={styles.eventCard}>
            <div style={styles.eventDateBadge}>
              <span style={styles.eventDateDay}>25</span>
              <span style={styles.eventDateMonth}>Nov</span>
            </div>

            <div style={styles.eventDetails}>
              <div style={styles.eventBadgeRow}>
                <span style={styles.eventCategoryTag}>CONVENTION</span>
                <span style={styles.eventFormatTag}>In Person</span>
              </div>
              <h4 style={styles.eventTitle}>
                44th Annual National Human Rights Convention & Plenary Assembly
              </h4>
              <div style={styles.eventLocationRow}>
                <MapPin size={14} color="#64748B" />
                <span>Vigyan Bhawan, Rajpath Area, New Delhi</span>
              </div>
            </div>

            <button
              type="button"
              style={styles.eventRegisterBtn}
              onClick={() => navigate('/member/events')}
            >
              <span>Register Now</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Second Event Card */}
          <div style={styles.eventCard}>
            <div style={styles.eventDateBadge}>
              <span style={styles.eventDateDay}>12</span>
              <span style={styles.eventDateMonth}>Dec</span>
            </div>

            <div style={styles.eventDetails}>
              <div style={styles.eventBadgeRow}>
                <span style={styles.eventCategoryTag}>LEGAL AID CAMP</span>
                <span style={styles.eventFormatTag}>Community Drive</span>
              </div>
              <h4 style={styles.eventTitle}>
                Free Legal Literacy & Citizens' Rights Outreach Camp
              </h4>
              <div style={styles.eventLocationRow}>
                <MapPin size={14} color="#64748B" />
                <span>Town Hall Plaza, Sector 17, Chandigarh</span>
              </div>
            </div>

            <button
              type="button"
              style={styles.eventRegisterBtn}
              onClick={() => navigate('/member/events')}
            >
              <span>Register Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Recommendations & Quick Links */}
      <div style={styles.recommendationsRow}>
        <div
          style={styles.recCard}
          onClick={() => navigate('/member/causes')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.recIconWrap}>
            <Heart size={20} color="#06294D" />
          </div>
          <div style={styles.recContent}>
            <h4 style={styles.recTitle}>Make a Difference Today</h4>
            <p style={styles.recDesc}>
              Support legal defense funds and medical rehabilitation causes. Eligible for 80G tax rebate.
            </p>
            <div style={styles.recLink}>
              <span>Support a Cause</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        <div
          style={styles.recCard}
          onClick={() => navigate('/member/rights')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.recIconWrap}>
            <BookOpen size={20} color="#06294D" />
          </div>
          <div style={styles.recContent}>
            <h4 style={styles.recTitle}>Know Your Constitutional Rights</h4>
            <p style={styles.recDesc}>
              Practical guides on FIR filing, arrest procedures, consumer protection, and RTI applications.
            </p>
            <div style={styles.recLink}>
              <span>Explore Guides</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Physical Welcome Kit Tracking Modal */}
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
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.kitSummaryBox}>
                <div style={styles.kitMemberName}>{member.fullName}</div>
                <div style={styles.kitMemberNo}>ID: {member.membershipNumber}</div>
                <div style={styles.kitChapter}>Chapter: {member.chapter}</div>
              </div>

              {/* Kit Contents List */}
              <div style={styles.kitIncludes}>
                <h5 style={styles.kitIncludesTitle}>Kit Package Contents:</h5>
                <ul style={styles.kitIncludesList}>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Embossed PVC Smart ID Card with Hologram & QR Code</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Gold-Embossed Membership Certificate & Accreditation Letter</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>Official HRSJM Brass Lapel Pin & Member Badge</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>National Human Rights Handbook & Constitution Primer</span>
                  </li>
                </ul>
              </div>

              {/* Step Timeline */}
              <div style={styles.timeline}>
                <div style={styles.timelineStep}>
                  <div style={styles.stepDotCompleted}>
                    <CheckCircle2 size={14} color="#FFFFFF" />
                  </div>
                  <div style={styles.stepInfo}>
                    <div style={styles.stepTitle}>Application Approved & Credentials Encoded</div>
                    <div style={styles.stepSub}>Completed on {member.validFrom}</div>
                  </div>
                </div>

                <div style={styles.timelineLineCompleted} />

                <div style={styles.timelineStep}>
                  <div style={styles.stepDotCompleted}>
                    <CheckCircle2 size={14} color="#FFFFFF" />
                  </div>
                  <div style={styles.stepInfo}>
                    <div style={styles.stepTitle}>Certificate & Smart Card Printed</div>
                    <div style={styles.stepSub}>Verified by National Executive Secretariat</div>
                  </div>
                </div>

                <div style={styles.timelineLineCompleted} />

                <div style={styles.timelineStep}>
                  <div style={styles.stepDotActive}>
                    <Clock size={14} color="#0B2F52" />
                  </div>
                  <div style={styles.stepInfo}>
                    <div style={{ ...styles.stepTitle, color: '#D97706' }}>
                      Dispatch Pending / In Preparation
                    </div>
                    <div style={styles.stepSub}>
                      Tracking Number: <strong>SP729104829IN</strong> (Speed Post)
                    </div>
                  </div>
                </div>

                <div style={styles.timelineLinePending} />

                <div style={styles.timelineStep}>
                  <div style={styles.stepDotPending}>
                    <Truck size={14} color="#94A3B8" />
                  </div>
                  <div style={styles.stepInfo}>
                    <div style={styles.stepTitlePending}>Doorstep Delivery</div>
                    <div style={styles.stepSub}>Estimated delivery within 4-7 business days</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.modalClosePrimaryBtn}
                onClick={() => setKitModalOpen(false)}
              >
                <span>Close</span>
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
    gap: '20px',
    paddingBottom: '32px',
  },
  /* Hero Section */
  heroSection: {
    position: 'relative',
    height: '240px',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: '#011F39',
    boxShadow: '0 8px 24px rgba(1, 31, 57, 0.18)',
    display: 'flex',
    alignItems: 'center',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(105deg, rgba(1, 31, 57, 0.94) 0%, rgba(1, 31, 57, 0.82) 48%, rgba(6, 41, 77, 0.58) 100%)',
    zIndex: 2,
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    padding: '28px 36px',
    maxWidth: '750px',
    display: 'flex',
    flexDirection: 'column',
  },
  heroGreeting: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  heroName: {
    color: '#FAD465',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.25,
    margin: '4px 0 8px 0',
    letterSpacing: '-0.01em',
  },
  heroDescription: {
    color: '#FFFFFF',
    fontSize: '13px',
    lineHeight: 1.5,
    opacity: 0.95,
    margin: '0 0 14px 0',
    maxWidth: '650px',
  },
  memberSinceChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 500,
    opacity: 0.95,
  },

  /* Status Cards */
  statusCardsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #DCE4EC',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.16s ease',
  },
  statusCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  starBadgeGold: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#F59E0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
  },
  kitBadgeSquare: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FCD34D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  statusTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  statusSub: {
    fontSize: '12.5px',
    color: '#64748B',
    marginTop: '2px',
  },
  actionBtnOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0B2F52',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  actionBtnLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'none',
    border: 'none',
    color: '#0B2F52',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  /* 3 Quick Action Cards */
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  quickActionIconCircle: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#FEFCE8',
    border: '1.5px solid #FCD34D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  quickActionTitle: {
    margin: 0,
    fontSize: '14.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },

  /* Your Impact Card */
  impactCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '16px',
    padding: '24px 28px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  impactHeader: {
    marginBottom: '20px',
  },
  impactSectionTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '0 0 4px 0',
  },
  impactSub: {
    fontSize: '13px',
    color: '#64748B',
  },
  impactMetricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    textAlign: 'center',
  },
  impactMetricCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '12px',
    transition: 'background-color 0.15s ease',
  },
  impactIconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#FEFCE8',
    border: '1.5px solid #FCD34D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  impactValue: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.2,
  },
  impactLabel: {
    fontSize: '12.5px',
    color: '#64748B',
    marginTop: '4px',
    whiteSpace: 'pre-line',
    lineHeight: 1.3,
  },

  /* Upcoming Events */
  upcomingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  upcomingHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '19px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '0 0 2px 0',
  },
  sectionSub: {
    fontSize: '12.5px',
    color: '#64748B',
    margin: 0,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#0B2F52',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '16px',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  eventDateBadge: {
    width: '50px',
    height: '56px',
    borderRadius: '10px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventDateDay: {
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 1,
    color: '#FAD465',
  },
  eventDateMonth: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  eventDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  eventBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  eventCategoryTag: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#0B2F52',
    backgroundColor: '#FEF3C7',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  eventFormatTag: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#16A34A',
    backgroundColor: '#EAF7EE',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  eventTitle: {
    margin: 0,
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  eventLocationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11.5px',
    color: '#64748B',
  },
  eventRegisterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FAD465',
    color: '#06294D',
    fontWeight: 700,
    fontSize: '12px',
    cursor: 'pointer',
    flexShrink: 0,
  },

  /* Recommendations */
  recommendationsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '16px',
  },
  recCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  recIconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  recTitle: {
    margin: 0,
    fontSize: '14.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  recDesc: {
    margin: 0,
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.4,
  },
  recLink: {
    marginTop: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#06294D',
    fontWeight: 700,
    fontSize: '12.5px',
  },

  /* Welcome Kit Tracking Modal */
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: '16px',
  },
  kitModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    maxWidth: '560px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
  },
  modalHeader: {
    backgroundColor: '#06294D',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#FFFFFF',
  },
  modalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '75vh',
    overflowY: 'auto',
  },
  kitSummaryBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '14px 18px',
  },
  kitMemberName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  kitMemberNo: {
    fontSize: '12.5px',
    fontFamily: 'monospace',
    color: '#475569',
    marginTop: '2px',
  },
  kitChapter: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
  kitIncludes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kitIncludesTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  kitIncludesList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '12.5px',
    color: '#334155',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 0',
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  stepDotCompleted: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#16A34A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepDotActive: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#FEF3C7',
    border: '2px solid #D97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepDotPending: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#F1F5F9',
    border: '1.5px solid #CBD5E1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineLineCompleted: {
    width: '2px',
    height: '24px',
    backgroundColor: '#16A34A',
    marginLeft: '12px',
  },
  timelineLinePending: {
    width: '2px',
    height: '24px',
    backgroundColor: '#E2E8F0',
    marginLeft: '12px',
  },
  stepInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stepTitle: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  stepTitlePending: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#94A3B8',
  },
  stepSub: {
    fontSize: '12px',
    color: '#64748B',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #DCE4EC',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalClosePrimaryBtn: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
};
