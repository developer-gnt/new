import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Phone, Search, X } from 'lucide-react';
import { SEEKER_EVENTS } from '../data/seekerData';
import type { SeekerEventItem } from '../types/seeker.types';

export const SeekerEventsPage: React.FC = () => {
  const [activeDateTab, setActiveDateTab] = useState<'ALL' | 'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SeekerEventItem | null>(null);

  const categories = ['All', 'Workshop', 'Relief Activity', 'Awareness'];

  const filteredEvents = useMemo(() => {
    return SEEKER_EVENTS.filter((e) => {
      if (activeDateTab === 'UPCOMING' && !e.isUpcoming) return false;
      if (activeDateTab === 'PAST' && e.isUpcoming) return false;
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeDateTab, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
            <Calendar size={14} className="text-[#06294D]" />
            <span>Community Relief & Outreach</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
            Relief Camps & Outreach Drives
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Participate in free legal literacy camps, health checkups, and on-ground aid distribution.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 shadow-xs space-y-4">
        <div className="flex border-b border-[#DBE5EE] gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveDateTab('UPCOMING')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeDateTab === 'UPCOMING'
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'text-[#718096] hover:bg-[#EDF2F7]'
            }`}
          >
            Upcoming Drives
          </button>
          <button
            type="button"
            onClick={() => setActiveDateTab('ALL')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeDateTab === 'ALL'
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'text-[#718096] hover:bg-[#EDF2F7]'
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setActiveDateTab('PAST')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeDateTab === 'PAST'
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'text-[#718096] hover:bg-[#EDF2F7]'
            }`}
          >
            Past Events
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search relief camps, venues, dates..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#06294D] text-white'
                    : 'bg-[#EDF2F7] text-[#34516D] hover:bg-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-sm hover:border-[#FAD465] transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#06294D] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                  <span className="text-sm text-[#FAD465] leading-none">{event.day}</span>
                  <span className="text-[10px] text-blue-200 uppercase leading-none mt-0.5">
                    {event.month}
                  </span>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40 mb-1">
                    {event.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#0B2F52] leading-snug line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#718096] leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#DBE5EE] text-xs">
              <div className="flex items-center gap-2 text-[#34516D]">
                <MapPin size={14} className="text-[#0D47A1] shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              {event.contact && (
                <div className="flex items-center gap-2 text-[#34516D]">
                  <Phone size={14} className="text-[#0D47A1] shrink-0" />
                  <span>Helpline: {event.contact}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="w-full py-2 bg-[#EDF2F7] hover:bg-[#06294D] hover:text-[#FAD465] text-[#06294D] text-xs font-bold rounded-xl transition cursor-pointer"
              >
                View Full Event Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40">
                {selectedEvent.category}
              </span>
              <h3 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-2">
                {selectedEvent.title}
              </h3>
            </div>

            <div className="p-4 bg-[#EDF2F7] rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                <Calendar size={15} className="text-[#06294D]" />
                <span>Date: {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                <MapPin size={15} className="text-[#06294D]" />
                <span>Venue: {selectedEvent.location}</span>
              </div>
              {selectedEvent.contact && (
                <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                  <Phone size={15} className="text-[#06294D]" />
                  <span>On-ground Coordinator: {selectedEvent.contact}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-[#34516D] leading-relaxed">
              {selectedEvent.description}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-[#06294D] text-[#FAD465] text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

