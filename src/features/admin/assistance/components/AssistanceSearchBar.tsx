import type React from 'react';
import { Search, X, SlidersHorizontal, Plus } from 'lucide-react';
import { CAUSE_OPTIONS } from '../data/assistanceFixtures';

interface AssistanceSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedUrgency: string;
  onUrgencyChange: (urgency: string) => void;
  onOpenFilterModal: () => void;
  onAddSeeker: () => void;
  hasActiveFilters?: boolean;
}

export const AssistanceSearchBar: React.FC<AssistanceSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedUrgency,
  onUrgencyChange,
  onOpenFilterModal,
  onAddSeeker,
  hasActiveFilters,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '400px',
        }}
      >
        <Search
          size={18}
          color="#9CA3AF"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        <input
          type="text"
          placeholder="Search by name, ID, cause, city..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 36px 10px 38px',
            fontSize: '13.5px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            outline: 'none',
            backgroundColor: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Cause Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{
            padding: '9px 12px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#374151',
            outline: 'none',
            cursor: 'pointer',
            maxWidth: '180px',
          }}
        >
          <option value="ALL">All Causes</option>
          {CAUSE_OPTIONS.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Urgency Selector */}
        <select
          value={selectedUrgency}
          onChange={(e) => onUrgencyChange(e.target.value)}
          style={{
            padding: '9px 12px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#374151',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">All Urgencies</option>
          <option value="CRITICAL">Critical Emergency</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium</option>
          <option value="NORMAL">Normal</option>
        </select>

        {/* Filters Modal Trigger */}
        <button
          type="button"
          onClick={onOpenFilterModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 14px',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '8px',
            border: hasActiveFilters ? '1px solid #011F39' : '1px solid #D1D5DB',
            backgroundColor: hasActiveFilters ? '#F0F4F8' : '#FFFFFF',
            color: hasActiveFilters ? '#011F39' : '#374151',
            cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={15} color={hasActiveFilters ? '#011F39' : '#6B7280'} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#011F39',
              }}
            />
          )}
        </button>

        {/* Add Cause Button */}
        <button
          type="button"
          onClick={onAddSeeker}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            fontSize: '13.5px',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#011F39',
            color: '#FAD465',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(1, 31, 57, 0.15)',
          }}
        >
          <Plus size={16} color="#FAD465" />
          <span>Create Aid Cause</span>
        </button>
      </div>
    </div>
  );
};

