import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Target,
  Heart,
  Award,
  Play,
  ArrowRight,
  BookOpen,
  Scale,
  Users,
  Handshake,
  MapPin,
  Eye,
  Ear,
  Megaphone,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { DEFAULT_ABOUT_VIDEO } from '../data/userDashboardData';
import { AboutVideoModal } from '../components/AboutVideoModal';

const CORE_VALUES = [
  {
    icon: Scale,
    title: 'Constitutional Justice',
    desc: 'Upholding fundamental constitutional guarantees and defending human rights for all citizens without discrimination.',
  },
  {
    icon: Shield,
    title: 'Dignity & Protection',
    desc: 'Protecting vulnerable individuals and underprivileged communities against exploitation and injustice.',
  },
  {
    icon: Heart,
    title: 'Empowerment & Compassion',
    desc: 'Empowering marginalized groups with legal literacy, civil support, and humanitarian aid.',
  },
  {
    icon: Award,
    title: 'Integrity & Transparency',
    desc: 'Operating with ethical rigor, public accountability, and dedicated grass-roots community leadership.',
  },
];

const PRINCIPLES = [
  {
    id: 'dignity',
    title: 'Human Dignity',
    description: 'Every individual matters.',
    icon: Users,
  },
  {
    id: 'equality',
    title: 'Equal Rights',
    description: 'Fair opportunities for all.',
    icon: Scale,
  },
  {
    id: 'justice',
    title: 'Social Justice',
    description: 'Stronger, more inclusive communities.',
    icon: Handshake,
  },
];

const ABOUT_WORK_AREAS = [
  {
    id: 'human-rights-monitoring',
    title: 'Human-rights Monitoring',
    description: 'Track, document and highlight rights violations.',
    icon: Eye,
  },
  {
    id: 'awareness-campaigns',
    title: 'Awareness Campaigns',
    description: 'Create awareness on rights, laws and social issues.',
    icon: Megaphone,
  },
  {
    id: 'workshops-training',
    title: 'Workshops & Training',
    description: 'Build knowledge and skills for stronger communities.',
    icon: Users,
  },
  {
    id: 'community-activities',
    title: 'Community Activities',
    description: 'Run local initiatives to support people in need.',
    icon: Handshake,
  },
  {
    id: 'leadership-development',
    title: 'Leadership Development',
    description: 'Empower youth and community leaders.',
    icon: GraduationCap,
  },
  {
    id: 'advocacy-awareness',
    title: 'Advocacy & Awareness',
    description: 'Engage with institutions and stakeholders.',
    icon: Megaphone,
  },
  {
    id: 'research-rights-education',
    title: 'Research & Rights Education',
    description: 'Research, publish and educate on human rights.',
    icon: BookOpen,
  },
  {
    id: 'legal-rights-awareness',
    title: 'Legal Rights Awareness',
    description: 'Provide information and guidance on legal rights and support.',
    icon: Scale,
  },
  {
    id: 'other-work-areas',
    title: 'Other Work Areas',
    description: 'Education, healthcare, women and child welfare, and more.',
    icon: Heart,
  },
];

const ON_THE_GROUND_FEATURES = [
  {
    id: 'field-visits',
    title: 'Field Visits',
    description: 'Understand real situations.',
    icon: MapPin,
  },
  {
    id: 'case-documentation',
    title: 'Case Documentation',
    description: 'Record and verify information.',
    icon: FileText,
  },
  {
    id: 'community-follow-up',
    title: 'Community Follow-up',
    description: 'Stay engaged for lasting change.',
    icon: Users,
  },
];

const APPROACH_STEPS = [
  {
    id: 'listen',
    title: 'Listen',
    description: "Understand people's concerns.",
    icon: Ear,
  },
  {
    id: 'document',
    title: 'Document',
    description: 'Gather facts and evidence.',
    icon: FileText,
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Provide guidance and connect resources.',
    icon: Handshake,
  },
  {
    id: 'advocate',
    title: 'Advocate',
    description: 'Engage stakeholders for real change.',
    icon: Megaphone,
  },
];

const ABOUT_IMPACT_STATS = [
  {
    id: 'communities',
    value: '500+',
    label: 'Communities Reached',
    icon: Users,
  },
  {
    id: 'people',
    value: '50K+',
    label: 'People Supported',
    icon: Heart,
  },
  {
    id: 'rights-issues',
    value: '1,200+',
    label: 'Rights Issues Documented',
    icon: FileText,
  },
  {
    id: 'cases-resolved',
    value: '1,150+',
    label: 'Cases Resolved',
    icon: Scale,
  },
];

