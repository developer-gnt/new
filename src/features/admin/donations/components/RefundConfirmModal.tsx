import React, { useState } from 'react';
import { AlertTriangle, X, RotateCcw } from 'lucide-react';
import type { DonationRowModel } from '../types/donations.types';

interface RefundConfirmModalProps {
  row: DonationRowModel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => Promise<void> | void;
  isProcessing?: boolean;
}

const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({
  row,
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  const [reason, setReason] = useState('Donor requested refund');

  if (!isOpen || !row) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(row.id, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 bg-rose-600 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-white" />
            <h3 className="font-semibold text-base font-serif tracking-wide text-white">
              Confirm Donation Refund
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to process a full refund of{' '}
            <strong className="text-slate-900">{formatINR(row.amount)}</strong> to{' '}
            <strong className="text-slate-900">{row.donorName}</strong>?
          </p>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-[11px] text-rose-800 space-y-1">
            <div className="font-bold">⚠️ Accounting &amp; Ledger Reversal:</div>
            <div>
              Refunding will post a mirrored reversal entry in the General Ledger and revoke 80G tax exemption certification validity for this transaction.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Reason for Refund
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Bank chargeback, duplicate payment, donor request"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isProcessing ? 'Processing Refund...' : 'Process Refund'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

