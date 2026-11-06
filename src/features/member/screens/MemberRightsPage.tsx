import type React from 'react';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Search,
  Eye,
  Calendar,
  CheckCircle2,
  X,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { rightsStore } from '@/features/admin/rights/store/rightsStore';
import type { RightsArticle } from '@/features/admin/rights/types/rights.types';
import { filterRightsForRole } from '@/features/content';

export const MemberRightsPage: React.FC = () => {
  const navigate = useNavigate();
  const snapshot = useSyncExternalStore<{ articles: RightsArticle[]; version: number }>(rightsStore.subscribe, rightsStore.getSnapshot);
  const articles = snapshot.articles;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<RightsArticle | null>(null);

  useEffect(() => {
    rightsStore.fetchRights().catch(() => {});
  }, []);

  const categories = ['ALL', 'Constitution', "Women's Rights", 'Police', 'RTI', 'Consumer'];

  const roleAuthorizedArticles = filterRightsForRole(articles, 'MEMBER');

  const filteredArticles = roleAuthorizedArticles.filter((art: RightsArticle) => {
    if (selectedCategory !== 'ALL' && !art.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = art.title.toLowerCase().includes(q);
      const inDesc = art.description.toLowerCase().includes(q);
      const inTags = (art.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <section style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>CONSTITUTIONAL LEGAL LITERACY</div>
          <h1 style={styles.heroTitle}>Know Your Rights</h1>
          <p style={styles.heroSub}>
            Authoritative, court-verified guides on fundamental rights, citizen safeguards during police encounters,
            RTI petitions, workplace protections, and women's legal remedies.
          </p>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroStatBox}>
            <div style={styles.heroStatVal}>{articles.length}</div>
            <div style={styles.heroStatLbl}>Verified Guides</div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div style={styles.searchFilterCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#718096" />
          <input
            type="text"
            placeholder="Search rights by keyword (e.g. arrest, RTI, equality, police, women)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.categoriesRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              style={{
                ...styles.categoryChip,
                ...(selectedCategory === cat ? styles.categoryChipActive : {}),
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Guides' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div style={styles.emptyState}>
          <Scale size={44} color="#CBD5E1" />
          <h3 style={styles.emptyTitle}>No Legal Guides Found</h3>
          <p style={styles.emptySub}>
            Try changing your search terms or category filter to discover related human rights articles.
          </p>
        </div>
      ) : (
        <div style={styles.articlesGrid}>
          {filteredArticles.map((art: RightsArticle) => (
            <div
              key={art.id}
              style={styles.articleCard}
              onClick={() => setActiveArticle(art)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.articleImageWrap}>
                <img
                  src={art.thumbnailUrl || undefined}
                  alt={art.title}
                  style={styles.articleImg}
                />
                <span style={styles.articleCatTag}>{art.category}</span>
                {art.featured && <span style={styles.articleFeaturedTag}>Featured</span>}
              </div>

              <div style={styles.articleBody}>
                <h3 style={styles.articleTitle}>{art.title}</h3>
                <p style={styles.articleDesc}>{art.description}</p>

                <div style={styles.articleMeta}>
                  <div style={styles.metaItem}>
                    <Calendar size={13} color="#718096" />
                    <span>{art.lastUpdatedDate}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <Eye size={13} color="#718096" />
                    <span>{art.views.toLocaleString()} reads</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.readMoreBtn}>
                    <span>Read Full Guide</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Article Reader Modal */}
      {activeArticle && (
        <div style={styles.modalBackdrop} onClick={() => setActiveArticle(null)}>
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderInfo}>
                <span style={styles.modalCat}>{activeArticle.category}</span>
                <span style={styles.modalUpdated}>
                  Updated: {activeArticle.lastUpdatedDate} • Verified by {activeArticle.organization}
                </span>
              </div>
              <button
                type="button"
                style={styles.modalCloseBtn}
                onClick={() => setActiveArticle(null)}
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <h1 style={styles.modalArticleTitle}>{activeArticle.title}</h1>
              <p style={styles.modalLead}>{activeArticle.description}</p>

              {/* Highlights Checklist */}
              {activeArticle.highlights && activeArticle.highlights.length > 0 && (
                <div style={styles.highlightsBox}>
                  <h4 style={styles.highlightsHeader}>Key Statutory Rights & Principles:</h4>
                  <div style={styles.highlightsList}>
                    {activeArticle.highlights.map((h) => (
                      <div key={h.title} style={styles.highlightRow}>
                        <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong>{h.title}:</strong> {h.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Paragraphs */}
              <div style={styles.articleContent}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} style={styles.paragraphText}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div style={styles.tagsRow}>
                {(activeArticle.tags || []).map((t: string) => (
                  <span key={t} style={styles.tag}>
                    #{t}
                  </span>
                ))}
              </div>

              {/* Legal Aid Referral Banner */}
              <div style={styles.referralBanner}>
                <div style={styles.referralLeft}>
                  <Scale size={24} color="#06294D" />
                  <div>
                    <h5 style={styles.referralTitle}>Have your rights under this law been violated?</h5>
                    <p style={styles.referralSub}>
                      Our legal aid committee investigates grievances and files formal representations before state commissions.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  style={styles.referralBtn}
                  onClick={() => {
                    setActiveArticle(null);
                    navigate('/member/support');
                  }}
                >
                  <FileText size={14} />
                  <span>File a Grievance</span>
                </button>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.footerCloseBtn}
                onClick={() => setActiveArticle(null)}
              >
                Close Guide
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
    paddingBottom: '36px',
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
  heroStatBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '16px 24px',
    textAlign: 'center',
  },
  heroStatVal: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '26px',
    fontWeight: 700,
    color: '#FAD465',
  },
  heroStatLbl: {
    fontSize: '11px',
    color: '#CBD5E0',
    marginTop: '2px',
  },

  /* Search & Filter */
  searchFilterCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    padding: '8px 14px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    color: '#1E293B',
    width: '100%',
  },
  categoriesRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  categoryChip: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  categoryChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FAD465',
    color: '#0B2F52',
  },

  /* Articles Grid */
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  articleImageWrap: {
    position: 'relative',
    height: '160px',
    backgroundColor: '#011F39',
  },
  articleImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  articleCatTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#06294D',
    color: '#FAD465',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
  },
  articleFeaturedTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
  },
  articleBody: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '10px',
  },
  articleTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  articleDesc: {
    margin: 0,
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.5,
  },
  articleMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '11.5px',
    color: '#94A3B8',
    marginTop: 'auto',
    paddingTop: '8px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cardFooter: {
    borderTop: '1px solid #F1F5F9',
    paddingTop: '10px',
    marginTop: '4px',
  },
  readMoreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#0B2F52',
    fontSize: '12.5px',
    fontWeight: 700,
  },

  /* Empty State */
  emptyState: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyTitle: {
    margin: '12px 0 6px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  emptySub: {
    margin: 0,
    fontSize: '13px',
    color: '#64748B',
    maxWidth: '420px',
  },

  /* Reader Modal */
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 80,
    padding: '16px',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '720px',
    width: '100%',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F0',
  },
  modalHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  modalCat: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    backgroundColor: '#FEF3C7',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  modalUpdated: {
    fontSize: '11.5px',
    color: '#64748B',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
  },
  modalBody: {
    padding: '24px 28px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalArticleTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.25,
  },
  modalLead: {
    margin: 0,
    fontSize: '14px',
    color: '#475569',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  highlightsBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  highlightsHeader: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  highlightRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '12.5px',
    color: '#334155',
    lineHeight: 1.45,
  },
  articleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '6px',
  },
  paragraphText: {
    margin: 0,
    fontSize: '13.5px',
    color: '#334155',
    lineHeight: 1.65,
  },
  tagsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    paddingTop: '6px',
  },
  tag: {
    fontSize: '11px',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  referralBanner: {
    backgroundColor: '#EFF6FF',
    border: '1.5px solid #BFDBFE',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '10px',
  },
  referralLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  referralTitle: {
    margin: 0,
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#1E3A8A',
  },
  referralSub: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#3B82F6',
    lineHeight: 1.4,
  },
  referralBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
  },
  modalFooter: {
    padding: '14px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#F8FAFC',
  },
  footerCloseBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
