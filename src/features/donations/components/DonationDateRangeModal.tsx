import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import type { DateRange } from '../types/donations.types';

interface DonationDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onApply: (range: DateRange) => void;
  onClear: () => void;
}

export const DonationDateRangeModal: React.FC<DonationDateRangeModalProps> = ({
  isOpen,
  onClose,
  dateRange,
  onApply,
  onClear,
}) => {
  const [from, setFrom] = useState(dateRange.from || '');
  const [to, setTo] = useState(dateRange.to || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && new Date(from).getTime() > new Date(to).getTime()) {
      setError('From Date cannot be after To Date.');
      return;
    }
    setError(null);
    onApply({ from: from || null, to: to || null });
    onClose();
  };

  const handleReset = () => {
    setFrom('');
    setTo('');
    setError(null);
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#011F39] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-[#FAD465]" />
            <h3 className="font-semibold text-base font-serif tracking-wide text-white">
              Filter by Date Range
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              From Date
            </label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              To Date
            </label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39]"
            />
          </div>

          <p className="text-xs text-slate-500">
            Leave dates blank to view donations across all recorded dates.
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline"
            >
              Clear Range
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#011F39] px-5 py-2 text-sm font-medium text-white hover:bg-[#022c50] shadow-sm transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
