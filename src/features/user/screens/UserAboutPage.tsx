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

const LEADERSHIP_TEAM = [
  {
    name: 'Dr. Rajeshwar Sharma',
    role: 'National President & Founder',
    qualification: 'Senior Advocate, Constitutional Law Specialist',
    image: '/assets/images/about-hero-community.png',
  },
  {
    name: 'Adv. Meenakshi Joshi',
    role: 'Secretary General & Legal Cell Head',
    qualification: 'Human Rights Defender, Supreme Court of India',
    image: '/assets/images/contact-hero-building.jpg',
  },
  {
    name: 'Col. (Retd.) Arvind Kumar',
    role: 'Director of Grassroots Operations',
    qualification: 'Community Development & Humanitarian Relief',
    image: '/assets/images/about-hero-rally.jpg',
  },
];

export const UserAboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-8">
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

      {/* 2. Mission & Vision Cards */}
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

      {/* 3. Core Values Grid */}
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

      {/* 4. Leadership & National Committee */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Guidance & Governance</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#06294D]">Leadership & Advisory Council</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {LEADERSHIP_TEAM.map((leader, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-44 bg-slate-900 overflow-hidden relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-[#06294D]">{leader.name}</h3>
                <p className="text-xs font-semibold text-amber-600 mb-1">{leader.role}</p>
                <p className="text-xs text-slate-500">{leader.qualification}</p>
              </div>
            </div>
          ))}
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
