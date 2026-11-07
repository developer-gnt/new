import type React from 'react';
import { Search, Filter, Globe, X, RotateCcw } from 'lucide-react';
import { EVENT_CATEGORIES } from '../types/events.types';

interface EventsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedFormat: string;
  onFormatChange: (fmt: string) => void;
  totalFilteredCount?: number;
  onCreateEvent?: () => void;
}

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
  totalFilteredCount,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) || selectedCategory !== 'ALL' || selectedFormat !== 'ALL';

  const handleReset = () => {
    onSearchChange('');
    onCategoryChange('ALL');
    onFormatChange('ALL');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-xs mb-6">
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
              placeholder="Search events by title, venue, or keywords..."
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
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-9 pl-8 pr-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer appearance-none"
            >
              <option value="ALL">All Categories</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Format Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedFormat}
              onChange={(e) => onFormatChange(e.target.value)}
              className="h-9 pl-8 pr-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer appearance-none"
            >
              <option value="ALL">All Formats</option>
              <option value="IN_PERSON">In-Person (Offline)</option>
              <option value="ONLINE">Online (Virtual)</option>
              <option value="HYBRID">Hybrid Mode</option>
            </select>
            <Globe size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Info: Filtered Count */}
        {typeof totalFilteredCount === 'number' && (
          <div className="text-xs text-slate-500 font-medium shrink-0 self-end md:self-center">
            Showing <strong className="text-slate-800">{totalFilteredCount}</strong> events
          </div>
        )}
      </div>
    </div>
  );
};
