import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Scale,
  MessageSquare,
  Phone,
  ArrowRight,
  PlusCircle,
  Video,
  X,
} from 'lucide-react';
import { SeekerHeroBanner } from '../components/SeekerHeroBanner';
import { SeekerTimelineStepper } from '../components/SeekerTimelineStepper';
import { useSeekerStore } from '../store/seekerStore';
import {
  IMPACT_STATS,
  RIGHTS_ARTICLES,
  SEEKER_EVENTS,
  SEEKER_NEWS,
} from '../data/seekerData';

export const SeekerHomePage: React.FC = () => {
  const { requests = [] } = useSeekerStore();
  const safeRequests = Array.isArray(requests) ? requests : [];

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Active aid request logic (matching SeekerHomeScreen.tsx)
  const activeAidRequest = safeRequests.find((r) => Number(r?.requested_amount) > 0);
  const latestRequest = activeAidRequest || (safeRequests.length > 0 ? safeRequests[0] : null);
  const isActualAid = Boolean(latestRequest && Number(latestRequest?.requested_amount) > 0);

  const formattedId = latestRequest?.id
    ? String(latestRequest.id).replace(/^asst-/i, '').slice(0, 8).toUpperCase()
    : '8241901A';

  let formattedDate = 'Recent';
  if (latestRequest?.created_at) {
    try {
      const d = new Date(latestRequest.created_at);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      // Fallback
    }
  }

  const openWhatsAppHelpline = () => {
    const phone = '919888880004';
    const text = encodeURIComponent('Hello HRSJM, I need emergency social & legal assistance.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Hero Banner Carousel */}
      <SeekerHeroBanner />

      {/* Active Aid Request Status Card OR Apply CTA Card (Exact APK Parity) */}
      <section>
        {latestRequest ? (
          <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#DBE5EE]">
              <div>
                <span className="text-[10px] font-extrabold text-[#06294D] uppercase tracking-wider block mb-1">
                  {isActualAid ? 'ACTIVE ASSISTANCE REQUEST' : 'ACCOUNT VERIFICATION'}
                </span>
                <h3 className="text-lg md:text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
                  {latestRequest.reason || 'Humanitarian Assistance Request'}
                </h3>
                <div className="text-xs text-[#718096] mt-1">
                  ASST-{formattedId} • Submitted on {formattedDate}
                </div>
              </div>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border self-start ${getStatusBadgeClass(
                  latestRequest.status
                )}`}
              >
                {(latestRequest.status || 'PENDING').replace(/_/g, ' ')}
              </span>
            </div>

            {/* Requested Aid Amount Bar (only for requests with amount > 0) */}
            {isActualAid && (
              <div className="my-4 px-4 py-3 rounded-xl bg-[#EDF2F7] border-l-4 border-[#FAD465] flex items-center justify-between">
                <span className="text-xs text-[#34516D] font-medium">Requested Aid Amount:</span>
                <span className="text-lg font-extrabold text-[#0B2F52]">
                  ₹{Number(latestRequest.requested_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Visual 4-Step Timeline Stepper */}
            <div className="pt-2 pb-3">
              <SeekerTimelineStepper status={latestRequest.status || 'UNDER_REVIEW'} />
            </div>

            <div className="pt-3 border-t border-[#DBE5EE] flex justify-between items-center text-xs">
              <span className="text-[#718096] hidden sm:inline">
                {latestRequest.admin_remark || 'Assessment in progress by HRSJM field team.'}
              </span>
              <Link
                to={`/seeker/requests`}
                className="text-[#06294D] font-bold hover:underline inline-flex items-center gap-1 ml-auto"
              >
                <span>View Full Status & Documents History</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#EDF2F7] rounded-2xl border border-[#DBE5EE] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#06294D] uppercase tracking-wider block mb-1">
                HUMANITARIAN ASSISTANCE
              </span>
              <h3 className="text-lg font-bold text-[#0B2F52]">
                Need Emergency Medical, Education, or Legal Relief?
              </h3>
              <p className="text-xs text-[#34516D] mt-1 max-w-xl leading-relaxed">
                HRSJM provides direct financial, legal, and welfare assistance for approved causes. Submit your request for rapid verification.
              </p>
            </div>
            <Link
              to="/seeker/apply"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition self-start md:self-auto shrink-0"
            >
              <PlusCircle size={15} />
              <span>+ Apply for Assistance</span>
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions Grid (Exact APK Parity) */}
      <section>
        <h2 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link
            to="/seeker/apply"
            className="p-4 rounded-xl bg-white border border-[#DCE4EC] hover:border-[#FAD465] hover:shadow-md transition group flex flex-col items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] text-[#C9971A] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-[#0B2F52]">Apply for Aid</span>
            <span className="text-[11px] text-[#718096] mt-0.5">Submit new application</span>
          </Link>

          <Link
            to="/seeker/requests"
            className="p-4 rounded-xl bg-white border border-[#DCE4EC] hover:border-[#FAD465] hover:shadow-md transition group flex flex-col items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-[#0B2F52]">Track Aid Status</span>
            <span className="text-[11px] text-[#718096] mt-0.5">Check timeline & review</span>
          </Link>

          <Link
            to="/seeker/rights"
            className="p-4 rounded-xl bg-white border border-[#DCE4EC] hover:border-[#FAD465] hover:shadow-md transition group flex flex-col items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#174A78] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Scale size={20} />
            </div>
            <span className="text-xs font-bold text-[#0B2F52]">Know Your Rights</span>
            <span className="text-[11px] text-[#718096] mt-0.5">Legal guidance & laws</span>
          </Link>

          <Link
            to="/seeker/support/create"
            className="p-4 rounded-xl bg-white border border-[#DCE4EC] hover:border-[#FAD465] hover:shadow-md transition group flex flex-col items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] text-[#0D9488] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <MessageSquare size={20} />
            </div>
            <span className="text-xs font-bold text-[#0B2F52]">File Grievance</span>
            <span className="text-[11px] text-[#718096] mt-0.5">Citizen complaint desk</span>
          </Link>
        </div>
      </section>

      {/* 24x7 Emergency Social & Legal Helpline Banner (Exact APK Parity) */}
      <section>
        <div
          onClick={openWhatsAppHelpline}
          className="rounded-2xl bg-[#FFF9E6] border border-[#FAD465] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
                24x7 Emergency Social & Legal Helpline
              </div>
              <div className="text-base sm:text-lg font-extrabold text-[#06294D] mt-0.5">
                +91 98888 80004 / 1800-HRSJM-AID
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openWhatsAppHelpline();
            }}
            className="px-4 py-2 bg-[#06294D] text-[#FAD465] font-bold text-xs rounded-xl shadow-xs hover:bg-[#123F68] transition shrink-0 cursor-pointer"
          >
            Chat on WhatsApp
          </button>
        </div>
      </section>

      {/* Know Your Rights Categories Row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
              Know Your Rights & Legal Aid
            </h2>
            <p className="text-xs text-[#718096]">Empowering citizens through constitutional and legal literacy</p>
          </div>
          <Link to="/seeker/rights" className="text-xs font-bold text-[#174A78] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RIGHTS_ARTICLES.slice(0, 4).map((art) => (
            <Link
              key={art.id}
              to={`/seeker/rights/${art.id}`}
              className="bg-white rounded-xl border border-[#DCE4EC] p-4.5 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40 mb-2">
                  {art.categoryLabel}
                </span>
                <h4 className="text-sm font-bold text-[#0B2F52] leading-snug line-clamp-2">
                  {art.title}
                </h4>
                <p className="text-xs text-[#718096] mt-2 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-[#DBE5EE] flex items-center justify-between text-[11px] text-[#174A78] font-semibold">
                <span>{art.legalReference}</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Impact Statistics Section (Exact APK Parity) */}
      <section className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#123F68] rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAD465]">
            NATIONWIDE CITIZEN SERVICE
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-white mt-1">
            Our Human Rights & Relief Impact
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Standing firmly with communities in times of legal oppression and humanitarian crisis.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl md:text-3xl font-extrabold text-[#FAD465]">
              {IMPACT_STATS.members.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs text-blue-100 mt-1 font-medium">Enrolled Members</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {IMPACT_STATS.complaintsHandled.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs text-blue-100 mt-1 font-medium">Grievances Addressed</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
              {IMPACT_STATS.casesResolved.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs text-blue-100 mt-1 font-medium">Cases Resolved</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl md:text-3xl font-extrabold text-[#FAD465]">
              {IMPACT_STATS.aidDisbursed}
            </div>
            <div className="text-xs text-blue-100 mt-1 font-medium">Humanitarian Aid Delivered</div>
          </div>
        </div>
      </section>

      {/* Upcoming Relief Camps & Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
              Upcoming Relief Camps & Events
            </h2>
            <p className="text-xs text-[#718096]">Field initiatives, free medical camps, and legal clinics</p>
          </div>
          <Link to="/seeker/events" className="text-xs font-bold text-[#174A78] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEEKER_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-[#DCE4EC] p-4.5 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#06294D] text-white flex flex-col items-center justify-center font-bold shrink-0">
                    <span className="text-sm text-[#FAD465] leading-none">{event.day}</span>
                    <span className="text-[10px] text-blue-200 uppercase leading-none mt-0.5">
                      {event.month}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDF2F7] text-[#06294D] mb-1">
                      {event.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#0B2F52] leading-snug">{event.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-[#718096] line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#DBE5EE] text-[11px] text-[#34516D] flex items-center justify-between">
                <span className="truncate">{event.location}</span>
                <Link
                  to="/seeker/events"
                  className="text-[#06294D] font-bold hover:underline shrink-0 ml-2"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories of Hope & News */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
              Stories of Hope & News
            </h2>
            <p className="text-xs text-[#718096]">Recent social impact stories and relief initiatives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEEKER_NEWS.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl border border-[#DCE4EC] p-4.5 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-[#718096] uppercase mb-2">
                  <span className="text-[#C9971A]">{news.category}</span>
                  <span>{news.date}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0B2F52] leading-snug line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-xs text-[#718096] mt-2 line-clamp-3 leading-relaxed">
                  {news.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About HRSJM Section with Video Action */}
      <section className="bg-white rounded-2xl border border-[#DCE4EC] p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-[#C9971A] uppercase tracking-wider">
            OFFICIAL MISSION & CORE OBJECTIVES
          </span>
          <h3 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
            About Human Rights and Social Justice Mission
          </h3>
          <p className="text-xs text-[#34516D] mt-2 leading-relaxed">
            Human Rights and Social Justice Mission (HRSJM) is a national registered non-governmental organization working steadfastly for human dignity, constitutional liberties, gender equality, and rapid emergency aid for the underprivileged across India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setVideoModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Video size={16} />
          <span>Watch Mission Overview Video</span>
        </button>
      </section>

      {/* Mission Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 text-[#06294D] mb-3">
              <Video size={20} />
              <h3 className="font-bold text-base text-[#0B2F52]">HRSJM Mission & Work</h3>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center text-white text-xs">
              <iframe
                title="HRSJM Overview"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#06294D] text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

