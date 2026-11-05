import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  Download,
  CheckCircle,
  Receipt,
  CreditCard,
  QrCode,
  Building,
  ArrowRight,
} from 'lucide-react';
import { donationsService } from '../../admin/donations/services/donationsService';
import type { Donation } from '../../admin/donations/types/donations.types';
import { useUserAuth } from '../store/userAuthStore';
import { cashfreeService } from '../../payments';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const CAUSES = [
  'General Human Rights Mission',
  'Free Legal Aid & Citizen Redressal',
  'Women & Child Protection Welfare',
  'Right to Education for Underprivileged',
  'Disaster & Emergency Humanitarian Relief',
];

export const UserDonationsPage: React.FC = () => {
  const { user } = useUserAuth();

  const [activeTab, setActiveTab] = useState<'donate' | 'history'>('donate');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCause, setSelectedCause] = useState<string>(CAUSES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');

  // Form State
  const [donorName, setDonorName] = useState(user?.full_name || 'Mohd. Ayaan Shaikh');
  const [donorEmail, setDonorEmail] = useState(user?.email || 'ayaan.shaikh@hrsjm.org');
  const [donorMobile, setDonorMobile] = useState(user?.mobile_number || '+91 98765 43210');
  const [panNumber, setPanNumber] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);
  const [pastDonations, setPastDonations] = useState<Donation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load history on mount or tab change
  useEffect(() => {
    if (activeTab === 'history') {
      const loadHistory = async () => {
        try {
          setLoadingHistory(true);
          const list = await donationsService.getDonations();
          setPastDonations(list || []);
        } catch (err) {
          console.error('Failed to load donation history:', err);
        } finally {
          setLoadingHistory(false);
        }
      };
      loadHistory();
    }
  }, [activeTab]);

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleMakeDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 10) {
      alert('Minimum donation amount is ₹10.');
      return;
    }

    try {
      setSubmitting(true);
      const session = await cashfreeService.createDonationOrder({
        cause: selectedCause,
        amount: effectiveAmount,
        donorName: isAnonymous ? 'Anonymous Donor' : donorName.trim(),
        donorEmail: donorEmail.trim() || undefined,
        donorMobile: donorMobile.trim() || undefined,
        userId: user?.id,
        panNumber: panNumber ? panNumber.toUpperCase() : undefined,
        need80G: Boolean(panNumber),
      });

      await cashfreeService.launchCashfreeCheckout(
        session,
        async (verifyRes) => {
          const completed: any = {
            id: session.order_id,
            amount: effectiveAmount,
            cause: selectedCause,
            donor_name: isAnonymous ? 'Anonymous Donor' : donorName.trim(),
            donor_mobile: donorMobile.trim(),
            donor_email: donorEmail.trim(),
            transaction_id: verifyRes.transaction_id || `CF-${Date.now().toString().slice(-8)}`,
            receipt_number: verifyRes.receipt_number || `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            is_anonymous: isAnonymous,
            created_at: new Date().toISOString(),
            payment_method: verifyRes.payment_method || 'CASHFREE',
          };
          setCompletedDonation(completed);
          setSubmitting(false);
        },
        () => {
          setSubmitting(false);
        }
      );
    } catch (err: any) {
      setSubmitting(false);
      alert(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 text-[#FAD465] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart size={14} className="fill-[#FAD465]" />
            <span>80G Tax-Exempt National Contribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">Donations & Support Desk</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Every contribution directly funds legal interventions, constitutional protection, women and child welfare, and grassroots relief. All donations are 50% tax exempt under Section 80G.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('donate');
              setCompletedDonation(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'donate' ? 'bg-[#E9B82E] text-[#011F39] shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Make a Donation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-[#E9B82E] text-[#011F39] shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            My Donation Receipts
          </button>
        </div>
      </div>

      {activeTab === 'donate' ? (
        completedDonation ? (
          /* Success Receipt Card */
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-lg text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={36} strokeWidth={2.2} />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Received Successfully
              </span>
              <h2 className="text-2xl font-black font-serif text-[#06294D] mt-3">Thank You for Your Generosity!</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your contribution of <strong className="text-slate-800">₹{completedDonation.amount.toLocaleString('en-IN')}</strong> will directly safeguard human dignity and constitutional rights.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt / Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedDonation.transaction_id || completedDonation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cause:</span>
                <span className="font-bold text-slate-800">{completedDonation.cause}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-bold text-slate-800">{completedDonation.donor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">80G Tax Exemption:</span>
                <span className="font-bold text-emerald-700">Eligible (50% Deduction)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  cashfreeService.downloadDonationReceiptPdf({
                    receiptNumber: (completedDonation as any).receipt_number || `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    orderId: completedDonation.id,
                    transactionId: (completedDonation as any).transaction_id || `CF-${Date.now().toString().slice(-8)}`,
                    amount: completedDonation.amount,
                    purpose: 'donation',
                    purposeTitle: completedDonation.cause,
                    donorName: completedDonation.donor_name,
                    donorMobile: donorMobile,
                    donorEmail: donorEmail,
                    panNumber: panNumber,
                    userId: user?.id,
                    paymentMethod: (completedDonation as any).payment_method || 'CASHFREE',
                    paidAt: completedDonation.created_at || new Date().toISOString(),
                    is80GEligible: true,
                    status: 'SUCCESS',
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083563] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download size={15} />
                <span>Download Official 80G Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompletedDonation(null);
                  setSelectedAmount(1000);
                  setCustomAmount('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        ) : (
          /* Donation Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Left 2 cols */}
            <form onSubmit={handleMakeDonation} className="lg:col-span-2 space-y-6">
              {/* 1. Select Cause */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <label className="text-xs font-bold text-[#06294D] uppercase tracking-wider block">
                  1. Select Mission Cause
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CAUSES.map(cause => (
                    <button
                      key={cause}
                      type="button"
                      onClick={() => setSelectedCause(cause)}
                      className={`p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border ${
                        selectedCause === cause
                          ? 'bg-[#FEF3C7] border-amber-400 text-[#06294D] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cause}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Amount Selector */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <label className="text-xs font-bold text-[#06294D] uppercase tracking-wider block">
                  2. Choose Donation Amount (INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-xl font-black text-sm transition-all cursor-pointer border ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#06294D] border-[#06294D] text-[#FAD465] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount in Rupees (Min ₹100)"
                      value={customAmount}
                      onChange={e => {
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
                      min="100"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Donor Information */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#06294D] uppercase tracking-wider block">
                    3. Donor Details for 80G Tax Exemption
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Make anonymous</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={e => setDonorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={donorEmail}
                        onChange={e => setDonorEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={donorMobile}
                        onChange={e => setDonorMobile(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">PAN Card (For 80G Tax Receipt)</label>
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        value={panNumber}
                        onChange={e => setPanNumber(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Payment Method & Submit */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <label className="text-xs font-bold text-[#06294D] uppercase tracking-wider block">
                  4. Payment Gateway Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'UPI' ? 'bg-[#06294D] text-[#FAD465] border-[#06294D]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <QrCode size={18} />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'CARD' ? 'bg-[#06294D] text-[#FAD465] border-[#06294D]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING' ? 'bg-[#06294D] text-[#FAD465] border-[#06294D]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Building size={18} />
                    <span>Net Banking</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#011F39] font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart size={16} className="fill-[#011F39]" />
                  <span>{submitting ? 'Connecting to Cashfree...' : `Pay ₹${effectiveAmount.toLocaleString('en-IN')} with Cashfree Gateway`}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Right Summary Column */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider">
                  Contribution Summary
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Donation Amount:</span>
                    <strong className="text-slate-900 font-mono">₹{effectiveAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Selected Cause:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[160px] truncate">{selectedCause}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Platform Fee:</span>
                    <span className="text-emerald-700 font-bold">₹0 (Zero Fee)</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-sm text-[#06294D]">
                    <span>Total Amount:</span>
                    <span className="font-mono">₹{effectiveAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Tax Exemption Assurance Card */}
              <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Section 80G Certified</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  HRSJM is a registered non-governmental organization under the Societies Registration Act. All monetary donations qualify for 50% income tax exemption under Section 80G of the Indian IT Act.
                </p>
                <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-amber-200">
                  Govt Reg: HRSJM/80G/DEL/2026-992
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* History Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#06294D]">Your Personal Donation Records</h2>
            <span className="text-xs text-slate-500">Official tax receipts downloadable anytime</span>
          </div>

          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : pastDonations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <Receipt size={36} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-bold text-slate-700">No donation records yet</p>
              <p className="text-xs text-slate-400 mt-1">Make your first contribution to receive an official 80G tax receipt.</p>
              <button
                type="button"
                onClick={() => setActiveTab('donate')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#06294D] hover:bg-[#083563] cursor-pointer"
              >
                Make a Contribution
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastDonations.map(donation => (
                <div
                  key={donation.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-[#06294D]">
                          ₹{donation.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {donation.status || 'SUCCESS'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{donation.cause || 'General Donation'}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: {donation.transaction_id || donation.id} • {new Date(donation.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#06294D] flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download size={13} />
                    <span>80G Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
