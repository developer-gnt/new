import React from 'react';
import {
  MessageSquare,
  FileText,
  HeartHandshake,
  Calendar,
  ShieldCheck,
  Bell,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { NotificationItem } from '../types/notifications.types';

interface NotificationRowProps {
  item: NotificationItem;
  onOpen: (item: NotificationItem) => void;
  onDelete: (recipientId: string) => void;
}

function renderCategoryIcon(category?: string) {
  switch (category) {
    case 'SUPPORT':
      return <MessageSquare size={16} className="text-sky-700" />;
    case 'APPLICATION':
      return <FileText size={16} className="text-emerald-700" />;
    case 'DONATION':
      return <HeartHandshake size={16} className="text-amber-700" />;
    case 'EVENT':
      return <Calendar size={16} className="text-purple-700" />;
    case 'SECURITY':
      return <ShieldCheck size={16} className="text-blue-700" />;
    default:
      return <Bell size={16} className="text-slate-700" />;
  }
}

function getCategoryIconBg(category?: string) {
  switch (category) {
    case 'SUPPORT':
      return 'bg-sky-50 border-sky-200';
    case 'APPLICATION':
      return 'bg-emerald-50 border-emerald-200';
    case 'DONATION':
      return 'bg-amber-50 border-amber-200';
    case 'EVENT':
      return 'bg-purple-50 border-purple-200';
    case 'SECURITY':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
}

function formatTimeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const NotificationRow: React.FC<NotificationRowProps> = ({
  item,
  onOpen,
  onDelete,
}) => {
  const { notification, is_read, created_at, recipient_id } = item;
  const iconBg = getCategoryIconBg(notification.category);

  return (
    <div
      onClick={() => onOpen(item)}
      className={`group relative rounded-xl border p-4 mb-3 transition-all duration-200 cursor-pointer ${
        !is_read
          ? 'bg-sky-50/40 border-sky-200/90 hover:border-sky-300 shadow-2xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Category Icon */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${iconBg} mt-0.5`}
        >
          {renderCategoryIcon(notification.category)}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {!is_read && (
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" title="Unread alert" />
              )}
              <h3
                className={`text-sm sm:text-base font-semibold group-hover:text-[#B45309] transition-colors leading-snug ${
                  !is_read ? 'text-[#011F39] font-bold' : 'text-slate-800'
                }`}
              >
                {notification.title}
              </h3>

              {/* Priority Badges */}
              {notification.priority === 'URGENT' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200 tracking-wider">
                  URGENT
                </span>
              )}
              {notification.priority === 'HIGH' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200 tracking-wider">
                  HIGH
                </span>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium shrink-0">
              {formatTimeAgo(created_at)}
            </span>
          </div>

          {/* Body Snippet */}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {notification.body}
          </p>

          {/* Action Link & Item Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {notification.actionLabel ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#011F39] hover:text-[#B45309] transition-colors">
                <span>{notification.actionLabel}</span>
                <ExternalLink size={12} />
              </div>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipient_id);
              }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              title="Delete notification"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
