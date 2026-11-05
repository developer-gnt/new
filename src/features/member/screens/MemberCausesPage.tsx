import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  Users,
  CreditCard,
  Building2,
  QrCode,
  Lock,
  Download,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import type { MemberPassbookEntry } from '../types/member.types';
import { generate80GReceiptPdf } from '../utils/memberDocumentGenerator';

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

  const [activeCause, setActiveCause] = useState<CauseItem | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('ABCDE1234F');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'CASHFREE'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<MemberPassbookEntry | null>(null);

  const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

  const handleOpenDonateModal = (cause: CauseItem) => {
    setActiveCause(cause);
    setDonationAmount(1000);
    setCustomAmountInput('');
    setCompletedReceipt(null);
  };

  const handlePresetSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmountInput('');
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDonationAmount(parsed);
    }
  };

  const handleExecuteDonation = async () => {
    if (!activeCause) return;
    setIsProcessing(true);

    setTimeout(async () => {
      const res = await processDonation(
        activeCause.title,
        donationAmount,
        paymentMethod,
        donorPan
      );
      setIsProcessing(false);
      if (res.success) {
        setCompletedReceipt(res.receipt);
      }
    }, 1200);
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
        {CAUSES.map((cause) => {
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

      {/* Donation Modal */}
      {activeCause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveCause(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!completedReceipt ? (
              <>
                {/* Header */}
                <div className="border-b border-slate-100 pb-3 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Philanthropic Mission Contribution
                  </span>
                  <h2 className="text-xl font-black text-[#06294D] pt-1">
                    {activeCause.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your contribution directly finances verified field interventions.
                  </p>
                </div>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Contribution Amount
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handlePresetSelect(amt)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          donationAmount === amt && !customAmountInput
                            ? 'bg-[#06294D] text-white border-[#06294D] shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                      Or Enter Custom Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={customAmountInput}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                    />
                  </div>
                </div>

                {/* Donor PAN for 80G */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Donor PAN (For Section 80G Exemption)
                  </label>
                  <input
                    type="text"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Mandatory for generating Form 10BD acknowledgment from Income Tax Department.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Payment Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? 'border-[#06294D] bg-[#06294D] text-white shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1" />
                      UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'border-[#06294D] bg-[#06294D] text-white shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASHFREE')}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'CASHFREE'
                          ? 'border-[#06294D] bg-[#06294D] text-white shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1" />
                      Cashfree
                    </button>
                  </div>
                </div>

                {/* Donate CTA */}
                <button
                  type="button"
                  disabled={isProcessing || donationAmount <= 0}
                  onClick={handleExecuteDonation}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isProcessing
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#FAD465] hover:bg-[#E9B82E] text-[#06294D]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Processing Contribution...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Contribute ₹{donationAmount.toLocaleString('en-IN')} & Generate 80G Receipt
                    </>
                  )}
                </button>
              </>
            ) : (
              /* Success Confirmation */
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Contribution Received with Thanks
                  </span>
                  <h2 className="text-2xl font-black text-[#06294D] pt-2">
                    Thank You for Your Generosity!
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your contribution of <strong>₹{completedReceipt.amount.toLocaleString('en-IN')}</strong> to{' '}
                    <em>{activeCause.title}</em> has been securely recorded.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Receipt Number</span>
                    <span className="font-mono font-bold text-slate-800">{completedReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">80G Certificate Ref</span>
                    <span className="font-mono text-slate-700">{completedReceipt.section80GRef}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Form 10BD Acknowledgement</span>
                    <span className="font-bold text-emerald-700">Eligible (50% Deduction)</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const doc = generate80GReceiptPdf(member, completedReceipt);
                      doc.save(`HRSJM_80G_Receipt_${completedReceipt.receiptNumber.replace(/\//g, '_')}.pdf`);
                    }}
                    className="w-full py-3 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#FAD465]" />
                    Download Official 80G Tax Receipt (PDF)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCause(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer pt-1 block mx-auto"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
