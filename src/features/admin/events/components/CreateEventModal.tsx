import type React from 'react';
import { useState } from 'react';
import { X, Calendar, MapPin, Users, Globe, Building } from 'lucide-react';
import {
  EVENT_CATEGORIES,
  type CreateEventFormState,
  type EventFormat,
} from '../types/events.types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: CreateEventFormState) => void;
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

const getInitialFormData = (): CreateEventFormState => ({
  title: '',
  description: '',
  coverImageUri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  category: 'Legal Awareness',
  eventType: 'IN_PERSON',
  eventDate: getTodayString(),
  startTime: '10:00',
  endDate: getTodayString(),
  endTime: '16:00',
  allDay: false,
  location: '',
  address: '',
  registrationRequired: true,
  totalSeats: '200',
  perPersonLimit: '2',
  organizedBy: 'Central Legal Aid Committee',
  targetAudience: 'Open to All',
  language: 'Hindi & English',
  shortInformation: '',
  tags: ['Human Rights', 'Legal Aid'],
  status: 'PUBLISH',
});

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateEventFormState>(getInitialFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Event title is required.';
    }
    if (!formData.location.trim()) {
      errs.location = 'Location / venue is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Event description is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <Calendar size={18} color="#06294D" />
            <h3 style={styles.headerTitle}>Create New Event or Conclave</h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.body}>
            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. National Legal Aid & Fundamental Rights Conclave 2026"
                style={{
                  ...styles.input,
                  borderColor: errors.title ? '#EF4444' : '#CBD5E1',
                }}
              />
              {errors.title && <span style={styles.errorText}>{errors.title}</span>}
            </div>

            {/* Category & Format */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={styles.select}
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Event Format *</label>
                <div style={styles.selectWrap}>
                  <Globe size={15} color="#94A3B8" style={styles.selectIcon} />
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value as EventFormat })
                    }
                    style={styles.selectWithIcon}
                  >
                    <option value="IN_PERSON">In-Person (Physical Venue)</option>
                    <option value="ONLINE">Online (Virtual Conclave)</option>
                    <option value="HYBRID">Hybrid Mode</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date, Start Time, End Time */}
            <div style={styles.row3}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Date *</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Location & Capacity */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location / Venue Name *</label>
                <div style={styles.selectWrap}>
                  <MapPin size={15} color="#94A3B8" style={styles.selectIcon} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Vigyan Bhavan / Zoom Webinar"
                    style={{
                      ...styles.selectWithIcon,
                      borderColor: errors.location ? '#EF4444' : '#CBD5E1',
                    }}
                  />
                </div>
                {errors.location && <span style={styles.errorText}>{errors.location}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Total Seat Capacity</label>
                <div style={styles.selectWrap}>
                  <Users size={15} color="#94A3B8" style={styles.selectIcon} />
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    placeholder="200"
                    style={styles.selectWithIcon}
                  />
                </div>
              </div>
            </div>

            {/* Organizer & Language */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Organizing Committee / Unit</label>
                <div style={styles.selectWrap}>
                  <Building size={15} color="#94A3B8" style={styles.selectIcon} />
                  <input
                    type="text"
                    value={formData.organizedBy}
                    onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })}
                    placeholder="e.g. State Directorate, Maharashtra"
                    style={styles.selectWithIcon}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="Hindi, English"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Short Info */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Short Summary</label>
              <input
                type="text"
                value={formData.shortInformation}
                onChange={(e) => setFormData({ ...formData, shortInformation: e.target.value })}
                placeholder="One sentence overview displayed on cards..."
                style={styles.input}
              />
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Event Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive agenda, keynote speakers, delegate guidelines..."
                style={{
                  ...styles.textarea,
                  borderColor: errors.description ? '#EF4444' : '#CBD5E1',
                }}
              />
              {errors.description && <span style={styles.errorText}>{errors.description}</span>}
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Publish Event
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
    maxWidth: '620px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: '90vh',
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
    fontSize: '17px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  selectWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  selectIcon: {
    position: 'absolute',
    left: '10px',
    pointerEvents: 'none',
  },
  selectWithIcon: {
    width: '100%',
    padding: '10px 12px 10px 32px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  errorText: {
    fontSize: '11px',
    color: '#DC2626',
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
  submitBtn: {
    padding: '9px 22px',
    borderRadius: '8px',
    backgroundColor: '#06294D',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(6, 41, 77, 0.25)',
  },
};
