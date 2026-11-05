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
  Scale,
} from 'lucide-react';

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
            <div className="w-8 h-8 rounded-full bg-[#06294D] border border-[#FAD465] flex items-center justify-center text-[#FAD465]">
              <Scale size={16} />
            </div>
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
      <main className="flex-1 px-4 -mt-12 pb-16">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-9 relative z-20">
          {/* Stepper Bar (Exact APK Parity) */}
          <div className="mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              {/* Step 1: Active */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-[#011F39] text-[#FAD465] border-2 border-[#EAA224] flex items-center justify-center text-xs font-bold shadow-sm">
                  1
                </div>
                <span className="text-[11px] font-bold text-[#011F39] mt-1.5 text-center leading-tight">
                  Account<br />Type
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-5" />

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1.5 text-center leading-tight">
                  Personal<br />Details
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-5" />

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1.5 text-center leading-tight">
                  Verification<br />/ Proofs
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-5" />

              {/* Step 4 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1.5 text-center leading-tight">
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#011F39] font-serif">
              Select Registration Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select how you would like to participate in the Human Rights & Social Justice Mission.
            </p>
          </div>

          {/* 3 Interactive Cards Grid (Exact APK Representation) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {ACCOUNT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              const IconComp = type.icon;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-2xl border-2 p-5 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-[#011F39] bg-[#011F39]/5 shadow-md ring-2 ring-[#011F39]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#011F39] text-[#FAD465] flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </div>
                  )}

                  <div>
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl ${type.iconBg} ${type.iconColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                    >
                      <IconComp size={26} strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#011F39] mb-1">
                      {type.title}
                    </h3>

                    {/* Badge */}
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-3 ${type.badgeColor}`}
                    >
                      {type.badge}
                    </span>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {type.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                      {type.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Radio / Selection Indicator at bottom */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#011F39] bg-[#011F39]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#FAD465]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: Signature Gold Yellow */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{selectedConfig.ctaText}</span>
              <ArrowRight size={16} />
            </button>

            {/* Back to Login */}
            <div className="text-center text-xs text-slate-600 pt-2">
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
