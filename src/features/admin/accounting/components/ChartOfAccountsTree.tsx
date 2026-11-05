import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  XCircle,
  Landmark,
} from 'lucide-react';
import type {
  AccountItem,
  AccountCategory,
  AccountType,
} from '../types/accounting.types';
import { formatINR } from '../types/accounting.types';

interface ChartOfAccountsTreeProps {
  accounts: AccountItem[];
  onAddAccount: () => void;
  onSelectAccount: (account: AccountItem) => void;
  onViewLedger: (account: AccountItem) => void;
  onToggleStatus: (account: AccountItem) => void;
}

export const ChartOfAccountsTree: React.FC<ChartOfAccountsTreeProps> = ({
  accounts,
  onAddAccount,
  onSelectAccount,
  onViewLedger,
  onToggleStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    'acc-ast-1000': true,
    'acc-lia-2000': true,
    'acc-equ-3000': true,
  });

  const categories: Array<{ id: AccountCategory; label: string }> = [
    { id: 'ALL', label: 'All Accounts' },
    { id: 'ASSET', label: 'Assets (1000s)' },
    { id: 'LIABILITY', label: 'Liabilities (2000s)' },
    { id: 'FUND_EQUITY', label: 'Fund Equity (3000s)' },
    { id: 'INCOME', label: 'Income Streams (4000s)' },
    { id: 'EXPENSE', label: 'Expenses (5000s)' },
  ];

  const filteredAccounts = useMemo(() => {
    let list = [...accounts];

    if (selectedCategory !== 'ALL') {
      list = list.filter((a) => a.account_type === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.account_name.toLowerCase().includes(q) ||
          (a.account_code || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [accounts, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTypeBadgeStyle = (type: AccountType) => {
    switch (type) {
      case 'ASSET':
        return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
      case 'LIABILITY':
        return { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' };
      case 'INCOME':
        return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
      case 'EXPENSE':
        return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
      case 'FUND_EQUITY':
        return { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' };
    }
  };

  return (
    <div>
      {/* Top Controls Bar */}
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
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '0 12px',
            height: '40px',
            flex: '1 1 280px',
            maxWidth: '460px',
          }}
        >
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search account name, code or description..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              marginLeft: '8px',
              fontSize: '13.5px',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Add Account CTA */}
        <button
          type="button"
          onClick={onAddAccount}
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
          <span>Add Account</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '2px',
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'ALL'
              ? accounts.length
              : accounts.filter((a) => a.account_type === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#011F39' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #011F39' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: '-1px',
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#011F39' : '#F3F4F6',
                  color: isActive ? '#FAD465' : '#4B5563',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accounts Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
              <th style={thStyle}>Code & Account Name</th>
              <th style={thStyle}>Type / Category</th>
              <th style={thStyle}>Description / Purpose</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Current Balance</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => {
                const isParent = !account.parent_account_id;
                const isExpanded = expandedParents[account.id] ?? false;
                const typeBadge = getTypeBadgeStyle(account.account_type);

                return (
                  <tr
                    key={account.id}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      backgroundColor: isParent ? '#F8FAFC' : '#FFFFFF',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Code & Account Name */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          paddingLeft: account.parent_account_id ? '28px' : '0px',
                        }}
                      >
                        {isParent ? (
                          <button
                            type="button"
                            onClick={() => toggleExpand(account.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '2px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#6B7280',
                            }}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        ) : (
                          <div style={{ width: '16px' }} />
                        )}

                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#E5E7EB',
                            color: '#011F39',
                          }}
                        >
                          {account.account_code || '—'}
                        </span>

                        <span
                          onClick={() => onSelectAccount(account)}
                          style={{
                            fontWeight: isParent ? 700 : 600,
                            color: '#011F39',
                            cursor: 'pointer',
                          }}
                        >
                          {account.account_name}
                        </span>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: typeBadge.bg,
                          color: typeBadge.color,
                          border: `1px solid ${typeBadge.border}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {account.account_type}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', color: '#6B7280', fontSize: '12.5px' }}>
                      {account.description || '—'}
                    </td>

                    {/* Current Balance */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: (account.balance || 0) < 0 ? '#DC2626' : '#011F39',
                        }}
                      >
                        {formatINR(account.balance || 0)}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(account)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          border: 'none',
                          backgroundColor: account.is_active ? '#ECFDF5' : '#F3F4F6',
                          color: account.is_active ? '#059669' : '#6B7280',
                          cursor: 'pointer',
                        }}
                      >
                        {account.is_active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{account.is_active ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onViewLedger(account)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: '#FFFFFF',
                            color: '#011F39',
                            cursor: 'pointer',
                          }}
                          title="View Ledger Statement"
                        >
                          <BookOpen size={13} />
                          <span>Ledger</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectAccount(account)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5px 8px',
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#6B7280',
                            cursor: 'pointer',
                          }}
                          title="Account Details"
                        >
                          <Landmark size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6B7280' }}>
                  No accounts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4B5563',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
