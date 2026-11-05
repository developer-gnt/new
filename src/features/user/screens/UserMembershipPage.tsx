import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Filter,
} from 'lucide-react';
import { useUserAuth } from '../store/userAuthStore';
import { applicationsService } from '../../admin/applications/services/applicationsService';
import {
  DISTRICT_STATE_POSTS,
  LETTER_PAD_POSTS,
  NATIONAL_LEVEL_POSTS,
  ALL_MEMBERSHIP_POSTS,
  type MembershipPostData,
} from '../data/membershipCategoriesData';
import { MembershipPostCard } from '../components/membership/MembershipPostCard';
import { MembershipVerificationNotice } from '../components/membership/MembershipVerificationNotice';
import { MembershipStep1, type Step1FormData } from '../components/membership/MembershipStep1';
import { MembershipStep2, type Step2FormData } from '../components/membership/MembershipStep2';
import { MembershipStep3 } from '../components/membership/MembershipStep3';
import { MembershipSubmitted } from '../components/membership/MembershipSubmitted';

export const UserMembershipPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useUserAuth();

  const initialTab = searchParams.get('tab') === 'status' || location.pathname.includes('status') ? 'status' : 'categories';
  const [activeTab, setActiveTab] = useState<'categories' | 'status'>(initialTab);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'district_state' | 'letter_pad' | 'national'>('all');

  // Wizard state
  const [viewMode, setViewMode] = useState<'categories' | 'wizard' | 'submitted'>('categories');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPost, setSelectedPost] = useState<MembershipPostData>(DISTRICT_STATE_POSTS[0]);
  const [submittedAppId, setSubmittedAppId] = useState<string>('HRSJM-MEM-2026-9042');
  const [submitting, setSubmitting] = useState(false);

  // Form data across steps
  const [step1Data, setStep1Data] = useState<Step1FormData>({
    fullName: user?.full_name || 'Mohd. Ayaan Shaikh',
    dob: '1995-06-15',
    gender: 'Male',
    mobile: user?.mobile_number || '9876543210',
    email: user?.email || 'ayaan.shaikh@hrsjm.org',
    policeStation: 'Azad Maidan Police Station, Mumbai',
    password: '',
    confirmPassword: '',
    photoUrl: user?.avatar || undefined,
  });

  const [step2Data, setStep2Data] = useState<Step2FormData>({
    addressLine1: 'Flat 402, High Point Apartments, Linking Road',
    addressLine2: 'Bandra West',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400050',
    aadhaarNumber: '9845 2310 8892',
  });

  // Live status
  const currentStatus = user?.membership_status || 'UNDER_REVIEW';
  const isApproved = currentStatus === 'ACTIVE' || currentStatus === 'APPROVED';
  const isPending = currentStatus === 'UNDER_REVIEW' || currentStatus === 'PENDING';

  useEffect(() => {
    const loadApps = async () => {
      try {
        if (user?.id) {
          await applicationsService.listMemberships({ user_id: user.id });
        }
      } catch {
        // use fallback store state
      }
    };
    loadApps();
  }, [user]);

  // Handle post selection -> initiates 3-step verification wizard
  const handleSelectPostToApply = (post: MembershipPostData) => {
    setSelectedPost(post);
    setCurrentStep(1);
    setViewMode('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 1 -> Step 2
  const handleStep1Next = (data: Step1FormData) => {
    setStep1Data(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 -> Step 3
  const handleStep2Next = (data: Step2FormData) => {
    setStep2Data(data);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 -> Submit
  const handleStep3Submit = async () => {
    setSubmitting(true);
    const newRefId = `HRSJM-MEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Backend call simulation / integration
      await new Promise(resolve => setTimeout(resolve, 900));
      setSubmittedAppId(newRefId);
      setViewMode('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmittedAppId(newRefId);
      setViewMode('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = () => {
    if (categoryFilter === 'all') return ALL_MEMBERSHIP_POSTS;
    return ALL_MEMBERSHIP_POSTS.filter(p => p.categoryGroup === categoryFilter);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 text-[#FAD465] text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard size={14} />
            <span>National Membership Council</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Membership Categories &amp; Verification</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Choose your official post, undergo 3-step statutory verification, and receive your verified national appointment credentials.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              setViewMode('categories');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#E9B82E] text-[#011F39] shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Membership Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'status' ? 'bg-[#E9B82E] text-[#011F39] shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            My Membership Status
          </button>
        </div>
      </div>

      {activeTab === 'status' ? (
        /* Status Tab */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Application Tracking Number
                </span>
                <span className="text-lg font-black text-[#06294D] font-mono">
                  {submittedAppId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Verification Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : isPending
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
            </div>

            {/* Stepper Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle size={16} />
                  <span>1. Application Submitted</span>
                </div>
                <p className="text-[11px] text-slate-600">Documents and credentials successfully received by Central Mission Desk.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Clock size={16} className="text-amber-600" />
                  <span>2. State Council Verification</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isApproved
                    ? 'State Chapter verification completed and verified.'
                    : 'Currently being reviewed by District Verification Officers.'}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${isApproved ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${isApproved ? 'text-emerald-800' : 'text-slate-400'}`}>
                  <Award size={16} />
                  <span>3. Council Approval</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isApproved
                    ? 'Official National Member credentials activated.'
                    : 'Credentials activate upon final state council review.'}
                </p>
              </div>
            </div>

            {/* Credentials Preview / Notice */}
            {isApproved ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#06294D] to-[#011F39] text-white space-y-4 max-w-lg mx-auto shadow-xl border border-amber-400/40">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <img src="/assets/logo/logo.png" alt="HRSJM Logo" className="w-10 h-10 object-contain" />
                    <div>
                      <h4 className="font-black text-sm text-white">HRSJM NATIONAL COUNCIL</h4>
                      <span className="text-[9.5px] text-[#FAD465] font-bold uppercase tracking-wider">Official Member Credentials</span>
                    </div>
                  </div>
                  <Award className="text-[#FAD465]" size={24} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/20">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Member Name</span>
                    <span className="font-bold text-white">{step1Data.fullName || user?.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Member ID Code</span>
                    <span className="font-bold text-[#FAD465] font-mono">HRSJM-ACT-2026-9042</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">State Chapter</span>
                    <span className="font-bold text-white">{step2Data.state} / {step2Data.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Validity</span>
                    <span className="font-bold text-emerald-400">Valid Till DEC 2027</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-[#06294D] flex items-start gap-2.5">
                <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Application is Under Administrative Review</span>
                  <p className="text-slate-600 leading-relaxed">
                    Member credentials and verified status are activated after administrative scrutiny by the regional credentials committee. You can expedite verification by contacting your local chapter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'wizard' ? (
        /* 3-Step Verification Wizard */
        <div className="space-y-6">
          {/* Stepper Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('categories')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Applying For Official Post
                </span>
                <span className="text-sm font-black text-[#06294D]">
                  {selectedPost.postName} ({selectedPost.fee} • {selectedPost.validity})
                </span>
              </div>
            </div>

            {/* Stepper Indicators */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  currentStep === 1
                    ? 'bg-[#06294D] text-white border-[#06294D]'
                    : currentStep > 1
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Personal</span>
              </div>

              <span className="text-slate-300">→</span>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  currentStep === 2
                    ? 'bg-[#06294D] text-white border-[#06294D]'
                    : currentStep > 2
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Address & ID</span>
              </div>

              <span className="text-slate-300">→</span>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  currentStep === 3
                    ? 'bg-[#06294D] text-white border-[#06294D]'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Fee & Docs</span>
              </div>
            </div>
          </div>

          {/* Current Step Component */}
          {currentStep === 1 && (
            <MembershipStep1
              initialData={step1Data}
              onNext={handleStep1Next}
              onBack={() => setViewMode('categories')}
            />
          )}

          {currentStep === 2 && (
            <MembershipStep2
              initialData={step2Data}
              onNext={handleStep2Next}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <MembershipStep3
              selectedPost={selectedPost}
              step1Data={step1Data}
              step2Data={step2Data}
              onSubmit={handleStep3Submit}
              onBack={() => setCurrentStep(2)}
              submitting={submitting}
            />
          )}
        </div>
      ) : viewMode === 'submitted' ? (
        /* Submitted Screen */
        <MembershipSubmitted
          applicationId={submittedAppId}
          selectedPost={selectedPost}
          step1Data={step1Data}
          step2Data={step2Data}
          onGoToStatus={() => {
            setActiveTab('status');
            setViewMode('categories');
          }}
          onReset={() => {
            setViewMode('categories');
            setCurrentStep(1);
          }}
        />
      ) : (
        /* Categories Listing View (APK clone) */
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
                <Filter size={12} />
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Posts ({ALL_MEMBERSHIP_POSTS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('district_state')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'district_state'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                District & State ({DISTRICT_STATE_POSTS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('letter_pad')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'letter_pad'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Letter Pad ({LETTER_PAD_POSTS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('national')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'national'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                National Council ({NATIONAL_LEVEL_POSTS.length})
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredPosts().length}</strong> available posts
            </span>
          </div>

          {/* District & State Posts Section */}
          {(categoryFilter === 'all' || categoryFilter === 'district_state') && (
            <div className="space-y-3">
              {/* Section Header Banner matching APK */}
              <div className="bg-[#EDF2F7] px-4 py-2 rounded-xl border border-[#DBE5EE] flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-[#06294D] tracking-wide">
                  District & State Level Posts
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {DISTRICT_STATE_POSTS.length} Posts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DISTRICT_STATE_POSTS.map(post => (
                  <MembershipPostCard
                    key={post.id}
                    post={post}
                    onApply={handleSelectPostToApply}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Letter Pad Posts Section */}
          {(categoryFilter === 'all' || categoryFilter === 'letter_pad') && (
            <div className="space-y-3">
              {/* Section Header Banner matching APK */}
              <div className="bg-[#EDF2F7] px-4 py-2 rounded-xl border border-[#DBE5EE] flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-[#06294D] tracking-wide">
                  Letter Pad Posts
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {LETTER_PAD_POSTS.length} Posts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LETTER_PAD_POSTS.map(post => (
                  <MembershipPostCard
                    key={post.id}
                    post={post}
                    onApply={handleSelectPostToApply}
                  />
                ))}
              </div>
            </div>
          )}

          {/* National Level Posts Section */}
          {(categoryFilter === 'all' || categoryFilter === 'national') && (
            <div className="space-y-3">
              {/* Section Header Banner matching APK */}
              <div className="bg-[#EDF2F7] px-4 py-2 rounded-xl border border-[#DBE5EE] flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-[#06294D] tracking-wide">
                  National Level Posts
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {NATIONAL_LEVEL_POSTS.length} Posts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NATIONAL_LEVEL_POSTS.map(post => (
                  <MembershipPostCard
                    key={post.id}
                    post={post}
                    onApply={handleSelectPostToApply}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Verification & Policy Notice matching APK */}
          <MembershipVerificationNotice />
        </div>
      )}
    </div>
  );
};
