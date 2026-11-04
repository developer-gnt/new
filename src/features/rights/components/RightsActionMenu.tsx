import type React from 'react';
import { useEffect, useRef } from 'react';
import { Edit, EyeOff, Archive, Send, RotateCcw, Trash2 } from 'lucide-react';
import type { RightsListItem, RightsStatus } from '../types/rights.types';

export interface RightsActionMenuProps {
  isOpen: boolean;
  article: RightsListItem | null;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onEdit: (article: RightsListItem) => void;
  onStatusChange: (article: RightsListItem, newStatus: RightsStatus) => void;
  onDelete: (article: RightsListItem) => void;
}

export const RightsActionMenu: React.FC<RightsActionMenuProps> = ({
  isOpen,
  article,
  anchorPosition,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen || !article || !anchorPosition) return null;

  return (
    <div
      ref={menuRef}
      style={{
        ...styles.menu,
        top: `${anchorPosition.top}px`,
        left: `${anchorPosition.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Edit */}
      <button
        type="button"
        style={styles.item}
        onClick={() => {
          onClose();
          onEdit(article);
        }}
      >
        <Edit size={14} color="#0284C7" />
        <span>Edit Article</span>
      </button>

      {/* Status-dependent transitions */}
      {article.status === 'PUBLISHED' && (
        <>
          <button
            type="button"
            style={styles.item}
            onClick={() => {
              onClose();
              onStatusChange(article, 'DRAFT');
            }}
          >
            <EyeOff size={14} color="#D97706" />
            <span>Unpublish to Draft</span>
          </button>
          <button
            type="button"
            style={styles.item}
            onClick={() => {
              onClose();
              onStatusChange(article, 'ARCHIVED');
            }}
          >
            <Archive size={14} color="#64748B" />
            <span>Archive Article</span>
          </button>
        </>
      )}

      {article.status === 'DRAFT' && (
        <>
          <button
            type="button"
            style={styles.item}
            onClick={() => {
              onClose();
              onStatusChange(article, 'PUBLISHED');
            }}
          >
            <Send size={14} color="#16A34A" />
            <span>Publish Article</span>
          </button>
          <button
            type="button"
            style={styles.item}
            onClick={() => {
              onClose();
              onStatusChange(article, 'ARCHIVED');
            }}
          >
            <Archive size={14} color="#64748B" />
            <span>Archive Article</span>
          </button>
        </>
      )}

      {article.status === 'ARCHIVED' && (
        <button
          type="button"
          style={styles.item}
          onClick={() => {
            onClose();
            onStatusChange(article, 'DRAFT');
          }}
        >
          <RotateCcw size={14} color="#2563EB" />
          <span>Restore to Draft</span>
        </button>
      )}

      <div style={styles.divider} />

      {/* Delete */}
      <button
        type="button"
        style={{ ...styles.item, color: '#DC2626' }}
        onClick={() => {
          onClose();
          onDelete(article);
        }}
      >
        <Trash2 size={14} color="#DC2626" />
        <span>Delete Article</span>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  menu: {
    position: 'fixed',
    zIndex: 1050,
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E2E8F0',
    padding: '4px',
    minWidth: '170px',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    fontWeight: 500,
    color: '#1E293B',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E2E8F0',
    margin: '4px 0',
  },
};

