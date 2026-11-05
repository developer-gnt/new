import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { eventsStore } from '@/features/admin/events/store/eventsStore';
import type { EventListItem } from '@/features/admin/events/types/events.types';
import { useCurrentMember } from '../store/memberStore';

export const MemberEventsPage: React.FC = () => {
  const { member } = useCurrentMember();
  const snapshot = useSyncExternalStore<{ events: EventListItem[]; version: number }>(eventsStore.subscribe, eventsStore.getSnapshot);
  const events = snapshot.events;

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'MY_REGISTRATIONS'>('UPCOMING');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventListItem | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>(['e-01']);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const categories = ['ALL', 'Seminar', 'Legal Awareness', 'Relief Activity', 'Workshop'];

  const filteredEvents = events.filter((e: EventListItem) => {
    if (activeTab === 'MY_REGISTRATIONS' && !registeredIds.includes(e.id)) {
      return false;
    }
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = e.title.toLowerCase().includes(q);
      const inLoc = e.location.toLowerCase().includes(q);
      const inDesc = (e.description || '').toLowerCase().includes(q);
      if (!inTitle && !inLoc && !inDesc) return false;
    }
    return true;
  });

  const handleRegister = (event: EventListItem) => {
    if (registeredIds.includes(event.id)) {
      // Unregister
      setRegisteredIds((prev) => prev.filter((id) => id !== event.id));
      setSuccessToast(`Cancelled registration for "${event.title}".`);
    } else {
      // Register
      setRegisteredIds((prev) => [...prev, event.id]);
      setSuccessToast(`Successfully registered! Pass allocated for ${member.fullName}.`);
    }
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const formatTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {successToast && (
        <div style={styles.toast}>
          <CheckCircle2 size={18} color="#FFFFFF" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroPill}>MEMBER ACCREDITATION & FIELD WORK</div>
          <h1 style={styles.heroTitle}>Upcoming Events & Drives</h1>
          <p style={styles.heroSub}>
            Participate in official rallies, legal awareness clinics, community aid drives, and national conventions.
            Attendance earns accreditation hours towards Chapter Leadership.
          </p>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{registeredIds.length}</div>
            <div style={styles.statLabel}>Enrolled Passes</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{events.length}</div>
            <div style={styles.statLabel}>Active Programs</div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs & Filter Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.tabGroup}>
          <button
            type="button"
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'UPCOMING' ? styles.tabBtnActive : {}),
            }}
            onClick={() => setActiveTab('UPCOMING')}
          >
            All Upcoming Events ({events.length})
          </button>
          <button
            type="button"
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'MY_REGISTRATIONS' ? styles.tabBtnActive : {}),
            }}
            onClick={() => setActiveTab('MY_REGISTRATIONS')}
          >
            My Registrations ({registeredIds.length})
          </button>
        </div>

        <div style={styles.filterWrap}>
          {/* Search Input */}
          <div style={styles.searchBox}>
            <Search size={16} color="#718096" />
            <input
              type="text"
              placeholder="Search by title, city or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Category Chips */}
          <div style={styles.chipsScroll}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                style={{
                  ...styles.chip,
                  ...(selectedCategory === cat ? styles.chipActive : {}),
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={44} color="#CBD5E1" />
          <h3 style={styles.emptyTitle}>No Events Found</h3>
          <p style={styles.emptySub}>
            No events match your selected filters. Try switching tabs or searching for another keyword.
          </p>
        </div>
      ) : (
        <div style={styles.eventsGrid}>
          {filteredEvents.map((event: EventListItem) => {
            const isRegistered = registeredIds.includes(event.id);
            return (
              <div key={event.id} style={styles.card}>
                <div style={styles.cardCoverWrap}>
                  <img
                    src={event.coverImageUrl || undefined}
                    alt={event.title}
                    style={styles.cardCover}
                  />
                  <div style={styles.categoryBadge}>{event.category}</div>
                  <div style={styles.formatBadge}>
                    {event.eventType === 'IN_PERSON' ? 'In Person' : event.eventType}
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventSnippet}>{event.shortInformation}</p>

                  <div style={styles.eventMeta}>
                    <div style={styles.metaRow}>
                      <Calendar size={14} color="#64748B" />
                      <span>{formatDate(event.startAt)} • {formatTime(event.startAt)}</span>
                    </div>
                    <div style={styles.metaRow}>
                      <MapPin size={14} color="#64748B" />
                      <span>{event.location}</span>
                    </div>
                    <div style={styles.metaRow}>
                      <Users size={14} color="#64748B" />
                      <span>{event.registrations} / {event.capacity} Registered</span>
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      type="button"
                      style={{
                        ...styles.registerBtn,
                        ...(isRegistered ? styles.registeredBtn : {}),
                      }}
                      onClick={() => handleRegister(event)}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span>Registered (Pass Active)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} color="#0B2F52" />
                          <span>Register Free Pass</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      style={styles.detailsBtn}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedEvent(null)}>
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalCategoryBadge}>{selectedEvent.category}</div>
              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setSelectedEvent(null)}
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <h2 style={styles.modalTitle}>{selectedEvent.title}</h2>
              <div style={styles.modalMetaList}>
                <div style={styles.modalMetaItem}>
                  <Calendar size={16} color="#06294D" />
                  <span>
                    <strong>Date:</strong> {formatDate(selectedEvent.startAt)}
                  </span>
                </div>
                <div style={styles.modalMetaItem}>
                  <Clock size={16} color="#06294D" />
                  <span>
                    <strong>Time:</strong> {formatTime(selectedEvent.startAt)} to{' '}
                    {selectedEvent.endAt ? formatTime(selectedEvent.endAt) : '4:00 PM'}
                  </span>
                </div>
                <div style={styles.modalMetaItem}>
                  <MapPin size={16} color="#06294D" />
                  <span>
                    <strong>Venue:</strong> {selectedEvent.address || selectedEvent.location}
                  </span>
                </div>
                <div style={styles.modalMetaItem}>
                  <Users size={16} color="#06294D" />
                  <span>
                    <strong>Organizer:</strong> {selectedEvent.organizer}
                  </span>
                </div>
              </div>

              <div style={styles.modalDescWrap}>
                <h4 style={styles.modalSubheading}>Program Agenda & Details</h4>
                <p style={styles.modalDescText}>{selectedEvent.description}</p>
              </div>

              <div style={styles.targetAudienceBox}>
                <span>Target Audience: <strong>{selectedEvent.targetAudience}</strong></span>
                <span>•</span>
                <span>Languages: <strong>{selectedEvent.language}</strong></span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.modalCloseBtn}
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                type="button"
                style={{
                  ...styles.modalActionBtn,
                  ...(registeredIds.includes(selectedEvent.id)
                    ? styles.modalActionRegistered
                    : {}),
                }}
                onClick={() => {
                  handleRegister(selectedEvent);
                  setSelectedEvent(null);
                }}
              >
                {registeredIds.includes(selectedEvent.id)
                  ? 'Cancel My Registration'
                  : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '36px',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    padding: '12px 20px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 90,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13.5px',
    fontWeight: 600,
  },
  heroBanner: {
    backgroundColor: '#06294D',
    borderRadius: '16px',
    padding: '28px 32px',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    boxShadow: '0 6px 20px rgba(1, 31, 57, 0.15)',
  },
  heroLeft: {
    flex: 1,
    minWidth: '320px',
  },
  heroPill: {
    display: 'inline-block',
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#FAD465',
    backgroundColor: 'rgba(250, 212, 101, 0.15)',
    padding: '3px 10px',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  heroTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '26px',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  heroSub: {
    fontSize: '13px',
    color: '#DCE4EC',
    lineHeight: 1.5,
    margin: 0,
    maxWidth: '620px',
  },
  heroRight: {
    display: 'flex',
    gap: '16px',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '14px 20px',
    textAlign: 'center',
    minWidth: '110px',
  },
  statValue: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '24px',
    fontWeight: 700,
    color: '#FAD465',
  },
  statLabel: {
    fontSize: '11px',
    color: '#CBD5E0',
    marginTop: '2px',
  },

  /* Controls */
  controlsBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '16px 20px',
  },
  tabGroup: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '12px',
  },
  tabBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
  },
  filterWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    padding: '8px 14px',
    flex: 1,
    minWidth: '240px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    color: '#1E293B',
    width: '100%',
  },
  chipsScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  chipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FAD465',
    color: '#0B2F52',
  },

  /* Events Grid */
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.15s ease',
  },
  cardCoverWrap: {
    position: 'relative',
    height: '170px',
    overflow: 'hidden',
    backgroundColor: '#011F39',
  },
  cardCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#06294D',
    color: '#FAD465',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
  },
  formatBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: '#06294D',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '12px',
  },
  eventTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '16.5px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1.3,
  },
  eventSnippet: {
    margin: 0,
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.45,
  },
  eventMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid #F1F5F9',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#475569',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    paddingTop: '6px',
  },
  registerBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FAD465',
    color: '#06294D',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  registeredBtn: {
    backgroundColor: '#EAF7EE',
    color: '#16A34A',
    border: '1px solid #86EFAC',
  },
  detailsBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  /* Empty State */
  emptyState: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyTitle: {
    margin: '12px 0 6px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  emptySub: {
    margin: 0,
    fontSize: '13px',
    color: '#64748B',
    maxWidth: '420px',
  },

  /* Modal */
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 70,
    padding: '16px',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCategoryBadge: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    backgroundColor: '#FEF3C7',
    padding: '3px 10px',
    borderRadius: '6px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  modalTitle: {
    margin: 0,
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '20px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  modalMetaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#FAF7F0',
    borderRadius: '10px',
    padding: '14px',
  },
  modalMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#334155',
  },
  modalDescWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modalSubheading: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: '#0B2F52',
  },
  modalDescText: {
    margin: 0,
    fontSize: '13px',
    color: '#475569',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  targetAudienceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#64748B',
    paddingTop: '8px',
    borderTop: '1px solid #E2E8F0',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  modalCloseBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalActionBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  modalActionRegistered: {
    backgroundColor: '#DC2626',
  },
};
