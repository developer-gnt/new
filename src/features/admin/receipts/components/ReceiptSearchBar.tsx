import type React from 'react';
import { Search, X, SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReceiptSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilterModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ReceiptSearchBar: React.FC<ReceiptSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenFilterModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      {/* Search Input Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 300px',
          minWidth: '240px',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          padding: '0 12px',
          height: '40px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Search size={16} color="#9CA3AF" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search voucher, donor name, contact, cause or ref..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            marginLeft: '8px',
            fontSize: '13.5px',
            color: '#111827',
            backgroundColor: 'transparent',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: '#9CA3AF',
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter and CTA Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            backgroundColor: hasActiveFilters ? '#EFF6FF' : '#FFFFFF',
            color: hasActiveFilters ? '#011F39' : '#374151',
            cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={14} color={hasActiveFilters ? '#011F39' : '#6B7280'} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#2563EB',
              }}
            />
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              padding: '9px 12px',
              fontSize: '12.5px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#6B7280',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/admin/receipts/create')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
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
          <span>Record Income</span>
        </button>
      </div>
    </div>
  );
};
