import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import {
  Newspaper,
  Calendar,
  Eye,
  Search,
  ChevronRight,
  X,
} from 'lucide-react';
import { newsStore } from '../../news/store/newsStore';
import type { NewsListItem } from '../../news/types/news.types';

export const MemberNewsPage: React.FC = () => {
  const snapshot = useSyncExternalStore(newsStore.subscribe, newsStore.getSnapshot);
  const news = snapshot.news;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<NewsListItem | null>(null);

  const categories = ['ALL', 'Legal', 'Events', 'National', 'Relief'];

  const filteredNews = news.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = item.title.toLowerCase().includes(q);
      const inSummary = item.summary.toLowerCase().includes(q);
      if (!inTitle && !inSummary) return false;
    }
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <section style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>MEDIA & PRESS DESK</div>
          <h1 style={styles.heroTitle}>News & Press Releases</h1>
          <p style={styles.heroSub}>
            Official statements, press releases, state convention communiqués, and judicial interventions
            issued by the National Executive Secretariat of HRSJM.
          </p>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroStatBox}>
            <div style={styles.heroStatVal}>{news.length}</div>
            <div style={styles.heroStatLbl}>Press Dispatches</div>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <div style={styles.controlsCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#718096" />
          <input
            type="text"
            placeholder="Search press releases and media statements..."
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
                ...styles.chip,
                ...(selectedCategory === cat ? styles.chipActive : {}),
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Releases' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div style={styles.emptyState}>
          <Newspaper size={44} color="#CBD5E1" />
          <h3 style={styles.emptyTitle}>No Press Releases Found</h3>
          <p style={styles.emptySub}>Try searching with another keyword or resetting the category filter.</p>
        </div>
      ) : (
        <div style={styles.newsGrid}>
          {filteredNews.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => setActiveArticle(item)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.cardImageWrap}>
                <img src={item.thumbnailUrl || undefined} alt={item.title} style={styles.cardImg} />
                <span style={styles.categoryBadge}>{item.category}</span>
              </div>

              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardSummary}>{item.summary}</p>

                <div style={styles.cardMeta}>
                  <div style={styles.metaItem}>
                    <Calendar size={13} color="#718096" />
                    <span>{item.date}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <Eye size={13} color="#718096" />
                    <span>{item.views.toLocaleString()} views</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.readMoreText}>
                    <span>Read Press Note</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* News Reader Modal */}
      {activeArticle && (
        <div style={styles.modalBackdrop} onClick={() => setActiveArticle(null)}>
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={styles.modalHeader}>
              <span style={styles.modalCatBadge}>{activeArticle.category}</span>
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
              <div style={styles.modalMetaRow}>
                <span>Published on {activeArticle.date} at {activeArticle.time}</span>
                <span>•</span>
                <span>By {activeArticle.author}</span>
              </div>

              <div style={styles.modalSummaryBox}>
                <p style={styles.modalSummaryText}>
                  {activeArticle.summaryDetailed || activeArticle.summary}
                </p>
              </div>

              {/* Highlights */}
              {activeArticle.highlights && activeArticle.highlights.length > 0 && (
                <div style={styles.highlightsBox}>
                  <h4 style={styles.highlightsTitle}>Key Points:</h4>
                  <ul style={styles.highlightsList}>
                    {activeArticle.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content */}
              <div style={styles.contentParagraphs}>
                {(activeArticle.content || []).map((p, idx) => (
                  <p key={idx} style={styles.paragraph}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div style={styles.tagsRow}>
                {(activeArticle.tags || []).map((t) => (
                  <span key={t} style={styles.tag}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.footerCloseBtn}
                onClick={() => setActiveArticle(null)}
              >
                Close Dispatch
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

  /* Controls */
  controlsCard: {
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
  chip: {
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
  chipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FAD465',
    color: '#0B2F52',
  },

  /* News Grid */
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  cardImageWrap: {
    position: 'relative',
    height: '160px',
    backgroundColor: '#011F39',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
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
  cardContent: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '10px',
  },
  cardTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  cardSummary: {
    margin: 0,
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.5,
  },
  cardMeta: {
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
  readMoreText: {
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

  /* Modal */
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
    maxWidth: '680px',
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
  modalCatBadge: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    backgroundColor: '#FEF3C7',
    padding: '3px 8px',
    borderRadius: '4px',
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
    fontSize: '22px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  modalMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#64748B',
  },
  modalSummaryBox: {
    backgroundColor: '#FAF7F0',
    borderLeft: '4px solid #FAD465',
    borderRadius: '0 8px 8px 0',
    padding: '12px 16px',
  },
  modalSummaryText: {
    margin: 0,
    fontSize: '13px',
    color: '#334155',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  highlightsBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px 18px',
  },
  highlightsTitle: {
    margin: '0 0 8px 0',
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  highlightsList: {
    margin: 0,
    paddingLeft: '18px',
    fontSize: '12.5px',
    color: '#475569',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contentParagraphs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paragraph: {
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
