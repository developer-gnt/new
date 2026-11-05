import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../store/userAuthStore';
import { userHomeService } from '../services/userHomeService';
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_ABOUT_VIDEO,
  GUEST_QUICK_ACTIONS,
  RIGHTS_CATEGORIES,
  WHAT_WE_DO_ITEMS,
  UPCOMING_EVENTS,
  LATEST_NEWS,
  DEFAULT_HOME_BLOGS,
} from '../data/userDashboardData';
import type {
  AboutVideoData,
  HeroSlide,
  HomeBlogItem,
  HomeEvent,
  HomeNewsItem,
  ImpactStats,
} from '../types/userHome.types';

import { HeroBanner } from '../components/HeroBanner';
import { QuickActionsRow } from '../components/QuickActionsRow';
import { AboutSection } from '../components/AboutSection';
import { AboutVideoModal } from '../components/AboutVideoModal';
import { SectionHeader } from '../components/SectionHeader';
import { CategoryIconRow } from '../components/CategoryIconRow';
import { ImpactSection } from '../components/ImpactSection';
import { UpcomingEventsCarousel } from '../components/UpcomingEventsCarousel';
import { LatestNewsList } from '../components/LatestNewsList';
import { ArticlesCarousel } from '../components/ArticlesCarousel';
import { DonationBanner } from '../components/DonationBanner';
import { SeekerStatusModal } from '../components/SeekerStatusModal';

