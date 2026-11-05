import React from 'react';
import { DONATION_CONTENT } from '../data/userDashboardData';
import { Heart } from 'lucide-react';

interface DonationBannerProps {
  onPress?: () => void;
}

export const DonationBanner: React.FC<DonationBannerProps> = ({ onPress }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-[#06294D] text-white">
      {/* Background Image with Dark Gradient Overlay */}
      <img
        src="/assets/images/contact-cta-hands.jpg"
        alt="Support HRSJM"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#011F39]/95 via-[#011F39]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-xl p-6 sm:p-8">
        <h3
          style={{ color: '#FFFFFF' }}
          className="text-lg sm:text-2xl font-extrabold tracking-tight leading-snug mb-2 whitespace-pre-line text-white !text-white"
        >
          {DONATION_CONTENT.headline}
        </h3>
        <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed mb-5 max-w-md">
          {DONATION_CONTENT.description}
        </p>

        <button
          type="button"
          onClick={onPress}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#011F39] bg-[#FAD465] hover:bg-[#F59E0B] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Heart size={16} className="fill-[#011F39]" />
          <span>{DONATION_CONTENT.ctaLabel}</span>
        </button>
      </div>
    </div>
  );
};

