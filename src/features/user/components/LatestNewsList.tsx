import React from 'react';
import type { HomeNewsItem } from '../types/userHome.types';
import { SectionHeader } from './SectionHeader';
import { ArrowRight } from 'lucide-react';

interface LatestNewsListProps {
  news: HomeNewsItem[];
  onViewAll?: () => void;
  onNewsClick?: (item: HomeNewsItem) => void;
}

export const LatestNewsList: React.FC<LatestNewsListProps> = ({
  news,
  onViewAll,
  onNewsClick,
}) => {
  return (
    <div className="w-full">
      <SectionHeader title="Latest News" linkLabel="View All" onLinkPress={onViewAll} />

      <div className="flex flex-col gap-2.5">
        {news.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNewsClick?.(item)}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left group cursor-pointer"
            aria-label={`${item.category}: ${item.title}`}
          >
            {/* Square Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
              <img
                src={item.imageUrl || '/assets/images/contact-hero-building.jpg'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 block mb-0.5">
                {item.category}
              </span>
              <h3 className="text-[13px] sm:text-[14px] font-bold text-[#06294D] line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
                {item.title}
              </h3>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                {item.date}
              </span>
            </div>

            {/* Right Arrow Button */}
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#06294D] flex items-center justify-center shrink-0 transition-colors ml-1">
              <ArrowRight size={13} className="text-slate-500 group-hover:text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

