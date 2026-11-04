import type React from 'react';
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import type { MemberSortOption, MembershipCategoryItem } from '../types/members.types';

interface MemberFilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories: MembershipCategoryItem[];
  selectedCategory: string;
  selectedStatus: string;
  selectedSort: MemberSortOption;
  onApply: (filters: { category: string; status: string; sort: MemberSortOption }) => void;
  onReset: () => void;
}

export const MemberFilterModal: React.FC<MemberFilterModalProps> = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  selectedStatus,
  selectedSort,
  onApply,
  onReset,
}) => {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localStatus, setLocalStatus] = useState(selectedStatus);
  const [localSort, setLocalSort] = useState(selectedSort);

  if (!visible) return null;

  const statuses: { label: string; value: string }[] = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Expiring Soon', value: 'EXPIRING_SOON' },
    { label: 'Inactive / Suspended', value: 'INACTIVE' },
  ];

  const sorts: { label: string; value: MemberSortOption }[] = [
    { label: 'Default List Order', value: 'default' },
    { label: 'Alphabetical: Name (A-Z)', value: 'name_asc' },
    { label: 'Enrolled Date: Newest First', value: 'joined_desc' },
    { label: 'Validity: Earliest Expiry First', value: 'expiry_asc' },
  ];

  const handleApply = () => {
    onApply({
      category: localCategory,
      status: localStatus,
      sort: localSort,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalCategory('ALL');
    setLocalStatus('ALL');
    setLocalSort('default');
    onReset();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#FAF7F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#011F39',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter size={16} color="#FAD465" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                Filter Member Directory
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                Refine directory records by category, lifecycle & sort
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Membership Category */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Membership Category / Post
            </label>
            <select
              value={localCategory}
              onChange={(e) => setLocalCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '13.5px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
                outline: 'none',
              }}
            >
              <option value="ALL">All Categories (Standard & Council)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({typeof c.fee === 'number' ? `₹${c.fee.toLocaleString('en-IN')}` : c.fee})
                </option>
              ))}
            </select>
          </div>

          {/* Member Status */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Membership Lifecycle Status
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {statuses.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setLocalStatus(st.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: localStatus === st.value ? '2px solid #011F39' : '1px solid #D1D5DB',
                    backgroundColor: localStatus === st.value ? '#F0F4F8' : '#FFFFFF',
                    color: localStatus === st.value ? '#011F39' : '#4B5563',
                    fontSize: '12.5px',
                    fontWeight: localStatus === st.value ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Option */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Sort Directory By
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {sorts.map((so) => (
                <label
                  key={so.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#374151',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  <input
                    type="radio"
                    name="filter_sort"
                    value={so.value}
                    checked={localSort === so.value}
                    onChange={() => setLocalSort(so.value)}
                    style={{ accentColor: '#011F39' }}
                  />
                  <span>{so.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6B7280',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#011F39',
                cursor: 'pointer',
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
