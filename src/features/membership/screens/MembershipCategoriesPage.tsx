import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Package,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MEMBERSHIP_CATEGORIES } from '../data/membershipCategoriesData';
import type { MembershipCategoryOption } from '../types/membershipApplication.types';
import { useMembershipApply } from '../store/membershipApplyStore';

export const MembershipCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedPost, setStep } = useMembershipApply();
  const [levelFilter, setLevelFilter] = useState<'all' | 'district' | 'state' | 'executive' | 'national'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = MEMBERSHIP_CATEGORIES.filter((cat) => {
    if (levelFilter !== 'all' && cat.level !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cat.postName.toLowerCase().includes(q) ||
        cat.qualification.toLowerCase().includes(q) ||
        cat.checklistItems.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSelectPost = (post: MembershipCategoryOption) => {
    setSelectedPost(post);
    setStep(1); // Begin at step 1
    navigate('/membership/apply');
  };

  return (
    <div style={styles.container}>
      {/* Top Hero Banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <Sparkles size={14} color="#FAD465" />
          <span>OFFICIAL ACCREDITATION TIERS</span>
        </div>
        <h1 style={styles.heroTitle}>Join the Human Rights & Social Justice Mission</h1>
        <p style={styles.heroSubtitle}>
          Select an authorized post or membership tier to become an accredited advocate for constitutional justice, legal awareness, and community protection across India.
        </p>

        <div style={styles.heroActionRow}>
          <button
            type="button"
            style={styles.trackBtn}
            onClick={() => navigate('/membership/status')}
          >
            <Clock size={16} />
            <span>Already Applied? Track Application Status</span>
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.tabsWrap}>
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            style={{ ...styles.tabBtn, ...(levelFilter === 'all' ? styles.tabBtnActive : {}) }}
          >
            All Categories ({MEMBERSHIP_CATEGORIES.length})
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('district')}
            style={{ ...styles.tabBtn, ...(levelFilter === 'district' ? styles.tabBtnActive : {}) }}
          >
            District Posts
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('state')}
            style={{ ...styles.tabBtn, ...(levelFilter === 'state' ? styles.tabBtnActive : {}) }}
          >
            State Posts
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('executive')}
            style={{ ...styles.tabBtn, ...(levelFilter === 'executive' ? styles.tabBtnActive : {}) }}
          >
            Executive Letter Pad Posts
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('national')}
            style={{ ...styles.tabBtn, ...(levelFilter === 'national' ? styles.tabBtnActive : {}) }}
          >
            National Life Patron
          </button>
        </div>

        <div style={styles.searchBox}>
          <Search size={16} color="#718096" />
          <input
            type="text"
            placeholder="Search by post name, qualification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div style={styles.grid}>
        {filteredCategories.map((post) => (
          <div key={post.id} style={styles.card}>
            {/* Top Post Header */}
            <div style={styles.cardHeader}>
              <div style={styles.headerLeft}>
                <span
                  style={{
                    ...styles.levelBadge,
                    backgroundColor: post.level === 'national' ? '#06294D' : post.level === 'executive' ? '#FEF6E7' : '#EDF2F7',
                    color: post.level === 'national' ? '#FAD465' : post.level === 'executive' ? '#D97706' : '#174A78',
                  }}
                >
                  {post.level.toUpperCase()} LEVEL
                </span>
                <h3 style={styles.postTitle}>{post.postName}</h3>
              </div>
              <div style={styles.feeWrap}>
                <div style={styles.feeAmount}>{post.fee}</div>
                <div style={styles.validityBadge}>/ {post.validity}</div>
              </div>
            </div>

            {/* Qualification & Eligibility */}
            <div style={styles.qualRow}>
              <ShieldCheck size={15} color="#16A34A" />
              <span>Eligibility: <strong>{post.qualification}</strong></span>
            </div>

            <div style={styles.divider} />

            {/* Accreditation Checklist */}
            <div style={styles.sectionBlock}>
              <div style={styles.blockTitle}>Official Documentation & Benefits:</div>
              <ul style={styles.checklist}>
                {post.checklistItems.map((item, idx) => (
                  <li key={idx} style={styles.checkItem}>
                    <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kit Inclusions */}
            {post.kitItems.length > 0 && (
              <div style={styles.kitBox}>
                <div style={styles.kitHeader}>
                  <Package size={14} color="#06294D" />
                  <span style={styles.kitTitle}>Induction Kit Package:</span>
                </div>
                <div style={styles.kitPills}>
                  {post.kitItems.map((kit, idx) => (
                    <span key={idx} style={styles.kitPill}>{kit}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Action Button */}
            <button
              type="button"
              style={styles.applyBtn}
              onClick={() => handleSelectPost(post)}
            >
              <span>Apply for this Post</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1360px',
    margin: '0 auto',
    padding: '32px 20px 64px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  heroSection: {
    background: 'linear-gradient(135deg, #06294D 0%, #011F39 100%)',
    borderRadius: '16px',
    padding: '40px 32px',
    color: '#FFFFFF',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid #FAD465',
    boxShadow: '0 8px 30px rgba(1, 31, 57, 0.25)',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(250, 212, 101, 0.15)',
    border: '1px solid rgba(250, 212, 101, 0.35)',
    color: '#FAD465',
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '999px',
    letterSpacing: '0.06em',
    marginBottom: '16px',
  },
  heroTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '32px',
    fontWeight: 800,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
    maxWidth: '840px',
  },
  heroSubtitle: {
    fontSize: '15px',
    color: '#DCE4EC',
    lineHeight: 1.6,
    maxWidth: '720px',
    margin: '0 0 24px 0',
  },
  heroActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  trackBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  tabsWrap: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  tabBtn: {
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#34516D',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    backgroundColor: '#06294D',
    borderColor: '#06294D',
    color: '#FAD465',
    fontWeight: 700,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '8px 14px',
    minWidth: '280px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    color: '#06294D',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #DCE4EC',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  },
  postTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '18px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
    lineHeight: 1.3,
  },
  feeWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  feeAmount: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '22px',
    fontWeight: 800,
    color: '#06294D',
  },
  validityBadge: {
    fontSize: '11px',
    color: '#718096',
    fontWeight: 600,
  },
  qualRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12.5px',
    color: '#34516D',
    marginBottom: '14px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#EDF2F7',
    marginBottom: '14px',
  },
  sectionBlock: {
    marginBottom: '16px',
  },
  blockTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  checklist: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '12.5px',
    color: '#334155',
    lineHeight: 1.4,
  },
  kitBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    marginTop: 'auto',
  },
  kitHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  kitTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
  },
  kitPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  kitPill: {
    fontSize: '10.5px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '4px',
    padding: '2px 6px',
    color: '#34516D',
  },
  applyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#FAD465',
    color: '#06294D',
    border: '1px solid #E9B82E',
    borderRadius: '8px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
};
