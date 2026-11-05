import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: string;
  badge: string;
  title1: string;
  goldTitle: string;
  title2: string;
  desc: string;
  ctaText?: string;
  ctaLink?: string;
}

const SLIDES: Slide[] = [
  {
    id: 'slide-1',
    badge: 'HUMANITARIAN RELIEF MISSION',
    title1: 'For Human Rights, Dignity and a',
    goldTitle: 'More Just',
    title2: 'Society.',
    desc: 'HRSJM provides direct financial, medical, education, and welfare assistance for approved emergency causes across India.',
    ctaText: '+ Apply for Assistance',
    ctaLink: '/seeker/apply',
  },
  {
    id: 'slide-2',
    badge: 'EMERGENCY MEDICAL & WELFARE AID',
    title1: 'Real Impact.',
    goldTitle: 'Immediate Relief.',
    title2: 'Full Transparency.',
    desc: 'Rapid document assessment and compassionate support for hospital bills, critical treatments, and child education expenses.',
    ctaText: 'Track Your Application',
    ctaLink: '/seeker/requests',
  },
  {
    id: 'slide-3',
    badge: 'LEGAL EMPOWERMENT & CITIZEN AID',
    title1: 'Know Your Rights & Claim Your',
    goldTitle: 'Fundamental Freedoms',
    title2: '',
    desc: 'Free legal consultations, domestic violence safeguards, and constitutional aid clinics backed by panel advocates.',
    ctaText: 'Explore Legal Rights',
    ctaLink: '/seeker/rights',
  },
];

export const SeekerHeroBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[currentIdx];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#DCE4EC] bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#123F68] text-white">
      {/* Decorative Golden Pattern / Shimmer Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAD465_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col justify-between min-h-[220px] md:min-h-[260px]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[#FAD465] text-[11px] font-bold tracking-wider uppercase mb-3">
            <HeartHandshake size={13} />
            <span>{slide.badge}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold font-['Playfair_Display',Georgia,serif] leading-tight text-white max-w-2xl">
            {slide.title1} <span className="text-[#FAD465]">{slide.goldTitle}</span> {slide.title2}
          </h2>

          <p className="text-xs md:text-sm text-blue-100/90 mt-2.5 max-w-xl leading-relaxed">
            {slide.desc}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {slide.ctaText && slide.ctaLink && (
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight size={14} />
            </Link>
          )}

          {/* Dots Indicator & Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={prevSlide}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1.5 px-1">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIdx ? 'w-5 bg-[#FAD465]' : 'w-1.5 bg-white/30'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

