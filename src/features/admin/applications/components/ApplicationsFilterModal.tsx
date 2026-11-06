import React, { useState } from 'react';
import type {
  ApplicationFilterOptions,
  ApplicationTypeFilter,
  ApplicationStatus,
} from '../types/applications.types';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface ApplicationsFilterModalProps {
  isOpen: boolean;
  currentFilters: ApplicationFilterOptions;
  onClose: () => void;
  onApply: (filters: ApplicationFilterOptions) => void;
  onReset: () => void;
}

const TYPE_OPTIONS: { key: ApplicationTypeFilter; label: string }[] = [
  { key: 'all', label: 'All Application Types' },
  { key: 'membership', label: 'Membership Applications' },
  { key: 'seeker', label: 'Donor Seeker Applications' },
];

const STATUS_OPTIONS: { key: 'all' | ApplicationStatus; label: string }[] = [
  { key: 'all', label: 'All Statuses' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const SORT_OPTIONS: { key: ApplicationFilterOptions['sortBy']; label: string }[] = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'name_asc', label: 'Name (A to Z)' },
];

export const ApplicationsFilterModal: React.FC<ApplicationsFilterModalProps> = ({
  isOpen,
  currentFilters,
  onClose,
  onApply,
  onReset,
}) => {
  const [selectedType, setSelectedType] = useState<ApplicationTypeFilter>(
    currentFilters.type || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<'all' | ApplicationStatus>(
    currentFilters.status || 'all'
  );
  const [selectedSort, setSelectedSort] = useState<ApplicationFilterOptions['sortBy']>(
    currentFilters.sortBy || 'newest'
  );

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      ...currentFilters,
      type: selectedType,
      accountType: selectedType,
      status: selectedStatus,
      sortBy: selectedSort,
    });
    onClose();
  };

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedSort('newest');
    onReset();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        padding: '16px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #EDF2F7',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #EDF2F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#011F39" />
            <h3
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '18px',
                fontWeight: 700,
                color: '#011F39',
                margin: 0,
              }}
            >
              Filter Applications
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#718096',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* Account Type */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#011F39',
                marginBottom: '8px',
              }}
            >
              Application Stream
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TYPE_OPTIONS.map(opt => {
                const isSelected = selectedType === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedType(opt.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1px solid #011F39' : '1px solid #DBE5EE',
                      backgroundColor: isSelected ? '#011F39' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#34516D',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#011F39',
                marginBottom: '8px',
              }}
            >
              Application Status
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STATUS_OPTIONS.map(opt => {
                const isSelected = selectedStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedStatus(opt.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1px solid #011F39' : '1px solid #DBE5EE',
                      backgroundColor: isSelected ? '#011F39' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#34516D',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#011F39',
                marginBottom: '8px',
              }}
            >
              Sort By
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SORT_OPTIONS.map(opt => {
                const isSelected = selectedSort === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedSort(opt.key)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      textAlign: 'center',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1px solid #011F39' : '1px solid #DBE5EE',
                      backgroundColor: isSelected ? '#FAF7F0' : '#FFFFFF',
                      color: isSelected ? '#011F39' : '#34516D',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #EDF2F7',
            backgroundColor: '#FAF7F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#34516D',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#34516D',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DBE5EE',
                borderRadius: '8px',
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
                color: '#011F39',
                backgroundColor: '#FAD465',
                border: 'none',
                borderRadius: '8px',
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

