import React from 'react';
import { X, Trash2, CheckCircle2 } from 'lucide-react';

interface ClearCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearCacheModal: React.FC<ClearCacheModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <Trash2 size={18} color="#DC2626" />
            <h3 style={styles.headerTitle}>Clear Platform Cache</h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.desc}>
            This action will purge temporary client-side cached queries, session buffers, and UI state from this browser session.
          </p>

          <div style={styles.infoBox}>
            <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={styles.infoText}>
              Your current administrator login credentials, tokens, and active database records will not be affected.
            </span>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={styles.confirmBtn}
          >
            Clear Cache & Reload
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '18px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  desc: {
    fontSize: '13.5px',
    color: '#334155',
    lineHeight: 1.55,
    margin: 0,
  },
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    padding: '12px 14px',
    borderRadius: '8px',
  },
  infoText: {
    fontSize: '12px',
    color: '#166534',
    lineHeight: 1.4,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};
