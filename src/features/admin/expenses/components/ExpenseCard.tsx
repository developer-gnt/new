import type React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import type { ExpenseEntryItem } from '../types/expenses.types';
import { formatINR } from '../types/expenses.types';

export const ExpenseListHeader: React.FC = () => {
  return (
    <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3.5 bg-[#FAF7F0] border-b border-[#DCE4EC] text-[11px] font-bold text-[#06294D] uppercase tracking-[0.12em]">
      <div className="col-span-3">Voucher &amp; Date</div>
      <div className="col-span-3">Expense Account &amp; Category</div>
      <div className="col-span-3">Payee &amp; Reference</div>
      <div className="col-span-1">Source</div>
      <div className="col-span-1 text-center">Status</div>
      <div className="col-span-1 text-right">Amount</div>
    </div>
  );
};

export const ExpenseCard: React.FC<{
  voucher: ExpenseEntryItem;
  onPress: (voucher: ExpenseEntryItem) => void;
}> = ({ voucher, onPress }) => {
  const isCancelled = voucher.status === 'CANCELLED';
  const accountName = voucher.expense_account?.account_name || 'Expense Account';
  const accountCode = voucher.expense_account?.account_code || '5000';
  const paidFrom =
    voucher.paid_from_account?.account_name || voucher.payment_method || 'Bank Transfer';

  const formatDate = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '28 Sep 2026';
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '28 Sep 2026';
    }
  };

  return (
    <div
      onClick={() => onPress(voucher)}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-3 px-5 py-3.5 bg-white hover:bg-[#FAF7F0]/60 border-b border-[#EDF2F7] last:border-b-0 transition-all cursor-pointer items-center text-xs"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPress(voucher);
      }}
    >
      {/* Col 1: Voucher & Date (col-span-3) */}
      <div className="lg:col-span-3 flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] border border-[#DBE5EE] text-[#06294D] flex items-center justify-center shrink-0 group-hover:bg-[#FAF7F0] group-hover:border-[#DCE4EC] transition-colors">
          <FileText size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-xs font-bold text-[#0B2F52] group-hover:text-[#C9971A] transition-colors truncate">
            {voucher.voucher_number}
          </span>
          <span className="text-[11px] text-[#718096] font-medium">
            {formatDate(voucher.expense_date)}
          </span>
        </div>
      </div>

      {/* Col 2: Expense Account & Category (col-span-3) */}
      <div className="lg:col-span-3 flex flex-col min-w-0">
        <span className="font-semibold text-xs text-[#0B2F52] truncate">
          {accountName}
        </span>
        <span className="text-[11px] text-[#718096] truncate">
          Code: {accountCode}
        </span>
      </div>

      {/* Col 3: Payee & Reference (col-span-3) */}
      <div className="lg:col-span-3 flex flex-col min-w-0">
        <span className="text-xs text-[#34516D] truncate">
          Paid to <strong className="text-[#06294D] font-semibold">{voucher.paid_to}</strong>
        </span>
        {voucher.reference_number ? (
          <span className="text-[11px] text-[#718096] font-mono truncate">
            Ref: {voucher.reference_number}
          </span>
        ) : voucher.description ? (
          <span className="text-[11px] text-[#718096] truncate">
            {voucher.description}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        )}
      </div>

      {/* Col 4: Payment Source (col-span-1) */}
      <div className="lg:col-span-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EDF2F7] border border-[#DBE5EE] text-[#06294D] truncate max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06294D] shrink-0" />
          <span className="truncate">{paidFrom}</span>
        </span>
      </div>

      {/* Col 5: Status (col-span-1 text-center) */}
      <div className="lg:col-span-1 text-left lg:text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isCancelled
              ? 'bg-slate-100 text-slate-500 border-slate-200 line-through'
              : 'bg-[#FAF7F0] text-[#06294D] border-[#DCE4EC]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCancelled ? 'bg-slate-400' : 'bg-emerald-600'
            }`}
          />
          <span>{voucher.status}</span>
        </span>
      </div>

      {/* Col 6: Amount (col-span-1 text-right) */}
      <div className="lg:col-span-1 text-left lg:text-right flex items-center justify-between lg:justify-end gap-2">
        <span
          className={`font-mono font-bold text-sm ${
            isCancelled
              ? 'text-slate-400 line-through'
              : 'text-[#0B2F52]'
          }`}
        >
          {formatINR(voucher.amount)}
        </span>
        <ChevronRight size={14} className="text-[#718096] group-hover:text-[#06294D] transition-colors shrink-0" />
      </div>
    </div>
  );
};
