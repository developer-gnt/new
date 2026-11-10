import type React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HeartHandshake,
  UserCheck,
  Gift,
  ShieldCheck,
  Scale,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Shield,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'seeker' | 'member' | 'donor' | 'admin') => {
    navigate(`/login?role=${role}`);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-800 flex flex-col font-sans selection:bg-[#FAD465] selection:text-[#011F39]">
      {/* =========================================================================
          1. TWO-TIER NAVIGATION HEADER (docs/design.md Section 5)
          ========================================================================= */}

      {/* Tier 1: Primary White Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DCE4EC] shadow-xs select-none">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Brand Logo and Bilingual Wordmark aligned left */}
          <Link to="/" className="flex items-center gap-3 group text-decoration-none min-w-0">
            <div className="flex flex-col min-w-0">
              <span className="text-[17px] font-bold tracking-wide text-[#011F39] font-serif leading-none">
                HUMAN RIGHTS SANRAKSHAN JAN MANCH
              </span>
              <span className="text-[10px] font-bold text-[#C9971A] tracking-wider uppercase mt-1 leading-tight">
                मानव अधिकार एवं सामाजिक न्याय संरक्षण ट्रस्ट • National Movement
              </span>
            </div>
          </Link>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold tracking-normal text-[#34516D]">
            <button
              onClick={() => scrollToSection('choose-section')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Portals
            </button>
            <button
              onClick={() => navigate('/rights')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Know Your Rights
            </button>
            <button
              onClick={() => navigate('/assistance/apply')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Apply for Aid
            </button>
            <button
              onClick={() => navigate('/membership/apply')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Become a Member
            </button>
            <button
              onClick={() => scrollToSection('mission-pillars')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Our Mission
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-[#011F39] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/register')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B2F52] hover:bg-[#EDF2F7] transition cursor-pointer"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              <span>Login Portal</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Tier 2: Secondary Gold Navigation Strip (docs/design.md Section 5) */}
        <div className="secondary-nav-strip">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between text-xs sm:text-[13px] overflow-x-auto scrollbar-none py-1.5">
            <div className="flex items-center gap-5 shrink-0 font-medium text-[#011F39]">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#011F39]" />
                <span>Statutory Trust: HR/0092/2019</span>
              </span>
              <span className="hidden md:inline text-black/20">•</span>
              <Link to="/rights" className="hover:underline hidden sm:inline">
                Constitutional Rights Guide
              </Link>
              <span className="hidden md:inline text-black/20">•</span>
              <Link to="/donations" className="hover:underline hidden sm:inline">
                80G Tax Deductible Aid
              </Link>
              <span className="hidden lg:inline text-black/20">•</span>
              <Link to="/events" className="hover:underline hidden lg:inline">
                Upcoming Conclaves & Drives
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-semibold text-[#011F39]">
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold tabular-nums">
                <Phone size={12} />
                <span>National Helpline: 1800-889-1092</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (docs/design.md Section 6)
          ========================================================================= */}
      <section className="bg-gradient-to-b from-[#011F39] via-[#06294D] to-[#011F39] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background textures */}
        <div className="absolute inset-0 bg-[#031B31]/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FAD465]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#123F68]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-[#FAD465] tracking-widest uppercase">
              <Shield size={13} className="text-[#FAD465]" />
              <span>Registered Public Non-Profit Trust • Section 12A & 80G Certified</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold font-serif tracking-tight text-white leading-[1.08]">
              Together for a <span className="text-[#FAD465]">More Just</span> &amp; Equal Society
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
              Human Rights Sanrakshan Jan Manch (HRSJM) is a national constitutional movement protecting
              fundamental civil rights, ensuring equality before law, providing pro-bono legal defense, and
              delivering direct humanitarian aid to underprivileged citizens across India.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => scrollToSection('choose-section')}
                className="btn-primary text-sm shadow-md"
              >
                <span>Choose Your Section</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/membership/apply')}
                className="btn-outline-white text-sm"
              >
                <UserCheck size={16} />
                <span>Join as a Member</span>
              </button>
            </div>
          </div>

          {/* Hero Right Column: Fast Executive Metric Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FAD465]">
                  National Footprint
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Audited
                </span>
              </div>

              <div className="space-y-3 font-number">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Citizens Assisted:</span>
                  <span className="text-xl font-bold font-mono text-[#FAD465] tabular-nums">54,280+</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Accredited Advocates:</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">3,450+</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Active State Units:</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">28 States / UTs</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Pro-Bono Legal Defense:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">100% Free</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Unique Tax Exemption Regn:</span>
                <span className="font-mono text-white font-bold">CIT(E)/80G</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EDITORIAL CALLOUT WITH CAVEAT PULL QUOTE (docs/design.md Section 10)
          ========================================================================= */}
      <section className="py-12 bg-white border-b border-[#DCE4EC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="font-quote text-2xl sm:text-3xl lg:text-[34px] text-[#011F39] block leading-snug">
              “In the defense of human dignity and constitutional liberty, no citizen stands alone.
              Justice is not a privilege; it is our sacred civil covenant.”
            </span>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#718096]">
              National Core Committee • Human Rights Sanrakshan Jan Manch
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROMINENT ROLE SELECTION SECTION (docs/design.md Section 8)
          ========================================================================= */}
      <section id="choose-section" className="py-16 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-label text-[#C9971A] bg-[#FFF9E6] px-3 py-1 rounded-full border border-[#FAD465]/40 inline-block mb-2">
            Role-Based Gateways
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#011F39]">
            Choose Your Operational Section
          </h2>
          <p className="text-sm text-[#34516D] mt-2">
            Select your section to access your dedicated workspace, verify credentials, track applications, or participate in civil rights missions.
          </p>
        </div>

        {/* 4 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Donation Seeker */}
          <div className="card-editorial-interactive flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9971A] border border-amber-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HeartHandshake size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100/70 text-[#C9971A]">
                  Aid &amp; Welfare
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1 font-serif">
                Donation Seeker
              </h3>
              <p className="text-xs text-[#34516D] leading-relaxed mb-3">
                For underprivileged individuals and families seeking medical treatment aid, educational assistance, or emergency welfare support.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-[#DCE4EC] text-[11px] text-[#34516D]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Submit welfare assistance request</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Upload medical/invoice documents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Track application review status</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate('/assistance/apply')}
                className="btn-primary text-xs py-2 w-full"
              >
                <span>Apply for Assistance</span>
                <ArrowRight size={13} />
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleRoleSelect('seeker')}
                  className="py-1.5 px-2 rounded-xl border border-[#DCE4EC] hover:bg-[#EDF2F7] text-[#011F39] font-semibold text-xs transition cursor-pointer"
                >
                  <span>Seeker Login</span>
                </button>
                <button
                  onClick={() => navigate('/assistance/track')}
                  className="py-1.5 px-2 rounded-xl border border-[#DCE4EC] hover:bg-[#EDF2F7] text-[#011F39] font-semibold text-xs transition cursor-pointer"
                >
                  <span>Track Status</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Member */}
          <div className="card-editorial-interactive flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#174A78] border border-blue-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100/70 text-[#174A78]">
                  Cadre &amp; Delegate
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1 font-serif">
                Member Portal
              </h3>
              <p className="text-xs text-[#34516D] leading-relaxed mb-3">
                For registered human rights delegates, legal counselors, state active members, and local committee officers.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-[#DCE4EC] text-[11px] text-[#34516D]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Access official Member Services</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Download verified Digital ID Card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Participate in regional conclaves</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate('/membership/apply')}
                className="btn-primary text-xs py-2 w-full"
              >
                <span>Become a Member</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => handleRoleSelect('member')}
                className="w-full py-1.5 px-3 rounded-xl border border-[#DCE4EC] hover:bg-[#EDF2F7] text-[#011F39] font-semibold text-xs transition cursor-pointer"
              >
                <span>Existing Member Login</span>
              </button>
            </div>
          </div>

          {/* Card 3: Donor */}
          <div className="card-editorial-interactive flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Gift size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100/70 text-[#16A34A]">
                  Philanthropy &amp; 80G
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1 font-serif">
                Donor &amp; CSR
              </h3>
              <p className="text-xs text-[#34516D] leading-relaxed mb-3">
                For benevolent contributors, patrons, and CSR partners making direct impacts in human welfare initiatives.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-[#DCE4EC] text-[11px] text-[#34516D]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Contribute to verified campaigns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Instant 80G tax receipt downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Full financial ledger audit</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate('/donations')}
                className="btn-primary text-xs py-2 w-full"
              >
                <span>Make a Contribution</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => handleRoleSelect('donor')}
                className="w-full py-1.5 px-3 rounded-xl border border-[#DCE4EC] hover:bg-[#EDF2F7] text-[#011F39] font-semibold text-xs transition cursor-pointer"
              >
                <span>Donor Login</span>
              </button>
            </div>
          </div>

          {/* Card 4: Admin */}
          <div className="card-editorial-interactive border-2 border-[#011F39] flex flex-col justify-between group relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#011F39] text-[#FAD465] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Operational Hub
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#011F39] text-[#FAD465] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                  Executive Console
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1 font-serif">
                Administrator
              </h3>
              <p className="text-xs text-[#34516D] leading-relaxed mb-3">
                For designated trustees, executive officers, and administrators overseeing national operations and governance.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-[#DCE4EC] text-[11px] text-[#34516D]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Application review &amp; KYC verify</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>General ledger &amp; accounting audit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Grievances, press &amp; conclaves</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect('admin')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#011F39] hover:bg-[#06294D] text-[#FAD465] font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Admin Console Login</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CORE MISSION PILLARS (docs/design.md Section 10)
          ========================================================================= */}
      <section id="mission-pillars" className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#DCE4EC]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label text-[#174A78] bg-[#EDF2F7] px-3 py-1 rounded-full inline-block">
              Constitutional Mandate
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#011F39] mt-2">
              Our Core Pillars of Action
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] mt-1">
              Guiding human rights interventions and social welfare programs nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-editorial bg-[#FAF7F0] p-6">
              <div className="w-10 h-10 rounded-xl bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-xs">
                <Scale size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Constitutional Legal Aid</h4>
              <p className="text-xs text-[#34516D] leading-relaxed">
                Free defense and legal representation for citizens facing custodial violence, discrimination, or unlawful deprivation.
              </p>
            </div>

            <div className="card-editorial bg-[#FAF7F0] p-6">
              <div className="w-10 h-10 rounded-xl bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-xs">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Civil Rights Protection</h4>
              <p className="text-xs text-[#34516D] leading-relaxed">
                Proactive investigation of human rights complaints and grievance escalation with statutory authorities.
              </p>
            </div>

            <div className="card-editorial bg-[#FAF7F0] p-6">
              <div className="w-10 h-10 rounded-xl bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-xs">
                <HeartHandshake size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Social Relief &amp; Welfare</h4>
              <p className="text-xs text-[#34516D] leading-relaxed">
                Direct financial disbursements for medical treatments, educational fees, and emergency assistance grants.
              </p>
            </div>

            <div className="card-editorial bg-[#FAF7F0] p-6">
              <div className="w-10 h-10 rounded-xl bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-xs">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Community Conclaves</h4>
              <p className="text-xs text-[#34516D] leading-relaxed">
                Grassroots awareness camps, educational seminars, and delegate conclaves fostering active civic engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. VERIFIED CONTACT & HELPLINE INFORMATION
          ========================================================================= */}
      <section id="contact-section" className="py-16 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-label text-[#C9971A] bg-[#FFF9E6] px-3 py-1 rounded-full border border-[#FAD465]/40 inline-block">
            National Headquarters
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#011F39] mt-2">
            Contact &amp; Support Channels
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Reach out through official verified channels for inquiries, memberships, or emergency aid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-editorial p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#174A78] flex items-center justify-center mb-3">
              <Phone size={18} />
            </div>
            <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Phone Helplines</h4>
            <div className="text-xs text-[#34516D] space-y-1 font-number">
              <p className="tabular-nums">+91 11 2338 4567</p>
              <p className="tabular-nums">+91 98765 43210</p>
              <p className="text-[11px] text-[#718096]">Mon - Fri, 10:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="card-editorial p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-3">
              <Mail size={18} />
            </div>
            <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Email Inquiries</h4>
            <div className="text-xs text-[#34516D] space-y-1 font-number">
              <p>info@hrsjm.org</p>
              <p>support@hrsjm.org</p>
              <p className="text-[11px] text-[#718096]">Response within 24–48 hours</p>
            </div>
          </div>

          <div className="card-editorial p-6">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#123F68] flex items-center justify-center mb-3">
              <MapPin size={18} />
            </div>
            <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">National Secretariat</h4>
            <div className="text-xs text-[#34516D] space-y-0.5">
              <p className="font-semibold text-[#011F39]">12/4 Institutional Area</p>
              <p>Lodhi Road, New Delhi</p>
              <p className="tabular-nums">Delhi - 110003, India</p>
            </div>
          </div>

          <div className="card-editorial p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9971A] flex items-center justify-center mb-3">
              <Clock size={18} />
            </div>
            <h4 className="font-bold text-sm text-[#011F39] mb-1 font-serif">Public Reception Hours</h4>
            <div className="text-xs text-[#34516D] space-y-1 font-number">
              <p><span className="font-semibold text-[#011F39]">Mon - Fri:</span> 10:00 AM - 6:00 PM</p>
              <p><span className="font-semibold text-[#011F39]">Saturday:</span> 10:00 AM - 2:00 PM</p>
              <p className="text-rose-600 font-semibold text-[11px]">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PUBLIC FOOTER (docs/design.md Section 2)
          ========================================================================= */}
      <footer className="bg-[#011F39] text-white pt-12 pb-8 border-t border-[#06294D] mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-bold font-serif text-base text-white">HRSJM</h3>
                  <p className="text-[10px] text-[#FAD465] font-semibold tracking-wider">
                    HUMAN RIGHTS SANRAKSHAN JAN MANCH
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                National non-governmental organisation dedicated to constitutional justice, equality, and humanitarian welfare across India.
              </p>
            </div>

            {/* Quick Section Gateways */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#FAD465] tracking-wider uppercase">Section Gateways</h4>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>
                  <button onClick={() => handleRoleSelect('seeker')} className="hover:text-[#FAD465] transition cursor-pointer flex items-center gap-1">
                    <ChevronRight size={12} /> Donation Seeker Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleSelect('member')} className="hover:text-[#FAD465] transition cursor-pointer flex items-center gap-1">
                    <ChevronRight size={12} /> Member Services Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleSelect('donor')} className="hover:text-[#FAD465] transition cursor-pointer flex items-center gap-1">
                    <ChevronRight size={12} /> Donor Portal &amp; 80G Receipts
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleSelect('admin')} className="hover:text-[#FAD465] transition cursor-pointer flex items-center gap-1">
                    <ChevronRight size={12} /> Executive Admin Console
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Notice */}
            <div className="space-y-2 text-xs text-slate-300">
              <h4 className="text-xs font-bold text-[#FAD465] tracking-wider uppercase">Compliance &amp; Trust</h4>
              <p className="leading-relaxed">
                Registered under the Indian Trust Act 1882 (Regn HR/0092/2019). Contributions to verified campaigns are eligible for 50% income tax deductions under Section 80G of the Income Tax Act 1961.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              © {CURRENT_YEAR} Human Rights Sanrakshan Jan Manch (HRSJM). All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs font-number">
              <span>मानव अधिकार • सामाजिक न्याय</span>
              <span>•</span>
              <span>National Secretariat: New Delhi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
