import type React from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { OFFICIAL_EXPENSE_TYPES } from '../data/expensesFixtures';

interface ExpenseSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onRecordExpense: () => void;
}

export const ExpenseSearchBar: React.FC<ExpenseSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  hasActiveFilters,
  onResetFilters,
  onRecordExpense,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.leftGroup}>
        {/* Search input */}
        <div style={styles.searchBox}>
          <Search size={16} color="#64748B" style={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, payee, description, reference..."
            style={styles.input}
          />
        </div>

        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={styles.select}
          aria-label="Filter by Expense Category"
        >
          <option value="ALL">All Expense Accounts (5001-5015)</option>
          {OFFICIAL_EXPENSE_TYPES.map((t) => (
            <option key={t.code} value={t.code}>
              {t.code} — {t.name}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={styles.resetBtn}
            title="Reset filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Record Expense CTA */}
      <button
        type="button"
        onClick={onRecordExpense}
        style={styles.recordBtn}
      >
        <Plus size={16} strokeWidth={2.4} />
        <span>Record Expense</span>
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
    flex: '1 1 500px',
    flexWrap: 'wrap',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 260px',
    minWidth: '220px',
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
    maxWidth: '280px',
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
  recordBtn: {
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
    boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
    whiteSpace: 'nowrap',
  },
};
