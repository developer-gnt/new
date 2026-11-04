import type React from 'react';
import { X, Calendar, Eye, Bookmark, Tag } from 'lucide-react';
import type { RightsArticle } from '../types/rights.types';
import { RIGHTS_STATUS_TONES, RIGHTS_STATUS_LABELS, formatRightsViews } from '../types/rights.types';

interface RightsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: RightsArticle | null;
}

export const RightsPreviewModal: React.FC<RightsPreviewModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  if (!isOpen || !article) return null;

  const statusTone = RIGHTS_STATUS_TONES[article.status] || RIGHTS_STATUS_TONES.DRAFT;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <span style={styles.previewTag}>READER PREVIEW</span>
            <span style={styles.titleTruncated}>{article.title}</span>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} title="Close preview">
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div style={styles.body}>
          {/* Hero Cover */}
          {article.thumbnailUrl ? (
            <div style={styles.coverWrapper}>
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                style={styles.coverImg}
              />
            </div>
          ) : (
            <div style={styles.coverFallback}>
              <span style={styles.fallbackText}>HUMAN RIGHTS COMMISSION RESOURCE</span>
            </div>
          )}

          <div style={styles.innerContent}>
            {/* Meta Row: Category, Status, Views, Date */}
            <div style={styles.metaRow}>
              <span style={styles.categoryChip}>{article.category}</span>
              <span
                style={{
                  ...styles.statusChip,
                  backgroundColor: statusTone.bg,
                  color: statusTone.text,
                  borderColor: statusTone.border,
                }}
              >
                {RIGHTS_STATUS_LABELS[article.status]}
              </span>
              <div style={styles.dateMeta}>
                <Calendar size={13} color="#64748B" />
                <span>{article.lastUpdatedDate} • {article.lastUpdatedTime}</span>
              </div>
              <div style={styles.dateMeta}>
                <Eye size={13} color="#64748B" />
                <span>{formatRightsViews(article.views)} views</span>
              </div>
            </div>

            {/* Headline Title */}
            <h1 style={styles.headline}>{article.title}</h1>

            {/* Short Description Quote / Lead */}
            <p style={styles.leadText}>{article.description}</p>

            {/* Author Row */}
            <div style={styles.authorCard}>
              <div style={styles.avatarCircle}>
                {article.author
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div style={styles.authorMeta}>
                <div style={styles.authorName}>{article.author}</div>
                <div style={styles.authorRole}>
                  {article.authorRole} • {article.organization}
                </div>
              </div>
            </div>

            {/* Key Highlights Section */}
            {article.highlights && article.highlights.length > 0 && (
              <div style={styles.highlightsSection}>
                <h3 style={styles.highlightsHeading}>
                  <Bookmark size={18} color="#06294D" />
                  <span>Key Statutory Highlights & Protections</span>
                </h3>
                <div style={styles.highlightsGrid}>
                  {article.highlights.map((h, idx) => (
                    <div key={idx} style={styles.highlightCard}>
                      <div style={styles.highlightIndex}>{idx + 1}</div>
                      <div style={styles.highlightContent}>
                        <div style={styles.highlightTitle}>{h.title}</div>
                        <div style={styles.highlightDesc}>{h.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Paragraphs */}
            <div style={styles.articleBody}>
              {article.content && article.content.length > 0 ? (
                article.content.map((para, i) => (
                  <p key={i} style={styles.paragraph}>
                    {para}
                  </p>
                ))
              ) : (
                <p style={styles.paragraph}>{article.description}</p>
              )}
            </div>

            {/* Tags Row */}
            {article.tags && article.tags.length > 0 && (
              <div style={styles.tagsContainer}>
                <Tag size={15} color="#64748B" />
                <div style={styles.tagsList}>
                  {article.tags.map((t) => (
                    <span key={t} style={styles.tagChip}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '780px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
  },
  previewTag: {
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  titleTruncated: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#E2E8F0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    overflowY: 'auto',
    backgroundColor: '#FAF7F0',
  },
  coverWrapper: {
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    backgroundColor: '#011F39',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverFallback: {
    width: '100%',
    height: '160px',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FAD465',
  },
  fallbackText: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  innerContent: {
    padding: '28px 36px',
    maxWidth: '720px',
    margin: '0 auto',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  categoryChip: {
    display: 'inline-flex',
    padding: '4px 12px',
    borderRadius: '6px',
    backgroundColor: '#EFF6FF',
    color: '#0369A1',
    fontSize: '12px',
    fontWeight: 700,
    border: '1px solid #BAE6FD',
  },
  statusChip: {
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 700,
    border: '1px solid',
  },
  dateMeta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#64748B',
  },
  headline: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: '26px',
    fontWeight: 700,
    color: '#011F39',
    lineHeight: 1.3,
    margin: '0 0 14px 0',
  },
  leadText: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#334155',
    fontStyle: 'italic',
    margin: '0 0 20px 0',
    padding: '12px 16px',
    borderLeft: '4px solid #06294D',
    backgroundColor: '#FFFFFF',
    borderRadius: '0 8px 8px 0',
  },
  authorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    marginBottom: '24px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#011F39',
    color: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '13px',
  },
  authorMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  authorName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0F172A',
  },
  authorRole: {
    fontSize: '12px',
    color: '#64748B',
  },
  highlightsSection: {
    marginBottom: '26px',
  },
  highlightsHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#06294D',
    fontFamily: 'Playfair Display, Georgia, serif',
    margin: '0 0 12px 0',
  },
  highlightsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  highlightCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  },
  highlightIndex: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontWeight: 700,
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  highlightContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  highlightTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0F172A',
  },
  highlightDesc: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: 1.45,
  },
  articleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#1E293B',
    marginBottom: '24px',
  },
  paragraph: {
    margin: 0,
  },
  tagsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '16px',
    borderTop: '1px solid #E2E8F0',
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagChip: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0284C7',
    backgroundColor: '#F0F9FF',
    padding: '3px 10px',
    borderRadius: '4px',
    border: '1px solid #BAE6FD',
  },
};
