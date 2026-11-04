import type React from 'react';
import { useState, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Scale,
  RefreshCw,
  Download,
  Search,
  Plus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { accountingStore } from '../store/accountingStore';
import {
  AccountingTabs,
  type AccountingActiveTab,
} from '../components/AccountingTabs';
import { LedgerSummaryCards } from '../components/LedgerSummaryCards';
import { LedgerModeChips } from '../components/LedgerModeChips';
import { ChartOfAccountsTree } from '../components/ChartOfAccountsTree';
import { CreateAccountModal } from '../components/CreateAccountModal';
import { AccountDetailModal } from '../components/AccountDetailModal';
import { JournalEntriesTable } from '../components/JournalEntriesTable';
import { JournalEntryLinesModal } from '../components/JournalEntryLinesModal';
import { CreateJournalEntryModal } from '../components/CreateJournalEntryModal';
import { ReverseJournalModal } from '../components/ReverseJournalModal';
import { PassbookExportModal } from '../components/PassbookExportModal';
import type {
  AccountItem,
  JournalEntryItem,
  MainAccountingMode,
} from '../types/accounting.types';
import { formatINR } from '../types/accounting.types';

export const AccountingDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Reactive state from accountingStore
  const storeSnapshot = useSyncExternalStore(
    accountingStore.subscribe,
    accountingStore.getSnapshot
  );
  const { accounts, journals, transactions, summary } = storeSnapshot;

  // Active Main Tab: 'passbook' | 'accounts' | 'journals'
  const initialTab = (searchParams.get('tab') as AccountingActiveTab) || 'passbook';
  const [activeTab, setActiveTab] = useState<AccountingActiveTab>(initialTab);

  // Sync tab with URL query parameter
  const handleSelectTab = (tab: AccountingActiveTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Passbook / Ledger Sub-States
  const [ledgerMode, setLedgerMode] = useState<MainAccountingMode>('PASSBOOK');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals state
  const [createAccountModalVisible, setCreateAccountModalVisible] = useState(false);
  const [detailAccount, setDetailAccount] = useState<AccountItem | null>(null);
  const [createJournalModalVisible, setCreateJournalModalVisible] = useState(false);
  const [viewLinesJournal, setViewLinesJournal] = useState<JournalEntryItem | null>(null);
  const [reverseJournal, setReverseJournal] = useState<JournalEntryItem | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load accounting data on mount
  useEffect(() => {
    accountingStore.fetchAll();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await accountingStore.fetchAll();
    setIsRefreshing(false);
  };

  // Filter Ledger Transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Mode filter: CREDIT (inflow) vs EXPENSE (outflow)
    if (ledgerMode === 'CREDIT') {
      list = list.filter((t) => t.debit > 0);
    } else if (ledgerMode === 'EXPENSE') {
      list = list.filter((t) => t.credit > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.entry_number.toLowerCase().includes(q) ||
          (t.narration || '').toLowerCase().includes(q) ||
          t.account_name.toLowerCase().includes(q) ||
          (t.received_from || '').toLowerCase().includes(q) ||
          (t.paid_to || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [transactions, ledgerMode, searchQuery]);

  // Mode counts
  const modeCounts = useMemo(() => {
    let credit = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.debit > 0) credit++;
      if (t.credit > 0) expense++;
    }
    return {
      PASSBOOK: transactions.length,
      CREDIT: credit,
      EXPENSE: expense,
    };
  }, [transactions]);

  // Paginated Ledger slice
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const getCategoryBadgeStyle = (tag?: string) => {
    switch (tag) {
      case 'CAUSE_FUND':
        return { label: 'CAUSE FUND', bg: '#EDE9FE', color: '#6D28D9', border: '#DDD6FE' };
      case 'DONATION':
        return { label: 'DONATION', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'MEMBERSHIP_FEE':
        return { label: 'MEMBERSHIP', bg: '#DBEAFE', color: '#1D4ED8', border: '#BFDBFE' };
      case 'EXPENSE':
        return { label: 'EXPENSE', bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      default:
        return { label: 'RECEIPT', bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' };
    }
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
              <Scale size={18} color="#FAD465" />
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
              Accounting & General Ledger
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 40px', fontSize: '13px', color: '#6B7280' }}>
            Official double-entry chart of accounts, balanced journal entries, and running passbook general ledger
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
            onClick={() => setExportModalVisible(true)}
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
            <span>Export Passbook</span>
          </button>

          {activeTab === 'accounts' ? (
            <button
              type="button"
              onClick={() => setCreateAccountModalVisible(true)}
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
          ) : activeTab === 'journals' ? (
            <button
              type="button"
              onClick={() => setCreateJournalModalVisible(true)}
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
              <span>New Journal Entry</span>
            </button>
          ) : (
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
              <span>Record Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <LedgerSummaryCards summary={summary} />

      {/* Main Content Box */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '24px',
        }}
      >
        {/* Navigation Tabs */}
        <AccountingTabs
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          journalCount={journals.length}
          accountCount={accounts.length}
          txCount={transactions.length}
        />

        {/* TAB 1: General Ledger / Passbook */}
        {activeTab === 'passbook' && (
          <div>
            {/* Mode selection chips */}
            <LedgerModeChips
              activeMode={ledgerMode}
              onSelectMode={(m) => {
                setLedgerMode(m);
                setCurrentPage(1);
              }}
              counts={modeCounts}
            />

            {/* If Analytics Mode is selected, display breakdown */}
            {ledgerMode === 'ANALYTICS' ? (
              <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <TrendingUp size={18} color="#011F39" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                    Revenue & Expenditure Stream Allocation
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
                      Inflow Breakdown (Credits)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#4B5563' }}>Donations (General & Cause):</span>
                      <b>₹ 1,20,000.00</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#4B5563' }}>Membership Registrations:</span>
                      <b>₹ 1,500.00</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#4B5563' }}>Grants & Subsidies:</span>
                      <b>₹ 1,00,000.00</b>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626', marginBottom: '8px' }}>
                      Outflow Breakdown (Debits)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#4B5563' }}>Beneficiary Relief Assistance:</span>
                      <b>₹ 20,000.00</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#4B5563' }}>Office & Printing:</span>
                      <b>₹ 3,200.00</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#4B5563' }}>Field Campaign Conveyance:</span>
                      <b>₹ 0.00</b>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '0 12px',
                      height: '40px',
                      flex: '1 1 300px',
                      maxWidth: '520px',
                    }}
                  >
                    <Search size={16} color="#9CA3AF" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search voucher #, particulars, account or contributor..."
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

                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    Showing <b>{filteredTransactions.length}</b> ledger records
                  </div>
                </div>

                {/* Ledger Transactions Table */}
                <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                        <th style={thStyle}>Date & Voucher No</th>
                        <th style={thStyle}>Stream Tag</th>
                        <th style={thStyle}>Particulars / Narration</th>
                        <th style={thStyle}>Account Allocation</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Inflow (Credit)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Outflow (Debit)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((tx) => {
                          const badge = getCategoryBadgeStyle(tx.category_tag);

                          return (
                            <tr
                              key={tx.id}
                              style={{
                                borderBottom: '1px solid #E5E7EB',
                                transition: 'background-color 0.15s ease',
                              }}
                            >
                              {/* Date & Voucher No */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: 700, color: '#011F39' }}>{tx.entry_number}</div>
                                <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                                  {tx.entry_date}
                                </div>
                              </td>

                              {/* Stream Tag */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: badge.bg,
                                    color: badge.color,
                                    border: `1px solid ${badge.border}`,
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  {badge.label}
                                </span>
                              </td>

                              {/* Particulars */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top', maxWidth: '320px' }}>
                                <div style={{ fontWeight: 600, color: '#111827' }}>
                                  {tx.narration || 'General transaction'}
                                </div>
                                {(tx.received_from || tx.paid_to) && (
                                  <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '2px' }}>
                                    Party: {tx.received_from || tx.paid_to}
                                  </div>
                                )}
                              </td>

                              {/* Account */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: 600, color: '#011F39' }}>{tx.account_name}</div>
                                {tx.account_code && (
                                  <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>
                                    A/c #{tx.account_code}
                                  </span>
                                )}
                              </td>

                              {/* Inflow Credit */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'right' }}>
                                {tx.debit > 0 ? (
                                  <span style={{ fontWeight: 700, color: '#059669' }}>
                                    + {formatINR(tx.debit)}
                                  </span>
                                ) : (
                                  <span style={{ color: '#D1D5DB' }}>—</span>
                                )}
                              </td>

                              {/* Outflow Debit */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'right' }}>
                                {tx.credit > 0 ? (
                                  <span style={{ fontWeight: 700, color: '#DC2626' }}>
                                    - {formatINR(tx.credit)}
                                  </span>
                                ) : (
                                  <span style={{ color: '#D1D5DB' }}>—</span>
                                )}
                              </td>

                              {/* Running Balance */}
                              <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'right' }}>
                                <span style={{ fontWeight: 800, color: '#011F39', fontSize: '13.5px' }}>
                                  {formatINR(tx.running_balance)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <AlertCircle size={28} color="#9CA3AF" />
                              <div style={{ fontWeight: 600 }}>No ledger transactions found</div>
                              <div style={{ fontSize: '12.5px' }}>Try switching modes or clearing search terms.</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid #E5E7EB',
                      marginTop: '16px',
                      fontSize: '13px',
                      color: '#4B5563',
                    }}
                  >
                    <div>
                      Showing <b>{(currentPage - 1) * pageSize + 1}</b> to{' '}
                      <b>{Math.min(currentPage * pageSize, filteredTransactions.length)}</b> of{' '}
                      <b>{filteredTransactions.length}</b> transactions
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
              </>
            )}
          </div>
        )}

        {/* TAB 2: Chart of Accounts */}
        {activeTab === 'accounts' && (
          <ChartOfAccountsTree
            accounts={accounts}
            onAddAccount={() => setCreateAccountModalVisible(true)}
            onSelectAccount={(acc) => setDetailAccount(acc)}
            onViewLedger={(acc) => navigate(`/admin/accounting/accounts/${acc.id}/ledger`)}
            onToggleStatus={async (acc) => {
              await accountingStore.toggleAccountStatus(acc.id, !acc.is_active);
            }}
          />
        )}

        {/* TAB 3: Journal Vouchers */}
        {activeTab === 'journals' && (
          <JournalEntriesTable
            entries={journals}
            onAddEntry={() => setCreateJournalModalVisible(true)}
            onViewLines={(entry) => setViewLinesJournal(entry)}
            onReverseEntry={(entry) => setReverseJournal(entry)}
          />
        )}
      </div>

      {/* Modals */}
      <CreateAccountModal
        visible={createAccountModalVisible}
        onClose={() => setCreateAccountModalVisible(false)}
        accounts={accounts}
        onCreate={async (payload) => {
          await accountingStore.createAccount(payload);
        }}
      />

      <AccountDetailModal
        visible={Boolean(detailAccount)}
        onClose={() => setDetailAccount(null)}
        account={detailAccount}
        onViewLedger={(acc) => navigate(`/admin/accounting/accounts/${acc.id}/ledger`)}
      />

      <CreateJournalEntryModal
        visible={createJournalModalVisible}
        onClose={() => setCreateJournalModalVisible(false)}
        accounts={accounts}
        onCreate={async (payload) => {
          await accountingStore.createJournalEntry(payload);
        }}
      />

      <JournalEntryLinesModal
        visible={Boolean(viewLinesJournal)}
        onClose={() => setViewLinesJournal(null)}
        entry={viewLinesJournal}
      />

      <ReverseJournalModal
        visible={Boolean(reverseJournal)}
        onClose={() => setReverseJournal(null)}
        entry={reverseJournal}
        onConfirmReverse={async (reason) => {
          if (!reverseJournal) return;
          await accountingStore.reverseJournalEntry(reverseJournal.id, reason);
        }}
      />

      <PassbookExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        transactions={transactions}
      />
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4B5563',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
