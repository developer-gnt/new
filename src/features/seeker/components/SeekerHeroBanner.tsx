import React, { useState, useEffect } from 'react';

export interface HeroSlideItem {
  id: string;
  headlineLines: string[];
  goldLine: string;
  supporting: string;
  image: string;
  scriptLines: string[];
  eyebrow?: string;
}

const OFFICIAL_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'mission-human-rights',
    eyebrow: 'HUMANITARIAN RELIEF MISSION',
    headlineLines: ['For Human Rights,', 'Dignity and a'],
    goldLine: 'More Just Society.',
    supporting: 'HRSJM provides direct financial, medical, education, and welfare assistance for approved causes across India.',
    image: '/assets/images/hero-home.webp',
    scriptLines: ['People.', 'Rights.', 'Justice.', 'Change.'],
  },
  {
    id: 'stand-for-dignity',
    eyebrow: 'EMERGENCY MEDICAL & WELFARE AID',
    headlineLines: ['Stand for Rights.', 'Stand for'],
    goldLine: 'Human Dignity.',
    supporting: 'Rapid document verification and compassionate support for hospital bills, critical treatments, and emergency relief.',
    image: '/assets/images/member-hero-rally.jpg',
    scriptLines: ['Empower.', 'Unite.', 'Protect.', 'Lead.'],
  },
  {
    id: 'grassroots-aid',
    eyebrow: 'DIRECT SOCIAL IMPACT',
    headlineLines: ['Awareness.', 'Action.'],
    goldLine: 'Real Impact.',
    supporting: 'Protecting fundamental human rights and delivering immediate relief to individuals and families in distress.',
    image: '/assets/images/contact-cta-hands.jpg',
    scriptLines: ['Hope.', 'Action.', 'Relief.', 'Care.'],
  },
  {
    id: 'legal-awareness',
    eyebrow: 'LEGAL EMPOWERMENT & CITIZEN AID',
    headlineLines: ['Know Your Law.', 'Claim Your'],
    goldLine: 'Fundamental Rights.',
    supporting: 'Free legal consultations, domestic violence safeguards, and constitutional aid clinics backed by panel advocates.',
    image: '/assets/images/event-legal-awareness.jpg',
    scriptLines: ['Justice.', 'Equality.', 'Truth.', 'Voice.'],
  },
  {
    id: 'community-workshops',
    eyebrow: 'NATIONWIDE WELFARE REACH',
    headlineLines: ['United for Peace.', 'Driven by'],
    goldLine: 'Social Justice.',
    supporting: 'Join nationwide relief camps, free health clinics, human rights conventions, and community outreach drives.',
    image: '/assets/images/about-hero-community.png',
    scriptLines: ['Engage.', 'Inspire.', 'Transform.', 'Serve.'],
  },
];

interface SeekerHeroBannerProps {
  showCta?: boolean;
}

/**
 * Exact replication of HeroBanner.tsx from the HRSJM React Native APK:
 * - Real photographic backgrounds
 * - Dark overlay: rgba(3, 27, 49, 0.58)
 * - Playfair Display headline with golden emphasis
 * - Right-side decorative cursive quote in Caveat
 * - Interactive pagination dots in bottom-left
 * - showCta={false} for Donation Seeker dashboard per APK SeekerHomeScreen.tsx
 */
export const SeekerHeroBanner: React.FC<SeekerHeroBannerProps> = ({ showCta: _showCta = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % OFFICIAL_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = OFFICIAL_HERO_SLIDES[currentIdx];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#011F39] text-white min-h-[220px] sm:min-h-[260px] md:min-h-[300px] flex items-center select-none border border-[#DCE4EC]">
      {/* Real Photographic Background */}
      <img
        src={slide.image}
        alt="HRSJM Mission"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        onError={(e) => {
          // Fallback if image fails
          (e.currentTarget as HTMLImageElement).src = '/assets/images/hero-home.webp';
        }}
      />

      {/* Dark Overlay (Exact APK rgba(3, 27, 49, 0.58)) */}
      <div className="absolute inset-0 bg-[#031B31]/60" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-5 py-6 sm:px-8 sm:py-8 md:px-10 flex flex-col justify-between h-full min-h-[220px] sm:min-h-[260px] md:min-h-[300px]">
        <div className="max-w-[75%] sm:max-w-[65%] md:max-w-[60%]">
          {slide.eyebrow && (
            <div className="text-[10px] font-bold text-[#FAD465] tracking-widest uppercase mb-1.5 font-['Inter',sans-serif]">
              {slide.eyebrow}
            </div>
          )}

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Playfair_Display',Georgia,serif] leading-tight text-white tracking-tight">
            {slide.headlineLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
            <span className="text-[#FAD465] font-['Playfair_Display',Georgia,serif] font-bold">
              {slide.goldLine}
            </span>
          </h2>

          <p className="text-xs sm:text-[13px] text-white/95 mt-2.5 leading-relaxed font-['Inter',sans-serif] line-clamp-3">
            {slide.supporting}
          </p>
        </div>

        {/* Right-Side Decorative Quote Script (Exact APK Cursive Treatment) */}
        <div className="hidden sm:block absolute right-4 sm:right-6 md:right-8 bottom-5 text-right pointer-events-none select-none">
          <div className="font-['Caveat',cursive] italic text-xl sm:text-2xl md:text-3xl text-white/90 leading-tight">
            {slide.scriptLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        {/* Interactive Pagination Dots (Bottom-Left per APK HeroBanner) */}
        <div className="flex items-center gap-2 mt-4 pt-2">
          {OFFICIAL_HERO_SLIDES.map((s, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-[#FAD465] opacity-100 ring-2 ring-[#FAD465]/40'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
