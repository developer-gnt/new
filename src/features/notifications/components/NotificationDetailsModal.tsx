import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, Calendar, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { NotificationItem } from '../types/notifications.types';

interface NotificationDetailsModalProps {
  item: NotificationItem | null;
  onClose: () => void;
}

export const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({
  item,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!item) return null;

  const { notification, created_at } = item;

  const handleNavigate = () => {
    if (notification.deepLinkUrl) {
      onClose();
      navigate(notification.deepLinkUrl);
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <span style={styles.categoryPill}>{notification.category || 'NOTIFICATION'}</span>
            {notification.priority === 'URGENT' && (
              <span style={styles.urgentPill}>URGENT</span>
            )}
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={styles.body}>
          <h2 style={styles.title}>{notification.title}</h2>

          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              <Calendar size={13} color="#64748B" />
              <span>Received: {formatDate(created_at)}</span>
            </div>
            <div style={styles.metaItem}>
              <Users size={13} color="#64748B" />
              <span>Audience: {notification.target_audience}</span>
            </div>
          </div>

          <div style={styles.divider} />

          <p style={styles.description}>{notification.body}</p>

          <div style={styles.infoBox}>
            <ShieldAlert size={16} color="#06294D" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={styles.infoText}>
              <strong>Administrative Governance Notice:</strong> Action on this alert is logged under central audit trail records.
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.closeModalBtn}>
            <CheckCircle2 size={14} color="#475569" />
            <span>Close</span>
          </button>

          {notification.deepLinkUrl && (
            <button type="button" onClick={handleNavigate} style={styles.actionBtn}>
              <span>{notification.actionLabel || 'Proceed to Module'}</span>
              <ExternalLink size={14} color="#011F39" />
            </button>
          )}
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
    maxWidth: '540px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 22px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryPill: {
    backgroundColor: '#EEF2F6',
    color: '#06294D',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
  },
  urgentPill: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: '11px',
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: '6px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  body: {
    padding: '22px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#011F39',
    margin: '0 0 12px 0',
    lineHeight: 1.35,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '12px',
    color: '#64748B',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#F1F5F9',
    margin: '16px 0',
  },
  description: {
    fontSize: '14px',
    color: '#334155',
    lineHeight: 1.6,
    margin: '0 0 18px 0',
  },
  infoBox: {
    display: 'flex',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
  },
  infoText: {
    fontSize: '12px',
    color: '#475569',
    lineHeight: 1.45,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#F8FAFC',
  },
  closeModalBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 20px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    color: '#011F39',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
  },
};
