import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, TrendingUp, FileText, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import type {
  BalanceSheetSummaryResponse,
  ProfitLossSummaryResponse,
  TrialBalanceSummaryResponse,
} from '../types/reports.types';

interface FinancialStatementsNavProps {
  tbSummary?: TrialBalanceSummaryResponse;
  plSummary?: ProfitLossSummaryResponse;
  bsSummary?: BalanceSheetSummaryResponse;
}

const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const FinancialStatementsNav: React.FC<FinancialStatementsNavProps> = ({
  tbSummary,
  plSummary,
  bsSummary,
}) => {
  const navigate = useNavigate();
  const isSurplus = (plSummary?.result_type ?? 'SURPLUS') === 'SURPLUS';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-serif">
            Financial Statements & Detailed Reports
          </h3>
          <p className="text-xs text-slate-500">
            Full General Ledger statutory statements, audit trails, and reconciliation sheets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/accounting')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm self-start sm:self-auto"
        >
          <BookOpen className="h-3.5 w-3.5 text-[#011F39]" />
          Go to General Ledger & Accounts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* STATEMENT 1: TRIAL BALANCE */}
        <div
          onClick={() => navigate('/admin/reports/trial-balance')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Trial Balance
                  </h4>
                  <p className="text-xs text-slate-500">Debit & Credit Ledger Check</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  tbSummary?.is_balanced
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                {tbSummary?.is_balanced ? 'Balanced' : 'Out of Balance'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Debit
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {tbSummary ? formatINR(tbSummary.total_debit) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Credit
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {tbSummary ? formatINR(tbSummary.total_credit) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Difference
                </span>
                <span
                  className={`text-xs font-bold font-mono block mt-0.5 ${
                    (tbSummary?.difference ?? 0) === 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {tbSummary ? formatINR(tbSummary.difference) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>View Detailed Trial Balance</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* STATEMENT 2: PROFIT & LOSS */}
        <div
          onClick={() => navigate('/admin/reports/profit-loss')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Profit & Loss Statement
                  </h4>
                  <p className="text-xs text-slate-500">Income Statement & Surplus</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isSurplus
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isSurplus ? 'Surplus' : 'Deficit'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Income
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono block mt-0.5">
                  {plSummary ? formatINR(plSummary.total_income) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Expense
                </span>
                <span className="text-xs font-bold text-rose-600 font-mono block mt-0.5">
                  {plSummary ? formatINR(plSummary.total_expenses) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {isSurplus ? 'Net Surplus' : 'Net Deficit'}
                </span>
                <span
                  className={`text-xs font-bold font-mono block mt-0.5 ${
                    isSurplus ? 'text-emerald-700 font-extrabold' : 'text-rose-700 font-extrabold'
                  }`}
                >
                  {plSummary ? formatINR(plSummary.net_result) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>View Full Income Statement</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* STATEMENT 3: BALANCE SHEET */}
        <div
          onClick={() => navigate('/admin/reports/balance-sheet')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-purple-300 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Balance Sheet
                  </h4>
                  <p className="text-xs text-slate-500">Assets, Liabilities & Reserves</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  bsSummary?.is_balanced
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                {bsSummary?.is_balanced ? 'Balanced' : 'Out of Balance'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Assets
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {bsSummary ? formatINR(bsSummary.total_assets) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Liabilities & Eq
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {bsSummary ? formatINR(bsSummary.total_liabilities_and_equity) : '—'}
                </span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Difference
                </span>
                <span
                  className={`text-xs font-bold font-mono block mt-0.5 ${
                    (bsSummary?.difference ?? 0) === 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {bsSummary ? formatINR(bsSummary.difference) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>View Statutory Balance Sheet</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
