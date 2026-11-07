import type React from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  Paperclip,
} from 'lucide-react';
import type { SupportTicket, TicketStatus } from '../types/support.types';
import {
  shortTicketId,
  STATUS_META,
  resolveTicketSource,
  SOURCE_CONFIG,
  PRIORITIES,
  canTransition,
} from '../types/support.types';

interface SupportTicketRowProps {
  ticket: SupportTicket;
  messageCount: number;
  onView: (ticket: SupportTicket) => void;
  onOpenChat: (ticket: SupportTicket) => void;
  onUpdateStatus: (ticket: SupportTicket, targetStatus: TicketStatus) => void;
}

export const SupportTicketRow: React.FC<SupportTicketRowProps> = ({
  ticket,
  messageCount,
  onView,
  onOpenChat,
  onUpdateStatus,
}) => {
  const shortId = shortTicketId(ticket.id);
  const statusMeta = STATUS_META[ticket.status] || STATUS_META.SUBMITTED;
  const sourceKey = resolveTicketSource(ticket);
  const sourceMeta = SOURCE_CONFIG[sourceKey] || SOURCE_CONFIG.app;
  const priorityMeta = PRIORITIES.find((p) => p.id === ticket.priority) || PRIORITIES[0];

  const complainantName = ticket.user?.full_name || 'Citizen Complainant';
  const complainantEmail = ticket.user?.email || '—';
  const complainantPhone = ticket.user?.mobile_number || '';

  const cleanSubject = ticket.subject.replace(/\[.*?\]\s*/g, '');
  const docCount = (ticket.documents || []).length;

  const dateFormatted = new Date(ticket.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div style={styles.card}>
      {/* Top Meta Bar */}
      <div style={styles.topBar}>
        <div style={styles.idGroup}>
          <span style={styles.idBadge}>{shortId}</span>
          <span
            style={{
              ...styles.sourceBadge,
              backgroundColor: sourceMeta.bg,
              color: sourceMeta.text,
              borderColor: sourceMeta.border,
            }}
          >
            {sourceMeta.label}
          </span>
          {ticket.category && (
            <span style={styles.categoryBadge}>{ticket.category}</span>
          )}
          {ticket.priority && ticket.priority !== 'NORMAL' && (
            <span
              style={{
                ...styles.priorityBadge,
                backgroundColor: priorityMeta.badgeBg,
                color: priorityMeta.tone,
                borderColor: priorityMeta.border,
              }}
            >
              {priorityMeta.label}
            </span>
          )}
        </div>

        <div style={styles.statusGroup}>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: statusMeta.badgeBg,
              color: statusMeta.badgeText,
              borderColor: statusMeta.border,
            }}
          >
            {statusMeta.label}
          </span>
          <span style={styles.dateText}>{dateFormatted}</span>
        </div>
      </div>

      {/* Main Content Info */}
      <div style={styles.contentBody}>
        <div style={styles.subjectRow}>
          <h3 style={styles.subjectText} onClick={() => onView(ticket)}>
            {cleanSubject}
          </h3>
          {docCount > 0 && (
            <span style={styles.attachmentPill} title={`${docCount} verified attachment(s)`}>
              <Paperclip size={12} color="#718096" />
              <span>{docCount}</span>
            </span>
          )}
        </div>

        {/* User Info Bar */}
        <div style={styles.userRow}>
          <div style={styles.avatar}>
            {complainantName.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>{complainantName}</span>
            <span style={styles.userSub}>
              {complainantEmail} {complainantPhone ? `• ${complainantPhone}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={styles.footer}>
        {/* Quick Transition Buttons */}
        <div style={styles.quickTransitions}>
          {canTransition(ticket.status, 'UNDER_REVIEW') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'UNDER_REVIEW')}
              style={styles.transitionBtnInfo}
            >
              <Clock size={13} />
              <span>Mark In Progress</span>
            </button>
          )}

          {canTransition(ticket.status, 'RESOLVED') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'RESOLVED')}
              style={styles.transitionBtnSuccess}
            >
              <CheckCircle2 size={13} />
              <span>Mark Resolved</span>
            </button>
          )}

          {canTransition(ticket.status, 'CLOSED') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'CLOSED')}
              style={styles.transitionBtnNeutral}
            >
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div style={styles.navActions}>
          <button
            type="button"
            onClick={() => onOpenChat(ticket)}
            style={styles.chatBtn}
            title="Open conversation chat"
          >
            <MessageSquare size={14} color="#011F39" />
            <span>Chat</span>
            {messageCount > 0 && (
              <span style={styles.chatBadge}>{messageCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onView(ticket)}
            style={styles.viewBtn}
          >
            <span>View Ticket</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #DCE4EC',
    padding: '16px 20px',
    marginBottom: '12px',
    transition: 'all 0.15s ease',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px',
  },
  idGroup: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  idBadge: {
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '12px',
    color: '#011F39',
    backgroundColor: '#EDF2F7',
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.04em',
  },
  sourceBadge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
  },
  categoryBadge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '6px',
    backgroundColor: '#FFF9E6',
    color: '#B45309',
    border: '1px solid #FDE68A',
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid',
  },
  dateText: {
    fontSize: '12px',
    color: '#718096',
  },
  contentBody: {
    marginBottom: '14px',
  },
  subjectRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  subjectText: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
    cursor: 'pointer',
    flex: 1,
  },
  attachmentPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#718096',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '2px 6px',
    borderRadius: '6px',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  userSub: {
    fontSize: '11px',
    color: '#718096',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    borderTop: '1px solid #EDF2F7',
    paddingTop: '12px',
  },
  quickTransitions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  transitionBtnInfo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #BAE6FD',
    backgroundColor: '#EFF6FF',
    color: '#0284C7',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  transitionBtnSuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #BBF7D0',
    backgroundColor: '#F0FDF4',
    color: '#15803D',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  transitionBtnNeutral: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
  chatBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    color: '#011F39',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  chatBadge: {
    fontSize: '10px',
    fontWeight: 700,
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '1px 5px',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
