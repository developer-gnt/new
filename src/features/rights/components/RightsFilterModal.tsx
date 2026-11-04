import type React from 'react';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { RightsDateFilter, RightsFilterState, RightsStatusFilter } from '../types/rights.types';

interface RightsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  applied: RightsFilterState;
  onApply: (filter: RightsFilterState) => void;
  onReset: () => void;
}

const FilterModalContent: React.FC<{
  categories: string[];
  applied: RightsFilterState;
  onClose: () => void;
  onApply: (filter: RightsFilterState) => void;
  onReset: () => void;
}> = ({ categories, applied, onClose, onApply, onReset }) => {
  const [selectedStatus, setSelectedStatus] = useState<RightsStatusFilter>(applied.status);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(applied.category);
  const [selectedDateRange, setSelectedDateRange] = useState<RightsDateFilter>(applied.dateRange);

  const statuses: Array<{ key: RightsStatusFilter; label: string }> = [
    { key: 'ALL', label: 'All Statuses' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'DRAFT', label: 'Draft' },
    { key: 'ARCHIVED', label: 'Archived' },
  ];

  const dateOptions: Array<{ key: RightsDateFilter; label: string }> = [
    { key: 'ANY', label: 'Any Date' },
    { key: 'TODAY', label: 'Today' },
    { key: 'WEEK', label: 'This Week' },
    { key: 'MONTH', label: 'This Month' },
  ];

  const handleApply = () => {
    onApply({
      status: selectedStatus,
      category: selectedCategory,
      dateRange: selectedDateRange,
    });
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.header}>
        <h3 style={styles.title}>Filter Rights Articles</h3>
        <button type="button" onClick={onClose} style={styles.closeBtn} title="Close filter">
          <X size={18} />
        </button>
      </div>

      <div style={styles.body}>
        {/* Status Section */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Publication Status</label>
          <div style={styles.chipsRow}>
            {statuses.map((s) => {
              const active = selectedStatus === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedStatus(s.key)}
                  style={{
                    ...styles.chip,
                    backgroundColor: active ? '#06294D' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    borderColor: active ? '#06294D' : '#CBD5E1',
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Section */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Rights Category</label>
          <div style={styles.chipsRow}>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              style={{
                ...styles.chip,
                backgroundColor: selectedCategory === null ? '#06294D' : '#F1F5F9',
                color: selectedCategory === null ? '#FFFFFF' : '#475569',
                borderColor: selectedCategory === null ? '#06294D' : '#CBD5E1',
              }}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  style={{
                    ...styles.chip,
                    backgroundColor: active ? '#06294D' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    borderColor: active ? '#06294D' : '#CBD5E1',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Window Section */}
        <div style={styles.section}>
          <label style={styles.sectionLabel}>Date Range</label>
          <div style={styles.chipsRow}>
            {dateOptions.map((d) => {
              const active = selectedDateRange === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDateRange(d.key)}
                  style={{
                    ...styles.chip,
                    backgroundColor: active ? '#06294D' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    borderColor: active ? '#06294D' : '#CBD5E1',
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button type="button" onClick={handleReset} style={styles.resetBtn}>
          Reset
        </button>
        <button type="button" onClick={handleApply} style={styles.applyBtn}>
          <Check size={16} />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};

export const RightsFilterModal: React.FC<RightsFilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  applied,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <FilterModalContent
          categories={categories}
          applied={applied}
          onClose={onClose}
          onApply={onApply}
          onReset={onReset}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.4)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #E2E8F0',
  },
  title: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 700,
    color: '#011F39',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#64748B',
    padding: '4px',
    borderRadius: '6px',
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
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
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#475569',
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderTop: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  resetBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#64748B',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  applyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

