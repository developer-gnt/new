import React from 'react';
import { Search, CheckCheck, Filter, X } from 'lucide-react';

interface NotificationsSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
  onMarkAllRead: () => void;
  onCreateBroadcast?: () => void;
  unreadCount: number;
  isBroadcastView: boolean;
  totalFilteredCount?: number;
}

export const NotificationsSearchBar: React.FC<NotificationsSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  onMarkAllRead,
  unreadCount,
  isBroadcastView,
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
              placeholder={
                isBroadcastView
                  ? 'Search announcements by subject or target...'
                  : 'Search notifications by title or description...'
              }
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

          {/* Priority Filter */}
          {!isBroadcastView && (
            <div className="relative flex items-center">
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="h-9 pl-7 pr-3 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#011F39] cursor-pointer appearance-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent Alerts</option>
                <option value="HIGH">High Priority</option>
                <option value="NORMAL">Normal Priority</option>
              </select>
              <Filter size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            </div>
          )}

          {/* Mark All Read Button */}
          {!isBroadcastView && (
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold border transition-colors ${
                unreadCount === 0
                  ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-2xs'
              }`}
              title="Mark all notifications as read"
            >
              <CheckCheck size={14} className={unreadCount > 0 ? 'text-[#011F39]' : 'text-slate-400'} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Right Info: Total Count */}
        {typeof totalFilteredCount === 'number' && (
          <div className="text-xs text-slate-500 font-medium shrink-0 self-end md:self-center">
            Showing <strong className="text-slate-800">{totalFilteredCount}</strong> items
          </div>
        )}
      </div>
    </div>
  );
};
