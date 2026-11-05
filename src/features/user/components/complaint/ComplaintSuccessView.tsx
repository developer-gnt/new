import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Heart,
  FileText,
  RotateCcw,
  Clock,
  Scale,
} from 'lucide-react';

export interface ComplaintSuccessViewProps {
  ticketId: string;
  onViewTickets: () => void;
  onReset: () => void;
}

const PRESET_DONATIONS = [250, 350, 500];

export const ComplaintSuccessView: React.FC<ComplaintSuccessViewProps> = ({
  ticketId,
  onViewTickets,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<number>(250);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);

  const effectiveAmount = isCustom ? parseInt(customAmount.trim(), 10) || 0 : selectedDonation;

  const handleCopy = () => {
    navigator.clipboard?.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonate = () => {
    if (effectiveAmount <= 0) return;
    setDonated(true);
    alert(`Thank you for supporting HRSJM with a contribution of ₹${effectiveAmount}! Your receipt reference will be emailed.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#06294D]">
            Complaint Submitted Successfully
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Thank you for reaching out to HRSJM. Your complaint has been received and recorded in our support ticket system.
          </p>
        </div>

        {/* Reference ID Box */}
        <div className="inline-flex items-center gap-2 p-2.5 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 font-semibold">Reference Ticket ID:</span>
          <span className="font-mono font-black text-sm text-[#06294D]">{ticketId}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-lg hover:bg-slate-200/80 text-slate-500 cursor-pointer transition-colors"
            title="Copy ID"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </div>

        {/* 3-Stage Status Tracker */}
        <div className="pt-2 max-w-lg mx-auto">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Live Case Redressal Pipeline
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Stage 1 */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
              <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto text-xs font-black">
                <Check size={12} strokeWidth={3} />
              </div>
              <p className="text-[11px] font-black leading-tight">1. Logged</p>
              <p className="text-[9.5px] text-emerald-600">Recorded</p>
            </div>

            {/* Stage 2 */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 ring-2 ring-amber-300/40">
              <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center mx-auto text-xs font-black animate-pulse">
                <Scale size={12} />
              </div>
              <p className="text-[11px] font-black leading-tight">2. Legal Cell</p>
              <p className="text-[9.5px] text-amber-700 font-semibold">In Review</p>
            </div>

            {/* Stage 3 */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 space-y-1">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-xs font-black">
                <Clock size={12} />
              </div>
              <p className="text-[11px] font-bold leading-tight">3. Redressal</p>
              <p className="text-[9.5px] text-slate-400">Resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voluntary Support / Donate to Us Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart size={16} fill="currentColor" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            SUPPORT OUR MISSION
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-[#06294D]">
            Support HRSJM — Donate to Us
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            HRSJM provides 100% free legal guidance, human rights protection, and urgent grievance assistance to citizens across India. Your voluntary contribution powers this humanitarian mission.
          </p>
        </div>

        {/* Amount Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Choose a Contribution Amount
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_DONATIONS.map(amt => {
              const isSelected = !isCustom && selectedDonation === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedDonation(amt);
                  }}
                  className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#06294D] text-white border-[#06294D] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ₹{amt}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                if (!customAmount) setCustomAmount('1000');
              }}
              className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                isCustom
                  ? 'bg-[#06294D] text-white border-[#06294D] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                ₹
              </span>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDonate}
          className="w-full py-3 px-4 rounded-xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <Heart size={14} fill="currentColor" />
          <span>{donated ? 'Contribute Again' : `Donate ₹${effectiveAmount || 0} to HRSJM`}</span>
        </button>

        <p className="text-center text-[10.5px] text-slate-400">
          🔒 256-bit encrypted · Tax exemption eligible under 80G
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onViewTickets}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#06294D] hover:bg-[#083563] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <FileText size={15} />
          <span>View My Tickets &amp; Live Chat</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={14} />
          <span>File Another Complaint</span>
        </button>
      </div>
    </div>
  );
};
