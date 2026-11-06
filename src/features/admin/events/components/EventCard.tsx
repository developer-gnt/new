import type React from 'react';
import { Calendar, Clock, MapPin, Users, Globe, ExternalLink, Trash2 } from 'lucide-react';
import type { EventListItem } from '../types/events.types';

interface EventCardProps {
  event: EventListItem;
  onPress: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, onDelete }) => {
  const formatDate = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const formatTime = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const getStatusStyle = () => {
    switch (event.status) {
      case 'UPCOMING':
        return { bg: '#FFF9E6', color: '#B45309', border: '#FDE68A', label: 'UPCOMING' };
      case 'COMPLETED':
        return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', label: 'COMPLETED' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA', label: 'CANCELLED' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', label: 'DRAFT' };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <div
      onClick={() => onPress(event.id)}
      style={styles.card}
      role="button"
      tabIndex={0}
    >
      {/* Cover Image or Fallback Header */}
      <div style={styles.imageWrap}>
        {event.coverImageUrl ? (
          <img src={event.coverImageUrl} alt={event.title} style={styles.coverImg} />
        ) : (
          <div style={styles.fallbackHeader}>
            <Calendar size={32} color="#06294D" />
            <span style={styles.fallbackCategory}>{event.category}</span>
          </div>
        )}

        <div style={styles.badgeOverlay}>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              borderColor: statusStyle.border,
            }}
          >
            {statusStyle.label}
          </span>

          {event.targetAudience && event.targetAudience !== 'ALL' && event.targetAudience !== 'Open to All' && (
            <span
              style={{
                ...styles.categoryBadge,
                backgroundColor: 'rgba(250, 212, 101, 0.95)',
                color: '#011F39',
                fontWeight: 700,
              }}
            >
              {event.targetAudience === 'MEMBERS' ? 'Members' : event.targetAudience === 'SEEKERS' ? 'Seekers' : event.targetAudience}
            </span>
          )}

          <span style={styles.categoryBadge}>{event.category}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={styles.body}>
        <h3 style={styles.title}>{event.title}</h3>
        <p style={styles.desc}>{event.shortInformation || event.description}</p>

        {/* Timing & Location Grid */}
        <div style={styles.metaList}>
          <div style={styles.metaItem}>
            <Clock size={14} color="#64748B" />
            <span>
              {formatDate(event.startAt)} · {formatTime(event.startAt)}
            </span>
          </div>

          <div style={styles.metaItem}>
            {event.eventType === 'ONLINE' ? (
              <Globe size={14} color="#64748B" />
            ) : (
              <MapPin size={14} color="#64748B" />
            )}
            <span style={styles.locationText}>{event.location}</span>
          </div>

          <div style={styles.metaItem}>
            <Users size={14} color="#64748B" />
            <span>
              <strong>{event.registrations}</strong> / {event.capacity || 200} delegates registered
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <span style={styles.organizerText}>
            By: <strong>{event.organizer || 'HRSJM Central'}</strong>
          </span>

          <div style={styles.actions}>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                style={styles.deleteBtn}
                title="Delete event"
              >
                <Trash2 size={13} color="#94A3B8" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPress(event.id);
              }}
              style={styles.viewBtn}
            >
              <span>View Details</span>
              <ExternalLink size={12} color="#06294D" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  imageWrap: {
    position: 'relative',
    height: '160px',
    backgroundColor: '#EEF2F6',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallbackHeader: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EEF2F6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  fallbackCategory: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  badgeOverlay: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: '10.5px',
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid',
    letterSpacing: '0.4px',
  },
  categoryBadge: {
    backgroundColor: 'rgba(1, 31, 57, 0.85)',
    color: '#FAD465',
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.4px',
  },
  body: {
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: '0 0 6px 0',
    lineHeight: 1.35,
  },
  desc: {
    fontSize: '12.5px',
    color: '#64748B',
    lineHeight: 1.5,
    margin: '0 0 14px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '12px',
    color: '#475569',
    marginBottom: '16px',
    paddingTop: '10px',
    borderTop: '1px solid #F1F5F9',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  locationText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: '1px solid #F1F5F9',
    marginTop: 'auto',
  },
  organizerText: {
    fontSize: '11px',
    color: '#64748B',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: '#EEF2F6',
    border: '1px solid #CBD5E1',
    color: '#06294D',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
