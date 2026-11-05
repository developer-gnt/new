import React from 'react';
import type { HomeEvent } from '../types/userHome.types';
import { SectionHeader } from './SectionHeader';
import { MapPin, ArrowRight } from 'lucide-react';

interface UpcomingEventsCarouselProps {
  events: HomeEvent[];
  onViewAll?: () => void;
  onEventClick?: (event: HomeEvent) => void;
}

export const UpcomingEventsCarousel: React.FC<UpcomingEventsCarouselProps> = ({
  events,
  onViewAll,
  onEventClick,
}) => {
  return (
    <div className="w-full">
      <SectionHeader title="Upcoming Events" linkLabel="View All" onLinkPress={onViewAll} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {events.map(event => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventClick?.(event)}
            className="flex flex-col text-left rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer"
            aria-label={`Event: ${event.title}`}
          >
            {/* Image Banner with Date Badge */}
            <div className="relative w-full h-36 bg-slate-900 overflow-hidden">
              <img
                src={event.imageUrl || '/assets/images/event-legal-awareness.jpg'}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <div className="absolute top-2.5 left-2.5 bg-white/95 rounded-lg px-2.5 py-1 text-center shadow-md">
                <span className="block text-sm font-extrabold text-[#06294D] leading-none">
                  {event.day}
                </span>
                <span className="block text-[9px] font-bold text-amber-600 uppercase tracking-wider">
                  {event.month}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <h3 className="text-[13.5px] font-bold text-[#06294D] leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                {event.title}
              </h3>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-[80%]">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#06294D] flex items-center justify-center transition-colors">
                  <ArrowRight size={12} className="text-slate-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

