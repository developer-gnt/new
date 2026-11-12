import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  BookOpen,
  Users,
  Handshake,
  Globe,
  FileText,
  Heart,
  Scale,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  getWhatWeDoDetail,
  type WhatWeDoDetailContent,
} from '../data/whatWeDoDetailData';

const renderIcon = (name: string, size = 18, className = '') => {
  switch (name) {
    case 'megaphone':
      return <Megaphone size={size} className={className} />;
    case 'users':
      return <Users size={size} className={className} />;
    case 'book-open':
      return <BookOpen size={size} className={className} />;
    case 'handshake':
      return <Handshake size={size} className={className} />;
    case 'shield-check':
    case 'shield':
      return <ShieldCheck size={size} className={className} />;
    case 'globe':
      return <Globe size={size} className={className} />;
    case 'file-text':
      return <FileText size={size} className={className} />;
    case 'heart':
      return <Heart size={size} className={className} />;
    case 'scale':
      return <Scale size={size} className={className} />;
    case 'award':
      return <Award size={size} className={className} />;
    case 'calendar':
      return <Calendar size={size} className={className} />;
    default:
      return <ShieldCheck size={size} className={className} />;
  }
};

export const UserWhatWeDoDetailPage: React.FC = () => {
  const { initiativeId } = useParams<{ initiativeId: string }>();
  const navigate = useNavigate();

  const content: WhatWeDoDetailContent = useMemo(() => {
    return getWhatWeDoDetail(initiativeId || 'awareness-campaigns');
  }, [initiativeId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [initiativeId]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pt-3 md:pt-4">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/what-we-do')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#06294D] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to What We Do</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/what-we-do" className="hover:text-[#06294D] transition-colors">
            What HRSJM Does
          </Link>
          <span>/</span>
          <span className="text-[#06294D] font-bold">{content.title}</span>
        </div>
      </div>

      {/* Hero Banner matching APK visual format */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] bg-[#06294D] shadow-md border border-slate-200/40">
        <img
          src={content.heroImage || '/assets/images/event-legal-awareness.jpg'}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-50"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = '/assets/images/event-legal-awareness.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06294D] via-[#06294D]/85 to-transparent" />

        <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col justify-end min-h-[220px] sm:min-h-[260px] max-w-3xl space-y-2.5">
          <div className="inline-block">
            <span className="px-2.5 py-1 rounded-md bg-white text-[#06294D] text-[11px] font-black uppercase tracking-wider shadow-xs">
              HRSJM INITIATIVE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight text-white">
            {content.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-2xl leading-relaxed font-sans">
            {content.heroDescription}
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#06294D]">Overview</h2>
          <div className="w-12 h-1 bg-[#E9B82E] rounded-full mt-1.5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {content.overview}
        </p>
      </div>

      {/* Our Key Activities */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#06294D]">
            Our Key Activities
          </h2>
          <div className="w-12 h-1 bg-[#E9B82E] rounded-full mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {content.activities.map((activity, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mb-3 text-[#06294D]">
                  {renderIcon(activity.icon, 20)}
                </div>
                <h3 className="text-sm font-bold text-[#06294D] mb-1.5">{activity.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Matters */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A] shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAD465] flex items-center justify-center text-[#06294D] shrink-0">
            {renderIcon(content.whyIcon || 'shield-check', 20)}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#06294D]">Why It Matters</h2>
            <div className="w-10 h-1 bg-[#E9B82E] rounded-full mt-1" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-1">
          {content.whyItMatters}
        </p>
      </div>

      {/* How You Can Participate */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#06294D]">
            How You Can Participate
          </h2>
          <div className="w-12 h-1 bg-[#E9B82E] rounded-full mt-1.5" />
        </div>

        <div className="space-y-3">
          {content.participationItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <div className="w-7 h-7 rounded-full bg-[#06294D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {item.text}
                </p>
              </div>
              <div className="text-amber-600 shrink-0 mt-1">
                <CheckCircle2 size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Action CTA Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#06294D] to-[#0D3B66] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[11px] font-bold text-[#E9B82E] uppercase tracking-wider">
            CITIZEN COLLABORATION
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {content.ctaTitle || 'Take Action with HRSJM'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Support our nationwide movement for human rights, constitutional education, and community assistance.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/membership')}
            className="px-5 py-2.5 rounded-xl bg-[#E9B82E] hover:bg-amber-400 text-[#06294D] text-xs font-bold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{content.ctaButtonLabel || 'Join as Volunteer'}</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/support')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer"
          >
            <span>File a Complaint</span>
          </button>
        </div>
      </div>
    </div>
  );
};

