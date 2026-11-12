import type React from 'react';
import { Search, RotateCcw, X, Filter, CreditCard } from 'lucide-react';
import { OFFICIAL_EXPENSE_TYPES } from '../data/expensesFixtures';

interface ExpenseSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeMethod?: string;
  onMethodChange?: (method: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onRecordExpense?: () => void;
  totalFilteredCount?: number;
}

export const ExpenseSearchBar: React.FC<ExpenseSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeMethod = 'ALL',
  onMethodChange,
  hasActiveFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  return (
    <div className="bg-white p-3.5 sm:p-4 border-b border-[#DCE4EC]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#718096] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Voucher ID, payee, description, reference..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#DBE5EE] text-xs text-[#0B2F52] placeholder-[#718096] bg-[#EDF2F7] hover:bg-white focus:bg-white focus:border-[#FAD465] focus:outline-none focus:ring-2 focus:ring-[#FAD465] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Payment Method Dropdown */}
          {onMethodChange && (
            <div className="relative flex items-center">
              <select
                value={activeMethod}
                onChange={(e) => onMethodChange(e.target.value)}
                className="h-9 pl-7 pr-6 text-xs font-medium rounded-xl border border-[#DBE5EE] bg-[#EDF2F7] text-[#06294D] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465] cursor-pointer appearance-none"
                aria-label="Filter by Payment Method"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI Transfer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Debit / Credit Card</option>
              </select>
              <CreditCard size={13} className="absolute left-2.5 text-[#718096] pointer-events-none" />
            </div>
          )}

          {/* Category Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-9 pl-7 pr-6 text-xs font-medium rounded-xl border border-[#DBE5EE] bg-[#EDF2F7] text-[#06294D] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465] cursor-pointer appearance-none max-w-xs"
              aria-label="Filter by Expense Category"
            >
              <option value="ALL">All Expense Accounts (5001-5015)</option>
              {OFFICIAL_EXPENSE_TYPES.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>
            <Filter size={13} className="absolute left-2.5 text-[#718096] pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-[#06294D] bg-[#EDF2F7] hover:bg-[#DBE5EE] border border-[#DBE5EE] rounded-xl transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Info: Total Count */}
        {typeof totalFilteredCount === 'number' && (
          <div className="text-xs text-[#718096] font-medium shrink-0 self-end lg:self-center">
            Showing <strong className="text-[#0B2F52]">{totalFilteredCount}</strong> vouchers
          </div>
        )}
      </div>
    </div>
  );
};
