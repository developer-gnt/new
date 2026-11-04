import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Scale, ArrowUpRight } from 'lucide-react';
import type { TrialBalanceAccountItem } from '../types/reports.types';

interface TrialBalanceDrilldownModalProps {
  accountItem: TrialBalanceAccountItem | null;
  onClose: () => void;
  asOfDate: string;
}

const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const TrialBalanceDrilldownModal: React.FC<TrialBalanceDrilldownModalProps> = ({
  accountItem,
  onClose,
  asOfDate,
}) => {
  const navigate = useNavigate();

  if (!accountItem) return null;

  const { account, gross_debit, gross_credit, debit_balance, credit_balance } = accountItem;

  const handleOpenLedger = () => {
    onClose();
    navigate(`/admin/accounting/accounts/${account.id}/ledger`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#011F39] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-[#FAD465]" />
            <div>
              <h3 className="font-semibold text-base font-serif tracking-wide text-white">
                Account Drilldown & Summary
              </h3>
              <p className="text-xs text-slate-300">As of {asOfDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Account Title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-700">
                {account.account_code || 'N/A'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                {account.account_type}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mt-2 font-serif">
              {account.account_name}
            </h4>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Net Debit Balance
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {debit_balance > 0 ? formatINR(debit_balance) : '—'}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Net Credit Balance
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {credit_balance > 0 ? formatINR(credit_balance) : '—'}
              </span>
            </div>
          </div>

          {/* Gross Activity Breakdown */}
          <div className="rounded-lg border border-slate-100 bg-white p-4 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Cumulative Gross Activity
            </span>
            <div className="flex justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Gross Debits:</span>
              <span className="font-mono font-semibold text-slate-800">{formatINR(gross_debit)}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Gross Credits:</span>
              <span className="font-mono font-semibold text-slate-800">{formatINR(gross_credit)}</span>
            </div>
            <div className="flex justify-between text-xs py-1 pt-2 font-bold">
              <span className="text-slate-700">Net Position:</span>
              <span className="font-mono text-[#011F39]">
                {debit_balance > 0
                  ? `${formatINR(debit_balance)} (Dr)`
                  : credit_balance > 0
                  ? `${formatINR(credit_balance)} (Cr)`
                  : '₹ 0.00 (Nil)'}
              </span>
            </div>
          </div>

          {/* Action to Ledger */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleOpenLedger}
              className="rounded-lg bg-[#011F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#022c50] shadow-sm transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4 text-[#FAD465]" />
              <span>View Account Ledger</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
