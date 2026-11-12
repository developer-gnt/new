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
  LedgerTransaction,
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
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
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

  // Transaction classification helpers
  const getInflowAmount = (t: LedgerTransaction): number => {
    if (t.category_tag === 'EXPENSE' || t.account_type === 'EXPENSE') return 0;
    return Number(t.credit) || (t.account_type === 'INCOME' ? Number(t.debit) : 0) || 0;
  };

  const getOutflowAmount = (t: LedgerTransaction): number => {
    if (t.category_tag === 'EXPENSE' || t.account_type === 'EXPENSE') {
      return Number(t.debit) || Number(t.credit) || 0;
    }
    return 0;
  };

  // Filter Ledger Transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Filter by specific Account Head if selected
    if (selectedAccountId !== 'ALL') {
      list = list.filter((t) => t.account_id === selectedAccountId);
    }

    // Mode filter: CREDIT (inflow) vs EXPENSE (outflow)
    if (ledgerMode === 'CREDIT') {
      list = list.filter((t) => getInflowAmount(t) > 0);
    } else if (ledgerMode === 'EXPENSE') {
      list = list.filter((t) => getOutflowAmount(t) > 0);
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
  }, [transactions, selectedAccountId, ledgerMode, searchQuery]);

  // Mode counts
  const modeCounts = useMemo(() => {
    let credit = 0;
    let expense = 0;
    for (const t of transactions) {
      if (getInflowAmount(t) > 0) credit++;
      if (getOutflowAmount(t) > 0) expense++;
    }
    return {
      PASSBOOK: transactions.length,
      CREDIT: credit,
      EXPENSE: expense,
    };
  }, [transactions]);

  // Dynamic live Stream Breakdown computed from REAL transaction data (No mock or fake data)
  const streamBreakdown = useMemo(() => {
    const inflowMap: Record<string, { name: string; code?: string; amount: number; count: number }> = {};
    const outflowMap: Record<string, { name: string; code?: string; amount: number; count: number }> = {};

    let totalInflow = 0;
    let totalOutflow = 0;

    transactions.forEach((t) => {
      const inflow = getInflowAmount(t);
      const outflow = getOutflowAmount(t);

      if (inflow > 0) {
        totalInflow += inflow;
        const key = t.account_name || 'General Inflows';
        if (!inflowMap[key]) {
          inflowMap[key] = { name: key, code: t.account_code || undefined, amount: 0, count: 0 };
        }
        inflowMap[key].amount += inflow;
        inflowMap[key].count += 1;
      }

      if (outflow > 0) {
        totalOutflow += outflow;
        const key = t.account_name || 'General Outflows';
        if (!outflowMap[key]) {
          outflowMap[key] = { name: key, code: t.account_code || undefined, amount: 0, count: 0 };
        }
        outflowMap[key].amount += outflow;
        outflowMap[key].count += 1;
      }
    });

    return {
      inflows: Object.values(inflowMap).sort((a, b) => b.amount - a.amount),
      outflows: Object.values(outflowMap).sort((a, b) => b.amount - a.amount),
      totalInflow,
      totalOutflow,
      netResult: totalInflow - totalOutflow,
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/receipts/create')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Record Income</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/expenses/create')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#FAD465] hover:bg-[#e9bf36] text-[#011F39] shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Record Expense</span>
              </button>
            </div>
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

            {/* If Analytics Mode is selected, display REAL dynamic breakdown */}
            {ledgerMode === 'ANALYTICS' ? (
              <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#011F39]" />
                    <h3 className="font-serif text-base font-bold text-[#011F39]">
                      Revenue & Expenditure Stream Allocation
                    </h3>
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                    Net Balance: <strong className={streamBreakdown.netResult >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {formatINR(streamBreakdown.netResult)}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Real Inflow Breakdown */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Inflow Breakdown (Income & Receipts)
                      </span>
                      <span className="font-serif font-bold text-xs text-emerald-700">
                        {formatINR(streamBreakdown.totalInflow)}
                      </span>
                    </div>

                    {streamBreakdown.inflows.length > 0 ? (
                      <div className="space-y-2">
                        {streamBreakdown.inflows.map((item) => (
                          <div key={item.name} className="flex justify-between items-center text-xs text-slate-600">
                            <div>
                              <span>{item.name}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                                ({item.count} {item.count === 1 ? 'voucher' : 'vouchers'})
                              </span>
                            </div>
                            <strong className="text-slate-900 font-mono">
                              {formatINR(item.amount)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">No posted income records found in this cycle.</p>
                    )}
                  </div>

                  {/* Real Outflow Breakdown */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                        Outflow Breakdown (Expenses & Disbursements)
                      </span>
                      <span className="font-serif font-bold text-xs text-rose-700">
                        {formatINR(streamBreakdown.totalOutflow)}
                      </span>
                    </div>

                    {streamBreakdown.outflows.length > 0 ? (
                      <div className="space-y-2">
                        {streamBreakdown.outflows.map((item) => (
                          <div key={item.name} className="flex justify-between items-center text-xs text-slate-600">
                            <div>
                              <span>{item.name}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                                ({item.count} {item.count === 1 ? 'voucher' : 'vouchers'})
                              </span>
                            </div>
                            <strong className="text-slate-900 font-mono">
                              {formatINR(item.amount)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">No posted expenditure records found in this cycle.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Account Head Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-1 max-w-2xl flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search voucher #, narration, account or party..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39] transition-colors"
                      />
                    </div>

                    <select
                      value={selectedAccountId}
                      onChange={(e) => {
                        setSelectedAccountId(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white hover:border-slate-300 focus:border-[#011F39] focus:outline-none transition-colors cursor-pointer max-w-[260px]"
                    >
                      <option value="ALL">All Account Heads (Consolidated)</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.account_code ? `${acc.account_code} — ` : ''}{acc.account_name} ({acc.account_type})
                        </option>
                      ))}
                    </select>
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
                        <th className="px-4 py-3">Particulars & Beneficiary</th>
                        <th className="px-4 py-3">Account Head & Payment Mode</th>
                        <th className="px-4 py-3 text-right">Income (Inflow / Cr)</th>
                        <th className="px-4 py-3 text-right">Expense (Outflow / Dr)</th>
                        <th className="px-4 py-3 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {/* 1. Official Opening Balance Row at start of period */}
                      {currentPage === 1 && !searchQuery.trim() && selectedAccountId === 'ALL' && (
                        <tr className="bg-amber-50/40 border-b border-amber-200/60 font-medium">
                          <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                            {formatLedgerDate(summary ? (summary as any).from_date : undefined)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider bg-blue-50 text-blue-700 border-blue-200">
                              OPENING
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            Opening Balance Brought Forward (b/f)
                            <span className="block text-[11px] text-slate-500 font-normal">
                              Net liquid cash & bank reserve carried from previous cycle
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            Cash & Bank Asset Reserves
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                          <td className="px-4 py-3 text-right font-serif font-bold text-[#011F39]">
                            {formatINR(summary.opening_balance)}
                          </td>
                        </tr>
                      )}

                      {/* 2. Chronological Transactions (Newest First) */}
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((tx) => {
                          const badge = getCategoryBadgeStyle(tx.category_tag);
                          const inflow = getInflowAmount(tx);
                          const outflow = getOutflowAmount(tx);
                          const displayVoucherNo = tx.voucher_number || tx.entry_number;

                          return (
                            <tr
                              key={tx.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              {/* Date & Voucher No */}
                              <td className="px-4 py-3 align-top">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-[#011F39]">{displayVoucherNo}</span>
                                  {tx.is_web_app && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                      Web App
                                    </span>
                                  )}
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

                              {/* Particulars & Beneficiary */}
                              <td className="px-4 py-3 align-top max-w-xs">
                                <div className="font-semibold text-slate-900 truncate">
                                  {tx.paid_to || tx.received_from || tx.narration || 'General transaction'}
                                </div>
                                {(tx.paid_to || tx.received_from) && tx.narration && (
                                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {tx.narration}
                                  </div>
                                )}
                              </td>

                              {/* Account Head & Payment Mode */}
                              <td className="px-4 py-3 align-top">
                                <div className="font-semibold text-slate-800 truncate">
                                  {tx.account_name}
                                  {tx.account_code && (
                                    <span className="text-[10.5px] text-slate-400 font-mono ml-1">
                                      (#{tx.account_code})
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  via {tx.payment_method || tx.disbursing_account_name || 'Bank Account'}
                                </div>
                              </td>

                              {/* Inflow Credit */}
                              <td className="px-4 py-3 align-top text-right">
                                {inflow > 0 ? (
                                  <span className="font-serif font-bold text-emerald-700">
                                    + {formatINR(inflow)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>

                              {/* Outflow Debit */}
                              <td className="px-4 py-3 align-top text-right">
                                {outflow > 0 ? (
                                  <span className="font-serif font-bold text-rose-700">
                                    - {formatINR(outflow)}
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

                      {/* 3. Official Closing Balance Row at bottom of table */}
                      {filteredTransactions.length > 0 && selectedAccountId === 'ALL' && (
                        <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-semibold text-slate-800">
                          <td colSpan={2} className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-bold">
                            Period Balance Summary
                          </td>
                          <td className="px-4 py-3">
                            Closing Net Balance Carried Forward (c/f)
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {filteredTransactions.length} Transactions
                          </td>
                          <td className="px-4 py-3 text-right font-serif font-bold text-emerald-700">
                            {summary.total_debit > 0 ? `+ ${formatINR(summary.total_debit)}` : '₹0.00'}
                          </td>
                          <td className="px-4 py-3 text-right font-serif font-bold text-rose-700">
                            {summary.total_credit > 0 ? `- ${formatINR(summary.total_credit)}` : '₹0.00'}
                          </td>
                          <td className="px-4 py-3 text-right font-serif font-bold text-[#011F39] text-base">
                            {formatINR(summary.closing_balance)}
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
