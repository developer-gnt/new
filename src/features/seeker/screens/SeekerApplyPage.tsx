import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ChevronLeft,
  X,
  Trash2,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
  User,
} from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';
import { useAuth } from '../../auth/store/authStore';
import type { AssistanceRequest } from '../types/seeker.types';

interface AttachedDoc {
  id: string;
  category: string;
  fileName: string;
  fileSize: string;
  file?: File;
}

const CAUSE_OPTIONS = [
  'Medical Emergency',
  'Education & Tuition',
  'Disaster Relief',
  'Livelihood & Food',
  'Disability Support',
  'Housing / Shelter',
  'Other',
];

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const URGENCY_LEVELS = [
  { key: 'NORMAL', label: 'Normal', color: '#10B981', bg: '#ECFDF5' },
  { key: 'MEDIUM', label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'HIGH', label: 'High', color: '#F97316', bg: '#FFF7ED' },
  { key: 'CRITICAL', label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
];

const SEEKER_DOC_CATEGORIES = [
  'Aadhaar / ID Proof',
  'Medical Report / Hospital Bill',
  'Income / Ration Card',
  'Tuition / School Fee Slip',
  'Other Document',
];

/**
 * Exact replication of CreateSeekerScreen.tsx from the HRSJM React Native APK:
 * - Header: Back arrow in circle, Heart icon in square, Title "Add Donation Seeker", subtitle, close X button
 * - Form sections:
 *   1. Applicant Information
 *   2. Cause & Assistance Type (Pills: Medical Emergency, Education & Tuition, etc.)
 *   3. Requested Amount & Urgency (Presets ₹5k, ₹10k, ₹25k, ₹50k, ₹100k + urgency pills)
 *   4. Circumstances & Ground Situation
 *   5. Supporting Verification Documents (Category selector + file upload + attached files list)
 * - Bottom Actions: Cancel & "+ Create Request" gold button
 */
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

  const handleGoBack = () => {
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
        ? customDocName.trim() || 'Supporting Document'
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
    <div className="max-w-3xl mx-auto space-y-4">
      {/* TOP HEADER (Exact APK CreateSeekerScreen Header) */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-4 py-3 shadow-xs flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleGoBack}
          className="w-9 h-9 rounded-full bg-[#EDF2F7] hover:bg-[#DBE5EE] flex items-center justify-center text-[#06294D] transition cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
            <Heart size={18} strokeWidth={2.2} />
          </div>
          <div className="truncate">
            <h1 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#06294D] tracking-tight truncate">
              Add Donation Seeker
            </h1>
            <p className="text-[11px] text-[#718096] truncate">
              Submit an assistance application for verification
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoBack}
          className="w-9 h-9 rounded-full bg-[#FAF7F0] hover:bg-[#EDF2F7] flex items-center justify-center text-[#718096] transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* FORM CARDS WRAPPER */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* SECTION 1: APPLICANT INFORMATION */}
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#06294D] uppercase tracking-wider pb-2 border-b border-[#EDF2F7]">
            <User size={15} className="text-[#06294D]" />
            <span>1. Applicant Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Applicant's full legal name"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
              {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
              {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                Residential Location / City
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, District, State"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CAUSE & ASSISTANCE TYPE */}
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#06294D] uppercase tracking-wider pb-2 border-b border-[#EDF2F7]">
            <Heart size={15} className="text-[#06294D]" />
            <span>2. Cause & Assistance Type <span className="text-red-500">*</span></span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CAUSE_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCause(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedCause === c
                    ? 'bg-[#06294D] text-[#FAD465] border-[#06294D] shadow-xs'
                    : 'bg-[#FAF7F0] text-[#34516D] border-[#DCE4EC] hover:bg-[#EDF2F7]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {selectedCause === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                Specify Custom Cause / Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customCause}
                onChange={(e) => setCustomCause(e.target.value)}
                placeholder="Please describe the specific aid reason"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
              {errors.customCause && <p className="text-[11px] text-red-600 mt-1">{errors.customCause}</p>}
            </div>
          )}
        </div>

        {/* SECTION 3: REQUESTED AMOUNT & URGENCY */}
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#06294D] uppercase tracking-wider pb-2 border-b border-[#EDF2F7]">
            <span>3. Requested Amount & Urgency Level</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
              Requested Aid Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-sm font-bold text-[#06294D]">₹</span>
              <input
                type="text"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 25000"
                className="w-full pl-8 pr-4 py-2 text-sm font-bold bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              />
            </div>
            {errors.requestedAmount && <p className="text-[11px] text-red-600 mt-1">{errors.requestedAmount}</p>}

            {/* Quick Amount Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] text-[#718096]">Presets:</span>
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setRequestedAmount(String(amt))}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition cursor-pointer ${
                    requestedAmount === String(amt)
                      ? 'bg-[#06294D] text-[#FAD465] border-[#06294D]'
                      : 'bg-[#FAF7F0] text-[#34516D] border-[#DCE4EC] hover:bg-[#EDF2F7]'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] mb-1.5">
              Urgency Assessment Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {URGENCY_LEVELS.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => setUrgency(u.key)}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                    urgency === u.key
                      ? 'border-[#06294D] ring-2 ring-[#06294D]/20 shadow-xs'
                      : 'border-[#DCE4EC] hover:bg-[#FAF7F0]'
                  }`}
                  style={{
                    backgroundColor: urgency === u.key ? u.bg : '#FFFFFF',
                    color: u.color,
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: SITUATION DESCRIPTION */}
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#06294D] uppercase tracking-wider pb-2 border-b border-[#EDF2F7]">
            <span>4. Circumstances & Ground Situation</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
              Case Description & Medical / Social Background
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details regarding the patient, family hardship, or specific welfare need..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
            />
          </div>
        </div>

        {/* SECTION 5: SUPPORTING DOCUMENTS */}
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#06294D] uppercase tracking-wider pb-2 border-b border-[#EDF2F7]">
            <UploadCloud size={15} className="text-[#06294D]" />
            <span>5. Supporting Verification Documents <span className="text-red-500">*</span></span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                  Document Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52] focus:outline-none"
                >
                  {SEEKER_DOC_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {docCategory === 'Other Document' && (
                <div>
                  <label className="block text-xs font-semibold text-[#0B2F52] mb-1">
                    Custom Document Title
                  </label>
                  <input
                    type="text"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    placeholder="e.g. Village Sarpanch Letter"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE4EC] rounded-xl text-[#0B2F52]"
                  />
                </div>
              )}
            </div>

            {/* Upload Drag/Click Zone */}
            <label className="border-2 border-dashed border-[#DCE4EC] rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-[#06294D] bg-[#FAF7F0] cursor-pointer transition">
              <UploadCloud size={24} className="text-[#06294D] mb-1" />
              <span className="text-xs font-bold text-[#0B2F52]">
                Upload Document or Photo (PDF, JPG, PNG)
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                Government ID, hospital bill, income proof, or fee challan
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {errors.documents && <p className="text-[11px] text-red-600">{errors.documents}</p>}

            {/* Attached Documents List */}
            {attachedDocs.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-[#718096] uppercase">
                  Attached Documents ({attachedDocs.length})
                </div>
                {attachedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs"
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
        </div>

        {/* BOTTOM ACTIONS (Exact APK Cancel + Create Request Buttons) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleGoBack}
            className="px-5 py-2.5 bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#34516D] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>{submitting ? 'Submitting...' : 'Create Request'}</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {submittedRequest && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">
                APPLICATION SUBMITTED
              </span>
              <h3 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
                Assistance Request Registered!
              </h3>
              <div className="mt-2 inline-block px-3 py-1 bg-[#EDF2F7] rounded-lg font-mono text-xs font-bold text-[#06294D]">
                ASST-{submittedRequest.id.slice(0, 8).toUpperCase()}
              </div>
            </div>

            <p className="text-xs text-[#34516D] leading-relaxed">
              Your assistance request for ₹{Number(submittedRequest.requested_amount).toLocaleString('en-IN')} has been placed under review by the HRSJM field assessment committee.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/seeker/requests"
                className="w-full py-2.5 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl transition text-center"
              >
                Track in Applications Tracker →
              </Link>
              <Link
                to="/seeker/home"
                className="w-full py-2.5 bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#0B2F52] text-xs font-bold rounded-xl transition text-center"
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
