import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Scale,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Users,
} from 'lucide-react';
import { authService } from '../features/auth/services/authService';
import {
  formatDateToDMY,
  validateAgeEligibility,
} from '../utils/age';
import { CalendarDatePicker } from '../components/common/CalendarDatePicker';
import { ApiError } from '../services/apiClient';
import type { RegisterFormData, RegisterValidationErrors } from '../features/auth/types/auth.types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step phase: 'form' | 'ineligible' | 'complete'
  const [phase, setPhase] = useState<'form' | 'ineligible' | 'complete'>('form');

  // Form Fields State
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    phone: '',
    countryCode: '+91',
    email: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
    termsAccepted: true,
    privacyAccepted: true,
  });

  // UI & Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation & Error States
  const [fieldErrors, setFieldErrors] = useState<RegisterValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Live Duplicate Checks
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // Ineligible Age calculation
  const [ineligibleAge, setIneligibleAge] = useState<number | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = authService.getAuthToken();
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  /**
   * Debounced duplicate check for mobile number
   */
  const checkPhoneDuplicate = useCallback(async (phoneToCheck: string) => {
    const cleanPhone = phoneToCheck.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) return;
    setCheckingPhone(true);
    try {
      const res = await authService.checkDuplicates({ mobile_number: cleanPhone });
      if (res?.mobile_taken) {
        setFieldErrors(prev => ({
          ...prev,
          phone: res.mobile_message || 'Mobile number is already registered.',
        }));
        setVerifiedPhone(null);
      } else {
        setVerifiedPhone(cleanPhone);
        setFieldErrors(prev => {
          if (prev.phone && prev.phone.toLowerCase().includes('already registered')) {
            const next = { ...prev };
            delete next.phone;
            return next;
          }
          return prev;
        });
      }
    } catch {
      // Ignore background check failure
    } finally {
      setCheckingPhone(false);
    }
  }, []);

  /**
   * Debounced duplicate check for email
   */
  const checkEmailDuplicate = useCallback(async (emailToCheck: string) => {
    const cleanEmail = emailToCheck.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) return;
    setCheckingEmail(true);
    try {
      const res = await authService.checkDuplicates({ email: cleanEmail });
      if (res?.email_taken) {
        setFieldErrors(prev => ({
          ...prev,
          email: res.email_message || 'Email address is already registered.',
        }));
        setVerifiedEmail(null);
      } else {
        setVerifiedEmail(cleanEmail);
        setFieldErrors(prev => {
          if (prev.email && prev.email.toLowerCase().includes('already registered')) {
            const next = { ...prev };
            delete next.email;
            return next;
          }
          return prev;
        });
      }
    } catch {
      // Ignore background check failure
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Effect for debounced phone duplicate check
  useEffect(() => {
    const clean = formData.phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      return;
    }
    const timer = setTimeout(() => {
      checkPhoneDuplicate(clean);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.phone, checkPhoneDuplicate]);

  // Effect for debounced email duplicate check
  useEffect(() => {
    const trimmed = formData.email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return;
    }
    const timer = setTimeout(() => {
      checkEmailDuplicate(trimmed);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email, checkEmailDuplicate]);

  // Validation Rules matching APK exactly
  const validateForm = (): boolean => {
    const errors: RegisterValidationErrors = {};

    // 1. Full Name
    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      errors.fullName = 'Full name is required';
    } else if (nameTrimmed.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(nameTrimmed)) {
      errors.fullName = 'Full name can only contain letters and spaces';
    }

    // 2. Mobile Phone
    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!digitsOnly) {
      errors.phone = 'Mobile number is required';
    } else if (digitsOnly.length !== 10) {
      errors.phone = 'Mobile number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      errors.phone = 'Mobile number must start with 6, 7, 8, or 9';
    }

    // 3. Email Address
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address';
    }

    // 4. Date of Birth & 18+ Age Eligibility
    const ageResult = validateAgeEligibility(formData.dob);
    if (!ageResult.isValid) {
      errors.dob = ageResult.error || 'Date of birth is required';
    } else if (!ageResult.isEligible) {
      setIneligibleAge(ageResult.age);
      setPhase('ineligible');
      return false;
    }

    // 5. Password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // 6. Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // 7. Consents
    if (!formData.termsAccepted) {
      errors.terms = 'Please accept Terms & Conditions to proceed';
    } else if (!formData.privacyAccepted) {
      errors.terms = 'Please accept Privacy Policy to proceed';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle registration submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const cleanMobile = formData.phone.replace(/\D/g, '').slice(-10);
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanDob = formatDateToDMY(formData.dob);

    try {
      // 1. Submit Registration Payload to POST /auth/register
      await authService.register({
        full_name: formData.fullName.trim(),
        mobile_number: cleanMobile,
        email: cleanEmail,
        dob: cleanDob,
        date_of_birth: cleanDob,
        password: formData.password.trim(),
        confirm_password: formData.confirmPassword.trim(),
        role_name: 'USER',
      });

      // 2. Transition to Step 3: Complete screen
      setPhase('complete');
    } catch (err: unknown) {
      let message = 'Unable to create account. Please try again.';
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          message = 'An account with this mobile number or email already exists. Please log in.';
        } else if (err.data?.code === 'AGE_NOT_ELIGIBLE') {
          setIneligibleAge(err.data?.details?.calculated_age ?? null);
          setPhase('ineligible');
          return;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // VIEW: 18+ INELIGIBLE AGE SCREEN (Exact APK)
  // ==========================================
  if (phase === 'ineligible') {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center items-center px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          {/* Logo & Bilingual Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#06294D] border-2 border-[#FAD465] flex items-center justify-center text-[#FAD465] shadow-sm">
              <Scale size={24} />
            </div>
            <div className="text-left">
              <div className="text-base font-black text-[#011F39] font-serif leading-none tracking-wide">
                HRSJM
              </div>
              <div className="text-[10px] font-bold text-[#EAA224] tracking-wider uppercase mt-0.5">
                Human Rights &amp; Social Justice Mission
              </div>
            </div>
          </div>

          {/* 18+ Restrained Red Badge */}
          <div className="w-20 h-20 rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <span className="text-2xl font-black text-rose-600 font-serif">18+</span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#011F39] font-serif mb-1">
            You Are Not Eligible
          </h2>
          <p className="text-xs font-semibold text-rose-600 mb-4">
            Sorry, you cannot register with HRSJM.
          </p>

          <div className="w-16 h-0.5 bg-slate-200 mx-auto mb-4" />

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            You must be at least 18 years old to register. Based on the date of birth provided,
            you do not meet the minimum constitutional age requirement for membership and platform participation.
          </p>

          {/* Age Requirement Highlight Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-700">Minimum Age Requirement:</span>
            </div>
            <span className="text-xs font-extrabold text-[#011F39] px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
              18 Years
            </span>
          </div>

          {typeof ineligibleAge === 'number' && ineligibleAge >= 0 && (
            <p className="text-[11px] text-slate-500 mb-6 font-medium">
              Current calculated age based on entry: {ineligibleAge}{' '}
              {ineligibleAge === 1 ? 'year' : 'years'}
            </p>
          )}

          <button
            onClick={() => {
              setPhase('form');
              setFieldErrors(prev => ({ ...prev, dob: 'You must be at least 18 years old to register.' }));
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-[#011F39] hover:bg-[#06294D] text-[#FAD465] font-bold text-xs uppercase tracking-wider shadow hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Registration</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: REGISTRATION COMPLETE (Exact APK)
  // ==========================================
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center px-4 py-8 sm:py-12 font-sans">
        <div className="w-full max-w-lg">
          {/* Top Bar with Back Button & Centered Screen Title */}
          <div className="flex items-center justify-between mb-6 px-2">
            <button
              onClick={() => navigate('/login')}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#0F2860] hover:bg-slate-50 transition cursor-pointer"
              title="Back to Login"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-base font-bold text-[#011F39] font-serif">
              Create Your Account
            </h1>
            <div className="w-9" />
          </div>

          {/* 3-Step Indicator: All Completed */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
            <div className="flex items-center justify-between relative max-w-sm mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#EAA224] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <Check size={16} />
                </div>
                <span className="text-[11px] font-bold text-[#011F39] mt-1.5 text-center leading-tight">
                  Account<br />Type
                </span>
              </div>

              {/* Connecting Line 1 */}
              <div className="flex-1 h-0.5 bg-[#EAA224] mx-2 -mt-5" />

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#EAA224] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <Check size={16} />
                </div>
                <span className="text-[11px] font-bold text-[#011F39] mt-1.5 text-center leading-tight">
                  Personal<br />Details
                </span>
              </div>

              {/* Connecting Line 2 */}
              <div className="flex-1 h-0.5 bg-[#EAA224] mx-2 -mt-5" />

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <Check size={16} />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 mt-1.5 text-center leading-tight">
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Success Banner & Confetti Illustration */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 sm:p-8 text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#011F39] font-serif leading-tight mb-2">
              Account Created<br />Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Welcome to HRSJM! Your account has been created successfully. You can now explore the platform and participate in human rights initiatives.
            </p>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 sm:p-8 mb-6">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-[#011F39] font-serif">
                Account Summary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Here are your registered account details.
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-[13px]">
              {/* Full Name */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <User size={16} className="text-[#0F2860]" />
                  <span>Full Name</span>
                </div>
                <span className="font-bold text-[#011F39]">{formData.fullName}</span>
              </div>

              <div className="border-t border-slate-100" />

              {/* Email Address */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Mail size={16} className="text-[#0F2860]" />
                  <span>Email Address</span>
                </div>
                <span className="font-semibold text-slate-800">{formData.email}</span>
              </div>

              <div className="border-t border-slate-100" />

              {/* Mobile Number */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Phone size={16} className="text-[#0F2860]" />
                  <span>Mobile Number</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {formData.countryCode} {formData.phone.replace(/\D/g, '').slice(-10)}
                </span>
              </div>

              <div className="border-t border-slate-100" />

              {/* Date of Birth */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Calendar size={16} className="text-[#0F2860]" />
                  <span>Date of Birth</span>
                </div>
                <span className="font-semibold text-slate-800">{formatDateToDMY(formData.dob)}</span>
              </div>

              <div className="border-t border-slate-100" />

              {/* Account Type */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Users size={16} className="text-[#0F2860]" />
                  <span>Account Type</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs">
                  General User
                </span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Info size={20} className="text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-900 leading-relaxed font-normal">
              Your credentials have been securely provisioned. You can sign in at any time to access services, file complaints, or participate in human rights programs.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#011F39] hover:bg-[#06294D] text-[#FAD465] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/admin/profile')}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition cursor-pointer"
            >
              View My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN GENERAL USER REGISTRATION FORM
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col font-sans">
      {/* 1. Header Band with Emblem and Title */}
      <header className="bg-[#011F39] text-white border-b border-[#06294D] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/register"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#FAD465] transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Change Account Type</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#06294D] border border-[#FAD465] flex items-center justify-center text-[#FAD465]">
              <Scale size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white font-serif leading-none">
                HRSJM
              </span>
              <span className="text-[9px] font-bold text-[#FAD465] tracking-widest uppercase mt-0.5">
                Create Your Account
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <Link to="/login" className="text-[#FAD465] font-bold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Top Hero Section */}
      <section className="bg-gradient-to-b from-[#011F39] via-[#06294D] to-[#0B2F52] text-white pt-10 pb-20 px-4 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FAD465]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#174A78]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-[#FAD465] tracking-widest uppercase">
            <span>Constitutional Platform</span>
            <span>•</span>
            <span>General User Registration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
            <span style={{ color: '#FFFFFF' }}>Personal </span>
            <span style={{ color: '#FAD465' }}>Details</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
            Enter your details and secure password to register your account.
          </p>
        </div>
      </section>

      {/* 3. Overlapping Registration Card */}
      <main className="flex-1 px-4 -mt-12 pb-16">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-9 relative z-20">
          {/* Stepper Bar: 3 Steps for General User */}
          <div className="mb-7 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between relative max-w-xs mx-auto">
              {/* Step 1: Account Type (Done - click to change) */}
              <Link to="/register" className="flex flex-col items-center z-10 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#EAA224] group-hover:bg-[#d89318] text-white flex items-center justify-center text-xs font-bold shadow-sm transition">
                  <Check size={16} />
                </div>
                <span className="text-[10px] font-bold text-[#011F39] mt-1 text-center leading-tight">
                  Account<br />Type
                </span>
              </Link>

              {/* Connecting Line 1 */}
              <div className="flex-1 h-0.5 bg-[#EAA224] mx-2 -mt-4" />

              {/* Step 2: Personal Details (Active) */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#011F39] text-[#FAD465] border-2 border-[#EAA224] flex items-center justify-center text-xs font-bold shadow-sm">
                  2
                </div>
                <span className="text-[10px] font-bold text-[#011F39] mt-1 text-center leading-tight">
                  Personal<br />Details
                </span>
              </div>

              {/* Connecting Line 2 */}
              <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4" />

              {/* Step 3: Complete */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1 text-center leading-tight">
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Section Heading inside Card */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#011F39] font-serif">
              Personal Information &amp; Password
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill in your details and password to register your account.
            </p>
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-1.5">
              <span>Applying for a specific role?</span>
              <div className="flex items-center gap-2 font-semibold">
                <Link to="/membership/apply" className="text-[#011F39] hover:text-amber-600 underline">
                  Member Registration
                </Link>
                <span>•</span>
                <Link to="/assistance/apply" className="text-amber-700 hover:text-amber-800 underline">
                  Donation Seeker Aid
                </Link>
              </div>
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  fieldErrors.fullName
                    ? 'border-rose-300 bg-rose-50/20'
                    : focusedField === 'fullName'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <User
                  size={18}
                  className={`mr-2.5 shrink-0 ${
                    fieldErrors.fullName ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => {
                    setFormData(p => ({ ...p, fullName: e.target.value }));
                    if (fieldErrors.fullName) {
                      setFieldErrors(p => ({ ...p, fullName: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.fullName}</span>
                </p>
              )}
            </div>

            {/* Field 2: Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  fieldErrors.phone
                    ? 'border-rose-300 bg-rose-50/20'
                    : focusedField === 'phone'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Phone
                  size={18}
                  className={`mr-2 shrink-0 ${
                    fieldErrors.phone ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md mr-2.5 select-none">
                  {formData.countryCode}
                </span>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  placeholder="10-digit Mobile Number *"
                  value={formData.phone}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(p => ({ ...p, phone: cleaned }));
                    setVerifiedPhone(null);
                    if (fieldErrors.phone) {
                      setFieldErrors(p => ({ ...p, phone: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium tracking-wide"
                />
                {checkingPhone ? (
                  <Loader2 size={16} className="text-[#EAA224] animate-spin shrink-0 ml-2" />
                ) : verifiedPhone && formData.phone === verifiedPhone && !fieldErrors.phone ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                ) : null}
              </div>
              {fieldErrors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.phone}</span>
                </p>
              )}
            </div>

            {/* Field 3: Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  fieldErrors.email
                    ? 'border-rose-300 bg-rose-50/20'
                    : focusedField === 'email'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Mail
                  size={18}
                  className={`mr-2.5 shrink-0 ${
                    fieldErrors.email ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com *"
                  value={formData.email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => {
                    setFormData(p => ({ ...p, email: e.target.value }));
                    setVerifiedEmail(null);
                    if (fieldErrors.email) {
                      setFieldErrors(p => ({ ...p, email: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
                {checkingEmail ? (
                  <Loader2 size={16} className="text-[#EAA224] animate-spin shrink-0 ml-2" />
                ) : verifiedEmail && formData.email.trim().toLowerCase() === verifiedEmail && !fieldErrors.email ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                ) : null}
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Field 4: Date of Birth (18+ enforcement with interactive Calendar format) */}
            <CalendarDatePicker
              label="Date of Birth"
              required
              minAge={18}
              value={formData.dob}
              error={fieldErrors.dob}
              placeholder="dd-mm-yyyy"
              onChange={(selectedVal) => {
                setFormData((p) => ({ ...p, dob: selectedVal }));

                if (selectedVal) {
                  const ageCheck = validateAgeEligibility(selectedVal);
                  if (!ageCheck.isValid) {
                    setFieldErrors((p) => ({ ...p, dob: ageCheck.error || undefined }));
                  } else if (!ageCheck.isEligible) {
                    setIneligibleAge(ageCheck.age);
                    setPhase('ineligible');
                  } else {
                    setFieldErrors((p) => {
                      const next = { ...p };
                      delete next.dob;
                      return next;
                    });
                  }
                } else {
                  setFieldErrors((p) => {
                    const next = { ...p };
                    delete next.dob;
                    return next;
                  });
                }
              }}
            />

            {/* Field 5: Gender (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gender <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  focusedField === 'gender'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Users size={18} className="mr-2.5 text-slate-400 shrink-0" />
                <select
                  name="gender"
                  value={formData.gender}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="">Select Gender (Optional)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-Binary</option>
                </select>
              </div>
            </div>

            {/* Field 6: Create Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Create Password <span className="text-rose-500">*</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  fieldErrors.password
                    ? 'border-rose-300 bg-rose-50/20'
                    : focusedField === 'password'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Lock
                  size={18}
                  className={`mr-2.5 shrink-0 ${
                    fieldErrors.password ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create Password (min. 6 chars) *"
                  value={formData.password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => {
                    setFormData(p => ({ ...p, password: e.target.value }));
                    if (fieldErrors.password) {
                      setFieldErrors(p => ({ ...p, password: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Field 7: Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div
                className={`flex items-center px-3.5 py-2.5 bg-slate-50 border rounded-xl transition ${
                  fieldErrors.confirmPassword
                    ? 'border-rose-300 bg-rose-50/20'
                    : focusedField === 'confirmPassword'
                    ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Lock
                  size={18}
                  className={`mr-2.5 shrink-0 ${
                    fieldErrors.confirmPassword ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => {
                    setFormData(p => ({ ...p, confirmPassword: e.target.value }));
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors(p => ({ ...p, confirmPassword: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Consents: Terms and Privacy */}
            <div className="pt-2 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={e => setFormData(p => ({ ...p, termsAccepted: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#011F39] focus:ring-[#011F39] cursor-pointer"
                />
                <span>
                  I agree to the <span className="font-semibold text-[#011F39] underline">Terms &amp; Conditions</span> of HRSJM. <span className="text-rose-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={e => setFormData(p => ({ ...p, privacyAccepted: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#011F39] focus:ring-[#011F39] cursor-pointer"
                />
                <span>
                  I accept the <span className="font-semibold text-[#011F39] underline">Privacy Policy</span> and consent to data processing. <span className="text-rose-500">*</span>
                </span>
              </label>

              {fieldErrors.terms && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.terms}</span>
                </p>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#011F39]" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="pt-4 text-center text-xs text-slate-600 border-t border-slate-100">
              <span>Already have an account? </span>
              <Link to="/login" className="font-bold text-[#0F2860] hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
        © 2026 Human Rights Sanrakshan Sansthan (HRSJM). All rights reserved.
      </footer>
    </div>
  );
};
