import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ChevronRight,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
} from 'lucide-react';
import type { ReceiptEntryItem } from '../types/receipts.types';
import { classifyReceipt } from '../utils/receiptClassification';
import { formatINR } from '../types/receipts.types';

interface ReceiptCardProps {
  voucher: ReceiptEntryItem;
  onCancelVoucher?: (voucher: ReceiptEntryItem) => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ voucher }) => {
  const navigate = useNavigate();
  const classified = classifyReceipt(voucher);
  const isCancelled = voucher.status === 'CANCELLED';

  const formatDate = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr || '—';
      return (
        d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' • ' +
        d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch {
      return isoStr || '—';
    }
  };

  const getMethodIcon = () => {
    const m = String(voucher.payment_method || '').toUpperCase();
    if (m.includes('UPI') || m.includes('CASHFREE') || m.includes('ONLINE')) {
      return <Smartphone size={12} className="text-[#06294D]" />;
    }
    if (m.includes('BANK') || m.includes('TRANSFER') || m.includes('CHEQUE')) {
      return <Building size={12} className="text-[#06294D]" />;
    }
    if (m.includes('CARD')) {
      return <CreditCard size={12} className="text-[#06294D]" />;
    }
    return <Banknote size={12} className="text-[#06294D]" />;
  };

  const getMethodLabel = (): string => {
    const m = String(voucher.payment_method || '').toUpperCase();
    if (m.includes('UPI')) return 'UPI';
    if (m.includes('CASHFREE')) return 'Cashfree Gateway';
    if (m.includes('BANK') || m.includes('TRANSFER')) return 'Bank Transfer';
    if (m.includes('CARD')) return 'Debit / Credit Card';
    if (m.includes('CHEQUE')) return 'Cheque / DD';
    if (m.includes('CASH')) return 'Cash in Hand';
    return voucher.payment_method || 'Online';
  };

  return (
    <tr
      onClick={() => navigate(`/admin/receipts/${voucher.id}`)}
      className={`group border-b border-[#EDF2F7] hover:bg-[#FAF7F0]/60 transition-colors cursor-pointer text-xs ${
        isCancelled ? 'bg-slate-50/70' : 'bg-white'
      }`}
    >
      {/* 1. Voucher No, Category & Stream */}
      <td className="py-3.5 px-4 align-top">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] border border-[#DBE5EE] text-[#06294D] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FAF7F0] group-hover:border-[#DCE4EC] transition-colors">
            <FileText size={16} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono text-xs font-bold transition-colors ${
                  isCancelled
                    ? 'text-slate-400 line-through'
                    : 'text-[#0B2F52] group-hover:text-[#C9971A]'
                }`}
              >
                {voucher.voucher_number}
              </span>

              {/* Category Badge */}
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EDF2F7] text-[#06294D] border border-[#DBE5EE]">
                {classified.categoryLabel}
              </span>

              {/* Channel Badge */}
              {classified.sourceBadgeText && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF7F0] text-[#34516D] border border-[#DCE4EC]">
                  {classified.sourceBadgeText}
                </span>
              )}
            </div>

            <div className="text-[11px] text-[#718096] font-medium mt-1">
              {formatDate(voucher.receipt_date)}
            </div>

            {/* Purpose / Cause Highlight */}
            {classified.sourceHighlightValue && (
              <div className="text-[11px] text-[#718096] truncate max-w-sm mt-1">
                Purpose: <span className="font-semibold text-[#06294D]">{classified.sourceHighlightValue}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* 2. Received From (Contributor / Payer) */}
      <td className="py-3.5 px-4 align-top">
        <div className="font-bold text-xs text-[#0B2F52]">
          {classified.payerName || voucher.received_from || 'Direct Contributor'}
        </div>
        {classified.payerContact && (
          <div className="text-[11px] text-[#34516D] mt-0.5">
            {classified.payerContact}
          </div>
        )}
        {voucher.reference_number && (
          <div className="text-[11px] font-mono text-[#718096] mt-1">
            Ref: {voucher.reference_number}
          </div>
        )}
      </td>

      {/* 3. Account Allocation */}
      <td className="py-3.5 px-4 align-top">
        <div className="font-semibold text-xs text-[#0B2F52]">
          {voucher.income_account?.account_name || 'Donation Income'}
        </div>
        <div className="text-[11px] text-[#718096] mt-0.5">
          To: {voucher.received_in_account?.account_name || 'Bank Account'}
        </div>
      </td>

      {/* 4. Payment Method */}
      <td className="py-3.5 px-4 align-top">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EDF2F7] text-[#06294D] border border-[#DBE5EE]">
          {getMethodIcon()}
          <span>{getMethodLabel()}</span>
        </span>
      </td>

      {/* 5. Amount & Status */}
      <td className="py-3.5 px-4 align-top text-right">
        <div
          className={`font-mono font-bold text-sm sm:text-base ${
            isCancelled ? 'text-slate-400 line-through' : 'text-[#0B2F52]'
          }`}
        >
          {formatINR(voucher.amount)}
        </div>
        <div className="mt-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
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
            <span>{isCancelled ? 'Cancelled' : 'Received'}</span>
          </span>
        </div>
      </td>

      {/* 6. Action */}
      <td className="py-3.5 px-4 align-middle text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/receipts/${voucher.id}`);
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#FAF7F0] hover:bg-[#EDF2F7] text-[#06294D] border border-[#DCE4EC] hover:border-[#FAD465] transition shadow-2xs cursor-pointer"
          title="View Voucher Slip"
        >
          <ChevronRight size={15} />
        </button>
      </td>
    </tr>
  );
};
