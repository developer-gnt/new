import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Users,
  Heart,
  Scale,
  Building2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';

interface InitiativeItem {
  id: string;
  pillarNumber: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string;
  badgeBg: string;
  badgeColor: string;
  benchmark: string;
  benchmarkLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  keyActions: string[];
  whyItMatters: string;
  howToParticipate: string[];
}

const INITIATIVES: InitiativeItem[] = [
  {
    id: 'human-rights-monitoring',
    pillarNumber: 'Pillar 01',
    title: 'Human Rights Monitoring & Fact-Finding',
    category: 'Legal & Monitoring',
    tagline: 'Ground-level tracking of rights violations and custodial accountability',
    description:
      'Our dedicated field monitors investigate civil rights violations, document police conduct, and help vulnerable communities seek immediate statutory redressal before commissions and judicial authorities.',
    image: '/assets/images/about-hero-rally.jpg',
    accentColor: '#1E40AF',
    badgeBg: '#EFF6FF',
    badgeColor: '#1D4ED8',
    benchmark: '3,500+',
    benchmarkLabel: 'Violations Documented',
    icon: Scale,
    keyActions: [
      'Field monitoring & ground incident investigation',
      'Custodial torture and unlawful detention reporting',
      'Independent fact-finding missions in conflict zones',
      'Formal submissions to NHRC and State Human Rights Commissions',
    ],
    whyItMatters:
      'Without rigorous factual evidence and on-the-ground documentation, systemic rights abuses remain unaddressed. Our fact-finding missions establish verified records that demand institutional accountability.',
    howToParticipate: [
      'Report suspected rights abuses through our secure complaint cell',
      'Share verified evidence and eyewitness observations with our investigators',
      'Volunteer as a local observer or community reporter in your district',
    ],
  },
  {
    id: 'awareness-campaigns',
    pillarNumber: 'Pillar 02',
    title: 'Constitutional Literacy & Public Campaigns',
    category: 'Awareness & Literacy',
    tagline: 'Taking fundamental constitutional rights directly to every citizen',
    description:
      'We conduct nationwide legal awareness rallies, street workshops, and multilingual seminars to educate citizens on their constitutional rights, police procedural limits, and accessible statutory remedies.',
    image: '/assets/images/event-legal-awareness.jpg',
    accentColor: '#D75486',
    badgeBg: '#FDF2F8',
    badgeColor: '#BE185D',
    benchmark: '500+',
    benchmarkLabel: 'Public Drives Completed',
    icon: Megaphone,
    keyActions: [
      'Door-to-door constitutional literacy in marginalized settlements',
      'Women safety, dowry prevention, and anti-harassment drives',
      'Right to Education (RTE) admission facilitation for slum children',
      'Multilingual digital handbooks on civil liberties and police conduct',
    ],
    whyItMatters:
      'Constitutional rights are only powerful when everyday citizens know they possess them. Awareness empowers vulnerable individuals to resist exploitation with lawful confidence.',
    howToParticipate: [
      'Attend or help coordinate awareness drives in your local neighbourhood',
      'Distribute translated rights guidebooks in your regional language',
      'Invite our legal awareness speakers to your school, college, or workplace',
    ],
  },
  {
    id: 'workshops-training',
    pillarNumber: 'Pillar 03',
    title: 'Paralegal Training & Capacity Building',
    category: 'Training & Capacity',
    tagline: 'Equipping grassroots defenders with actionable legal know-how',
    description:
      'Structured legal aid workshops and training academies that equip students, local leaders, and social workers with the expertise to draft RTI queries, file FIR grievances, and combat social injustice.',
    image: '/assets/images/about-hero-community.png',
    accentColor: '#B67D00',
    badgeBg: '#FEFCE8',
    badgeColor: '#A16207',
    benchmark: '12,000+',
    benchmarkLabel: 'Paralegals & Youth Trained',
    icon: GraduationCap,
    keyActions: [
      'Right to Information (RTI) drafting & appeals masterclasses',
      'Domestic violence & POCSO statutory protection procedures',
      'Community dispute conciliation and first-response mediation',
      'Public speaking and grassroots advocacy leadership bootcamps',
    ],
    whyItMatters:
      'Sustainable change happens when communities possess their own trained advocates. Our training builds local self-reliance so grievances can be handled rapidly at the grassroots level.',
    howToParticipate: [
      'Enroll in our quarterly certified Paralegal Training Academy',
      'Apply for accredited legal internships with our senior advocates',
      'Nominate active community members from your area for sponsored training',
    ],
  },
  {
    id: 'community-activities',
    pillarNumber: 'Pillar 04',
    title: 'Grassroots Community Aid & Emergency Relief',
    category: 'Community Relief',
    tagline: 'Direct humanitarian, medical, and legal assistance for underserved families',
    description:
      'Beyond courtroom battles, HRSJM maintains emergency relief cells providing free legal counsel, disaster response kits, medical aid camps, and humanitarian assistance to vulnerable families.',
    image: '/assets/images/contact-cta-hands.jpg',
    accentColor: '#E11D48',
    badgeBg: '#FFF1F2',
    badgeColor: '#E11D48',
    benchmark: '2,00,000+',
    benchmarkLabel: 'Citizens Directly Assisted',
    icon: Heart,
    keyActions: [
      'Free weekly walk-in legal aid clinics across tier-2 and tier-3 towns',
      'Immediate bail & legal representation for indigent prisoners',
      'Educational kit and scholarship drives for underprivileged students',
      'Emergency food, blanket, and medical relief in disaster zones',
    ],
    whyItMatters:
      'Justice encompasses economic survival and human dignity. Providing tangible relief alongside legal counsel restores hope and protects families from destitution.',
    howToParticipate: [
      'Support our emergency humanitarian and medical aid operations',
      'Volunteer as a distribution coordinator during disaster response drives',
      'Refer marginalized individuals requiring free legal aid to our clinics',
    ],
  },
  {
    id: 'advocacy-reform',
    pillarNumber: 'Pillar 05',
    title: 'Public Interest Litigation & Policy Reform',
    category: 'Advocacy & Reform',
    tagline: 'Driving structural and legislative reform through constitutional litigation',
    description:
      'Our legal research division documents human rights conditions, drafts landmark Public Interest Litigations (PILs), monitors prison conditions, and submits representations to ministries.',
    image: '/assets/images/contact-hero-building.jpg',
    accentColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    badgeColor: '#6D28D9',
    benchmark: '85+',
    benchmarkLabel: 'PILs & Whitepapers Filed',
    icon: Building2,
    keyActions: [
      'High-impact PIL litigation in High Courts and Supreme Court',
      'Comprehensive Annual National Human Rights Status reports',
      'Representations on custodial standards and police reform guidelines',
      'Policy recommendations on child protection and labor welfare laws',
    ],
    whyItMatters:
      'While individual cases save lives, policy reforms protect entire generations. Our PILs and policy papers challenge outdated practices and establish progressive legal precedents.',
    howToParticipate: [
      'Contribute legal research or ground data to our ongoing PIL petitions',
      'Submit academic whitepapers or comparative law analysis',
      'Advocate for human rights policy reform through community campaigns',
    ],
  },
  {
    id: 'leadership-development',
    pillarNumber: 'Pillar 06',
    title: 'Youth Leadership & Civic Engagement',
    category: 'Training & Capacity',
    tagline: 'Fostering democratic governance and responsible civic leadership',
    description:
      'Empowering young changemakers to lead local development initiatives, conduct peaceful civic advocacy, build university rights chapters, and counter misinformation.',
    image: '/assets/images/member-hero-rally.jpg',
    accentColor: '#059669',
    badgeBg: '#ECFDF5',
    badgeColor: '#047857',
    benchmark: '45,000+',
    benchmarkLabel: 'Youth Volunteers Engaged',
    icon: Users,
    keyActions: [
      'Campus Human Rights Clubs in leading colleges and universities',
      'Peer-to-peer legal awareness and anti-ragging circles',
      'Civic representation in local ward and municipal advisory committees',
      'Digital campaigns against online harassment, cyberbullying, and hate speech',
    ],
    whyItMatters:
      'India is home to the largest youth population in the world. When young minds embrace constitutional values, the entire nation moves forward with equality and empathy.',
    howToParticipate: [
      'Charter an official HRSJM Youth Chapter at your educational institution',
      'Lead a local youth civic drive in your town or village',
      'Apply to represent youth voices in our National Youth Assembly',
    ],
  },
];

