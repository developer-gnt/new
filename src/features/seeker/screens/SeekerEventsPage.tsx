import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Phone, Search, X } from 'lucide-react';
import { SEEKER_EVENTS } from '../data/seekerData';
import type { SeekerEventItem } from '../types/seeker.types';

type DateFilter = 'All Dates' | 'Today' | 'Upcoming' | 'Past';

const DATE_TABS: DateFilter[] = ['Upcoming', 'All Dates', 'Past'];

const CATEGORY_PILLS = ['All', 'Workshop', 'Relief Activity', 'Awareness', 'Health Camp'];

/**
 * Exact replication of UserEventsScreen.tsx from the HRSJM React Native APK:
 * - Header: "Relief Camps & Outreach Drives"
 * - Date Filter Tabs: Upcoming, All Dates, Past
 * - Category filter pills
 * - Search bar with #EDF2F7 input
 * - Event cards with Navy date box, gold date number, category badge, venue map pin, helpline, and modal
 */
export const SeekerEventsPage: React.FC = () => {
  const [activeDateTab, setActiveDateTab] = useState<DateFilter>('Upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SeekerEventItem | null>(null);

  const filteredEvents = useMemo(() => {
    return SEEKER_EVENTS.filter((e) => {
      if (activeDateTab === 'Upcoming' && !e.isUpcoming) return false;
      if (activeDateTab === 'Past' && e.isUpcoming) return false;
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
    <div className="space-y-4">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-5 py-4 shadow-xs">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-0.5">
          <Calendar size={14} className="text-[#06294D]" />
          <span>Community Relief & Outreach</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
          Relief Camps & Outreach Drives
        </h1>
        <p className="text-xs text-[#718096] mt-0.5">
          Participate in free legal literacy camps, health checkups, and on-ground aid distribution.
        </p>
      </div>

      {/* 2. DATE TABS, CATEGORY PILLS & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-xs p-3 space-y-3">
        {/* Date Tabs */}
        <div className="flex border-b border-[#DBE5EE] pb-1 gap-1 overflow-x-auto">
          {DATE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveDateTab(tab)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeDateTab === tab
                  ? 'bg-[#06294D] text-[#FAD465] font-bold shadow-xs'
                  : 'text-[#718096] hover:bg-[#EDF2F7] hover:text-[#0B2F52]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Category Row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search relief camps, venues, dates..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORY_PILLS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#06294D] text-[#FAD465]'
                    : 'bg-[#EDF2F7] text-[#34516D] hover:bg-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-[#DCE4EC] p-4.5 shadow-xs hover:border-[#FAD465] transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-11 h-11 rounded-xl bg-[#06294D] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                  <span className="text-xs text-[#FAD465] leading-none font-bold">{event.day}</span>
                  <span className="text-[9px] text-blue-200 uppercase leading-none mt-0.5">
                    {event.month}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40 mb-1">
                    {event.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#0B2F52] leading-snug line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#718096] leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>

            <div className="space-y-2 pt-2.5 border-t border-[#DBE5EE] text-xs">
              <div className="flex items-center gap-1.5 text-[#34516D]">
                <MapPin size={13} className="text-[#0D47A1] shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              {event.contact && (
                <div className="flex items-center gap-1.5 text-[#34516D]">
                  <Phone size={13} className="text-[#0D47A1] shrink-0" />
                  <span className="truncate">Coordinator: {event.contact}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="w-full py-1.5 bg-[#EDF2F7] hover:bg-[#06294D] hover:text-[#FAD465] text-[#06294D] text-xs font-bold rounded-xl transition cursor-pointer mt-1"
              >
                View Full Event Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3 relative">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40">
                {selectedEvent.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1.5">
                {selectedEvent.title}
              </h3>
            </div>

            <div className="p-3 bg-[#EDF2F7] rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                <Calendar size={14} className="text-[#06294D]" />
                <span>Date: {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                <MapPin size={14} className="text-[#06294D]" />
                <span>Venue: {selectedEvent.location}</span>
              </div>
              {selectedEvent.contact && (
                <div className="flex items-center gap-2 text-[#0B2F52] font-semibold">
                  <Phone size={14} className="text-[#06294D]" />
                  <span>On-ground Coordinator: {selectedEvent.contact}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-[#34516D] leading-relaxed">
              {selectedEvent.description}
            </div>

            <div className="pt-2 flex justify-end">
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
