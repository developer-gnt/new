import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  X,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { eventsService } from '../../admin/events/services/eventsService';
import type { EventListItem } from '../../admin/events/types/events.types';

const EVENT_CATEGORIES = [
  'All',
  'Upcoming',
  'Workshop',
  'Awareness',
  'Comunity',
  'Seminar',
  'Awareness Camp',
  'Relief Activity',
];

const matchesEventFilter = (selected: string, event: EventListItem): boolean => {
  if (!selected || selected === 'All') return true;

  if (selected === 'Upcoming') {
    return event.status === 'UPCOMING';
  }

  const sel = selected.toLowerCase().trim();
  const cat = (event.category || '').toLowerCase();
  const title = (event.title || '').toLowerCase();
  const desc = (event.description || '').toLowerCase();
  const tags = (event.tags || []).map((t: string) => t.toLowerCase());

  if (sel === 'workshop') {
    return cat.includes('workshop') || title.includes('workshop') || tags.some((t: string) => t.includes('workshop'));
  }

  if (sel === 'awareness') {
    return cat.includes('awareness') || title.includes('awareness') || tags.some((t: string) => t.includes('awareness'));
  }

  if (sel === 'comunity' || sel === 'community') {
    return (
      cat.includes('community') ||
      cat.includes('comunity') ||
      title.includes('community') ||
      desc.includes('community') ||
      tags.some((t: string) => t.includes('community'))
    );
  }

  if (sel === 'seminar') {
    return cat.includes('seminar') || title.includes('seminar') || tags.some((t: string) => t.includes('seminar'));
  }

  if (sel === 'awareness camp' || sel === 'camp') {
    return cat.includes('camp') || title.includes('camp') || tags.some((t: string) => t.includes('camp'));
  }

  if (sel === 'relief activity' || sel === 'relief') {
    return (
      cat.includes('relief') ||
      cat.includes('activity') ||
      title.includes('relief') ||
      tags.some((t: string) => t.includes('relief'))
    );
  }

  return cat.includes(sel) || title.includes(sel) || tags.some((t: string) => t.includes(sel));
};

export const UserEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<EventListItem | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventsService.list();
        if (isMounted) {
          setEvents(res || []);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesCat = matchesEventFilter(selectedCategory, e);
      const matchesSearch =
        !search.trim() ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(search.toLowerCase())) ||
        (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [events, selectedCategory, search]);

  const handleRegister = (eventId: string) => {
    setRegisteredEvents(prev => new Set([...prev, eventId]));
    setSuccessMessage('Registration confirmed! You will receive confirmation via SMS/Notification.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const parseEventDate = (isoString?: string) => {
    try {
      if (!isoString) return { day: '25', month: 'OCT', year: '2026', time: '10:00 AM' };
      const d = new Date(isoString);
      return {
        day: String(d.getDate()).padStart(2, '0'),
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        year: String(d.getFullYear()),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { day: '25', month: 'OCT', year: '2026', time: '10:00 AM' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 text-[#FAD465] text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar size={14} />
            <span>Community Conventions & Action</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">Events & Activities</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Participate in nationwide constitutional workshops, legal assistance camps, youth conventions, and human rights rallies.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events or locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FAD465]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {EVENT_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Calendar size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No events found</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting another category or clear your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => {
            const { day, month, time } = parseEventDate(event.startAt);
            const isRegistered = registeredEvents.has(event.id);

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Event Image */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={event.coverImageUrl || '/assets/images/event-legal-awareness.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Calendar Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 rounded-xl px-2.5 py-1 text-center shadow-md">
                    <span className="block text-base font-black text-[#06294D] leading-none">{day}</span>
                    <span className="block text-[9.5px] font-bold text-amber-600 uppercase tracking-wider">
                      {month}
                    </span>
                  </div>

                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#06294D]/90 text-white uppercase tracking-wider backdrop-blur-xs">
                    {event.category || 'Human Rights'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-[#06294D] group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{event.location || 'Mumbai, Maharashtra'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      <span>{time}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-[#06294D] hover:bg-slate-50 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegister(event.id)}
                    disabled={isRegistered}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-[#06294D] hover:bg-[#083563] text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? 'Registered ✓' : 'Register Free'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="relative h-48 bg-slate-900">
              <img
                src={selectedEvent.coverImageUrl || '/assets/images/event-legal-awareness.jpg'}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                  {selectedEvent.category || 'Workshop'}
                </span>
                <span className="text-xs text-slate-400">
                  Organized by {selectedEvent.organizer || 'HRSJM National Cell'}
                </span>
              </div>

              <h2 className="text-xl font-black text-[#06294D]">{selectedEvent.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-bold text-slate-800">{selectedEvent.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Seat Capacity</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Users size={12} />
                    <span>{selectedEvent.capacity || 200} participants</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Free open entry for citizens & students</span>
              <button
                type="button"
                onClick={() => {
                  handleRegister(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                disabled={registeredEvents.has(selectedEvent.id)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#06294D] hover:bg-[#083563] cursor-pointer"
              >
                {registeredEvents.has(selectedEvent.id) ? 'Already Registered' : 'Confirm Free Seat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

