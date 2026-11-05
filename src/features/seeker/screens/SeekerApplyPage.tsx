import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ChevronLeft,
  Trash2,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';
import { useAuth } from '../../auth/store/authStore';
import {
  CAUSE_OPTIONS,
  PRESET_AMOUNTS,
  SEEKER_DOC_CATEGORIES,
  URGENCY_LEVELS,
} from '../data/seekerData';
import type { AssistanceRequest } from '../types/seeker.types';

interface AttachedDoc {
  id: string;
  category: string;
  fileName: string;
  fileSize: string;
  file?: File;
}

export const SeekerApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useSeekerStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [mobile, setMobile] = useState(user?.mobile_number || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');

  const [selectedCause, setSelectedCause] = useState<string>('Medical Emergency');
  const [customCause, setCustomCause] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('25000');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [description, setDescription] = useState('');

  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);
  const [docCategory, setDocCategory] = useState<string>('Aadhaar / ID Proof');
  const [customDocName, setCustomDocName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRequest, setSubmittedRequest] = useState<AssistanceRequest | null>(null);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/seeker/home');
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (min 2 characters).';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      errs.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (selectedCause === 'Other' && !customCause.trim()) {
      errs.customCause = 'Please enter the specific reason/cause.';
    }

    const amt = parseFloat(requestedAmount.replace(/,/g, ''));
    if (isNaN(amt) || amt <= 0) {
      errs.requestedAmount = 'Please enter a valid amount greater than ₹0.';
    }

    if (attachedDocs.length === 0) {
      errs.documents = 'Supporting document is required (*). Please attach at least 1 document.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const finalDocName =
      docCategory === 'Other Document'
        ? (customDocName.trim() || 'Supporting Document')
        : docCategory;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const newDoc: AttachedDoc = {
      id: `doc-${Date.now()}`,
      category: finalDocName,
      fileName: file.name,
      fileSize: `${sizeInMb} MB`,
      file,
    };

    setAttachedDocs((prev) => [...prev, newDoc]);
    setErrors((prev) => ({ ...prev, documents: '' }));
    e.target.value = '';
  };

  const removeDoc = (id: string) => {
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const amt = parseFloat(requestedAmount.replace(/,/g, ''));
    const finalReason = selectedCause === 'Other' ? customCause.trim() : selectedCause;

    try {
      const created = await createRequest({
        full_name: fullName.trim(),
        mobile: mobile.replace(/\D/g, ''),
        email: email.trim() || undefined,
        requested_amount: amt,
        reason: finalReason,
        description: description.trim() || undefined,
        status: 'UNDER_REVIEW',
        documents: attachedDocs.map((d) => ({
          document_name: d.category,
          file_name: d.fileName,
          file_size: d.fileSize,
          file: d.file,
        })),
      });

      setSubmittedRequest(created);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Submission failed. Please check details and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2F52] hover:text-[#06294D] transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>

        <span className="text-xs text-[#718096]">Humanitarian Assistance Application</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-md overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#123F68] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FAD465]">
              <Heart size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-['Playfair_Display',Georgia,serif]">
                Apply for Donation Assistance
              </h1>
              <p className="text-xs text-blue-200 mt-0.5">
                Submit your aid request with authentic supporting records for rapid verification.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Section 1: Applicant Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider border-b border-[#DBE5EE] pb-2">
              1. Applicant Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2 pl-9 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                    required
                  />
                  <User size={15} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="w-full px-3.5 py-2 pl-9 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                    required
                  />
                  <Phone size={15} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 pl-9 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                  />
                  <Mail size={15} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                  Residential Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Locality, City, State"
                    className="w-full px-3.5 py-2 pl-9 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                  />
                  <MapPin size={15} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Assistance Need & Cause */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider border-b border-[#DBE5EE] pb-2">
              2. Assistance Details & Urgency
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-2">
                Assistance Category / Cause <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAUSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedCause(opt.key)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                      selectedCause === opt.key
                        ? 'bg-[#06294D] text-[#FAD465] border-[#06294D] shadow-xs'
                        : 'bg-[#EDF2F7] text-[#0B2F52] border-[#DBE5EE] hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {selectedCause === 'Other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customCause}
                    onChange={(e) => setCustomCause(e.target.value)}
                    placeholder="Specify exact cause or reason..."
                    className="w-full px-3.5 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                  />
                  {errors.customCause && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.customCause}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                Requested Aid Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 25000"
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
                required
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRequestedAmount(String(amt))}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDF2F7] border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#FAD465] hover:text-[#011F39] transition cursor-pointer"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              {errors.requestedAmount && (
                <p className="text-[11px] text-red-600 mt-1">{errors.requestedAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                Urgency Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {URGENCY_LEVELS.map((u) => (
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => setUrgency(u.key)}
                    style={{
                      borderColor: urgency === u.key ? u.color : '#DBE5EE',
                      backgroundColor: urgency === u.key ? u.bg : '#EDF2F7',
                      color: urgency === u.key ? u.color : '#718096',
                    }}
                    className="py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1">
                Detailed Situation & Purpose
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background circumstances, hospital or institution details, and how the aid will be utilized..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
            </div>
          </div>

          {/* Section 3: Supporting Documents */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider border-b border-[#DBE5EE] pb-2">
              3. Supporting Document Verification <span className="text-red-500">*</span>
            </h3>

            <div className="p-4 bg-[#EDF2F7] rounded-xl border border-[#DBE5EE] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                    Document Type
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:ring-2 focus:ring-[#FAD465]"
                  >
                    {SEEKER_DOC_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {docCategory === 'Other Document' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      placeholder="e.g. Salary Slip or Death Certificate"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DBE5EE] rounded-lg text-[#0B2F52]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#CBD5E1] hover:border-[#06294D] rounded-xl bg-white cursor-pointer transition">
                  <UploadCloud size={24} className="text-[#06294D] mb-1" />
                  <span className="text-xs font-bold text-[#06294D]">
                    Click or Drag to Upload File
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    Supports PDF, JPG, PNG (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {errors.documents && (
                <p className="text-[11px] text-red-600 font-medium">{errors.documents}</p>
              )}
            </div>

            {/* Attached Documents List */}
            {attachedDocs.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#718096] uppercase">
                  Attached Documents ({attachedDocs.length})
                </div>
                {attachedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#DCE4EC] text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <FileText size={16} className="text-[#0D9488] shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-[#0B2F52] truncate">{doc.category}</div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {doc.fileName} • {doc.fileSize}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-[#DBE5EE]">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <span>Submit Assistance Request</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {submittedRequest && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">
                APPLICATION SUBMITTED
              </span>
              <h3 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
                Request Registered Successfully!
              </h3>
              <div className="mt-2 inline-block px-3 py-1 bg-[#EDF2F7] rounded-lg font-mono text-xs font-bold text-[#06294D]">
                ASST-{submittedRequest.id.slice(0, 8).toUpperCase()}
              </div>
            </div>

            <p className="text-xs text-[#34516D] leading-relaxed">
              Your assistance request has been queued for verification. Our field assessment team will review the supporting records.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/seeker/requests"
                className="w-full py-2.5 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl transition"
              >
                Track in Applications Tracker →
              </Link>
              <Link
                to="/seeker/home"
                className="w-full py-2.5 bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#0B2F52] text-xs font-bold rounded-xl transition"
              >
                Back to Home Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

