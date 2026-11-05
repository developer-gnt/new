import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  linkLabel?: string;
  onLinkPress?: () => void;
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  eyebrow,
  linkLabel,
  onLinkPress,
  light = false,
}) => {
  return (
    <div className="flex items-end justify-between mb-3 w-full">
      <div className="flex-1">
        {eyebrow && (
          <div
            className={`text-[10px] font-bold tracking-[1.3px] uppercase mb-1 ${
              light ? 'text-[#FAD465]' : 'text-[#C9971A]'
            }`}
          >
            {eyebrow}
          </div>
        )}
        <h2
          className={`text-[20px] md:text-[22px] leading-[26px] font-bold tracking-tight ${
            light ? 'text-white' : 'text-[#06294D]'
          }`}
        >
          {title}
        </h2>
      </div>

      {linkLabel && (
        <button
          type="button"
          onClick={onLinkPress}
          className={`inline-flex items-center gap-1 text-[13px] font-bold transition-opacity hover:opacity-80 ml-2 cursor-pointer ${
            light ? 'text-[#FAD465]' : 'text-[#06294D]'
          }`}
          aria-label={`${linkLabel} — ${title}`}
        >
          <span>{linkLabel}</span>
          <ArrowRight size={14} className={light ? 'text-[#FAD465]' : 'text-[#06294D]'} />
        </button>
      )}
    </div>
  );
};

