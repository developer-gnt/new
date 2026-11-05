import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Users,
  BookOpen,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Scale,
  Heart,
} from 'lucide-react';

const WHAT_WE_DO_DETAILS = [
  {
    id: 'awareness-campaigns',
    title: 'Awareness Campaigns',
    icon: Megaphone,
    headline: 'Taking Constitutional Literacy to Every Citizen',
    description:
      'We organize public awareness campaigns, street rallies, constitutional literacy drives, and audio-visual presentations in both urban and rural areas to inform citizens about their civil rights, consumer protections, and remedies for human rights abuses.',
    initiatives: [
      'Constitutional Rights Rallies & Public Marches',
      'Door-to-door legal literacy drives in marginalized settlements',
      'Digital human rights campaigns on civil rights and police conduct',
      'School and university constitutional awareness lectures',
    ],
    stat: '500+ Campaigns Held',
  },
  {
    id: 'workshops-training',
    title: 'Workshops & Training',
    icon: Users,
    headline: 'Building Capacities of Grassroots Leaders and Youth',
    description:
      'Structured legal aid workshops and leadership training seminars equipping paralegals, students, local leaders, and social workers with the knowledge to handle local grievances, file RTI applications, and combat social injustice.',
    initiatives: [
      'Right to Information (RTI) filing masterclasses',
      'Legal defense procedures for women & child welfare officers',
      'Human Rights Monitoring and Fact-Finding methodology',
      'Grassroots conflict resolution & conciliation forums',
    ],
    stat: '12,000+ Activists Trained',
  },
  {
    id: 'research-rights-education',
    title: 'Research & Education',
    icon: BookOpen,
    headline: 'Evidenced Advocacy & Policy Reform Initiatives',
    description:
      'Our legal research division documents human rights conditions, publishes analytical policy briefs, monitors custodial conduct, and submits evidence-backed representations to statutory commissions and judicial bodies.',
    initiatives: [
      'Annual National Human Rights Status Reports',
      'Public Interest Litigation (PIL) drafting and legal research',
      'Publications on educational access for underprivileged children',
      'Legal research clinics in partnership with law universities',
    ],
    stat: '85+ Research Papers & PILs',
  },
  {
    id: 'community-activities',
    title: 'Community Activities & Relief',
    icon: Handshake,
    headline: 'Grassroots Aid & Direct Human Support',
    description:
      'Beyond legal literacy, HRSJM maintains emergency relief cells providing free legal counsel, grievance mediation, educational scholarship drives, medical aid camps, and humanitarian assistance to disaster-struck families.',
    initiatives: [
      'Free Weekly Legal Aid Clinics in tier-2 and tier-3 cities',
      'Emergency legal intervention in arbitrary detention cases',
      'Women self-help group legal counseling and livelihood support',
      'Educational kit distributions for slum and rural students',
    ],
    stat: '2,00,000+ Citizens Assisted',
  },
];

export const UserWhatWeDoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E9B82E]/20 border border-[#E9B82E]/40 text-[#FAD465] text-xs font-bold uppercase tracking-wider">
            Our Core Initiatives
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            What HRSJM Does
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            From grassroots awareness to high-court constitutional advocacy, explore how our multidisciplinary mission delivers real, tangible impact for justice and human dignity across India.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="space-y-6">
        {WHAT_WE_DO_DETAILS.map((item, index) => {
          const Icon = item.icon;
          const isEven = index % 2 === 1;

          return (
            <div
              key={item.id}
              className={`p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-6 sm:gap-8 items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#06294D] flex items-center justify-center shrink-0">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                      Program Pillar 0{index + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#06294D]">{item.title}</h2>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-800">{item.headline}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>

                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-[#06294D] uppercase tracking-wider block">
                    Key Action Areas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.initiatives.map((init, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{init}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stat Highlight Card */}
              <div className="w-full md:w-64 p-5 rounded-2xl bg-[#FAF7F0] border border-amber-200/60 flex flex-col justify-between shrink-0">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Verified Benchmark
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#06294D]">{item.stat}</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Documented nationwide across Maharashtra, Delhi NCR, Uttar Pradesh, and regional state chapters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#06294D] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Upcoming Programs</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-[#06294D]">Have a human rights grievance or seeking legal aid?</h4>
          <p className="text-xs text-slate-500">Submit a free complaint to our legal cell or reach out to our advisory desk.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/support')}
            className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#06294D] hover:bg-[#083563] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Scale size={14} />
            <span>File a Complaint</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/donations')}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#011F39] bg-[#E9B82E] hover:bg-[#d8a825] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Heart size={14} />
            <span>Support Our Work</span>
          </button>
        </div>
      </div>
    </div>
  );
};

