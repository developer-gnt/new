import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HrsjmLogo } from '../../../components/common/HrsjmLogo';
import { useAuth } from '../../auth/store/authStore';

export const SeekerIdCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const seekerId = `HRSJM-SEK-${(user?.id || '4004').slice(-4).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/seeker/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2F52] hover:text-[#06294D] transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to Profile</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06294D] text-[#FAD465] text-xs font-bold rounded-lg hover:bg-[#123F68] transition cursor-pointer"
        >
          <Printer size={14} />
          <span>Print / Save ID</span>
        </button>
      </div>

      {/* Official Seeker ID Card (Printable) */}
      <div
        id="printable-seeker-id-card"
        className="bg-white rounded-3xl border-2 border-[#DCE4EC] shadow-xl overflow-hidden relative"
      >
        {/* Navy Header Band */}
        <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#123F68] p-5 text-white flex items-center justify-between border-b-2 border-[#FAD465]">
          <div className="flex items-center gap-3">
            <HrsjmLogo size="sm" variant="light" />
            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-[#FAD465] uppercase">
                HUMAN RIGHTS & SOCIAL JUSTICE MISSION
              </div>
              <div className="text-sm font-bold font-['Playfair_Display',Georgia,serif]">
                Donation Seeker Verification Card
              </div>
            </div>
          </div>
          <ShieldCheck size={28} className="text-[#FAD465]" />
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Beneficiary Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-[#06294D] text-[#FAD465] flex items-center justify-center font-bold text-3xl shadow-md border-2 border-[#FAD465] shrink-0">
              {user?.full_name?.charAt(0) || 'S'}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                <CheckCircle2 size={12} />
                <span>Verified Beneficiary Pass</span>
              </div>
              <h2 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
                {user?.full_name || 'HRSJM Test Seeker'}
              </h2>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                ID: {seekerId}
              </div>
              <div className="text-xs text-[#718096]">
                Mobile: {user?.mobile_number || '9888880004'}
              </div>
            </div>

            {/* QR Verification Code Mockup */}
            <div className="w-20 h-20 bg-[#FAF7F0] border border-[#DBE5EE] rounded-xl p-1.5 flex flex-col items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#06294D] fill-current">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h4v2h-4v-2zm-4 4h4v4h-4v-4zm6 2h2v2h-2v-2z" />
              </svg>
              <span className="text-[8px] font-mono text-gray-400 mt-0.5">SCAN TO VERIFY</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-[#DBE5EE] py-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Registered State</span>
              <span className="font-bold text-[#0B2F52]">{user?.state || 'Maharashtra'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">City / Center</span>
              <span className="font-bold text-[#0B2F52]">{user?.city || 'Mumbai Central'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Issue Date</span>
              <span className="font-bold text-[#0B2F52]">01 Oct 2026</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Validity</span>
              <span className="font-bold text-[#10B981]">Active & Verified</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed text-center">
            This card is issued by Human Rights and Social Justice Mission to authorized aid recipients. It certifies genuine registration for humanitarian medical, educational, and legal assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

