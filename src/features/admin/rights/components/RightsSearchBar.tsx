import type React from 'react';
import { Search, Filter, RotateCcw, Plus } from 'lucide-react';
import type { RightsDateFilter } from '../types/rights.types';

interface RightsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
  selectedDateRange: RightsDateFilter;
  onDateRangeChange: (range: RightsDateFilter) => void;
  onOpenFilterModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  onAddRights: () => void;
}

export const RightsSearchBar: React.FC<RightsSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedDateRange,
  onDateRangeChange,
  onOpenFilterModal,
  onResetFilters,
  hasActiveFilters,
  onAddRights,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.leftGroup}>
        {/* Search Input */}
        <div style={styles.searchBox}>
          <Search size={16} color="#64748B" style={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search rights by title, description, category, tags..."
            style={styles.input}
          />
        </div>

        {/* Category Select */}
        <select
          value={selectedCategory || 'ALL'}
          onChange={(e) => onCategoryChange(e.target.value === 'ALL' ? null : e.target.value)}
          style={styles.select}
          aria-label="Filter by Category"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Date Window Select */}
        <select
          value={selectedDateRange}
          onChange={(e) => onDateRangeChange(e.target.value as RightsDateFilter)}
          style={styles.select}
          aria-label="Filter by Date Window"
        >
          <option value="ANY">Any Date</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">This Week</option>
          <option value="MONTH">This Month</option>
        </select>

        {/* Multi-Criteria Filter Button */}
        <button
          type="button"
          onClick={onOpenFilterModal}
          style={{
            ...styles.filterBtn,
            backgroundColor: hasActiveFilters ? '#EFF6FF' : '#FFFFFF',
            borderColor: hasActiveFilters ? '#06294D' : '#CBD5E1',
            color: hasActiveFilters ? '#06294D' : '#475569',
          }}
          title="Open advanced filter options"
        >
          <Filter size={15} />
          <span>Filters</span>
          {hasActiveFilters && <span style={styles.activeDot} />}
        </button>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={styles.resetBtn}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={onAddRights}
        style={styles.addBtn}
      >
        <Plus size={16} strokeWidth={2.4} />
        <span>Add Rights Content</span>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px',
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 540px',
    flexWrap: 'wrap',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 240px',
    minWidth: '200px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '9px 12px 9px 36px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#F8FAFC',
    transition: 'border-color 0.15s ease',
  },
  select: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    cursor: 'pointer',
  },
  filterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 14px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    position: 'relative',
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#EA580C',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
  },
};

