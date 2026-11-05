import React, { useState } from 'react';
import {
  Heart,
  Users,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import { GlobalPaymentModal } from '../../payments';

interface CauseItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Legal Aid' | 'Child Welfare' | 'Women Safety' | 'Human Rights';
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  daysLeft: number;
  imageUrl: string;
  urgent?: boolean;
}

const CAUSES: CauseItem[] = [
  {
    id: 'cause-1',
    title: 'Free Legal Aid & Pro-Bono Defense Pool',
    tagline: 'Providing experienced advocates to defend underprivileged citizens against unlawful detention and custodial abuse.',
    category: 'Legal Aid',
    targetAmount: 250000,
    raisedAmount: 185000,
    donorCount: 42,
    daysLeft: 14,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    urgent: true,
  },
  {
    id: 'cause-2',
    title: 'Child Slum Education & Midday Nutrition Drive',
    tagline: 'Supporting basic primary schooling, notebooks, and nutritious daily meals for children of migrant daily wage laborers.',
    category: 'Child Welfare',
    targetAmount: 400000,
    raisedAmount: 310000,
    donorCount: 88,
    daysLeft: 22,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cause-3',
    title: 'Women Crisis Helpline & Emergency Shelter',
    tagline: 'Immediate legal protection, emergency shelter, and counseling support for victims of domestic violence and harassment.',
    category: 'Women Safety',
    targetAmount: 180000,
    raisedAmount: 135000,
    donorCount: 31,
    daysLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    urgent: true,
  },
  {
    id: 'cause-4',
    title: 'Anti-Trafficking Squad & Bonded Labor Rescue',
    tagline: 'Coordinating with local district magistrates to raid illegal brick kilns and rehabilitate rescued bonded laborers.',
    category: 'Human Rights',
    targetAmount: 500000,
    raisedAmount: 375000,
    donorCount: 56,
    daysLeft: 30,
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600',
  },
];

export const MemberCausesPage: React.FC = () => {
  const { member, processDonation } = useCurrentMember();
  const [causesList, setCausesList] = useState<CauseItem[]>(CAUSES);
  const [activeCause, setActiveCause] = useState<CauseItem | null>(null);

  const handleOpenDonateModal = (cause: CauseItem) => {
    setActiveCause(cause);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#011F39] text-white p-6 md:p-8 rounded-2xl shadow-md border border-[#FAD465]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAD465]/20 text-[#FAD465] border border-[#FAD465]/30">
            <Heart className="w-3.5 h-3.5 fill-[#FAD465]" />
            Accredited Human Rights Relief & Welfare Drives
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Causes & Humanitarian Mission Campaigns
          </h1>
          <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Directly empower ground-level legal camps, rapid response rescue operations, and child welfare initiatives. All contributions are 100% transparent and eligible for Section 80G tax deductions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <span className="text-slate-300">Your Lifetime Donations: </span>
              <span className="font-bold text-[#FAD465]">₹{member.stats.totalDonated.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <span className="text-slate-300">Drives Supported: </span>
              <span className="font-bold text-white">{member.stats.donationCount} Campaigns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Causes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {causesList.map((cause) => {
          const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

          return (
            <div
              key={cause.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image Banner */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={cause.imageUrl}
                    alt={cause.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 text-[#06294D] backdrop-blur-sm">
                      {cause.category}
                    </span>
                    {cause.urgent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white">
                        Urgent Relief
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs text-[#FAD465] font-semibold flex items-center gap-1 mb-0.5">
                      <Clock className="w-3.5 h-3.5" /> {cause.daysLeft} days remaining
                    </span>
                    <h3 className="font-bold text-base md:text-lg leading-tight drop-shadow-sm">
                      {cause.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">{cause.tagline}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-[#06294D]">
                        ₹{cause.raisedAmount.toLocaleString('en-IN')}{' '}
                        <span className="text-[11px] font-normal text-slate-400">raised</span>
                      </span>
                      <span className="font-bold text-slate-500">{percent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#06294D] to-[#FAD465]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Goal: ₹{cause.targetAmount.toLocaleString('en-IN')}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {cause.donorCount} Donors
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenDonateModal(cause)}
                  className="w-full py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 text-[#FAD465] fill-[#FAD465]" />
                  Contribute to this Cause
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Cashfree Payment Gateway Modal */}
      {activeCause && (
        <GlobalPaymentModal
          isOpen={Boolean(activeCause)}
          onClose={() => setActiveCause(null)}
          payload={{
            purpose: 'donation',
            amount: 1000,
            title: activeCause.title,
            subtitle: activeCause.category,
            entityId: activeCause.id,
            userId: member.id,
            donorName: member.fullName,
            donorMobile: member.phone,
            donorEmail: member.email,
          }}
          onSuccess={(receipt) => {
            setCausesList((prev) =>
              prev.map((c) =>
                c.id === activeCause.id
                  ? { ...c, raisedAmount: c.raisedAmount + receipt.amount, donorCount: c.donorCount + 1 }
                  : c
              )
            );
            processDonation(
              activeCause.title,
              receipt.amount,
              'CASHFREE',
              receipt.panNumber,
              receipt.transactionId
            );
          }}
        />
      )}
    </div>
  );
};
