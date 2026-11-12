import type React from 'react';
import { Search, Filter, RotateCcw, X, Calendar } from 'lucide-react';
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
  onAddRights?: () => void;
  totalFilteredCount?: number;
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
  totalFilteredCount,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-xs mb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search rights by title, description, category, tags..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedCategory || 'ALL'}
              onChange={(e) => onCategoryChange(e.target.value === 'ALL' ? null : e.target.value)}
              className="h-9 px-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer"
              aria-label="Filter by Category"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Window Select */}
          <div className="relative flex items-center">
            <select
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value as RightsDateFilter)}
              className="h-9 pl-7 pr-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer appearance-none"
              aria-label="Filter by Date Window"
            >
              <option value="ANY">Any Date</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>
            <Calendar size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Advanced Filters Button */}
          <button
            type="button"
            onClick={onOpenFilterModal}
            className={`h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-lg border flex items-center gap-2 transition-colors cursor-pointer ${
              hasActiveFilters
                ? 'border-[#011F39] bg-[#EDF2F7] text-[#011F39]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title="Open advanced filter options"
          >
            <Filter size={15} className="text-[#011F39]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#011F39]" />
            )}
          </button>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Info: Total Count */}
        {typeof totalFilteredCount === 'number' && (
          <div className="text-xs text-slate-500 font-medium shrink-0 self-end md:self-center">
            Showing <strong className="text-slate-800">{totalFilteredCount}</strong> articles
          </div>
        )}
      </div>
    </div>
  );
};
