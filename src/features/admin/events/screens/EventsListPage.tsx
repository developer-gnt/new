import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Plus } from 'lucide-react';
import { eventsStore } from '../store/eventsStore';
import { EventsStatsCards } from '../components/EventsStatsCards';
import { EventsFilterBar } from '../components/EventsFilterBar';
import { EventCard } from '../components/EventCard';
import { CreateEventModal } from '../components/CreateEventModal';
import type { EventStatusFilter, CreateEventFormState } from '../types/events.types';

export const EventsListPage: React.FC = () => {
  const navigate = useNavigate();
  const snapshot = useSyncExternalStore(eventsStore.subscribe, eventsStore.getSnapshot);
  const events = snapshot.events;
  const stats = eventsStore.getStats();

  const [selectedStatus, setSelectedStatus] = useState<EventStatusFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filter events
  const filteredEvents = events.filter((e) => {
    // Status
    if (selectedStatus !== 'ALL' && e.status !== selectedStatus) {
      return false;
    }
    // Category
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) {
      return false;
    }
    // Format
    if (selectedFormat !== 'ALL' && e.eventType !== selectedFormat) {
      return false;
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = e.title.toLowerCase().includes(q);
      const inLoc = e.location.toLowerCase().includes(q);
      const inDesc = (e.description || '').toLowerCase().includes(q);
      if (!inTitle && !inLoc && !inDesc) {
        return false;
      }
    }
    return true;
  });

  const handleCreateSubmit = (form: CreateEventFormState) => {
    eventsStore.createEvent(form);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      eventsStore.deleteEvent(id);
    }
  };

  return (
    <div style={styles.container}>
      {/* Breadcrumb & Header */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </span>
          <ChevronRight size={13} color="#94A3B8" />
          <span style={styles.breadcrumbActive}>Events Management</span>
        </div>

        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Events & Conclaves</h1>
            <p style={styles.subtitle}>
              Organize human rights conclaves, legal awareness workshops, and track delegate attendance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            style={styles.primaryBtn}
          >
            <Plus size={16} color="#011F39" strokeWidth={2.5} />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <EventsStatsCards
        stats={stats}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* Filter Bar */}
      <EventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        onCreateEvent={() => setCreateModalOpen(true)}
      />

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div style={styles.emptyContainer}>
          <Calendar size={44} color="#CBD5E1" />
          <h3 style={styles.emptyTitle}>No Events Found</h3>
          <p style={styles.emptySub}>
            No events match your current filters. Try resetting search criteria or create a new event.
          </p>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            style={styles.emptyCreateBtn}
          >
            <Plus size={15} color="#011F39" />
            <span>Create Event</span>
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={(id) => navigate(`/admin/events/${id}`)}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px 32px 60px',
    maxWidth: '1440px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '24px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    color: '#64748B',
    marginBottom: '10px',
  },
  breadcrumbLink: {
    cursor: 'pointer',
    color: '#06294D',
    fontWeight: 500,
  },
  breadcrumbActive: {
    color: '#0F172A',
    fontWeight: 600,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#011F39',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13.5px',
    color: '#64748B',
    margin: '4px 0 0 0',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(250, 212, 101, 0.4)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    padding: '54px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#011F39',
    margin: '14px 0 4px 0',
  },
  emptySub: {
    fontSize: '13px',
    color: '#64748B',
    margin: '0 0 16px 0',
    maxWidth: '400px',
    lineHeight: 1.45,
  },
  emptyCreateBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FAD465',
    border: 'none',
    color: '#011F39',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
