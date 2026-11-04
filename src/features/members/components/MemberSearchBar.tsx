import type React from 'react';
import { Search, X, SlidersHorizontal, UserPlus, ArrowUpDown } from 'lucide-react';
import type { MemberSortOption, MembershipCategoryItem } from '../types/members.types';

interface MemberSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: MembershipCategoryItem[];
  sortOption: MemberSortOption;
  onSortChange: (sort: MemberSortOption) => void;
  onOpenFilterModal: () => void;
  onAddMember: () => void;
  hasActiveFilters?: boolean;
}

export const MemberSearchBar: React.FC<MemberSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortOption,
  onSortChange,
  onOpenFilterModal,
  onAddMember,
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
          maxWidth: '420px',
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
          placeholder="Search by name, phone, email, ID..."
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

      {/* Filter / Sort / Add Member Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Category Dropdown */}
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
          <option value="ALL">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort Selector */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as MemberSortOption)}
            style={{
              padding: '9px 12px 9px 30px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="joined_desc">Newest Joined</option>
            <option value="expiry_asc">Expiry (Earliest)</option>
          </select>
          <ArrowUpDown
            size={14}
            color="#6B7280"
            style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
          />
        </div>

        {/* Detailed Filters Modal Button */}
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

        {/* Add Member Button */}
        <button
          type="button"
          onClick={onAddMember}
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
          <UserPlus size={16} color="#FAD465" />
          <span>Add Member</span>
        </button>
      </div>
    </div>
  );
};

