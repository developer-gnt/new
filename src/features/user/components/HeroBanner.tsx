import type React from 'react';
import { useState, useEffect } from 'react';
import type { HeroSlide } from '../types/userHome.types';

interface HeroBannerProps {
  slides: HeroSlide[];
  onCtaPress?: (slide: HeroSlide) => void;
  showCta?: boolean;
}

const AUTOPLAY_INTERVAL_MS = 4500;

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides,
  onCtaPress,
  showCta = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  // Auto-scrolling carousel
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slideCount]);

  if (!slides || slides.length === 0) return null;
  const currentSlide = slides[activeIndex];
  const scriptLines = currentSlide.scriptLines || ['People.', 'Rights.', 'Justice.', 'Change.'];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-[#011F39] text-[#CBD4DD] select-none transition-all duration-300 min-h-[300px] md:min-h-[370px] shadow-md"
      role="region"
      aria-label="Hero Carousel"
    >
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentSlide.image}
          alt={currentSlide.headlineLines.join(' ')}
          className="w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#011F39]/95 via-[#011F39]/80 to-[#011F39]/40" />
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between min-h-[300px] md:min-h-[370px]">
        <div className="max-w-xl">
          {currentSlide.eyebrow && (
            <span className="inline-block px-2.5 py-1 mb-3 text-[11px] font-bold tracking-wider text-[#FAD465] uppercase bg-[#06294D]/60 rounded">
              {currentSlide.eyebrow}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.2] mb-3">
            {currentSlide.headlineLines.map((line, idx) => (
              <span key={idx} className="block text-[#CBD4DD]">
                {line}
              </span>
            ))}
            <span className="text-[#FAD465] block mt-0.5">{currentSlide.goldLine}</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#CBD4DD] opacity-90 leading-relaxed mb-6 max-w-lg">
            {currentSlide.supporting}
          </p>

          {showCta && (
            <div>
              <button
                type="button"
                onClick={() => onCtaPress?.(currentSlide)}
                className="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#011F39] bg-[#FAD465] hover:bg-[#F59E0B] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Join the Movement
              </button>
            </div>
          )}
        </div>

        {/* Decorative Script Lines (as in APK) */}
        <div className="hidden lg:flex flex-col items-end opacity-25 text-right font-serif text-3xl font-bold tracking-widest text-[#CBD4DD] pointer-events-none pr-4">
          {scriptLines.map((line, idx) => (
            <span key={idx} className="leading-tight">
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {slideCount > 1 && (
        <div
          className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2"
          role="tablist"
          aria-label="Slide Dots"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-[#FAD465]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-selected={idx === activeIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
};
