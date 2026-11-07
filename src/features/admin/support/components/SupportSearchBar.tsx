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
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Ticket ID, subject, citizen name, email or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 px-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {TICKET_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>

          {/* Source Channel Dropdown Filter */}
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="h-9 px-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer"
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
            className={`h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-lg border flex items-center gap-2 transition-colors cursor-pointer ${
              activeFilterCount > 0
                ? 'border-[#011F39] bg-[#EDF2F7] text-[#011F39]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Filter size={15} className="text-[#011F39]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#011F39] text-white text-[11px] font-bold rounded-full px-1.5 py-0.2 leading-tight">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Action: Create New Ticket */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full lg:w-auto h-9 px-4 text-xs sm:text-sm font-bold rounded-lg bg-[#FAD465] hover:bg-[#e9bf36] text-[#011F39] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
