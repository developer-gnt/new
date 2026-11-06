import React, { useState } from 'react';
import type {
  UserFilterOptions,
  UserTypeTabKey,
  UserStatus,
  UserSortOption,
} from '../types/user.types';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface UserFilterModalProps {
  isOpen: boolean;
  currentFilters: UserFilterOptions;
  onClose: () => void;
  onApply: (filters: UserFilterOptions) => void;
  onReset: () => void;
}

const TYPE_OPTIONS: { key: UserTypeTabKey; label: string }[] = [
  { key: 'all', label: 'All Roles' },
  { key: 'admin', label: 'Admins' },
  { key: 'member', label: 'Members' },
  { key: 'donor', label: 'Donors' },
  { key: 'seeker', label: 'Donation Seekers' },
  { key: 'general', label: 'General Users' },
];

const STATUS_OPTIONS: { key: 'all' | UserStatus; label: string }[] = [
  { key: 'all', label: 'All Statuses' },
  { key: 'active', label: 'Approved / Active' },
  { key: 'pending', label: 'Pending Review' },
  { key: 'blocked', label: 'Blocked' },
];

const SORT_OPTIONS: { key: UserSortOption; label: string }[] = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'name_asc', label: 'Name (A to Z)' },
  { key: 'name_desc', label: 'Name (Z to A)' },
];

export const UserFilterModal: React.FC<UserFilterModalProps> = ({
  isOpen,
  currentFilters,
  onClose,
  onApply,
  onReset,
}) => {
  const [selectedType, setSelectedType] = useState<UserTypeTabKey>(
    currentFilters.typeTab || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<'all' | UserStatus>(
    currentFilters.status || 'all'
  );
  const [joinedFrom, setJoinedFrom] = useState(currentFilters.joinedFrom || '');
  const [joinedTo, setJoinedTo] = useState(currentFilters.joinedTo || '');
  const [selectedSort, setSelectedSort] = useState<UserSortOption>(
    currentFilters.sortBy || 'newest'
  );

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      typeTab: selectedType,
      status: selectedStatus,
      joinedFrom: joinedFrom || undefined,
      joinedTo: joinedTo || undefined,
      sortBy: selectedSort,
    });
    onClose();
  };

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setJoinedFrom('');
    setJoinedTo('');
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
          maxWidth: '520px',
          maxHeight: '90vh',
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
              Filter & Sort Users
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

        {/* Scrollable body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* User Role */}
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
              User Role
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
                      padding: '6px 12px',
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
              Account Status
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
                      padding: '6px 12px',
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

          {/* Joined Date Range */}
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
              Date Joined (Range)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                  From
                </span>
                <input
                  type="date"
                  value={joinedFrom}
                  onChange={e => setJoinedFrom(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #DBE5EE',
                    backgroundColor: '#FFFFFF',
                    color: '#011F39',
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '4px' }}>
                  To
                </span>
                <input
                  type="date"
                  value={joinedTo}
                  onChange={e => setJoinedTo(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #DBE5EE',
                    backgroundColor: '#FFFFFF',
                    color: '#011F39',
                  }}
                />
              </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {SORT_OPTIONS.map(opt => {
                const isSelected = selectedSort === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedSort(opt.key)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      textAlign: 'left',
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

        {/* Footer actions */}
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
