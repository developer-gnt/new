import type React from 'react';
import { Search, Plus, Filter, Globe } from 'lucide-react';
import { EVENT_CATEGORIES } from '../types/events.types';

interface EventsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedFormat: string;
  onFormatChange: (fmt: string) => void;
  onCreateEvent: () => void;
}

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
  onCreateEvent,
}) => {
  return (
    <div style={styles.container}>
      {/* Search Input */}
      <div style={styles.searchWrap}>
        <Search size={16} color="#94A3B8" style={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events by title, venue, or keywords..."
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={styles.clearBtn}
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Filters & Create Event Button */}
      <div style={styles.actionsWrap}>
        {/* Category Dropdown */}
        <div style={styles.selectWrap}>
          <Filter size={14} color="#64748B" style={styles.selectIcon} />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">All Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Format Dropdown */}
        <div style={styles.selectWrap}>
          <Globe size={14} color="#64748B" style={styles.selectIcon} />
          <select
            value={selectedFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">All Formats</option>
            <option value="IN_PERSON">In-Person (Offline)</option>
            <option value="ONLINE">Online (Virtual)</option>
            <option value="HYBRID">Hybrid Mode</option>
          </select>
        </div>

        {/* Create Event Button */}
        <button
          type="button"
          onClick={onCreateEvent}
          style={styles.createBtn}
        >
          <Plus size={16} color="#011F39" strokeWidth={2.5} />
          <span>Create Event</span>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 36px 9px 36px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13.5px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px',
  },
  actionsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  selectWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  selectIcon: {
    position: 'absolute',
    left: '10px',
    pointerEvents: 'none',
  },
  select: {
    padding: '9px 12px 9px 30px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '12.5px',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
  },
  createBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
  },
};
