import React from 'react';
import { ShieldCheck, Package } from 'lucide-react';

export const MembershipVerificationNotice: React.FC = () => {
  return (
    <div className="bg-[#EFF6FF] rounded-2xl p-4 sm:p-5 border border-[#BFDBFE] shadow-xs">
      <div className="flex items-center gap-3 pb-2.5 border-b border-[#DBEAFE]">
        <div className="w-8 h-8 rounded-full bg-[#DBEAFE] border border-[#93C5FD] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#1E3A8A]">
            Document Verification & Approval Policy
          </h4>
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#3B82F6]">
            राष्ट्रीय समिति द्वारा सत्यापन एवं अनुमोदन
          </p>
        </div>
      </div>

      <div className="pt-3 space-y-2.5">
        <p className="text-xs text-slate-700 leading-relaxed">
          All membership applications are subject to mandatory document verification and background check by the{' '}
          <strong className="text-[#06294D] font-bold">HRSJM National Committee</strong> before final appointment approval.
        </p>

        <div className="bg-white rounded-xl p-3 border border-blue-200/60 flex items-start gap-2.5">
          <Package className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-slate-700 leading-snug">
            <strong>Official Welcome Kit</strong> (Appointment Letter, Certificate, Lanyard & T-Shirt) will be dispatched to your registered address upon verification.
          </p>
        </div>
      </div>
    </div>
  );
};

