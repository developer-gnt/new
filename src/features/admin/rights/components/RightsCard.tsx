import type React from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import type { RightsListItem } from '../types/rights.types';
import {
  RIGHTS_STATUS_TONES,
  RIGHTS_STATUS_LABELS,
  formatRightsViews,
} from '../types/rights.types';

export const RightsListHeader: React.FC = () => {
  return (
    <div style={styles.headerRow}>
      <div style={{ flex: '3 1 300px' }}>
        <span style={styles.headerText}>Rights Details</span>
      </div>
      <div style={{ flex: '1.2 1 120px' }}>
        <span style={styles.headerText}>Category</span>
      </div>
      <div style={{ flex: '1.2 1 120px' }}>
        <span style={styles.headerText}>Last Updated</span>
      </div>
      <div style={{ flex: '1 1 100px' }}>
        <span style={styles.headerText}>Status</span>
      </div>
      <div style={{ flex: '0.8 1 80px' }}>
        <span style={styles.headerText}>Views</span>
      </div>
      <div style={{ flex: '0.5 1 50px', textAlign: 'right' }}>
        <span style={styles.headerText}>Action</span>
      </div>
    </div>
  );
};

export interface RightsCardProps {
  article: RightsListItem;
  onPress: (article: RightsListItem) => void;
  onMorePress: (article: RightsListItem, e: React.MouseEvent) => void;
}

export const RightsCard: React.FC<RightsCardProps> = ({
  article,
  onPress,
  onMorePress,
}) => {
  const statusTone = RIGHTS_STATUS_TONES[article.status] || RIGHTS_STATUS_TONES.DRAFT;

  return (
    <div
      style={styles.cardRow}
      onClick={() => onPress(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPress(article);
      }}
    >
      {/* Col 1: Rights Details */}
      <div style={{ ...styles.col, flex: '3 1 300px' }}>
        {article.thumbnailUrl ? (
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            style={styles.thumbnail}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={styles.thumbPlaceholder}>
            <span style={styles.thumbPlaceholderText}>HRSJM</span>
          </div>
        )}
        <div style={styles.detailsText}>
          <div style={styles.title}>{article.title}</div>
          <div style={styles.description}>{article.description}</div>
        </div>
      </div>

      {/* Col 2: Category */}
      <div style={{ ...styles.col, flex: '1.2 1 120px' }}>
        <div style={styles.categoryChip}>
          <span>{article.category}</span>
        </div>
      </div>

      {/* Col 3: Last Updated */}
      <div style={{ ...styles.col, flex: '1.2 1 120px' }}>
        <div style={styles.dateCol}>
          <span style={styles.dateText}>{article.lastUpdatedDate}</span>
          <span style={styles.timeText}>{article.lastUpdatedTime}</span>
        </div>
      </div>

      {/* Col 4: Status */}
      <div style={{ ...styles.col, flex: '1 1 100px' }}>
        <div
          style={{
            ...styles.statusBadge,
            backgroundColor: statusTone.bg,
            borderColor: statusTone.border,
            color: statusTone.text,
          }}
        >
          <span style={{ ...styles.statusDot, backgroundColor: statusTone.dot }} />
          <span>{RIGHTS_STATUS_LABELS[article.status]}</span>
        </div>
      </div>

      {/* Col 5: Views */}
      <div style={{ ...styles.col, flex: '0.8 1 80px' }}>
        <div style={styles.viewsContainer}>
          <Eye size={14} color="#64748B" />
          <span style={styles.viewsText}>{formatRightsViews(article.views)}</span>
        </div>
      </div>

      {/* Col 6: Action */}
      <div
        style={{
          ...styles.col,
          flex: '0.5 1 50px',
          justifyContent: 'flex-end',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMorePress(article, e);
          }}
          style={styles.moreBtn}
          title="More actions"
          aria-label="Actions menu"
        >
          <MoreVertical size={16} color="#64748B" />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px 8px 0 0',
    border: '1px solid #E2E8F0',
    borderBottom: 'none',
  },
  headerText: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: 'Inter, sans-serif',
  },
  cardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  col: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },
  thumbnail: {
    width: '64px',
    height: '48px',
    borderRadius: '6px',
    objectFit: 'cover',
    flexShrink: 0,
    backgroundColor: '#F1F5F9',
  },
  thumbPlaceholder: {
    width: '64px',
    height: '48px',
    borderRadius: '6px',
    backgroundColor: '#011F39',
    color: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '11px',
    flexShrink: 0,
  },
  thumbPlaceholderText: {
    letterSpacing: '0.05em',
  },
  detailsText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: 0,
    overflow: 'hidden',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0F172A',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    fontSize: '12px',
    color: '#64748B',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  categoryChip: {
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: '#EFF6FF',
    color: '#0369A1',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid #BAE6FD',
  },
  dateCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dateText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#1E293B',
  },
  timeText: {
    fontSize: '11px',
    color: '#94A3B8',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  viewsContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  viewsText: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
  },
};

