import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface ApplicationsSearchBarProps {
  query: string;
  onChangeQuery: (text: string) => void;
  onFilterClick: () => void;
  hasActiveFilters?: boolean;
}

export const ApplicationsSearchBar: React.FC<ApplicationsSearchBarProps> = ({
  query,
  onChangeQuery,
  onFilterClick,
  hasActiveFilters = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      {/* Search Input Box */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={18}
          color="#718096"
          style={{
            position: 'absolute',
            left: '14px',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={query}
          onChange={e => onChangeQuery(e.target.value)}
          placeholder="Search applications by applicant name, ID, phone, email..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '11px 40px 11px 42px',
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #DBE5EE',
            backgroundColor: '#FFFFFF',
            color: '#011F39',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => onChangeQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: '#718096',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={onFilterClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 18px',
          borderRadius: '10px',
          border: hasActiveFilters ? '1px solid #011F39' : '1px solid #DBE5EE',
          backgroundColor: hasActiveFilters ? '#FAF7F0' : '#FFFFFF',
          color: '#011F39',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <SlidersHorizontal size={17} color="#011F39" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#011F39',
            }}
          />
        )}
      </button>
    </div>
  );
};

