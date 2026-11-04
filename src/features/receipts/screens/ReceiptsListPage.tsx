import type React from 'react';
import { useState, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  RefreshCw,
  Plus,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type {
  ReceiptEntryItem,
  ReceiptStatsSummary,
} from '../types/receipts.types';
import { receiptsStore } from '../store/receiptsStore';
import { classifyReceipt } from '../utils/receiptClassification';
import { ReceiptStatsCards } from '../components/ReceiptStatsCards';
import { ReceiptStatusTabs } from '../components/ReceiptStatusTabs';
import { ReceiptSourceChips } from '../components/ReceiptSourceChips';
import { ReceiptMethodChips } from '../components/ReceiptMethodChips';
import { ReceiptSearchBar } from '../components/ReceiptSearchBar';
import { ReceiptCard } from '../components/ReceiptCard';
import {
  ReceiptFilterModal,
  type ReceiptFiltersState,
} from '../components/ReceiptFilterModal';
import { ReceiptCancelModal } from '../components/ReceiptCancelModal';

export const ReceiptsListPage: React.FC = () => {
  const navigate = useNavigate();

  // Reactive state from receiptsStore
  const storeSnapshot = useSyncExternalStore(
    receiptsStore.subscribe,
    receiptsStore.getSnapshot
  );
  const vouchers = storeSnapshot.vouchers;

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSource, setActiveSource] = useState<string>('ALL');
  const [activeMethod, setActiveMethod] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [cancelModalVoucher, setCancelModalVoucher] = useState<ReceiptEntryItem | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<ReceiptFiltersState>({
    category: 'ALL',
    source: 'ALL',
    method: 'ALL',
    status: 'ALL',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load backend vouchers on mount
  useEffect(() => {
    receiptsStore.fetchVouchers();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await receiptsStore.fetchVouchers();
    setIsRefreshing(false);
  };

  // Classified vouchers with rich metadata
  const classifiedItems = useMemo(() => {
    return vouchers.map((v) => ({
      voucher: v,
      classified: classifyReceipt(v),
    }));
  }, [vouchers]);

  // Compute breakdown counts and total amounts across streams
  const stats: ReceiptStatsSummary = useMemo(() => {
    let allAmount = 0;
    let ngoDonations = 0;
    let ngoAmount = 0;
    let causeDonations = 0;
    let causeAmount = 0;
    let membership = 0;
    let membershipAmount = 0;
    let renewals = 0;
    let renewalsAmount = 0;
    let otherIncome = 0;
    let otherAmount = 0;
    let cancelled = 0;
    let cancelledAmount = 0;

    for (const { voucher, classified } of classifiedItems) {
      const amt = Number(voucher.amount) || 0;
      const isNotCancelled = voucher.status !== 'CANCELLED';

      if (isNotCancelled) {
        allAmount += amt;
      } else {
        cancelled++;
        cancelledAmount += amt;
      }

      if (classified.category === 'CAUSE_DONATION') {
        causeDonations++;
        if (isNotCancelled) causeAmount += amt;
      } else if (
        classified.category === 'NGO_DONATION' ||
        classified.category === 'GENERAL_DONATION'
      ) {
        ngoDonations++;
        if (isNotCancelled) ngoAmount += amt;
      } else if (
        classified.category === 'MEMBERSHIP_PAYMENT' ||
        classified.category === 'NEW_MEMBERSHIP'
      ) {
        membership++;
        if (isNotCancelled) membershipAmount += amt;
      } else if (
        classified.category === 'RENEWAL_PAYMENT' ||
        classified.category === 'RENEW_MEMBERSHIP'
      ) {
        renewals++;
        if (isNotCancelled) renewalsAmount += amt;
      } else {
        otherIncome++;
        if (isNotCancelled) otherAmount += amt;
      }
    }

    return {
      all: vouchers.length,
      allAmount,
      ngoDonations,
      ngoAmount,
      causeDonations,
      causeAmount,
      membership,
      membershipAmount,
      renewals,
      renewalsAmount,
      membershipAndRenewals: membership + renewals,
      membershipAndRenewalsAmount: membershipAmount + renewalsAmount,
      otherIncome,
      otherAmount,
      cancelled,
      cancelledAmount,
    };
  }, [vouchers.length, classifiedItems]);

  // Source Counts
  const sourceCounts = useMemo(() => {
    let website = 0;
    let webApp = 0;
    let app = 0;

    for (const { classified } of classifiedItems) {
      if (classified.sourceKey === 'WEBSITE') website++;
      else if (classified.sourceKey === 'WEB_APP') webApp++;
      else if (classified.sourceKey === 'APPLICATION') app++;
    }

    return {
      ALL: vouchers.length,
      WEBSITE: website,
      WEB_APP: webApp,
      APPLICATION: app,
    };
  }, [vouchers.length, classifiedItems]);

  // Method Counts
  const methodCounts = useMemo(() => {
    let upi = 0;
    let bank = 0;
    let cash = 0;
    let cheque = 0;
    let card = 0;

    for (const { voucher } of classifiedItems) {
      const m = String(voucher.payment_method || '').toUpperCase();
      if (m.includes('UPI') || m.includes('ONLINE') || m.includes('CASHFREE')) upi++;
      else if (m.includes('BANK') || m.includes('TRANSFER')) bank++;
      else if (m === 'CASH') cash++;
      else if (m === 'CHEQUE') cheque++;
      else if (m === 'CARD') card++;
    }

    return {
      ALL: vouchers.length,
      UPI: upi,
      BANK: bank,
      CASH: cash,
      CHEQUE: cheque,
      CARD: card,
    };
  }, [vouchers.length, classifiedItems]);

  // Multi-criteria Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return classifiedItems
      .filter(({ voucher, classified }) => {
        // 1. Stream Category filter (from quick tabs or advanced modal)
        const targetCategory = advancedFilters.category !== 'ALL' ? advancedFilters.category : activeCategory;
        if (targetCategory !== 'ALL') {
          if (targetCategory === 'NGO_DONATION') {
            if (classified.category !== 'NGO_DONATION' && classified.category !== 'GENERAL_DONATION') return false;
          } else if (targetCategory === 'CAUSE_DONATION') {
            if (classified.category !== 'CAUSE_DONATION') return false;
          } else if (targetCategory === 'MEMBERSHIP') {
            if (
              classified.category !== 'MEMBERSHIP_PAYMENT' &&
              classified.category !== 'NEW_MEMBERSHIP' &&
              classified.category !== 'RENEWAL_PAYMENT' &&
              classified.category !== 'RENEW_MEMBERSHIP'
            ) {
              return false;
            }
          } else if (targetCategory === 'MEMBERSHIP_PAYMENT') {
            if (classified.category !== 'MEMBERSHIP_PAYMENT' && classified.category !== 'NEW_MEMBERSHIP') return false;
          } else if (targetCategory === 'RENEWAL_PAYMENT') {
            if (classified.category !== 'RENEWAL_PAYMENT' && classified.category !== 'RENEW_MEMBERSHIP') return false;
          } else if (targetCategory === 'OTHER_INCOME') {
            if (classified.category !== 'OTHER_INCOME') return false;
          }
        }

        // 2. Origin Source Channel filter
        const targetSource = advancedFilters.source !== 'ALL' ? advancedFilters.source : activeSource;
        if (targetSource !== 'ALL') {
          if (classified.sourceKey !== targetSource) return false;
        }

        // 3. Payment Method filter
        const targetMethod = advancedFilters.method !== 'ALL' ? advancedFilters.method : activeMethod;
        if (targetMethod !== 'ALL') {
          const m = String(voucher.payment_method || '').toUpperCase();
          if (targetMethod === 'UPI' && !m.includes('UPI') && !m.includes('CASHFREE') && !m.includes('ONLINE')) return false;
          if (targetMethod === 'BANK' && !m.includes('BANK') && !m.includes('TRANSFER')) return false;
          if (targetMethod === 'CASH' && m !== 'CASH') return false;
          if (targetMethod === 'CHEQUE' && m !== 'CHEQUE') return false;
          if (targetMethod === 'CARD' && m !== 'CARD') return false;
        }

        // 4. Status filter
        if (advancedFilters.status !== 'ALL') {
          if (voucher.status !== advancedFilters.status) return false;
        }

        // 5. Date range
        if (advancedFilters.startDate) {
          if (voucher.receipt_date < advancedFilters.startDate) return false;
        }
        if (advancedFilters.endDate) {
          if (voucher.receipt_date > advancedFilters.endDate) return false;
        }

        // 6. Amount range
        if (advancedFilters.minAmount) {
          const min = parseFloat(advancedFilters.minAmount);
          if (!isNaN(min) && Number(voucher.amount) < min) return false;
        }
        if (advancedFilters.maxAmount) {
          const max = parseFloat(advancedFilters.maxAmount);
          if (!isNaN(max) && Number(voucher.amount) > max) return false;
        }

        // 7. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const vNum = (voucher.voucher_number || '').toLowerCase();
          const recFrom = (voucher.received_from || '').toLowerCase();
          const payerName = (classified.payerName || '').toLowerCase();
          const contact = (classified.payerContact || '').toLowerCase();
          const highlight = (classified.sourceHighlightValue || '').toLowerCase();
          const refNum = (voucher.reference_number || '').toLowerCase();
          const desc = (voucher.description || '').toLowerCase();
          const acc = (voucher.income_account?.account_name || '').toLowerCase();

          return (
            vNum.includes(q) ||
            recFrom.includes(q) ||
            payerName.includes(q) ||
            contact.includes(q) ||
            highlight.includes(q) ||
            refNum.includes(q) ||
            desc.includes(q) ||
            acc.includes(q)
          );
        }

        return true;
      })
      .map((item) => item.voucher);
  }, [classifiedItems, activeCategory, activeSource, activeMethod, advancedFilters, searchQuery]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / pageSize));
  const paginatedVouchers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVouchers.slice(start, start + pageSize);
  }, [filteredVouchers, currentPage, pageSize]);

  const hasActiveFilters =
    activeCategory !== 'ALL' ||
    activeSource !== 'ALL' ||
    activeMethod !== 'ALL' ||
    searchQuery.trim() !== '' ||
    advancedFilters.status !== 'ALL' ||
    advancedFilters.startDate !== '' ||
    advancedFilters.endDate !== '' ||
    advancedFilters.minAmount !== '' ||
    advancedFilters.maxAmount !== '';

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setActiveSource('ALL');
    setActiveMethod('ALL');
    setSearchQuery('');
    setAdvancedFilters({
      category: 'ALL',
      source: 'ALL',
      method: 'ALL',
      status: 'ALL',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const headers = [
      'Voucher Number',
      'Receipt Date',
      'Received From',
      'Income Account',
      'Payment Method',
      'Amount',
      'Reference Number',
      'Status',
      'Description',
    ];
    const rows = filteredVouchers.map((v) => [
      v.voucher_number,
      v.receipt_date,
      `"${v.received_from}"`,
      `"${v.income_account?.account_name || 'Income'}"`,
      v.payment_method,
      v.amount,
      `"${v.reference_number || ''}"`,
      v.status,
      `"${(v.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hrsjm_receipts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!cancelModalVoucher) return;
    await receiptsStore.cancelVoucher(cancelModalVoucher.id, reason);
    setCancelModalVoucher(null);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <FileText size={18} color="#FAD465" />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 700,
                color: '#011F39',
                letterSpacing: '-0.02em',
              }}
            >
              Income (Receipt Vouchers)
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 40px', fontSize: '13px', color: '#6B7280' }}>
            Inward revenue stream vouchers for donations, membership fees, causes and grants with double-entry journal postings
          </p>
        </div>

        {/* Global Page Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

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

      {/* Top 4 KPI Cards */}
      <ReceiptStatsCards
        stats={stats}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
      />

      {/* Main Content Box */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '20px',
        }}
      >
        {/* Primary Stream Tabs */}
        <ReceiptStatusTabs
          activeTab={activeCategory}
          onSelectTab={(tab) => {
            setActiveCategory(tab);
            setCurrentPage(1);
          }}
          stats={stats}
        />

        {/* Origin Channel Chips */}
        <ReceiptSourceChips
          activeSource={activeSource}
          onSelectSource={(source) => {
            setActiveSource(source);
            setCurrentPage(1);
          }}
          sourceCounts={sourceCounts}
        />

        {/* Payment Method Chips */}
        <ReceiptMethodChips
          activeMethod={activeMethod}
          onSelectMethod={(method) => {
            setActiveMethod(method);
            setCurrentPage(1);
          }}
          methodCounts={methodCounts}
        />

        {/* Search & Action Bar */}
        <ReceiptSearchBar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onOpenFilterModal={() => setFilterModalVisible(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Vouchers Data Table */}
        <div style={{ overflowX: 'auto', margin: '0 -20px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13.5px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <th style={thStyle}>Voucher No & Stream</th>
                <th style={thStyle}>Received From / Payer</th>
                <th style={thStyle}>Income Account Allocation</th>
                <th style={thStyle}>Payment Method</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount & Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVouchers.length > 0 ? (
                paginatedVouchers.map((voucher) => (
                  <ReceiptCard
                    key={voucher.id}
                    voucher={voucher}
                    onCancelVoucher={(v) => setCancelModalVoucher(v)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertCircle size={32} color="#9CA3AF" />
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>
                        No receipt vouchers found
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        Try adjusting your search criteria, income stream tabs, or channel filters.
                      </div>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        style={{
                          marginTop: '8px',
                          padding: '6px 14px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: '1px solid #011F39',
                          backgroundColor: '#FFFFFF',
                          color: '#011F39',
                          cursor: 'pointer',
                        }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredVouchers.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB',
              marginTop: '12px',
              fontSize: '13px',
              color: '#4B5563',
            }}
          >
            <div>
              Showing <b>{(currentPage - 1) * pageSize + 1}</b> to{' '}
              <b>{Math.min(currentPage * pageSize, filteredVouchers.length)}</b> of{' '}
              <b>{filteredVouchers.length}</b> vouchers
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span style={{ padding: '0 8px', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filter Modal */}
      <ReceiptFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={advancedFilters}
        onApply={(f) => {
          setAdvancedFilters(f);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Cancel Voucher Modal */}
      <ReceiptCancelModal
        visible={Boolean(cancelModalVoucher)}
        onClose={() => setCancelModalVoucher(null)}
        voucher={cancelModalVoucher}
        onConfirmCancel={handleConfirmCancel}
      />
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
