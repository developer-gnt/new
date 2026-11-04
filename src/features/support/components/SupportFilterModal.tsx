import type React from 'react';
import { useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import {
  TICKET_TABS,
  TICKET_CATEGORIES,
  PRIORITIES,
  type SupportFilterState,
} from '../types/support.types';

interface SupportFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SupportFilterState;
  onApply: (filters: SupportFilterState) => void;
  onReset: () => void;
}

export const SupportFilterModal: React.FC<SupportFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<SupportFilterState>({ ...filters });

  if (!visible) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Filter Tickets & Complaints</h2>
            <p style={styles.subtitle}>Refine results by status, category, priority or channel</p>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#718096" />
          </button>
        </div>

        <div style={styles.body}>
          {/* Status Filter */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>Lifecycle Status</label>
            <div style={styles.pillsRow}>
              {TICKET_TABS.map((t) => {
                const active = localFilters.status === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, status: t.key })}
                    style={{
                      ...styles.pill,
                      backgroundColor: active ? '#011F39' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#34516D',
                      borderColor: active ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>Category</label>
            <div style={styles.pillsRow}>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, category: 'ALL' })}
                style={{
                  ...styles.pill,
                  backgroundColor: localFilters.category === 'ALL' ? '#011F39' : '#FFFFFF',
                  color: localFilters.category === 'ALL' ? '#FFFFFF' : '#34516D',
                  borderColor: localFilters.category === 'ALL' ? '#011F39' : '#DCE4EC',
                }}
              >
                All Categories
              </button>
              {TICKET_CATEGORIES.map((c) => {
                const active = localFilters.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, category: c.id })}
                    style={{
                      ...styles.pill,
                      backgroundColor: active ? '#011F39' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#34516D',
                      borderColor: active ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>Priority</label>
            <div style={styles.pillsRow}>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, priority: 'ALL' })}
                style={{
                  ...styles.pill,
                  backgroundColor: localFilters.priority === 'ALL' ? '#011F39' : '#FFFFFF',
                  color: localFilters.priority === 'ALL' ? '#FFFFFF' : '#34516D',
                  borderColor: localFilters.priority === 'ALL' ? '#011F39' : '#DCE4EC',
                }}
              >
                All Priorities
              </button>
              {PRIORITIES.map((p) => {
                const active = localFilters.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, priority: p.id })}
                    style={{
                      ...styles.pill,
                      backgroundColor: active ? p.tone : '#FFFFFF',
                      color: active ? '#FFFFFF' : p.tone,
                      borderColor: p.tone,
                      fontWeight: 600,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intake Channel Filter */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>Intake Channel / Source</label>
            <div style={styles.pillsRow}>
              {[
                { id: 'ALL', label: 'All Channels' },
                { id: 'website', label: '🌐 Website' },
                { id: 'app', label: '📱 Mobile App' },
                { id: 'web', label: '💻 Web App' },
              ].map((s) => {
                const active = localFilters.source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, source: s.id })}
                    style={{
                      ...styles.pill,
                      backgroundColor: active ? '#011F39' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#34516D',
                      borderColor: active ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Filter */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>Date Range</label>
            <div style={styles.pillsRow}>
              {[
                { id: 'ALL', label: 'All Time' },
                { id: 'TODAY', label: 'Today' },
                { id: '7_DAYS', label: 'Past 7 Days' },
                { id: 'THIS_MONTH', label: 'This Month' },
                { id: '90_DAYS', label: 'Past 90 Days' },
              ].map((d) => {
                const active = localFilters.dateRange === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, dateRange: d.id })}
                    style={{
                      ...styles.pill,
                      backgroundColor: active ? '#011F39' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#34516D',
                      borderColor: active ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <button type="button" onClick={handleReset} style={styles.resetBtn}>
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>
          <div style={styles.rightActions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="button" onClick={handleApply} style={styles.applyBtn}>
              <Check size={16} />
              <span>Apply Filters</span>
            </button>
          </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '560px',
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
    fontSize: '20px',
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
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#011F39',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  pillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '24px',
    borderTop: '1px solid #EDF2F7',
    paddingTop: '16px',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#DC2626',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
  rightActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#34516D',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
  applyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
};
