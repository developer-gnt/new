import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface CustomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate: string;
  initialEndDate: string;
  onApply: (startDate: string, endDate: string) => void;
}

export const CustomDateModal: React.FC<CustomDateModalProps> = ({
  isOpen,
  onClose,
  initialStartDate,
  initialEndDate,
  onApply,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please provide both Start Date and End Date.');
      return;
    }
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      setError('Start Date cannot be after End Date.');
      return;
    }
    setError(null);
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#011F39] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-[#FAD465]" />
            <h3 className="font-semibold text-base font-serif tracking-wide text-white">Select Custom Date Range</h3>
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
              Start Date (From)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              End Date (To / As of Date)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#011F39] focus:outline-none focus:ring-1 focus:ring-[#011F39]"
              required
            />
          </div>

          <p className="text-xs text-slate-500">
            Reports, analytics and general ledger reconciliation will be filtered strictly between these dates.
          </p>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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
        </form>
      </div>
    </div>
  );
};
