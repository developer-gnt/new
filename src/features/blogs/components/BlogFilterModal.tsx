import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { BlogStatusFilter, BlogDateFilter } from '../types/blog.types';
import { DEFAULT_BLOG_CATEGORIES } from '../types/blog.types';

interface BlogFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: BlogStatusFilter;
  category: string | null;
  dateRange: BlogDateFilter;
  onApply: (status: BlogStatusFilter, category: string | null, dateRange: BlogDateFilter) => void;
  onReset: () => void;
}

export const BlogFilterModal: React.FC<BlogFilterModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <BlogFilterModalContent {...props} />;
};

const BlogFilterModalContent: React.FC<BlogFilterModalProps> = ({
  onClose,
  status: initialStatus,
  category: initialCategory,
  dateRange: initialDateRange,
  onApply,
  onReset,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BlogStatusFilter>(initialStatus);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedDateRange, setSelectedDateRange] = useState<BlogDateFilter>(initialDateRange);

  const statuses: { key: BlogStatusFilter; label: string }[] = [
    { key: 'ALL', label: 'All Statuses' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'DRAFT', label: 'Drafts' },
    { key: 'ARCHIVED', label: 'Archived' },
  ];

  const dateRanges: { key: BlogDateFilter; label: string }[] = [
    { key: 'ANY', label: 'Any Time' },
    { key: 'TODAY', label: 'Today' },
    { key: 'WEEK', label: 'This Week' },
    { key: 'MONTH', label: 'This Month' },
  ];

  const handleSave = () => {
    onApply(selectedStatus, selectedCategory, selectedDateRange);
    onClose();
  };

  const handleClear = () => {
    setSelectedStatus('ALL');
    setSelectedCategory(null);
    setSelectedDateRange('ANY');
    onReset();
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Filter Articles & Blogs</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Status Options */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Publication Status</label>
            <div style={styles.chipsGrid}>
              {statuses.map((st) => {
                const isSelected = selectedStatus === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => setSelectedStatus(st.key)}
                    style={{
                      ...styles.chip,
                      backgroundColor: isSelected ? '#011F39' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#34516D',
                      borderColor: isSelected ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Options */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Publication Date Window</label>
            <div style={styles.chipsGrid}>
              {dateRanges.map((dr) => {
                const isSelected = selectedDateRange === dr.key;
                return (
                  <button
                    key={dr.key}
                    onClick={() => setSelectedDateRange(dr.key)}
                    style={{
                      ...styles.chip,
                      backgroundColor: isSelected ? '#011F39' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#34516D',
                      borderColor: isSelected ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{dr.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Options */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Article Category</label>
            <div style={styles.chipsGrid}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  ...styles.chip,
                  backgroundColor: selectedCategory === null ? '#011F39' : '#F8FAFC',
                  color: selectedCategory === null ? '#FFFFFF' : '#34516D',
                  borderColor: selectedCategory === null ? '#011F39' : '#DCE4EC',
                }}
              >
                {selectedCategory === null && <Check size={14} />}
                <span>All Categories</span>
              </button>
              {DEFAULT_BLOG_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      ...styles.chip,
                      backgroundColor: isSelected ? '#011F39' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#34516D',
                      borderColor: isSelected ? '#011F39' : '#DCE4EC',
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={handleClear} style={styles.resetBtn}>
            Reset All
          </button>
          <div style={styles.footerRight}>
            <button onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={handleSave} style={styles.applyBtn}>
              Apply Filters
            </button>
          </div>
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
    backgroundColor: 'rgba(1, 31, 57, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '540px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(1, 31, 57, 0.2)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #DCE4EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    color: '#011F39',
    margin: 0,
    fontWeight: 700,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#011F39',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  chipsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #DCE4EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  footerRight: {
    display: 'flex',
    gap: '10px',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: '#DC2626',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  cancelBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#34516D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  applyBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
