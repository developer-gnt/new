import type React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Users,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import hrsjmLogo from '../assets/hrsjm_logo.png';

const CURRENT_YEAR = new Date().getFullYear();

export type AccountTypeOption = 'general' | 'member' | 'seeker';

interface AccountTypeConfig {
  id: AccountTypeOption;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  deliverables: string[];
  ctaText: string;
  targetRoute: string;
  icon: typeof User;
  iconBg: string;
  iconColor: string;
}

const ACCOUNT_TYPES: AccountTypeConfig[] = [
  {
    id: 'general',
    title: 'General User',
    badge: 'Instant Access • No Approval',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Explore, learn fundamental rights, read press releases, and participate in human rights movements.',
    deliverables: [
      'Self-service instant activation',
      'Report human rights complaints',
      'Access legal rights library & guides',
    ],
    ctaText: 'Continue to Registration',
    targetRoute: '/register/user',
    icon: User,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#0B2F52]',
  },
  {
    id: 'member',
    title: 'Member',
    badge: 'Official ID & Voting Rights',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Join as an official member or office bearer of HRSJM with verified appointment and credentials.',
    deliverables: [
      'Official Appointment Letter & Certificate',
      'Downloadable Digital & Physical ID Card',
      'Voting rights in regional councils',
    ],
    ctaText: 'Proceed to Membership Form',
    targetRoute: '/membership/apply',
    icon: Users,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#059669]',
  },
  {
    id: 'seeker',
    title: 'Donation Seeker',
    badge: 'Requires KYC & Admin Approval',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Request financial, medical or educational relief for verified distress and humanitarian causes.',
    deliverables: [
      'Emergency medical / education aid',
      'Direct verified grant disbursements',
      'Online application status tracking',
    ],
    ctaText: 'Proceed to Assistance Form',
    targetRoute: '/assistance/apply',
    icon: HeartHandshake,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
];

export const SignupCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<AccountTypeOption>('general');

  const selectedConfig = ACCOUNT_TYPES.find((c) => c.id === selectedType) || ACCOUNT_TYPES[0];

  const handleProceed = () => {
    navigate(selectedConfig.targetRoute);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <header className="bg-[#011F39] text-white border-b border-[#06294D] shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#FAD465] transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Login</span>
          </Link>

          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={hrsjmLogo}
              alt="HRSJM Official Crest"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white font-serif leading-none">
                HRSJM
              </span>
              <span className="text-[9px] font-bold text-[#FAD465] tracking-widest uppercase mt-0.5">
                Constitutional Platform
              </span>
            </div>
          </Link>

          <div className="text-xs">
            <span className="text-slate-400 hidden sm:inline">Already registered? </span>
            <Link to="/login" className="text-[#FAD465] font-bold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Strip */}
      <section className="bg-gradient-to-b from-[#011F39] via-[#06294D] to-[#0B2F52] text-white pt-10 pb-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-[#FAD465] tracking-widest uppercase">
            <span>Step 1 of Registration</span>
            <span>•</span>
            <span>Category Selection</span>
          </div>

          <h1
            style={{ color: '#FFFFFF' }}
            className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white !text-white"
          >
            Choose Your <span style={{ color: '#FAD465' }} className="text-[#FAD465]">Account Type</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
            Please select the category that best describes you to begin the registration process.
          </p>
        </div>
      </section>

      {/* Main Container Overlapping Card */}
      <main className="flex-1 px-4 -mt-10 pb-14">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-7 relative z-20">
          {/* Stepper Bar (Exact APK Parity) */}
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between relative max-w-sm mx-auto">
              {/* Step 1: Active */}
              <div className="flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-[#011F39] text-[#FAD465] border-2 border-[#E9B82E] flex items-center justify-center text-[11px] font-bold shadow-xs">
                  1
                </div>
                <span className="text-[10px] font-bold text-[#011F39] mt-1 text-center leading-tight">
                  Account<br />Type
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4" />

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
                  2
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1 text-center leading-tight">
                  Personal<br />Details
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4" />

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
                  3
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1 text-center leading-tight">
                  Verification<br />/ Proofs
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4" />

              {/* Step 4 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
                  4
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1 text-center leading-tight">
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#011F39] font-serif">
              Select Registration Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select how you would like to participate in the Human Rights & Social Justice Mission.
            </p>
          </div>

          {/* 3 Interactive Cards Grid (Refined, Compact & Professional) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
            {ACCOUNT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              const IconComp = type.icon;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-xl border p-4 text-left cursor-pointer transition-all duration-150 flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-[#011F39] bg-[#011F39]/[0.03] shadow-xs ring-1 ring-[#011F39]/20'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Radio Indicator */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg ${type.iconBg} ${type.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                      >
                        <IconComp size={18} strokeWidth={2} />
                      </div>

                      <div
                        className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#011F39] bg-[#011F39]'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#FAD465]" />}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#011F39] mb-1">
                      {type.title}
                    </h3>

                    {/* Badge */}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border mb-2 ${type.badgeColor}`}
                    >
                      {type.badge}
                    </span>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 min-h-[32px]">
                      {type.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-1.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                      {type.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Selection Status Line */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                    <span className={isSelected ? 'text-[#011F39]' : 'text-slate-400'}>
                      {isSelected ? '✓ Selected' : 'Tap to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: Signature Gold Yellow */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3 px-5 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{selectedConfig.ctaText}</span>
              <ArrowRight size={15} />
            </button>

            {/* Back to Login */}
            <div className="text-center text-xs text-slate-600 pt-1">
              <span>Already have an account? </span>
              <Link to="/login" className="font-bold text-[#011F39] hover:underline">
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-5 text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>© {CURRENT_YEAR} Human Rights Sanrakshan Sansthan (HRSJM). All rights reserved.</p>
      </footer>
    </div>
  );
};
