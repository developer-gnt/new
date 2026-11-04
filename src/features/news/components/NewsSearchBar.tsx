import type React from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { DEFAULT_NEWS_CATEGORIES } from '../types/news.types';

interface NewsSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  onOpenFilterModal: () => void;
  onAddNew: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const NewsSearchBar: React.FC<NewsSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenFilterModal,
  onAddNew,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div style={styles.container}>
      {/* Search Input Box */}
      <div style={styles.searchWrapper}>
        <Search size={18} color="#64748B" style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search news by headline, summary, tags or author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} style={styles.clearSearchBtn}>
            <X size={15} color="#64748B" />
          </button>
        )}
      </div>

      <div style={styles.controlsRow}>
        {/* Category Dropdown */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          style={styles.categorySelect}
        >
          <option value="">All Categories</option>
          {DEFAULT_NEWS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Filter Modal Trigger */}
        <button
          onClick={onOpenFilterModal}
          style={{
            ...styles.filterBtn,
            backgroundColor: hasActiveFilters ? '#EBF3FA' : '#FFFFFF',
            borderColor: hasActiveFilters ? '#011F39' : '#DCE4EC',
            color: hasActiveFilters ? '#011F39' : '#34516D',
          }}
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && <span style={styles.activeDot} />}
        </button>

        {/* Clear Filters (if active) */}
        {hasActiveFilters && (
          <button onClick={onClearFilters} style={styles.resetBtn}>
            <X size={14} />
            <span>Reset</span>
          </button>
        )}

        {/* New Article CTA */}
        <button onClick={onAddNew} style={styles.addBtn}>
          <Plus size={18} />
          <span>New Article</span>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1 1 320px',
    minWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '11px 38px 11px 42px',
    borderRadius: '10px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    color: '#011F39',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(1, 31, 57, 0.04)',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  controlsRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categorySelect: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    color: '#011F39',
    outline: 'none',
    cursor: 'pointer',
    height: '42px',
  },
  filterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    position: 'relative',
    height: '42px',
  },
  activeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#011F39',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    backgroundColor: '#FDEEEF',
    border: '1px solid #FED7D7',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(1, 31, 57, 0.2)',
    height: '42px',
  },
};