export const UserAboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Hero Overview Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#06294D] text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#011F39]/95 via-[#06294D]/85 to-transparent z-0" />
        <img
          src="/assets/images/about-hero-rally.jpg"
          alt="HRSJM About Mission"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 z-0"
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 border border-[#E9B82E]/40 text-[#FAD465] text-xs font-bold uppercase tracking-wider">
            <Shield size={14} />
            <span>National Non-Governmental Mission</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-tight text-white">
            Human Rights and Social Justice Mission
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Human Rights and Social Justice Mission (HRSJM) is a nationwide civic organization dedicated to advancing constitutional literacy, protecting civil liberties, providing free legal aid, and driving grassroots community development across India.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#011F39] bg-[#E9B82E] hover:bg-[#d8a825] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play size={15} className="fill-[#011F39]" />
              <span>Watch Mission Video</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/what-we-do')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              <span>Explore What We Do</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Who We Are Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <div className="w-8 h-1 bg-[#E9B82E] rounded-full mb-1.5" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#06294D]">
            Who We Are
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
              HRSJM is a people-centred human-rights organisation working for the dignity, equality and justice of marginalised communities. We stand with individuals and groups to protect their rights and build a fairer, more inclusive society.
            </p>
            <div className="p-3.5 rounded-xl bg-[#FFF9E6] border border-[#FDE68A] text-xs text-[#06294D] font-medium leading-relaxed">
              Empowering citizens across India through constitutional education, free legal aid clinics, and community relief interventions.
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {PRINCIPLES.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#FAF7F0] border border-slate-200/80 shadow-2xs flex flex-col items-center text-center hover:shadow-sm hover:border-amber-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#06294D] mb-3 group-hover:scale-105 transition-transform">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-bold text-[#06294D] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-extrabold font-serif text-[#06294D] mb-2">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To defend civil rights, provide accessible legal counsel to the underprivileged, eradicate social discrimination, and foster an informed citizenry conscious of both constitutional rights and civic duties.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#06294D] flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h2 className="text-xl font-extrabold font-serif text-[#06294D] mb-2">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              An inclusive, just, and dignified democratic society where every citizen—regardless of gender, caste, creed, or economic background—exercises their fundamental rights with confidence and dignity.
            </p>
          </div>
        </div>
      </div>

      {/* 4. What We Do Section - Nine key areas of action */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="w-8 h-1 bg-[#E9B82E] rounded-full mb-1.5" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#06294D]">
              What We Do
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Nine key areas of action
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/what-we-do')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06294D] hover:text-amber-600 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Programs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {ABOUT_WORK_AREAS.map(area => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                onClick={() => {
                  if (area.id === 'other-work-areas') {
                    navigate('/what-we-do');
                  } else {
                    navigate(`/what-we-do/${area.id}`);
                  }
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#06294D] group-hover:scale-105 transition-transform">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#06294D] group-hover:text-white transition-colors">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#06294D] group-hover:text-amber-600 transition-colors mb-1">
                    {area.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. On The Ground Section - Human Rights Monitoring */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9E6] border border-[#FDE68A] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-amber-300/60 shadow-xs bg-[#06294D]">
            <img
              src="/assets/images/about-hero-community.png"
              alt="On The Ground Human Rights Monitoring"
              className="w-full h-full object-cover object-center"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/about-hero-rally.jpg';
              }}
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 tracking-wider uppercase">
              <div className="w-6 h-0.5 bg-amber-600 rounded-full" />
              <span>ON THE GROUND</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#06294D]">
              Human-rights Monitoring
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              We track, document and highlight human-rights issues to ensure that the voices of marginalised communities are heard and addressed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {ON_THE_GROUND_FEATURES.map(feature => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#06294D] mb-2.5">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <h4 className="text-sm font-bold text-[#06294D] mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Our Approach Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <div className="w-8 h-1 bg-[#E9B82E] rounded-full mb-1.5" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#06294D]">
              Our Approach
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            A people-centred and collaborative process
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPROACH_STEPS.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-5 rounded-2xl bg-[#FAF7F0] border border-slate-200/80 shadow-2xs flex items-start gap-3.5 hover:shadow-xs transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#06294D] shrink-0">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#06294D] mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Core Values Grid */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Foundational Pillars</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#06294D]">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#06294D] flex items-center justify-center mb-3">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold text-[#06294D] mb-1.5">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Our Impact Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <div className="w-8 h-1 bg-[#E9B82E] rounded-full mb-1.5" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#06294D]">
              Our Impact
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Building stronger, fairer and more inclusive communities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ABOUT_IMPACT_STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A] shadow-2xs flex flex-col items-center text-center hover:shadow-xs transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#C9971A]/40 flex items-center justify-center text-[#06294D] mb-3 shadow-2xs">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#06294D]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Call to Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#072444] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-amber-400/20">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
            Join Hands With Human Rights & Social Justice Mission
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Whether you are a legal professional, social worker, student, or concerned citizen, your involvement empowers grass-roots justice across India.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/user/membership')}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#011F39] bg-[#E9B82E] hover:bg-[#d8a825] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Become a Member
          </button>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
          >
            Contact Cell
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <AboutVideoModal
        visible={videoModalOpen}
        video={DEFAULT_ABOUT_VIDEO}
        onClose={() => setVideoModalOpen(false)}
        onOpenAbout={() => setVideoModalOpen(false)}
        onOpenDonate={() => {
          setVideoModalOpen(false);
          navigate('/donations');
        }}
      />
    </div>
  );
};
