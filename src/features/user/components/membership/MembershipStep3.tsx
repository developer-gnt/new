import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Building2,
  Lock,
} from 'lucide-react';
import type { MembershipPostData } from '../../data/membershipCategoriesData';
import type { Step1FormData } from './MembershipStep1';
import type { Step2FormData } from './MembershipStep2';

export interface DocumentState {
  identityProof?: File | null;
  identityProofName?: string;
  addressProof?: File | null;
  addressProofName?: string;
  qualificationProof?: File | null;
  qualificationProofName?: string;
  photoProof?: File | null;
  photoProofName?: string;
}

interface MembershipStep3Props {
  selectedPost: MembershipPostData;
  step1Data: Step1FormData;
  step2Data: Step2FormData;
  onSubmit: (payload: {
    documents: DocumentState;
    paymentMethod: string;
  }) => void;
  onBack: () => void;
  submitting: boolean;
}

export const MembershipStep3: React.FC<MembershipStep3Props> = ({
  selectedPost,
  step1Data,
  onSubmit,
  onBack,
  submitting,
}) => {
  const [documents, setDocuments] = useState<DocumentState>({
    identityProofName: 'aadhaar_card_front.pdf',
    addressProofName: 'address_proof.pdf',
    qualificationProofName: `${selectedPost.qualification.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cert.pdf`,
    photoProofName: step1Data.photoUrl ? 'applicant_photo.jpg' : undefined,
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeConduct, setAgreeConduct] = useState(false);
  const [agreeAccuracy, setAgreeAccuracy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (field: keyof DocumentState, nameField: keyof DocumentState, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file,
        [nameField]: file.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !agreeConduct || !agreeAccuracy) {
      setErrorMsg('Please accept all statutory declarations before submitting.');
      return;
    }
    setErrorMsg(null);
    onSubmit({
      documents,
      paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
          Step 3 of 3
        </span>
        <h2 className="text-xl font-black text-[#06294D]">Document Verification & Membership Fee</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload required verification certificates and complete official appointment processing.
        </p>
      </div>

      {/* Selected Post Summary Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#06294D] to-[#011F39] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#FAD465] tracking-wider block">
            Selected Membership Designation
          </span>
          <h3 className="text-lg font-black text-white">{selectedPost.postName}</h3>
          <p className="text-xs text-slate-200 mt-0.5">
            Category: {selectedPost.categoryGroupLabel} • Validity: {selectedPost.validity}
          </p>
        </div>

        <div className="sm:text-right shrink-0 bg-white/10 p-3 rounded-xl border border-white/15">
          <span className="text-[10px] text-slate-300 block font-semibold">Total Payable Fee</span>
          <span className="text-2xl font-black text-[#FAD465]">{selectedPost.fee}</span>
          <span className="text-[10px] text-emerald-300 block font-medium">80G Tax Exemption Applicable</span>
        </div>
      </div>

      {/* Document Verification Cards (4 mandatory) */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#06294D] uppercase tracking-wider">
          Mandatory Verification Documents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Identity Proof */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-xs font-bold text-[#06294D]">Identity Proof</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Aadhaar / Voter ID
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 truncate">
              {documents.identityProofName || 'Upload front & back PDF/JPG'}
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>{documents.identityProofName ? 'Re-upload Document' : 'Upload Identity Proof'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={e => handleFileUpload('identityProof', 'identityProofName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Address Proof */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-[#06294D]">Address Proof</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                Electricity / Rent / ID
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 truncate">
              {documents.addressProofName || 'Upload residential proof'}
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>{documents.addressProofName ? 'Re-upload Document' : 'Upload Address Proof'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={e => handleFileUpload('addressProof', 'addressProofName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* 3. Educational Qualification */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#06294D] shrink-0" />
                <span className="text-xs font-bold text-[#06294D]">Qualification Certificate</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#EDF2F7] text-[#06294D] text-[10px] font-bold">
                {selectedPost.qualification}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 truncate">
              {documents.qualificationProofName || 'Upload certificate / marksheet'}
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>{documents.qualificationProofName ? 'Re-upload Certificate' : 'Upload Certificate'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={e => handleFileUpload('qualificationProof', 'qualificationProofName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* 4. Passport Photo */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold text-[#06294D]">Passport Photograph</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                Applicant Photo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 truncate">
              {documents.photoProofName || (step1Data.photoUrl ? 'Attached from Step 1' : 'Clear face photo')}
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>Upload / Replace Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileUpload('photoProof', 'photoProofName', e)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#06294D] uppercase tracking-wider">
          Official Payment Gateway
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              paymentMethod === 'upi'
                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-5 h-5 text-emerald-700 mb-1" />
            <span className="text-xs font-bold block">UPI / QR Code</span>
            <span className="text-[10.5px] text-slate-500">GPay, PhonePe, Paytm, BHIM</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-5 h-5 text-blue-700 mb-1" />
            <span className="text-xs font-bold block">Credit / Debit Card</span>
            <span className="text-[10.5px] text-slate-500">Visa, Mastercard, RuPay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              paymentMethod === 'netbanking'
                ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-5 h-5 text-amber-700 mb-1" />
            <span className="text-xs font-bold block">Net Banking / IMPS</span>
            <span className="text-[10.5px] text-slate-500">All major Indian banks</span>
          </button>
        </div>
      </div>

      {/* Statutory Declarations (Checkboxes from APK) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-[#06294D] uppercase tracking-wider">
          Statutory Declarations & Consents
        </h4>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 rounded text-blue-700 mt-0.5"
          />
          <span className="leading-snug">
            I agree to abide by the Constitution, Bylaws, and Rules of the <strong>Human Rights and Social Justice Mission (HRSJM)</strong>.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={agreeConduct}
            onChange={e => setAgreeConduct(e.target.checked)}
            className="w-4 h-4 rounded text-blue-700 mt-0.5"
          />
          <span className="leading-snug">
            I pledge to adhere to the official Member Code of Conduct, maintain ethical dignity, and never misuse organizational credentials.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={agreeAccuracy}
            onChange={e => setAgreeAccuracy(e.target.checked)}
            className="w-4 h-4 rounded text-blue-700 mt-0.5"
          />
          <span className="leading-snug">
            I declare that all submitted personal details, ID numbers, and verification documents are genuine, authentic, and accurate.
          </span>
        </label>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          ← Back to Step 2
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#011F39] text-xs font-extrabold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5 text-[#011F39]" />
          <span>{submitting ? 'Verifying & Submitting...' : `Submit Application & Pay ${selectedPost.fee}`}</span>
        </button>
      </div>
    </form>
  );
};

