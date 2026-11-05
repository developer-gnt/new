import React from 'react';
import { SectionHeader } from './SectionHeader';
import { Play } from 'lucide-react';

export interface AboutSectionProps {
  title?: string;
  description?: string;
  duration?: string;
  thumbnailUrl?: string;
  onMorePress?: () => void;
  onMediaPress?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title = 'About HRSJM',
  description = 'Human Rights and Social Justice Mission (HRSJM) works for human rights, dignity, equality and social justice through awareness, advocacy, education and community support.',
  duration = '3:45',
  thumbnailUrl = '/assets/images/about-hero-rally.jpg',
  onMorePress,
  onMediaPress,
}) => {
  return (
    <div className="w-full">
      <SectionHeader title={title} linkLabel="View More" onLinkPress={onMorePress} />

      <div className="flex flex-row items-center gap-3 sm:gap-5 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="flex-1 min-w-0 text-slate-600 text-xs sm:text-[14px] leading-relaxed">
          {description}
        </p>

        {/* Video Thumbnail Button */}
        <button
          type="button"
          onClick={onMediaPress}
          className="relative group shrink-0 w-[105px] sm:w-[150px] md:w-[170px] h-[76px] sm:h-[110px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer bg-slate-900"
          aria-label="Play HRSJM Introduction Video"
        >
          <img
            src={thumbnailUrl}
            alt="About HRSJM Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

          {/* Center Play Button Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md text-[#06294D] group-hover:scale-110 transition-transform">
              <Play size={16} className="fill-[#06294D] ml-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white tracking-wider backdrop-blur-xs">
              {duration}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