const CATEGORIES = [
  'All Initiatives',
  'Legal & Monitoring',
  'Awareness & Literacy',
  'Training & Capacity',
  'Community Relief',
  'Advocacy & Reform',
];

export const UserWhatWeDoPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Initiatives');
  const [activeModalItem, setActiveModalItem] = useState<InitiativeItem | null>(null);

  const filteredInitiatives = useMemo(() => {
    if (selectedCategory === 'All Initiatives') return INITIATIVES;
    return INITIATIVES.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#06294D] via-[#041E3A] to-[#011F39] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#E9B82E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 border border-[#E9B82E]/40 text-[#FAD465] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Official Humanitarian &amp; Legal Mandate</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            What HRSJM Does
          </h1>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            From grassroots human-rights monitoring to landmark constitutional litigation, discover how our nationwide mission delivers measurable impact, legal protection, and human dignity across India.
          </p>
        </div>

        {/* Hero Impact Benchmarks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/15 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xl sm:text-3xl font-black text-[#FAD465]">500+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">Awareness Drives</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xl sm:text-3xl font-black text-white">12,000+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">Paralegals Trained</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xl sm:text-3xl font-black text-emerald-400">2,00,000+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">Citizens Assisted</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xl sm:text-3xl font-black text-[#FAD465]">28</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">State Chapters</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#06294D] text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Modern Initiatives Grid (2 Columns, Rich Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInitiatives.map(item => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Image Header with Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md"
                    style={{ backgroundColor: item.badgeBg, color: item.badgeColor }}
                  >
                    {item.pillarNumber}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Title on Image */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      <Icon size={15} />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 tracking-wide">
                      Verified Benchmark: {item.benchmark} {item.benchmarkLabel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-xs">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700 leading-snug">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Key Actions Tag Chips */}
                  <div className="pt-1">
                    <span className="text-[10.5px] font-bold text-[#06294D] uppercase tracking-wider block mb-2">
                      Key Operations:
                    </span>
                    <div className="space-y-1.5">
                      {item.keyActions.slice(0, 3).map((action, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2
                            size={14}
                            className="shrink-0 mt-0.5 text-emerald-600"
                          />
                          <span className="line-clamp-1">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    className="text-xs font-bold text-[#06294D] hover:text-[#083563] group-hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>View Complete Program Details</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    View Drives
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Three-Step Methodology Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            How HRSJM Delivers Justice
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#06294D]">
            Our 3-Stage Operational Framework
          </h2>
          <p className="text-xs text-slate-500">
            A structured, lawful pathway from initial incident report to final statutory resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#06294D] flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-[#06294D]">Incident Intake &amp; Field Fact-Finding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complaints received through our digital portal or chapter offices undergo prompt factual verification and prima facie evidentiary scrutiny.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-amber-800 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-[#06294D]">Legal Representation &amp; Commission Notices</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned legal cell advocates issue statutory notices, draft RTI inquiries, and represent victims before human rights tribunals and courts.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-[#06294D]">Redressal &amp; Sustained Rehabilitation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensuring compensation orders, protective injunctions, and ongoing community support are fully enforced by local authorities.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Bottom Dual-Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#06294D] to-[#011F39] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAD465]">
            Citizen Grievance Redressal
          </span>
          <h3 className="text-lg sm:text-2xl font-black text-white">
            Facing a human rights violation or seeking legal counsel?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200">
            Submit a confidential complaint to our central legal defense desk or contribute to our nationwide humanitarian relief funds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/support')}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Scale size={15} />
            <span>File a Complaint</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/donations')}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-[#06294D] bg-[#E9B82E] hover:bg-[#d8a825] transition-all cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Heart size={15} fill="currentColor" />
            <span>Support Our Work</span>
          </button>
        </div>
      </div>

      {/* 6. Program Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 w-full shrink-0">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E9B82E] text-[#06294D] mb-1.5 inline-block">
                  {activeModalItem.pillarNumber} • {activeModalItem.category}
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {activeModalItem.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Program Overview
                </span>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {activeModalItem.description}
                </p>
              </div>

              {/* Benchmark Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                <div className="text-xl sm:text-2xl font-black text-[#06294D]">
                  {activeModalItem.benchmark}
                </div>
                <div className="text-xs font-semibold text-amber-900">
                  {activeModalItem.benchmarkLabel} across regional chapters.
                </div>
              </div>

              {/* Key Operations */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Core Field Operations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalItem.keyActions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why It Matters */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-bold text-[#06294D] uppercase tracking-wider block">
                  Why This Program Matters
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeModalItem.whyItMatters}
                </p>
              </div>

              {/* How To Participate */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  How You Can Participate
                </span>
                <div className="space-y-1.5">
                  {activeModalItem.howToParticipate.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalItem(null);
                    navigate('/membership-applications');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083563] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Join as Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalItem(null);
                    navigate('/support');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] text-xs font-bold cursor-pointer transition-colors"
                >
                  File Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
