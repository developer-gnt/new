import type React from 'react';
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { ExpenseEntryItem } from '../types/expenses.types';
import { formatINR } from '../types/expenses.types';

interface ExpenseCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  voucher: ExpenseEntryItem | null;
  isCancelling?: boolean;
}

export const ExpenseCancelModal: React.FC<ExpenseCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  voucher,
  isCancelling = false,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen || !voucher) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim() || 'Voided by administrator');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <AlertTriangle size={22} color="#DC2626" />
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} title="Close">
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <h3 style={styles.title}>Cancel Expense Voucher</h3>
          <p style={styles.text}>
            Are you sure you want to void voucher{' '}
            <strong style={{ color: '#0F172A' }}>{voucher.voucher_number}</strong> for{' '}
            <strong style={{ color: '#0F172A' }}>{formatINR(voucher.amount)}</strong>?
          </p>
          <p style={styles.subtext}>
            Cancelling this voucher will mark it as CANCELLED, adjust the general ledger, and post an automatic reversal journal entry.
          </p>

          <div style={styles.reasonField}>
            <label style={styles.label}>Cancellation Reason / Audit Note</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Duplicate entry recorded in error, or supplier refunded transaction..."
              rows={3}
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            style={styles.cancelBtn}
          >
            Keep Voucher
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCancelling}
            style={styles.confirmBtn}
          >
            {isCancelling ? 'Voiding...' : 'Yes, Void Voucher'}
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
    maxWidth: '480px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
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
  text: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.5,
    color: '#475569',
  },
  subtext: {
    margin: 0,
    fontSize: '12.5px',
    lineHeight: 1.5,
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
  },
  reasonField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
  },
  textarea: {
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    resize: 'vertical',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
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
  confirmBtn: {
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
