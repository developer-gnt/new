import React from 'react';
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
  ExternalLink,
  ChevronRight,
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
    <div className="min-h-screen bg-[#FAF7F0] text-slate-800 flex flex-col font-sans">
      {/* 1. Public Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#011F39] text-white border-b border-[#06294D] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Official Bilingual Emblem & Brand Mark */}
          <Link to="/" className="flex items-center gap-3.5 group text-decoration-none">
            <div className="w-11 h-11 rounded-full bg-[#06294D] border-2 border-[#FAD465] flex items-center justify-center text-[#FAD465] shadow-sm group-hover:scale-105 transition-transform">
              <Scale size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white font-serif leading-none">
                HRSJM
              </span>
              <span className="text-[10px] font-bold text-[#FAD465] tracking-widest uppercase mt-0.5 leading-tight">
                HUMAN RIGHTS & SOCIAL JUSTICE MISSION
              </span>
              <span className="text-[9px] text-slate-300 tracking-wide font-medium">
                मानव अधिकार • सामाजिक न्याय
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide text-slate-200">
            <button
              onClick={() => scrollToSection('choose-section')}
              className="hover:text-[#FAD465] transition cursor-pointer"
            >
              Choose Your Section
            </button>
            <button
              onClick={() => navigate('/assistance/apply')}
              className="hover:text-[#FAD465] transition cursor-pointer text-[#FAD465]"
            >
              Apply for Aid
            </button>
            <button
              onClick={() => navigate('/membership/apply')}
              className="hover:text-[#FAD465] transition cursor-pointer"
            >
              Become a Member
            </button>
            <button
              onClick={() => scrollToSection('mission-pillars')}
              className="hover:text-[#FAD465] transition cursor-pointer"
            >
              Our Mission
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-[#FAD465] transition cursor-pointer"
            >
              Contact & Helpline
            </button>
          </nav>

          {/* Direct Login CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/register')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-[#FAD465] transition cursor-pointer"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Login Portal</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-b from-[#011F39] via-[#06294D] to-[#0B2F52] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FAD465]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#174A78]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0]/10 border border-[#FAF7F0]/20 text-[11px] font-bold text-[#FAD465] tracking-widest uppercase">
            <span>Official NGO Digital Platform</span>
            <span>•</span>
            <span>Est. Registered Public Trust</span>
          </div>

          <h1
            style={{ color: '#FFFFFF' }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-tight"
          >
            Together for a <span style={{ color: '#FAD465' }} className="text-[#FAD465]">More Just</span> Society
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            Human Rights Sanrakshan Sansthan (HRSJM) is a national constitutional movement protecting fundamental
            rights, ensuring equality before law, providing pro-bono legal defense, and delivering humanitarian aid
            to vulnerable communities across India.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('choose-section')}
              className="px-6 py-3.5 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>Choose Your Section</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login?role=admin')}
              className="px-6 py-3.5 rounded-xl bg-[#FAF7F0]/15 hover:bg-[#FAF7F0]/25 text-white border border-white/20 font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <span>Admin Console</span>
              <ExternalLink size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROMINENT ROLE SELECTION SECTION */}
      <section id="choose-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#011F39]/5 text-[#011F39] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Role-Based Gateways</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#011F39]">
            Choose Your Section
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Select your section to access your dedicated operational workspace, verify records, track applications, or participate in human rights initiatives.
          </p>
        </div>

        {/* 4 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Donation Seeker */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#B45309] border border-amber-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HeartHandshake size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100/70 text-[#B45309]">
                  Aid & Welfare
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1">
                Donation Seeker
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                For underprivileged individuals and families seeking medical treatment aid, educational assistance, or emergency welfare support.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-slate-100 text-[11px] text-slate-600">
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
                className="w-full py-2 px-3 rounded-lg bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apply for Assistance</span>
                <ArrowRight size={13} />
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleRoleSelect('seeker')}
                  className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center text-center cursor-pointer"
                >
                  <span>Seeker Login</span>
                </button>
                <button
                  onClick={() => navigate('/assistance/track')}
                  className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center text-center cursor-pointer"
                >
                  <span>Track Status</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Member */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1D4ED8] border border-blue-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100/70 text-[#1D4ED8]">
                  Cadre & Delegate
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1">
                Member
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                For registered human rights delegates, legal counselors, state active members, and local committee officers.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-slate-100 text-[11px] text-slate-600">
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
                className="w-full py-2 px-3 rounded-lg bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Become a Member</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => handleRoleSelect('member')}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Existing Member Login</span>
              </button>
            </div>
          </div>

          {/* Card 3: Donor */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] border border-emerald-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Gift size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100/70 text-[#059669]">
                  Philanthropy & 80G
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1">
                Donor
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                For benevolent contributors, patrons, and CSR partners making direct impacts in human welfare initiatives.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-slate-100 text-[11px] text-slate-600">
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
                  <span>Recurring mandate transparency</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect('donor')}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Donor Login</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Admin */}
          <div className="bg-white rounded-xl border-2 border-[#011F39] p-4.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#011F39] text-[#FAD465] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Operational Hub
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                  Executive Console
                </span>
              </div>

              <h3 className="text-base font-bold text-[#011F39] mb-1">
                Admin
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                For designated trustees, executive officers, and administrators overseeing national operations and governance.
              </p>

              <div className="space-y-1.5 py-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Application review & KYC verify</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>General ledger & accounting audit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>Grievances, press & conclaves</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect('admin')}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Admin Console Login</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Core Mission Pillars */}
      <section id="mission-pillars" className="bg-white py-18 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#06294D] bg-[#011F39]/5 px-3 py-1 rounded-full">
              Constitutional Mandate
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#011F39] mt-2">
              Our Core Pillars of Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guiding human rights interventions and social welfare programs nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#FAF7F0] border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-sm">
                <Scale size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1">Constitutional Legal Aid</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free defense and legal representation for citizens facing custodial violence, discrimination, or unlawful deprivation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF7F0] border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-sm">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1">Civil Rights Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proactive investigation of human rights complaints and grievance escalation with statutory authorities.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF7F0] border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-sm">
                <HeartHandshake size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1">Social Relief & Welfare</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct financial disbursements for medical treatments, educational fees, and emergency assistance grants.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF7F0] border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center mb-3.5 shadow-sm">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#011F39] mb-1">Community Conclaves</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grassroots awareness camps, educational seminars, and delegate conclaves fostering active civic engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Contact & Office Information */}
      <section id="contact-section" className="py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#06294D] bg-[#011F39]/5 px-3 py-1 rounded-full">
            National Headquarters
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#011F39] mt-2">
            Contact & Support Channels
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reach out through official verified channels for inquiries, memberships, or emergency aid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center mb-3">
              <Phone size={18} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Phone Helplines</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p>+91 22 1234 5678</p>
              <p>+91 98765 43210</p>
              <p className="text-[11px] text-slate-400">Mon - Fri, 10:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center mb-3">
              <Mail size={18} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Email Inquiries</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p>info@hrsjm.org</p>
              <p>support@hrsjm.org</p>
              <p className="text-[11px] text-slate-400">Response within 24–48 hours</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <MapPin size={18} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Office Address</h4>
            <div className="text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-800">HRSJM Head Office</p>
              <p>123 Justice Lane, Kurla (W)</p>
              <p>Mumbai, Maharashtra 400070</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Clock size={18} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Working Hours</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-700">Mon - Fri:</span> 10:00 AM - 6:00 PM</p>
              <p><span className="font-semibold text-slate-700">Saturday:</span> 10:00 AM - 2:00 PM</p>
              <p className="text-rose-600 font-semibold text-[11px]">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Public Footer */}
      <footer className="bg-[#011F39] text-white pt-12 pb-8 border-t border-[#06294D] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#06294D] border border-[#FAD465] flex items-center justify-center text-[#FAD465]">
                  <Scale size={16} />
                </div>
                <div>
                  <h3 style={{ color: '#FFFFFF' }} className="font-bold font-serif text-base text-white">HRSJM</h3>
                  <p className="text-[10px] text-[#FAD465] font-semibold tracking-wider">
                    HUMAN RIGHTS & SOCIAL JUSTICE MISSION
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
                    <ChevronRight size={12} /> Donor Portal & 80G Receipts
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
              <h4 className="text-xs font-bold text-[#FAD465] tracking-wider uppercase">Compliance & Trust</h4>
              <p className="leading-relaxed">
                Registered under the Indian Public Trusts Act. Contributions to verified campaigns are eligible for tax deductions under Section 80G of the Income Tax Act.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              © {CURRENT_YEAR} Human Rights Sanrakshan Sansthan (HRSJM). All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>मानव अधिकार • सामाजिक न्याय</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
