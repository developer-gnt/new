import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Edit3,
  ArrowLeft,
  Send,
  Loader2,
} from 'lucide-react';
import type { HelpTopic } from '../../data/helpTopicsData';
import type { UploadedDoc } from './ComplaintStep1Details';
import type { UserDetailsForm } from './ComplaintStep2User';

export interface ComplaintStep3Props {
  selectedTopics: HelpTopic[];
  subject: string;
  description: string;
  aadhaarFiles: UploadedDoc[];
  handwrittenFiles: UploadedDoc[];
  userForm: UserDetailsForm;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export const ComplaintStep3Review: React.FC<ComplaintStep3Props> = ({
  selectedTopics,
  subject,
  description,
  aadhaarFiles,
  handwrittenFiles,
  userForm,
  onEditStep,
  onBack,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);

  const canSubmit = agreeTerms && agreePrivacy && agreeDeclaration && !isSubmitting;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#06294D] tracking-tight">
          Review Your Complaint
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Please verify your case facts and applicant declarations before submission.
        </p>
      </div>

      {/* Review Card 1: Complaint Details */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#06294D]">Complaint Details</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#06294D] hover:text-[#E9B82E] transition-colors cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Type(s) of Help
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedTopics.length > 0 ? (
                selectedTopics.map(t => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-[#06294D]"
                  >
                    {t.title}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Subject / Title
            </span>
            <p className="font-semibold text-slate-800">{subject || 'Not provided'}</p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Detailed Description
            </span>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {description || 'Not provided'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Aadhaar Card
              </span>
              <p className="font-semibold text-slate-700">
                {aadhaarFiles.length > 0
                  ? aadhaarFiles.map(f => f.name).join(', ')
                  : 'Not uploaded'}
              </p>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Handwritten Complaint
              </span>
              <p className="font-semibold text-slate-700">
                {handwrittenFiles.length > 0
                  ? handwrittenFiles.map(f => f.name).join(', ')
                  : 'Not uploaded'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Card 2: Your Details */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#06294D]">Your Details</h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#06294D] hover:text-[#E9B82E] transition-colors cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Full Name
            </span>
            <p className="font-semibold text-slate-800">{userForm.fullName || 'Not provided'}</p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Mobile Number
            </span>
            <p className="font-semibold text-slate-800">
              {userForm.mobile ? `+91 ${userForm.mobile}` : 'Not provided'}
            </p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Email Address
            </span>
            <p className="font-semibold text-slate-800">{userForm.email || 'Not provided'}</p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Nearby Police Station
            </span>
            <p className="font-semibold text-slate-800">{userForm.policeStation || 'Not provided'}</p>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Full Address & Location
            </span>
            <p className="font-semibold text-slate-800">
              {userForm.address ? `${userForm.address}, ` : ''}
              {userForm.city ? `${userForm.city}, ` : ''}
              {userForm.state || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#06294D] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#06294D]">Your information is safe with us.</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            We keep your personal information strictly confidential and use it only to examine your grievance and respond to your request for legal assistance.
          </p>
        </div>
      </div>

      {/* Declarations & Consents Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-[#06294D]">
          Applicant Declarations &amp; Consents
        </h3>

        <div className="space-y-3 text-xs">
          {/* Declaration 1 */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreeTerms
                  ? 'bg-[#06294D] border-[#06294D] text-white'
                  : 'border-slate-300 group-hover:border-slate-400 bg-white'
              }`}
            >
              {agreeTerms && <Check size={12} strokeWidth={3} />}
            </div>
            <div>
              <p className="font-bold text-slate-800">
                I agree to the Terms &amp; Conditions <span className="text-rose-500">*</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                I accept the official Terms of Service governing HRSJM grievance assistance and legal advisory.
              </p>
            </div>
          </label>

          {/* Declaration 2 */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div
              onClick={() => setAgreePrivacy(!agreePrivacy)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreePrivacy
                  ? 'bg-[#06294D] border-[#06294D] text-white'
                  : 'border-slate-300 group-hover:border-slate-400 bg-white'
              }`}
            >
              {agreePrivacy && <Check size={12} strokeWidth={3} />}
            </div>
            <div>
              <p className="font-bold text-slate-800">
                I accept the Privacy Policy <span className="text-rose-500">*</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                I consent to HRSJM verifying my details and contacting me regarding this case via phone or email.
              </p>
            </div>
          </label>

          {/* Declaration 3 */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div
              onClick={() => setAgreeDeclaration(!agreeDeclaration)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreeDeclaration
                  ? 'bg-[#06294D] border-[#06294D] text-white'
                  : 'border-slate-300 group-hover:border-slate-400 bg-white'
              }`}
            >
              {agreeDeclaration && <Check size={12} strokeWidth={3} />}
            </div>
            <div>
              <p className="font-bold text-slate-800">
                Solemn Declaration of Truthfulness <span className="text-rose-500">*</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                I declare that all facts, details, and statements provided in this complaint are true and accurate to the best of my knowledge.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Error Alert if Submission Fails */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <span className="font-bold">Submission failed:</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 3 Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`flex-1 py-3.5 px-5 rounded-2xl font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin text-[#06294D]" />
              <span>Submitting Complaint...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Submit Complaint</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

