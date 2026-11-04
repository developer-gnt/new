import type React from 'react';
import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import type { SupportTicket, TicketStatus } from '../types/support.types';
import { STATUS_META, shortTicketId } from '../types/support.types';

interface UpdateStatusModalProps {
  visible: boolean;
  ticket: SupportTicket | null;
  targetStatus: TicketStatus;
  onClose: () => void;
  onConfirm: (note?: string) => Promise<boolean>;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  visible,
  ticket,
  targetStatus,
  onClose,
  onConfirm,
}) => {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!visible || !ticket) return null;

  const currentMeta = STATUS_META[ticket.status] || STATUS_META.SUBMITTED;
  const targetMeta = STATUS_META[targetStatus] || STATUS_META.SUBMITTED;
  const shortId = shortTicketId(ticket.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const ok = await onConfirm(note.trim() || undefined);
      if (ok) {
        setNote('');
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Status transition failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Update Ticket Status</h2>
            <p style={styles.subtitle}>Ticket #{shortId}</p>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#718096" />
          </button>
        </div>

        {errorMsg && (
          <div style={styles.errorBanner}>
            <AlertCircle size={16} color="#DC2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Transition Visual Preview */}
          <div style={styles.transitionBox}>
            <div
              style={{
                ...styles.badge,
                backgroundColor: currentMeta.badgeBg,
                color: currentMeta.badgeText,
                borderColor: currentMeta.border,
              }}
            >
              {currentMeta.label}
            </div>

            <ArrowRight size={18} color="#718096" />

            <div
              style={{
                ...styles.badge,
                backgroundColor: targetMeta.badgeBg,
                color: targetMeta.badgeText,
                borderColor: targetMeta.border,
              }}
            >
              {targetMeta.label}
            </div>
          </div>

          <div style={styles.ticketSummaryBox}>
            <span style={styles.ticketSubject}>{ticket.subject}</span>
            <span style={styles.ticketComplainant}>
              Complainant: {ticket.user?.full_name || 'Citizen'} ({ticket.user?.email || 'No email'})
            </span>
          </div>

          {/* Action Note / Remarks Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {targetStatus === 'RESOLVED'
                ? 'Resolution Remarks & Action Taken'
                : 'Administrative Note / Reason (Optional)'}
            </label>
            <textarea
              rows={4}
              placeholder={
                targetStatus === 'RESOLVED'
                  ? 'Describe the resolution provided to the citizen or grievance redressal action taken...'
                  : 'Add notes for the case log or reasons for this status update...'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.confirmBtn,
                backgroundColor:
                  targetStatus === 'RESOLVED'
                    ? '#16A34A'
                    : targetStatus === 'UNDER_REVIEW'
                    ? '#0284C7'
                    : '#475569',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{submitting ? 'Updating...' : `Confirm as ${targetMeta.label}`}</span>
            </button>
          </div>
        </form>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(1, 31, 57, 0.2)',
    padding: '28px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottom: '1px solid #EDF2F7',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#718096',
    fontFamily: 'monospace',
    margin: '4px 0 0 0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFF5F5',
    border: '1px solid #FED7D7',
    color: '#C53030',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  transitionBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
  },
  badge: {
    fontSize: '13px',
    fontWeight: 700,
    padding: '4px 14px',
    borderRadius: '12px',
    border: '1px solid',
  },
  ticketSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  ticketSubject: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#011F39',
  },
  ticketComplainant: {
    fontSize: '12px',
    color: '#718096',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#011F39',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    fontSize: '13px',
    color: '#011F39',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#34516D',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
  confirmBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
};

