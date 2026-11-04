import type React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { BlogListItem } from '../types/blog.types';

interface BlogDeleteModalProps {
  isOpen: boolean;
  blog: BlogListItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const BlogDeleteModal: React.FC<BlogDeleteModalProps> = ({
  isOpen,
  blog,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !blog) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <AlertTriangle size={30} color="#DC2626" />
        </div>

        <h3 style={styles.title}>Delete Blog Article</h3>
        <p style={styles.message}>
          Are you sure you want to permanently delete{' '}
          <strong>&ldquo;{blog.title}&rdquo;</strong>?
        </p>
        <p style={styles.subtext}>
          This article will be completely removed from the editorial platform and cannot be recovered.
        </p>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={isDeleting}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.deleteBtn} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Article'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
    padding: '16px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '440px',
    width: '100%',
    padding: '28px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(1, 31, 57, 0.2)',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#FDEEEF',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    color: '#011F39',
    margin: '0 0 10px 0',
  },
  message: {
    fontSize: '14px',
    color: '#334155',
    lineHeight: 1.5,
    margin: '0 0 6px 0',
  },
  subtext: {
    fontSize: '12px',
    color: '#64748B',
    lineHeight: 1.4,
    margin: '0 0 24px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    padding: '11px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#34516D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '11px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
