import React from 'react';
import { HeartHandshake, X, Check, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface SeekerStatusModalProps {
  visible: boolean;
  applicationNumber?: string;
  status?: 'pending' | 'active' | 'blocked';
  remarks?: string;
  onClose: () => void;
  onReapply?: () => void;
  onApplyMembership?: () => void;
}

export const SeekerStatusModal: React.FC<SeekerStatusModalProps> = ({
  visible,
  applicationNumber = 'HRSJM-SEK-2026-0042',
  status = 'pending',
  remarks,
  onClose,
  onReapply,
  onApplyMembership,
}) => {
  useLockBodyScroll(visible);

  if (!visible) return null;

  const isApproved = status === 'active';
  const isRejected = status === 'blocked';
  const isPending = !isApproved && !isRejected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <HeartHandshake size={18} />
            </div>
            <h3 className="font-bold text-base text-[#06294D]">
              Donation Seeker Application
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Application Number & Status Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                APPLICATION NUMBER
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">
                {applicationNumber}
              </span>
            </div>

            <div>
              {isApproved && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Approved
                </span>
              )}
              {isRejected && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Rejected
                </span>
              )}
              {isPending && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Under Review
                </span>
              )}
            </div>
          </div>

          {/* Timeline Tracker */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Application Progress
            </h4>
            <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 pl-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 border-2 border-white flex items-center justify-center">
                  <Check size={14} strokeWidth={2.5} />
                </div>
                <div className="text-xs font-bold text-slate-800">Application Submitted</div>
                <div className="text-[11px] text-slate-500">Details & supporting documents received</div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div
                  className={`absolute -left-8 top-0.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-700'
                      : isRejected
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isApproved ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : isRejected ? (
                    <AlertCircle size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800">Verification & Assessment</div>
                <div className="text-[11px] text-slate-500">
                  {isApproved
                    ? 'Documents verified by committee'
                    : isRejected
                    ? 'Application flagged during verification'
                    : 'Documents are currently under review by admin'}
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div
                  className={`absolute -left-8 top-0.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-700'
                      : isRejected
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isApproved ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : isRejected ? (
                    <X size={14} strokeWidth={2.5} />
                  ) : (
                    <Clock size={14} />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800">Final Decision</div>
                <div className="text-[11px] text-slate-500">
                  {isApproved
                    ? 'Beneficiary aid approved'
                    : isRejected
                    ? (remarks || 'Application could not be approved at this time')
                    : 'Awaiting administrator confirmation'}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection / Note Details */}
          {remarks && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Admin Note:</strong> {remarks}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onApplyMembership && (
            <button
              type="button"
              onClick={onApplyMembership}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Apply for Membership Instead</span>
              <ArrowRight size={13} />
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isRejected && onReapply && (
              <button
                type="button"
                onClick={onReapply}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Re-apply for Aid
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

