import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Eye,
  ShieldCheck,
  Scale,
  UsersRound,
  Leaf,
  Heart,
  ArrowRight,
  PhoneCall,
  FileCheck,
} from 'lucide-react';
import heroBg from '../../../assets/about/hero-bg.png';
import whoWeAreImg from '../../../assets/about/who-we-are.png';
import leader1Img from '../../../assets/about/leader-1.png';
import leader2Img from '../../../assets/about/leader-2.png';
import leader3Img from '../../../assets/about/leader-3.png';
import ctaHandsImg from '../../../assets/about/cta-hands.png';

export const MemberAboutPage: React.FC = () => {
  const navigate = useNavigate();

  const coreValues = [
    {
      title: 'Equality & Human Dignity',
      description:
        'Every citizen holds an inviolable right to equal treatment, constitutional freedoms, and mutual respect without discrimination of caste, creed, gender, or religion.',
      icon: Scale,
    },
    {
      title: 'Rule of Law & Justice',
      description:
        'Advancing constitutional safeguards and ensuring state agencies, law enforcement, and courts remain fair, transparent, and accountable to the common citizen.',
      icon: ShieldCheck,
    },
    {
      title: 'Community Empowerment',
      description:
        'Equipping grassroots communities, women, workers, and rural families with practical legal literacy so they can fearlessly exercise their statutory rights.',
      icon: UsersRound,
    },
    {
      title: 'Compassion & Social Welfare',
      description:
        'Immediate rescue, legal defense, and rehabilitation aid for victims of atrocities, custodial excesses, discrimination, and domestic violence.',
      icon: Heart,
    },
    {
      title: 'Environmental & Public Health Rights',
      description:
        'Safeguarding clean air, potable water, ecological conservation, and humane working environments as fundamental facets of the Right to Life.',
      icon: Leaf,
    },
    {
      title: 'Integrity & Transparency',
      description:
        'Strict governance, verified accounting, 80G tax compliance, and open accountability in all humanitarian missions across state and district chapters.',
      icon: FileCheck,
    },
  ];

  const leadership = [
    {
      name: 'Adv. Rajeshwar Sharma',
      role: 'National President & Founder',
      sub: 'Senior Human Rights Advocate, Supreme Court of India',
      image: leader1Img,
    },
    {
      name: 'Dr. Pratibha Deshmukh',
      role: 'National Vice President',
      sub: 'Former State Human Rights Commissioner & Social Reformer',
      image: leader2Img,
    },
    {
      name: 'Col. Arvind Pratap Singh (Retd.)',
      role: 'National General Secretary',
      sub: 'Head of Chapter Administration & Field Operations',
      image: leader3Img,
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. Hero Section */}
      <section style={styles.heroCard}>
        <img src={heroBg} alt="HRSJM Mission" style={styles.heroBgImg} />
        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <div style={styles.heroTagline}>HRSJM CONSTITUTION & CHARTER</div>
          <h1 style={styles.heroHeading}>
            People. Rights. Justice. <span style={{ color: '#FAD465' }}>Change.</span>
          </h1>
          <p style={styles.heroDesc}>
            Human Rights & Social Justice Mission (HRSJM) is a national, people-driven
            movement committed to safeguarding fundamental rights, extending pro-bono legal
            aid, and empowering vulnerable communities across India.
          </p>

          <div style={styles.heroStatsRow}>
            <div style={styles.heroStatItem}>
              <span style={styles.heroStatValue}>28+</span>
              <span style={styles.heroStatLabel}>State Chapters</span>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStatItem}>
              <span style={styles.heroStatValue}>12,000+</span>
              <span style={styles.heroStatLabel}>Active Members</span>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStatItem}>
              <span style={styles.heroStatValue}>4,500+</span>
              <span style={styles.heroStatLabel}>Cases Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section style={styles.whoWeAreCard}>
        <div style={styles.whoWeAreTextCol}>
          <span style={styles.sectionPill}>ORGANISATION PROFILE</span>
          <h2 style={styles.sectionTitle}>Who We Are</h2>
          <p style={styles.bodyText}>
            Human Rights & Social Justice Mission (HRSJM) was incorporated under the Indian
            Societies and Trust Acts to serve as a democratic bridge between citizens and
            their constitutional guarantees.
          </p>
          <p style={styles.bodyText}>
            Guided by Articles 14 through 32 of the Constitution of India and the Universal
            Declaration of Human Rights (UDHR), HRSJM operates as an accredited watchdog and
            grassroots support network. Through our 24/7 Grievance Helpdesk, thousands of
            underprivileged citizens receive legal representation, police complaint
            follow-ups, and protective mediation completely free of charge.
          </p>

          <div style={styles.keyHighlightsBox}>
            <div style={styles.highlightItem}>
              <ShieldCheck size={18} color="#16A34A" />
              <span>Registered under NITI Aayog Darpan & 80G Tax Exemption Certified</span>
            </div>
            <div style={styles.highlightItem}>
              <ShieldCheck size={18} color="#16A34A" />
              <span>Permanent Legal Aid Panels across 18 High Courts and District Bars</span>
            </div>
          </div>
        </div>

        <div style={styles.whoWeAreImgWrap}>
          <img src={whoWeAreImg} alt="HRSJM Grassroots Work" style={styles.whoWeAreImg} />
        </div>
      </section>

      {/* 3. Mission & Vision Cards */}
      <section style={styles.missionVisionGrid}>
        <div style={styles.mvCard}>
          <div style={styles.mvIconNavy}>
            <Target size={24} color="#FAD465" />
          </div>
          <h3 style={styles.mvTitle}>Our Mission</h3>
          <p style={styles.mvDesc}>
            To protect human rights, eliminate oppression and social discrimination, and empower
            vulnerable communities through aggressive legal advocacy, mass constitutional
            literacy, and direct humanitarian relief.
          </p>
        </div>

        <div style={styles.mvCard}>
          <div style={styles.mvIconGold}>
            <Eye size={24} color="#06294D" />
          </div>
          <h3 style={styles.mvTitle}>Our Vision</h3>
          <p style={styles.mvDesc}>
            An India where every citizen—irrespective of birth, gender, wealth, or creed—lives
            with absolute dignity, equal protection under the law, and unfettered access to
            justice and civic opportunities.
          </p>
        </div>
      </section>

      {/* 4. Core Values & Principles */}
      <section style={styles.valuesSection}>
        <div style={styles.valuesHeader}>
          <span style={styles.sectionPill}>GUIDING PRINCIPLES</span>
          <h2 style={styles.sectionTitle}>Our Core Values</h2>
          <p style={styles.sectionSub}>The constitutional cornerstones guiding every member, chapter, and legal officer</p>
        </div>

        <div style={styles.valuesGrid}>
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} style={styles.valueCard}>
                <div style={styles.valueIconWrap}>
                  <Icon size={22} color="#06294D" />
                </div>
                <h4 style={styles.valueTitle}>{val.title}</h4>
                <p style={styles.valueDesc}>{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. National Leadership & Governance */}
      <section style={styles.leadershipSection}>
        <div style={styles.leadershipHeader}>
          <span style={styles.sectionPill}>BOARD OF GOVERNORS</span>
          <h2 style={styles.sectionTitle}>National Leadership</h2>
          <p style={styles.sectionSub}>Dedicated jurists and human rights advocates heading the organisation</p>
        </div>

        <div style={styles.leadershipGrid}>
          {leadership.map((leader) => (
            <div key={leader.name} style={styles.leaderCard}>
              <div style={styles.leaderImgWrap}>
                <img src={leader.image} alt={leader.name} style={styles.leaderImg} />
              </div>
              <h4 style={styles.leaderName}>{leader.name}</h4>
              <div style={styles.leaderRole}>{leader.role}</div>
              <p style={styles.leaderSub}>{leader.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact & Helpline Banner */}
      <section style={styles.helplineCard}>
        <div style={styles.helplineContent}>
          <div style={styles.helplineIcon}>
            <PhoneCall size={28} color="#0B2F52" />
          </div>
          <div>
            <h3 style={styles.helplineTitle}>HRSJM 24/7 Human Rights Helpline</h3>
            <p style={styles.helplineDesc}>
              National Emergency Legal Assistance Desk for members and citizens facing unlawful detention,
              domestic violence, or civil rights violations.
            </p>
            <div style={styles.helplineContacts}>
              <span>Toll Free: <strong>1800-889-HRSJM (47756)</strong></span>
              <span>•</span>
              <span>Email: <strong>legal@hrsjm.org.in</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Footer */}
      <section style={styles.ctaCard}>
        <img src={ctaHandsImg} alt="Together For Justice" style={styles.ctaImg} />
        <div style={styles.ctaOverlay} />
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Together, We Defend Justice</h2>
          <p style={styles.ctaSub}>
            As an accredited member, you represent our collective voice in your district and community.
            Engage with upcoming campaigns or review your official credentials.
          </p>
          <div style={styles.ctaActions}>
            <button
              type="button"
              style={styles.ctaBtnPrimary}
              onClick={() => navigate('/member/causes')}
            >
              <span>Support Active Causes</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              style={styles.ctaBtnSecondary}
              onClick={() => navigate('/member/rights')}
            >
              <span>Explore Know Your Rights</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '40px',
  },
  heroCard: {
    position: 'relative',
    height: '280px',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: '#011F39',
    boxShadow: '0 8px 30px rgba(1, 31, 57, 0.2)',
    display: 'flex',
    alignItems: 'center',
  },
  heroBgImg: {
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
    background: 'linear-gradient(100deg, rgba(1, 31, 57, 0.95) 0%, rgba(6, 41, 77, 0.85) 60%, rgba(1, 31, 57, 0.5) 100%)',
    zIndex: 2,
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    padding: '32px 40px',
    maxWidth: '820px',
  },
  heroTagline: {
    fontSize: '11.5px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#FAD465',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  heroHeading: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '34px',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 10px 0',
    lineHeight: 1.2,
  },
  heroDesc: {
    fontSize: '14px',
    color: '#DCE4EC',
    lineHeight: 1.5,
    margin: '0 0 20px 0',
    maxWidth: '700px',
  },
  heroStatsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  heroStatItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  heroStatValue: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '22px',
    fontWeight: 700,
    color: '#FAD465',
    lineHeight: 1.1,
  },
  heroStatLabel: {
    fontSize: '11px',
    color: '#CBD5E0',
    marginTop: '2px',
  },
  heroStatDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  /* Who We Are */
  whoWeAreCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '16px',
    padding: '32px',
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '32px',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
  },
  whoWeAreTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionPill: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#06294D',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FCD34D',
    padding: '3px 10px',
    borderRadius: '6px',
    width: 'fit-content',
  },
  sectionTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  sectionSub: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '4px',
  },
  bodyText: {
    fontSize: '13.5px',
    color: '#475569',
    lineHeight: 1.6,
    margin: 0,
  },
  keyHighlightsBox: {
    marginTop: '8px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  whoWeAreImgWrap: {
    borderRadius: '14px',
    overflow: 'hidden',
    height: '280px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
  },
  whoWeAreImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  /* Mission & Vision */
  missionVisionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  mvCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  mvIconNavy: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvIconGold: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  mvDesc: {
    fontSize: '13.5px',
    color: '#475569',
    lineHeight: 1.55,
    margin: 0,
  },

  /* Values Section */
  valuesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  valuesHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  valueCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  valueIconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: '#FEFCE8',
    border: '1.5px solid #FCD34D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  valueDesc: {
    margin: 0,
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.5,
  },

  /* Leadership */
  leadershipSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  leadershipHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  leadershipGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  leaderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  leaderImgWrap: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #FAD465',
    marginBottom: '14px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  leaderImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  leaderName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  leaderRole: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#D97706',
    marginTop: '4px',
  },
  leaderSub: {
    fontSize: '11.5px',
    color: '#64748B',
    marginTop: '4px',
    lineHeight: 1.4,
  },

  /* Helpline Banner */
  helplineCard: {
    backgroundColor: '#FEF9C3',
    border: '1.5px solid #FCD34D',
    borderRadius: '14px',
    padding: '20px 28px',
  },
  helplineContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  helplineIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '12px',
    backgroundColor: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  helplineTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  helplineDesc: {
    margin: '4px 0 8px 0',
    fontSize: '12.5px',
    color: '#475569',
    lineHeight: 1.45,
  },
  helplineContacts: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12.5px',
    color: '#06294D',
  },

  /* CTA */
  ctaCard: {
    position: 'relative',
    height: '200px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#011F39',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(1, 31, 57, 0.15)',
  },
  ctaImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  ctaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(1, 31, 57, 0.94) 0%, rgba(6, 41, 77, 0.82) 100%)',
    zIndex: 2,
  },
  ctaContent: {
    position: 'relative',
    zIndex: 3,
    padding: '28px 36px',
    maxWidth: '680px',
  },
  ctaTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '22px',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 6px 0',
  },
  ctaSub: {
    fontSize: '12.5px',
    color: '#E2E8F0',
    margin: '0 0 16px 0',
    lineHeight: 1.45,
  },
  ctaActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ctaBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FAD465',
    color: '#06294D',
    fontWeight: 700,
    fontSize: '12.5px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  ctaBtnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '12.5px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    cursor: 'pointer',
  },
};
