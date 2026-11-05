import type React from 'react';
import { useState, useMemo, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { expensesStore } from '../store/expensesStore';
import { ExpenseStatsCards } from '../components/ExpenseStatsCards';
import { ExpenseStatusTabs } from '../components/ExpenseStatusTabs';
import { ExpenseMethodChips } from '../components/ExpenseMethodChips';
import { ExpenseSearchBar } from '../components/ExpenseSearchBar';
import { ExpenseListHeader, ExpenseCard } from '../components/ExpenseCard';
import { ExpenseCancelModal } from '../components/ExpenseCancelModal';
import type { ExpenseEntryItem } from '../types/expenses.types';

export const ExpensesListPage: React.FC = () => {
  const navigate = useNavigate();
  const snapshot = useSyncExternalStore(expensesStore.subscribe, expensesStore.getSnapshot);
  const vouchers = snapshot.vouchers;

  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [activeMethod, setActiveMethod] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingVoucher, setCancellingVoucher] = useState<ExpenseEntryItem | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const stats = useMemo(() => {
    const all = vouchers.length;
    const posted = vouchers.filter((v) => v.status === 'POSTED').length;
    const cancelled = vouchers.filter((v) => v.status === 'CANCELLED').length;
    const totalAmount = vouchers
      .filter((v) => v.status === 'POSTED')
      .reduce((sum, v) => sum + (Number(v.amount) || 0), 0);

    return { all, posted, cancelled, totalAmount };
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return vouchers.filter((voucher) => {
      // Status filter
      if (activeStatus !== 'ALL' && voucher.status !== activeStatus) {
        return false;
      }
      // Payment method filter
      if (activeMethod !== 'ALL') {
        const method = voucher.payment_method;
        if (activeMethod === 'BANK_TRANSFER' && method !== 'BANK_TRANSFER') return false;
        if (activeMethod === 'CASH' && method !== 'CASH') return false;
        if (activeMethod === 'UPI' && method !== 'UPI') return false;
        if (activeMethod === 'CHEQUE' && method !== 'CHEQUE') return false;
        if (activeMethod === 'CARD' && method !== 'CARD') return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL') {
        const catCode = voucher.expense_account?.account_code || voucher.expense_account_id;
        if (catCode !== selectedCategory) return false;
      }
      // Search query filter
      if (q) {
        const inNum = voucher.voucher_number.toLowerCase().includes(q);
        const inPayee = voucher.paid_to.toLowerCase().includes(q);
        const inDesc = (voucher.description || '').toLowerCase().includes(q);
        const inRef = (voucher.reference_number || '').toLowerCase().includes(q);
        const inAcc = (voucher.expense_account?.account_name || '').toLowerCase().includes(q);
        if (!inNum && !inPayee && !inDesc && !inRef && !inAcc) {
          return false;
        }
      }
      return true;
    });
  }, [vouchers, activeStatus, activeMethod, selectedCategory, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeStatus !== 'ALL' ||
    activeMethod !== 'ALL' ||
    selectedCategory !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveStatus('ALL');
    setActiveMethod('ALL');
    setSelectedCategory('ALL');
  };

  const handleVoucherClick = (voucher: ExpenseEntryItem) => {
    navigate(`/admin/expenses/${voucher.id}`);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!cancellingVoucher) return;
    setIsCancelling(true);
    try {
      await expensesStore.cancel(cancellingVoucher.id, reason);
      setCancelModalOpen(false);
      setCancellingVoucher(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Header & Breadcrumbs */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.breadcrumb}>
            <span>Finance & Accounts</span>
            <span style={styles.bcSep}>/</span>
            <span style={styles.bcActive}>Expenses Management</span>
          </div>
          <h1 style={styles.title}>Expenses & Payment Vouchers</h1>
          <p style={styles.subtitle}>
            Record, track, audit and manage organizational expenditures with automatic double-entry ledger posting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/expenses/create')}
          style={styles.recordBtn}
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>Record Expense</span>
        </button>
      </div>

      {/* 2x2 Executive KPI Stats Grid */}
      <ExpenseStatsCards
        stats={stats}
        activeStatus={activeStatus}
        onSelectStatus={(st) => setActiveStatus(st)}
      />

      {/* Primary Status Filter Tabs */}
      <ExpenseStatusTabs
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        counts={{ all: stats.all, posted: stats.posted, cancelled: stats.cancelled }}
      />

      {/* Secondary Payment Method Filter Chips */}
      <ExpenseMethodChips
        activeMethod={activeMethod}
        onSelectMethod={setActiveMethod}
      />

      {/* Search Input & Category Dropdown */}
      <ExpenseSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onRecordExpense={() => navigate('/admin/expenses/create')}
      />

      {/* Table Container */}
      <div style={styles.listContainer}>
        <ExpenseListHeader />

        {filteredVouchers.length > 0 ? (
          filteredVouchers.map((v) => (
            <ExpenseCard
              key={v.id}
              voucher={v}
              onPress={handleVoucherClick}
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={40} color="#94A3B8" />
            <h3 style={styles.emptyTitle}>No Expense Vouchers Found</h3>
            <p style={styles.emptyText}>
              No vouchers match the current search filters or category. Try clearing filters or record a new expense.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={styles.emptyResetBtn}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <ExpenseCancelModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setCancellingVoucher(null);
        }}
        onConfirm={handleConfirmCancel}
        voucher={cancellingVoucher}
        isCancelling={isCancelling}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px 32px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#64748B',
    marginBottom: '6px',
    fontWeight: 500,
  },
  bcSep: {
    color: '#CBD5E1',
  },
  bcActive: {
    color: '#06294D',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#011F39',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#64748B',
  },
  recordBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
  },
  listContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    margin: '16px 0 6px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#1E293B',
  },
  emptyText: {
    margin: 0,
    fontSize: '13px',
    color: '#64748B',
    maxWidth: '440px',
  },
  emptyResetBtn: {
    marginTop: '16px',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#06294D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
