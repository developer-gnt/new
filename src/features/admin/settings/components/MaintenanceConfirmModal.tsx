import React from 'react';
import { X, AlertOctagon, Wrench } from 'lucide-react';

interface MaintenanceConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCurrentlyEnabled: boolean;
}

export const MaintenanceConfirmModal: React.FC<MaintenanceConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isCurrentlyEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <AlertOctagon size={18} color="#DC2626" />
            <h3 style={styles.headerTitle}>
              {isCurrentlyEnabled ? 'Disable Maintenance Mode' : 'Enable Emergency Maintenance'}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.desc}>
            {isCurrentlyEnabled
              ? 'Are you sure you want to disable maintenance mode? All public services, registration portals, and donation gateways will be restored immediately.'
              : 'Enabling maintenance mode will restrict non-admin access across the public website and mobile apps. Only verified administrators will be able to access the platform.'}
          </p>

          <div style={styles.warningBox}>
            <Wrench size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={styles.warningText}>
              {isCurrentlyEnabled
                ? 'Standard SLA monitoring will resume upon reactivation.'
                : 'Active visitor sessions may be disconnected while maintenance is in effect.'}
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
            style={{
              ...styles.confirmBtn,
              backgroundColor: isCurrentlyEnabled ? '#06294D' : '#DC2626',
            }}
          >
            {isCurrentlyEnabled ? 'Confirm Deactivation' : 'Confirm & Enable Maintenance'}
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
    maxWidth: '480px',
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
  warningBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    padding: '12px 14px',
    borderRadius: '8px',
  },
  warningText: {
    fontSize: '12px',
    color: '#991B1B',
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
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};
