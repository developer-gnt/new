import type React from 'react';
import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import {
  TICKET_CATEGORIES,
  PRIORITIES,
  type CreateTicketBody,
  type TicketPriority,
  type TicketSourceType,
} from '../types/support.types';

interface CreateTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (body: CreateTicketBody) => Promise<boolean>;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<string>('Membership');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('NORMAL');
  const [source, setSource] = useState<TicketSourceType>('web');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!visible) return null;

  const isGeneralCategory = category === 'General';

  const resetForm = () => {
    setCategory('Membership');
    setCustomCategory('');
    setPriority('NORMAL');
    setSource('web');
    setSubject('');
    setDescription('');
    setErrorMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGeneralCategory && !customCategory.trim()) {
      setErrorMsg('Please specify the custom category/topic.');
      return;
    }
    if (!subject.trim() || subject.trim().length < 3) {
      setErrorMsg('Please enter a valid subject (at least 3 characters).');
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      setErrorMsg('Please enter a detailed description of the grievance/ticket (at least 5 characters).');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const finalCategory = isGeneralCategory && customCategory.trim()
        ? customCategory.trim()
        : category;

      const success = await onSubmit({
        category: finalCategory,
        priority,
        source,
        subject: subject.trim(),
        description: description.trim(),
      });

      if (success) {
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit ticket');
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
            <h2 style={styles.title}>Create Support Ticket</h2>
            <p style={styles.subtitle}>
              Record a citizen grievance, member complaint or internal inquiry
            </p>
          </div>
          <button type="button" onClick={handleClose} style={styles.closeBtn}>
            <X size={20} color="#718096" />
          </button>
        </div>

        {errorMsg && (
          <div style={styles.errorBanner}>
            <AlertCircle size={16} color="#DC2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Category Selector */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <div style={styles.categoryGrid}>
              {TICKET_CATEGORIES.map((c) => {
                const selected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    style={{
                      ...styles.categoryCard,
                      borderColor: selected ? '#011F39' : '#DCE4EC',
                      backgroundColor: selected ? '#EDF2F7' : '#FFFFFF',
                      color: selected ? '#011F39' : '#34516D',
                      fontWeight: selected ? 700 : 500,
                    }}
                  >
                    <span style={styles.categoryIcon}>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
            {isGeneralCategory && (
              <input
                type="text"
                placeholder="Specify grievance topic (e.g., Police Misconduct, Land Dispute)..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{ ...styles.input, marginTop: '8px' }}
              />
            )}
          </div>

          {/* Priority & Source Row */}
          <div style={styles.row}>
            {/* Priority Selector */}
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Urgency & Priority</label>
              <div style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isSel = priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      style={{
                        ...styles.priorityPill,
                        backgroundColor: isSel ? p.badgeBg : '#FFFFFF',
                        borderColor: isSel ? p.tone : '#DCE4EC',
                        color: isSel ? p.tone : '#718096',
                        fontWeight: isSel ? 700 : 500,
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inflow Channel / Source */}
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Intake Channel</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as TicketSourceType)}
                style={styles.input}
              >
                <option value="web">💻 Admin / Web Console</option>
                <option value="website">🌐 Public Website Portal</option>
                <option value="app">📱 Mobile Application</option>
              </select>
            </div>
          </div>

          {/* Subject Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Subject / Ticket Headline *</label>
            <input
              type="text"
              placeholder="e.g. 80G Certificate not received for Winter Relief donation"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Detailed Concern Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Details of Concern / Description *</label>
            <textarea
              rows={5}
              placeholder="Provide complete facts, affected party details, transaction reference, or requested administrative action..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>

          {/* Modal Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creating Ticket...' : 'Create Ticket'}
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
    maxWidth: '680px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
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
    fontSize: '22px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#718096',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#011F39',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '8px',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    gap: '4px',
  },
  categoryIcon: {
    fontSize: '18px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  priorityRow: {
    display: 'flex',
    gap: '8px',
  },
  priorityPill: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    fontSize: '14px',
    color: '#011F39',
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    fontSize: '14px',
    color: '#011F39',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    borderTop: '1px solid #EDF2F7',
    paddingTop: '16px',
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
  submitBtn: {
    padding: '10px 22px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontWeight: 700,
    fontSize: '13px',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
  },
};
