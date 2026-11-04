import type React from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { TICKET_CATEGORIES } from '../types/support.types';

interface SupportSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  activeFilterCount: number;
  onOpenFilterModal: () => void;
  onOpenCreateModal: () => void;
}

export const SupportSearchBar: React.FC<SupportSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSource,
  onSourceChange,
  activeFilterCount,
  onOpenFilterModal,
  onOpenCreateModal,
}) => {
  return (
    <div style={styles.container}>
      {/* Search Input */}
      <div style={styles.searchWrapper}>
        <Search size={18} color="#718096" style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by Ticket ID, subject, citizen name or contact..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={styles.clearBtn}
            title="Clear search"
          >
            <X size={14} color="#718096" />
          </button>
        )}
      </div>

      {/* Category Dropdown Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={styles.select}
      >
        <option value="ALL">All Categories</option>
        {TICKET_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.label}
          </option>
        ))}
      </select>

      {/* Source Dropdown Filter */}
      <select
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
        style={styles.select}
      >
        <option value="ALL">All Channels</option>
        <option value="website">🌐 Website</option>
        <option value="app">📱 Mobile App</option>
        <option value="web">💻 Admin / Web</option>
      </select>

      {/* Advanced Filters Button */}
      <button
        type="button"
        onClick={onOpenFilterModal}
        style={{
          ...styles.filterBtn,
          borderColor: activeFilterCount > 0 ? '#011F39' : '#DCE4EC',
          backgroundColor: activeFilterCount > 0 ? '#EDF2F7' : '#FFFFFF',
        }}
      >
        <Filter size={16} color="#011F39" />
        <span style={styles.filterBtnText}>Filters</span>
        {activeFilterCount > 0 && <span style={styles.filterCountBadge}>{activeFilterCount}</span>}
      </button>

      {/* Create Support Ticket Action */}
      <button type="button" onClick={onOpenCreateModal} style={styles.createBtn}>
        <Plus size={18} color="#011F39" />
        <span>New Ticket</span>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1 1 300px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 36px 10px 38px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    color: '#011F39',
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    color: '#34516D',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
  },
  filterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    color: '#011F39',
  },
  filterBtnText: {
    fontSize: '13px',
  },
  filterCountBadge: {
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '10px',
    padding: '1px 6px',
  },
  createBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FAD465',
    color: '#011F39',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
    marginLeft: 'auto',
  },
};
