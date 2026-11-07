import type React from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  Paperclip,
  Calendar,
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

  // Status indicator dot color
  const statusDotColor =
    ticket.status === 'RESOLVED'
      ? 'bg-emerald-500'
      : ticket.status === 'UNDER_REVIEW'
      ? 'bg-sky-500'
      : ticket.status === 'SUBMITTED'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 mb-3.5 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        {/* Left Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ticket ID */}
          <span className="font-mono text-xs font-bold text-[#011F39] bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md tracking-wider">
            {shortId}
          </span>

          {/* Source Channel Badge */}
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border"
            style={{
              backgroundColor: sourceMeta.bg,
              color: sourceMeta.text,
              borderColor: sourceMeta.border,
            }}
          >
            {sourceMeta.label}
          </span>

          {/* Category Badge */}
          {ticket.category && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#FFF9E6] text-[#B45309] border border-[#FDE68A]">
              {ticket.category}
            </span>
          )}

          {/* Priority Badge */}
          {ticket.priority && ticket.priority !== 'NORMAL' && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider"
              style={{
                backgroundColor: priorityMeta.badgeBg,
                color: priorityMeta.tone,
                borderColor: priorityMeta.border,
              }}
            >
              {priorityMeta.label}
            </span>
          )}
        </div>

        {/* Right Status & Date */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs"
            style={{
              backgroundColor: statusMeta.badgeBg,
              color: statusMeta.badgeText,
              borderColor: statusMeta.border,
            }}
          >
            <span className={`w-2 h-2 rounded-full ${statusDotColor}`} />
            {statusMeta.label}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar size={13} className="text-slate-400" />
            {dateFormatted}
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mb-3.5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            onClick={() => onView(ticket)}
            className="font-serif font-bold text-base sm:text-lg text-[#011F39] hover:text-[#B45309] cursor-pointer transition-colors leading-snug"
          >
            {cleanSubject}
          </h3>

          {docCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md shrink-0"
              title={`${docCount} verified attachment(s)`}
            >
              <Paperclip size={12} className="text-slate-400" />
              <span>{docCount}</span>
            </span>
          )}
        </div>

        {/* User Row */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#011F39] text-[#FAD465] text-xs font-bold flex items-center justify-center shrink-0">
            {complainantName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className="font-semibold text-slate-900">{complainantName}</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500">{complainantEmail}</span>
            {complainantPhone && (
              <>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-500">{complainantPhone}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-slate-100 pt-3 mt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Quick Lifecycle Transition Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {canTransition(ticket.status, 'UNDER_REVIEW') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'UNDER_REVIEW')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <Clock size={13} />
              <span>Mark In Progress</span>
            </button>
          )}

          {canTransition(ticket.status, 'RESOLVED') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'RESOLVED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Mark Resolved</span>
            </button>
          )}

          {canTransition(ticket.status, 'CLOSED') && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket, 'CLOSED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => onOpenChat(ticket)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            title="Open conversation chat"
          >
            <MessageSquare size={14} className="text-slate-500" />
            <span>Chat</span>
            {messageCount > 0 && (
              <span className="bg-[#011F39] text-[#FAD465] text-[10px] font-bold rounded-full px-1.5 py-0.2 leading-tight">
                {messageCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onView(ticket)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#011F39] hover:bg-[#06294D] text-white shadow-2xs transition-colors cursor-pointer"
          >
            <span>View Ticket</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
