import React from 'react';
import type { HomeBlogItem } from '../types/userHome.types';
import { SectionHeader } from './SectionHeader';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface ArticlesCarouselProps {
  blogs: HomeBlogItem[];
  onViewAll?: () => void;
  onBlogClick?: (item: HomeBlogItem) => void;
}

export const ArticlesCarousel: React.FC<ArticlesCarouselProps> = ({
  blogs,
  onViewAll,
  onBlogClick,
}) => {
  return (
    <div className="w-full">
      <SectionHeader title="Articles and Blogs" linkLabel="View All" onLinkPress={onViewAll} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {blogs.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onBlogClick?.(item)}
            className="flex flex-col text-left rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer"
            aria-label={`Article: ${item.title}`}
          >
            {/* Thumbnail with Category Tag */}
            <div className="relative w-full h-36 bg-slate-900 overflow-hidden">
              <img
                src={item.thumbnailUrl || '/assets/images/article-rights-book.jpg'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#06294D]/90 backdrop-blur-xs text-white text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {item.category}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-[13.5px] font-bold text-[#06294D] line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {item.excerpt}
                </p>
              </div>

              {/* Meta Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} className="text-slate-400" />
                    <span>{item.date}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <User size={11} className="text-slate-400" />
                    <span className="truncate">{item.author}</span>
                  </span>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-[#06294D] flex items-center justify-center transition-colors">
                  <ArrowRight size={12} className="text-slate-500 group-hover:text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

