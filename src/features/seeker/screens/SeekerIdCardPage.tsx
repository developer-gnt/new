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
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>HRSJM Seeker ID Card - ${user?.full_name || 'Seeker'}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 24px; background: #FAF7F0; color: #06294D; text-align: center; }
            .card-wrapper { max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 2px solid #06294D; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .c-header { background: #06294D; padding: 18px; color: #FFFFFF; border-bottom: 3px solid #FAD465; text-align: left; }
            .c-org { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #FAD465; text-transform: uppercase; }
            .c-title { font-size: 16px; font-weight: 700; margin-top: 4px; color: #FFFFFF; }
            .c-body { padding: 24px; text-align: left; }
            .row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
            .avatar { width: 70px; height: 70px; border-radius: 14px; background: #06294D; color: #FAD465; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; border: 2px solid #FAD465; }
            .name { font-size: 18px; font-weight: 800; color: #06294D; }
            .id-code { font-family: monospace; font-size: 12px; font-weight: 700; color: #0D9488; margin-top: 2px; }
            .meta { font-size: 12px; color: #64748B; margin-top: 2px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 14px 0; margin-bottom: 16px; font-size: 12px; }
            .label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94A3B8; }
            .val { font-weight: 700; color: #06294D; margin-top: 2px; }
            .notice { font-size: 10px; color: #94A3B8; line-height: 1.5; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card-wrapper">
            <div class="c-header">
              <div class="c-org">Human Rights & Social Justice Mission</div>
              <div class="c-title">Donation Seeker Verification Card</div>
            </div>
            <div class="c-body">
              <div class="row">
                <div class="avatar">${user?.full_name?.charAt(0) || 'S'}</div>
                <div>
                  <div class="name">${user?.full_name || 'HRSJM Seeker'}</div>
                  <div class="id-code">ID: ${seekerId}</div>
                  <div class="meta">Mobile: ${user?.mobile_number || '9888880004'}</div>
                </div>
              </div>
              <div class="grid">
                <div>
                  <div class="label">Registered State</div>
                  <div class="val">${user?.state || 'Maharashtra'}</div>
                </div>
                <div>
                  <div class="label">City / Center</div>
                  <div class="val">${user?.city || 'Mumbai Central'}</div>
                </div>
                <div>
                  <div class="label">Issue Date</div>
                  <div class="val">01 Oct 2026</div>
                </div>
                <div>
                  <div class="label">Status</div>
                  <div class="val" style="color: #10B981;">Active & Verified</div>
                </div>
              </div>
              <div class="notice">
                Official Credential issued by Human Rights and Social Justice Mission for verified humanitarian assistance.
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
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

