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
  ExternalLink,
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

const formatLedgerDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

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
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // React to search param updates
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
    const t = searchParams.get('tab') as AccountingActiveTab;
    if (t && (t === 'passbook' || t === 'accounts' || t === 'journals')) {
      setActiveTab(t);
    }
  }, [searchParams]);

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9E6] text-[#011F39] border border-[#FDE68A] mb-2 tracking-wide uppercase">
            <Scale size={12} className="text-[#B45309]" />
            <span>Financial Audit & General Ledger</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#011F39]">
            Accounting & General Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official double-entry chart of accounts, balanced journal entries, and running passbook general ledger
          </p>
        </div>

        {/* Global Page Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#011F39]' : 'text-slate-500'} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setExportModalVisible(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export Passbook</span>
          </button>

          {activeTab === 'accounts' ? (
            <button
              type="button"
              onClick={() => setCreateAccountModalVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#FAD465] hover:bg-[#e9bf36] text-[#011F39] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Account</span>
            </button>
          ) : activeTab === 'journals' ? (
            <button
              type="button"
              onClick={() => setCreateJournalModalVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#FAD465] hover:bg-[#e9bf36] text-[#011F39] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>New Journal Entry</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/admin/receipts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#FAD465] hover:bg-[#e9bf36] text-[#011F39] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Record Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Summary Cards (Executive Balanced Grid, No Dark Block) */}
      <LedgerSummaryCards summary={summary} />

      {/* Main Content Box */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-6">
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
              <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#011F39]" />
                  <h3 className="font-serif text-base font-bold text-[#011F39]">
                    Revenue & Expenditure Stream Allocation
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                      Inflow Breakdown (Credits)
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Donations (General & Cause):</span>
                      <strong className="text-slate-900">₹ 1,20,000.00</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Membership Registrations:</span>
                      <strong className="text-slate-900">₹ 1,500.00</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Grants & Subsidies:</span>
                      <strong className="text-slate-900">₹ 1,00,000.00</strong>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                      Outflow Breakdown (Debits)
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Beneficiary Relief Assistance:</span>
                      <strong className="text-slate-900">₹ 20,000.00</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Office & Printing:</span>
                      <strong className="text-slate-900">₹ 3,200.00</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Field Campaign Conveyance:</span>
                      <strong className="text-slate-900">₹ 0.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search voucher #, particulars, account or contributor..."
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39] transition-colors"
                    />
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> ledger records
                  </div>
                </div>

                {/* Ledger Transactions Table */}
                <div className="overflow-x-auto border border-slate-200/90 rounded-xl shadow-xs">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Date & Voucher No</th>
                        <th className="px-4 py-3">Stream Tag</th>
                        <th className="px-4 py-3">Particulars / Narration</th>
                        <th className="px-4 py-3">Account Allocation</th>
                        <th className="px-4 py-3 text-right">Inflow (Credit)</th>
                        <th className="px-4 py-3 text-right">Outflow (Debit)</th>
                        <th className="px-4 py-3 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((tx) => {
                          const badge = getCategoryBadgeStyle(tx.category_tag);

                          return (
                            <tr
                              key={tx.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              {/* Date & Voucher No */}
                              <td className="px-4 py-3 align-top">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-[#011F39]">{tx.entry_number}</span>
                                  {tx.category_tag === 'EXPENSE' || tx.reference_type === 'MANUAL_EXPENSE' ? (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/admin/expenses/${tx.reference_id || tx.entry_number}`)}
                                      title="Open Expense Voucher"
                                      className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                    >
                                      <ExternalLink size={12} />
                                    </button>
                                  ) : tx.category_tag === 'DONATION' || tx.reference_type === 'DONATION_PAYMENT' ? (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/admin/donations/${tx.reference_id || tx.entry_number}`)}
                                      title="Open Donation Record"
                                      className="text-slate-400 hover:text-amber-600 transition cursor-pointer"
                                    >
                                      <ExternalLink size={12} />
                                    </button>
                                  ) : tx.category_tag === 'MEMBERSHIP_FEE' || tx.reference_type === 'MEMBERSHIP_PAYMENT' ? (
                                    <button
                                      type="button"
                                      onClick={() => navigate('/admin/members')}
                                      title="Open Members Directory"
                                      className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                    >
                                      <ExternalLink size={12} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/admin/receipts/${tx.reference_id || tx.entry_number}`)}
                                      title="Open Receipt Voucher"
                                      className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                                    >
                                      <ExternalLink size={12} />
                                    </button>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                  {formatLedgerDate(tx.entry_date)}
                                </div>
                              </td>

                              {/* Stream Tag */}
                              <td className="px-4 py-3 align-top">
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider"
                                  style={{
                                    backgroundColor: badge.bg,
                                    color: badge.color,
                                    borderColor: badge.border,
                                  }}
                                >
                                  {badge.label}
                                </span>
                              </td>

                              {/* Particulars */}
                              <td className="px-4 py-3 align-top max-w-xs">
                                <div className="font-semibold text-slate-900 truncate">
                                  {tx.narration || 'General transaction'}
                                </div>
                                {(tx.received_from || tx.paid_to) && (
                                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                    Party: {tx.received_from || tx.paid_to}
                                  </div>
                                )}
                              </td>

                              {/* Account */}
                              <td className="px-4 py-3 align-top">
                                <div className="font-semibold text-slate-800 truncate">{tx.account_name}</div>
                                {tx.account_code && (
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    A/c #{tx.account_code}
                                  </span>
                                )}
                              </td>

                              {/* Inflow Credit */}
                              <td className="px-4 py-3 align-top text-right">
                                {tx.debit > 0 ? (
                                  <span className="font-serif font-bold text-emerald-700">
                                    + {formatINR(tx.debit)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>

                              {/* Outflow Debit */}
                              <td className="px-4 py-3 align-top text-right">
                                {tx.credit > 0 ? (
                                  <span className="font-serif font-bold text-rose-700">
                                    - {formatINR(tx.credit)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>

                              {/* Running Balance */}
                              <td className="px-4 py-3 align-top text-right">
                                <span className="font-serif font-bold text-[#011F39]">
                                  {formatINR(tx.running_balance)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle size={28} className="text-slate-400" />
                              <div className="font-semibold text-slate-700">No ledger transactions found</div>
                              <div className="text-xs text-slate-400">Try switching modes or clearing search terms.</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500 mt-3">
                    <div>
                      Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
                      <strong>{Math.min(currentPage * pageSize, filteredTransactions.length)}</strong> of{' '}
                      <strong>{filteredTransactions.length}</strong> transactions
                    </div>

                    <div className="flex items-center gap-2 self-center sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          currentPage === 1
                            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        <ChevronLeft size={14} />
                        <span>Prev</span>
                      </button>

                      <span className="font-bold text-slate-700 px-2">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          currentPage === totalPages
                            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight size={14} />
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