import {
  ClipboardList,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, getMatchedSeekerApplication, updateAssistanceStatus } = useUserAuth();

  // Dynamic Content States - initialized with APK source of truth defaults
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [aboutVideo, setAboutVideo] = useState<AboutVideoData>(DEFAULT_ABOUT_VIDEO);
  const [upcomingEvents, setUpcomingEvents] = useState<HomeEvent[]>(UPCOMING_EVENTS);
  const [latestNews, setLatestNews] = useState<HomeNewsItem[]>(LATEST_NEWS);
  const [blogs, setBlogs] = useState<HomeBlogItem[]>(DEFAULT_HOME_BLOGS);
  const [impactStats] = useState<ImpactStats>(userHomeService.getImpactStats());

  // Modal States
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [seekerModalOpen, setSeekerModalOpen] = useState(false);

  // Status checks matching APK
  const hasPendingMemberApp =
    user?.membership_status === 'PENDING' ||
    user?.membership_status === 'UNDER_REVIEW' ||
    (user?.account_type === 'member' && user?.membership_status !== 'ACTIVE' && user?.membership_status !== 'APPROVED');

  const matchedSeeker = useMemo(() => getMatchedSeekerApplication(), [getMatchedSeekerApplication]);

  const hasSeekerApp = Boolean(
    matchedSeeker ||
    user?.assistance_application_number ||
    user?.account_type === 'seeker' ||
    user?.assistance_status === 'PENDING' ||
    user?.assistance_status === 'UNDER_REVIEW' ||
    user?.assistance_status === 'APPROVED' ||
    user?.assistance_status === 'REJECTED'
  );

  const seekerStatus: 'active' | 'blocked' | 'pending' =
    matchedSeeker?.status ||
    (user?.assistance_status === 'APPROVED'
      ? 'active'
      : user?.assistance_status === 'REJECTED'
      ? 'blocked'
      : 'pending');

  const isSeekerApproved = seekerStatus === 'active';
  const isSeekerRejected = seekerStatus === 'blocked';

  // Load dynamic data on mount
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [events, news, blogList, video, slides] = await Promise.all([
          userHomeService.fetchUpcomingEvents(),
          userHomeService.fetchLatestNews(),
          userHomeService.fetchPublishedBlogs(),
          userHomeService.fetchAboutVideo(),
          userHomeService.fetchHeroSlides(),
        ]);
        if (isMounted) {
          if (events && events.length > 0) setUpcomingEvents(events);
          if (news && news.length > 0) setLatestNews(news);
          if (blogList && blogList.length > 0) setBlogs(blogList);
          if (video) setAboutVideo(video);
          if (slides && slides.length > 0) setHeroSlides(slides);
        }
      } catch (err) {
        console.warn('Error loading dashboard dynamic data:', err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroCta = (slide: HeroSlide) => {
    const action = slide?.ctaAction || 'join';
    switch (action) {
      case 'donate':
        navigate('/donations');
        break;
      case 'membership':
      case 'join':
        navigate('/user/membership');
        break;
      case 'rights':
        navigate('/rights');
        break;
      case 'events':
        navigate('/events');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'help':
        navigate('/support');
        break;
      default:
        navigate('/user/membership');
        break;
    }
  };

  const handleQuickAction = (action: any) => {
    switch (action.id) {
      case 'join':
      case 'renew':
      case 'membership':
        navigate('/user/membership');
        break;
      case 'complaint':
        navigate('/support');
        break;
      case 'donate':
        navigate('/donations');
        break;
      default:
        break;
    }
  };

  const handleReapplySeeker = () => {
    updateAssistanceStatus('PENDING');
    setSeekerModalOpen(false);
    alert('Application re-submitted for admin verification.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pt-3 md:pt-4">
      {/* 1. Pending Membership Application Alert Banner */}
      {hasPendingMemberApp && (
        <div
          onClick={() => navigate('/user/membership?tab=status')}
          className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFFDF5] border-[1.5px] border-[#F59E0B] shadow-xs hover:shadow-md transition-all cursor-pointer"
          role="alert"
        >
          <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 text-[#0D47A1]">
            <ClipboardList size={20} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-[#92400E]">
                Membership Application Under Review
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-extrabold uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Pending
              </span>
            </div>
            <p className="text-xs text-[#78350F] leading-relaxed">
              Your membership application is currently being verified by the administration. You can view your live application status anytime. Official credentials and member voting privileges will activate upon approval.
            </p>
          </div>
        </div>
      )}

      {/* 2. Donation Seeker Application Status Alert Banner */}
      {hasSeekerApp && (
        <div
          className={`flex items-start gap-3.5 p-4 rounded-2xl border-[1.5px] shadow-xs transition-all ${
            isSeekerApproved
              ? 'bg-[#F0FDF4] border-[#22C55E]'
              : isSeekerRejected
              ? 'bg-[#FEF2F2] border-[#EF4444]'
              : 'bg-[#FFFDF5] border-[#F59E0B]'
          }`}
          role="alert"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isSeekerApproved
                ? 'bg-[#DCFCE7] text-[#15803D]'
                : isSeekerRejected
                ? 'bg-[#FEE2E2] text-[#DC2626]'
                : 'bg-[#FEF3C7] text-[#0D47A1]'
            }`}
          >
            {isSeekerApproved ? (
              <CheckCircle2 size={20} strokeWidth={2} />
            ) : isSeekerRejected ? (
              <AlertCircle size={20} strokeWidth={2} />
            ) : (
              <HeartHandshake size={20} strokeWidth={2} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <h3
                className={`text-sm font-bold ${
                  isSeekerApproved
                    ? 'text-[#166534]'
                    : isSeekerRejected
                    ? 'text-[#991B1B]'
                    : 'text-[#92400E]'
                }`}
              >
                {isSeekerApproved
                  ? 'Donation Seeker Approved!'
                  : isSeekerRejected
                  ? 'Donation Seeker Application Rejected'
                  : 'Donation Seeker Application Under Review'}
              </h3>

              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-extrabold uppercase border ${
                  isSeekerApproved
                    ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                    : isSeekerRejected
                    ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                    : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                }`}
              >
                {isSeekerApproved
                  ? 'Approved'
                  : isSeekerRejected
                  ? 'Action Needed'
                  : 'Under Review'}
              </span>
            </div>

            <p
              className={`text-xs leading-relaxed ${
                isSeekerApproved
                  ? 'text-[#166534]'
                  : isSeekerRejected
                  ? 'text-[#991B1B]'
                  : 'text-[#78350F]'
              }`}
            >
              {isSeekerApproved
                ? 'Your application has been approved by admin. Your role has been updated to Donation Seeker.'
                : isSeekerRejected
                ? `Application ${matchedSeeker?.applicationNumber || user?.assistance_application_number || ''} was rejected. ${matchedSeeker?.remarks ? `Reason: ${matchedSeeker.remarks}` : 'You can review reason and re-apply.'}`
                : `Application ${matchedSeeker?.applicationNumber || user?.assistance_application_number || 'HRSJM-SEK-2026-0042'} is being reviewed by admin. You are currently browsing as a User.`}
            </p>

            <div className="flex items-center gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setSeekerModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F172A] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                See My Application ↗
              </button>

              {isSeekerRejected && (
                <button
                  type="button"
                  onClick={handleReapplySeeker}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Re-apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Hero Carousel Banner */}
      <HeroBanner slides={heroSlides} onCtaPress={handleHeroCta} />

      {/* 4. Quick Actions Grid (4-Across) */}
      <QuickActionsRow actions={GUEST_QUICK_ACTIONS} onPressAction={handleQuickAction} />

      {/* 5. About HRSJM Section */}
      <AboutSection
        title={aboutVideo.title ? 'About HRSJM' : undefined}
        description={aboutVideo.summaryText}
        duration={aboutVideo.duration}
        thumbnailUrl={aboutVideo.thumbnailUrl}
        onMorePress={() => navigate('/about')}
        onMediaPress={() => setVideoModalOpen(true)}
      />

      {/* 6. Know Your Rights Section */}
      <div>
        <SectionHeader
          title="Know Your Rights"
          linkLabel="View All"
          onLinkPress={() => navigate('/rights')}
        />
        <CategoryIconRow
          items={RIGHTS_CATEGORIES}
          onPressItem={() => navigate('/rights')}
        />
      </div>

      {/* 7. What HRSJM Does Section */}
      <div>
        <SectionHeader
          title="What HRSJM Does"
          linkLabel="View All"
          onLinkPress={() => navigate('/about')}
        />
        <CategoryIconRow
          items={WHAT_WE_DO_ITEMS}
          onPressItem={() => navigate('/about')}
        />
      </div>

      {/* 8. Our Impact Executive Metric Card */}
      <ImpactSection stats={impactStats} onDetailsPress={() => navigate('/about')} />

      {/* 9. Upcoming Events Section */}
      <UpcomingEventsCarousel
        events={upcomingEvents}
        onViewAll={() => navigate('/events')}
        onEventClick={() => navigate('/events')}
      />

      {/* 10. Latest News Section */}
      <LatestNewsList
        news={latestNews}
        onViewAll={() => navigate('/news')}
        onNewsClick={() => navigate('/news')}
      />

      {/* 11. Articles and Blogs Section */}
      <ArticlesCarousel
        blogs={blogs}
        onViewAll={() => navigate('/blogs')}
        onBlogClick={() => navigate('/blogs')}
      />

      {/* 12. Full-Width Community Donation Banner */}
      <DonationBanner onPress={() => navigate('/donations')} />

      {/* Interactive Modal Popups */}
      <AboutVideoModal
        visible={videoModalOpen}
        video={aboutVideo}
        onClose={() => setVideoModalOpen(false)}
        onOpenAbout={() => {
          setVideoModalOpen(false);
          navigate('/about');
        }}
        onOpenDonate={() => {
          setVideoModalOpen(false);
          navigate('/donations');
        }}
      />

      <SeekerStatusModal
        visible={seekerModalOpen}
        applicationNumber={matchedSeeker?.applicationNumber || user?.assistance_application_number || 'HRSJM-SEK-2026-0042'}
        status={seekerStatus}
        remarks={matchedSeeker?.remarks}
        onClose={() => setSeekerModalOpen(false)}
        onReapply={handleReapplySeeker}
        onApplyMembership={() => {
          setSeekerModalOpen(false);
          navigate('/user/membership');
        }}
      />
    </div>
  );
};
