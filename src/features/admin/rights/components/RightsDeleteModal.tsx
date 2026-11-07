import type React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { RightsListItem } from '../types/rights.types';

interface RightsDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  article: RightsListItem | null;
  isDeleting?: boolean;
}

export const RightsDeleteModal: React.FC<RightsDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  article,
  isDeleting = false,
}) => {
  if (!isOpen || !article) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <AlertTriangle size={22} color="#DC2626" />
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} title="Cancel">
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <h3 style={styles.title}>Delete Rights Article</h3>
          <p style={styles.message}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: '#0F172A' }}>"{article.title}"</strong>? This action will remove
            the article from public listings and the legal reference database.
          </p>
          <div style={styles.warningBox}>
            <span style={styles.warningText}>
              Category: <strong>{article.category}</strong> • Status: <strong>{article.status}</strong>
            </span>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={styles.deleteBtn}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Article'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.45)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 0 24px',
  },
  iconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#FEE2E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    padding: '4px',
  },
  body: {
    padding: '16px 24px 20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#0F172A',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  message: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.5,
    color: '#64748B',
  },
  warningBox: {
    padding: '10px 14px',
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    marginTop: '6px',
  },
  warningText: {
    fontSize: '12px',
    color: '#475569',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '14px 24px',
    backgroundColor: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

