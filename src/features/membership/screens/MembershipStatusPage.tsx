import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Award,
  Phone,
  Mail,
  Building2,
  Check,
  CreditCard,
} from 'lucide-react';
import { useMembershipApply } from '../store/membershipApplyStore';
import type { ApplicationStatus } from '../types/membershipApplication.types';

export const MembershipStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryAppId = searchParams.get('id') || '';

  const {
    submittedApps,
    activeTrackRecord,
    trackApplication,
    setActiveTrackRecord,
    reuploadDocument,
  } = useMembershipApply();

  const [searchInput, setSearchInput] = useState(queryAppId || (activeTrackRecord?.applicationId ?? ''));
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);

  // Re-upload state
  const [reuploadTarget, setReuploadTarget] = useState<'photo' | 'idProof' | 'signature' | null>(null);
  const [reuploadFileName, setReuploadFileName] = useState('');
  const [reuploadSuccess, setReuploadSuccess] = useState(false);

  // Initialize with query param if present
  React.useEffect(() => {
    if (queryAppId) {
      trackApplication(queryAppId);
    }
  }, [queryAppId, trackApplication]);

  const searchFeedback = manualFeedback ?? (queryAppId && activeTrackRecord?.applicationId !== queryAppId
    ? `No record found matching "${queryAppId}". Try one of the demo records below.`
    : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setManualFeedback(null);
    if (!searchInput.trim()) return;

    const found = trackApplication(searchInput);
    if (!found) {
      setManualFeedback(`No record found for "${searchInput}". Please check your Application ID or mobile number.`);
    }
  };

  const handleSimulateReupload = () => {
    if (!activeTrackRecord || !reuploadTarget) return;
    const name = reuploadFileName || `reuploaded_${reuploadTarget}_${Date.now()}.pdf`;
    reuploadDocument(activeTrackRecord.applicationId, reuploadTarget, name);
    setReuploadSuccess(true);
    setTimeout(() => {
      setReuploadTarget(null);
      setReuploadFileName('');
      setReuploadSuccess(false);
    }, 2000);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'REUPLOAD_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      case 'APPLIED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-600 border border-slate-500/30">
            <Clock className="w-3.5 h-3.5" /> Submitted
          </span>
        );
    }
  };

  const currentRecord = activeTrackRecord;

  // 4 Stages definition
  const stages = [
    { number: 1, title: 'Submission Received', desc: 'Application logged with initial payment voucher' },
    { number: 2, title: 'KYC & Document Verification', desc: 'Aadhaar / Voter ID and signature validation' },
    { number: 3, title: 'Executive Board Approval', desc: 'State / National Directorate review and sign-off' },
    { number: 4, title: 'Induction & ID Issuance', desc: 'Member credentials and digital certificate generated' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#011F39] text-white py-12 px-4 shadow-md border-b-2 border-[#FAD465]/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAD465]/20 text-[#FAD465] text-xs font-semibold uppercase tracking-wider border border-[#FAD465]/40">
            <ShieldCheck className="w-4 h-4 text-[#FAD465]" />
            Official Application Tracking Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Track Membership Application
          </h1>
          <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Enter your Application Reference Number or registered mobile number to check real-time verification and induction status.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. HRSJM-APP-2026-9214 or +91 9876543210"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FAD465] shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#06294D] font-bold text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Track Status
            </button>
          </form>

          {searchFeedback && (
            <p className="text-xs text-rose-300 font-medium bg-rose-950/40 border border-rose-500/30 rounded-lg p-2 max-w-xl mx-auto">
              {searchFeedback}
            </p>
          )}

          {/* Quick Demo Switcher */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400">Quick Test Cases:</span>
            {submittedApps.map((app) => (
              <button
                key={app.applicationId}
                type="button"
                onClick={() => {
                  setActiveTrackRecord(app);
                  setSearchInput(app.applicationId);
                  setManualFeedback(null);
                }}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  currentRecord?.applicationId === app.applicationId
                    ? 'bg-[#FAD465] text-[#06294D] font-bold border-[#FAD465]'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
                }`}
              >
                {app.applicationId.slice(-4)} ({app.status.replace('_', ' ')})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {!currentRecord ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Application Selected</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Enter an Application ID in the search box above or click on one of the quick test cases to view tracking details.
            </p>
          </div>
        ) : (
          <>
            {/* Header Card with Status Banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {currentRecord.applicationId}
                    </span>
                    {getStatusBadge(currentRecord.status)}
                  </div>
                  <h2 className="text-2xl font-black text-[#06294D] tracking-tight">
                    {currentRecord.postName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted on {new Date(currentRecord.submittedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {currentRecord.status === 'APPROVED' && (
                    <Link
                      to="/member/id-card"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <CreditCard className="w-4 h-4 text-[#FAD465]" />
                      View Digital ID Card
                    </Link>
                  )}
                  <Link
                    to="/membership/categories"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  >
                    View All Categories
                  </Link>
                </div>
              </div>

              {/* Status Notice Box */}
              {currentRecord.status === 'APPROVED' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-900 text-sm">
                      Congratulations! Your membership has been officially approved.
                    </p>
                    <p className="text-emerald-800">
                      Your credentials have been activated. Member ID: <strong className="font-mono text-emerald-950">{currentRecord.generatedMemberId || 'HRSJM-MEM-2026-0842'}</strong>. You now have full access to the Member Portal.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/member/dashboard"
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        Enter Member Portal <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {currentRecord.status === 'REUPLOAD_REQUIRED' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-900 text-sm">Document Verification Flagged</p>
                    <p className="text-amber-800">
                      {currentRecord.reviewerRemarks || 'One or more of your documents require re-upload. Please check the document status below and submit a clear copy.'}
                    </p>
                  </div>
                </div>
              )}

              {currentRecord.status === 'UNDER_REVIEW' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-blue-900 text-sm">Application Under Active Verification</p>
                    <p className="text-blue-800">
                      {currentRecord.reviewerRemarks || 'Our scrutiny committee is currently verifying your submitted identity and address credentials. Most applications are processed within 48 to 72 working hours.'}
                    </p>
                  </div>
                </div>
              )}

              {currentRecord.status === 'REJECTED' && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-rose-900 text-sm">Application Could Not Be Accepted</p>
                    <p className="text-rose-800">
                      {currentRecord.reviewerRemarks || 'Your application does not meet the eligibility charter criteria. If you believe this is in error, please contact membership@hrsjm.org.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4-Stage Progress Stepper */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Application Lifecycle Pipeline
                </h3>

                <div className="relative">
                  {/* Connecting Line */}
                  <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-200 -z-0" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                    {stages.map((stage) => {
                      const isComplete =
                        currentRecord.status === 'APPROVED' ||
                        currentRecord.currentStage > stage.number;

                      const isCurrent = currentRecord.currentStage === stage.number && (currentRecord.status as string) !== 'APPROVED';
                      const isIssue = stage.number === 2 && currentRecord.status === 'REUPLOAD_REQUIRED';

                      return (
                        <div
                          key={stage.number}
                          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                            isIssue
                              ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300'
                              : isComplete
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : isCurrent
                              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400">Step {stage.number}</span>
                            {isIssue ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            ) : isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-slate-300" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{stage.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Section: Applicant Details & Document Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applicant Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#06294D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 className="w-4 h-4 text-[#FAD465]" />
                  Applicant & Chapter Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Applicant Full Name</span>
                    <span className="font-semibold text-slate-800 text-sm">{currentRecord.fullName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Mobile Number
                      </span>
                      <span className="font-medium text-slate-700">{currentRecord.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email Address
                      </span>
                      <span className="font-medium text-slate-700 truncate block">{currentRecord.email}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Proposed / Assigned Chapter</span>
                    <span className="font-medium text-slate-700">{currentRecord.assignedChapter}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Enrollment Contribution</span>
                      <span className="font-bold text-[#06294D]">₹{currentRecord.categoryFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Designated Validity</span>
                      <span className="font-semibold text-slate-700">{currentRecord.validity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Scrutiny Checklist */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#06294D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-[#FAD465]" />
                  Document Verification Scrutiny
                </h3>

                <div className="space-y-3">
                  {/* Photo */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Passport Photograph</p>
                        <p className="text-[11px] text-slate-400">{currentRecord.documents.photo.name}</p>
                      </div>
                    </div>
                    {currentRecord.documents.photo.status === 'VERIFIED' ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* ID Proof */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      currentRecord.documents.idProof.status === 'REJECTED'
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        ID
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {currentRecord.documents.idProof.type || 'Identity Proof'}
                        </p>
                        <p className="text-[11px] text-slate-400">{currentRecord.documents.idProof.name}</p>
                      </div>
                    </div>

                    {currentRecord.documents.idProof.status === 'VERIFIED' ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : currentRecord.documents.idProof.status === 'REJECTED' ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Needs Re-upload
                        </span>
                        <button
                          type="button"
                          onClick={() => setReuploadTarget('idProof')}
                          className="px-2 py-1 rounded bg-[#06294D] hover:bg-[#083a6b] text-white text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Re-upload
                        </button>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                        In Review
                      </span>
                    )}
                  </div>

                  {/* Signature */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Specimen Signature</p>
                        <p className="text-[11px] text-slate-400">{currentRecord.documents.signature.name}</p>
                      </div>
                    </div>
                    {currentRecord.documents.signature.status === 'VERIFIED' ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                        In Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Re-upload Form Drawer */}
                {reuploadTarget && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-[#06294D]" />
                        Re-upload {reuploadTarget === 'idProof' ? 'Identity Document' : reuploadTarget}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setReuploadTarget(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-white">
                      <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-medium text-slate-600">Select replacement file (PDF, JPG, PNG)</p>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setReuploadFileName(file.name);
                        }}
                        className="text-xs text-slate-500 mt-2 block w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#06294D] file:text-white"
                      />
                    </div>

                    {reuploadSuccess ? (
                      <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Re-upload successful! Queue updated.
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSimulateReupload}
                        className="w-full py-2 rounded-lg bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Submit Replacement Document
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl p-6 bg-[#06294D] text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-base font-bold">Need Verification Assistance?</h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  If you have queries regarding document eligibility, national background clearance, or membership privileges, our executive desk is available to assist.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="tel:+911123456789"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Call Helpdesk
                </a>
                <a
                  href="mailto:membership@hrsjm.org"
                  className="px-4 py-2 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#06294D] text-xs font-bold transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
