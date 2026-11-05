import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Heart,
  Scale,
  CreditCard,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { NotificationsService } from '../../notifications/services/notificationsService';
import type { NotificationItem } from '../../notifications/types/notifications.types';

export const UserNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    NotificationsService.getInstance().getNotifications() || []
  );
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({
      ...n,
      is_read: true,
      read_at: new Date().toISOString(),
    }));
    setNotifications(updated);
    NotificationsService.getInstance().saveNotifications(updated);
  };

  const handleItemClick = (item: NotificationItem) => {
    // mark this item as read
    const updated = notifications.map(n =>
      n.notification.id === item.notification.id
        ? { ...n, is_read: true, read_at: new Date().toISOString() }
        : n
    );
    setNotifications(updated);
    NotificationsService.getInstance().saveNotifications(updated);

    // Navigate to deepLink if present
    if (item.notification.deepLinkUrl) {
      navigate(item.notification.deepLinkUrl);
    }
  };

  const filtered = notifications.filter(item => {
    if (filter === 'UNREAD') return !item.is_read;
    return true;
  });

  const getIconForCategory = (cat?: string) => {
    switch (cat) {
      case 'DONATION':
        return <Heart size={16} className="text-rose-600" />;
      case 'APPLICATION':
        return <CreditCard size={16} className="text-amber-600" />;
      case 'EVENT':
        return <Calendar size={16} className="text-blue-600" />;
      case 'SUPPORT':
        return <Scale size={16} className="text-emerald-600" />;
      default:
        return <ShieldAlert size={16} className="text-[#06294D]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 text-[#FAD465] text-xs font-bold uppercase tracking-wider mb-2">
            <Bell size={14} />
            <span>Alerts & Activity Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Real-time updates regarding your membership review, filed grievances, event passes, and mission alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'UNREAD'
              ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
          <Bell size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No notifications to display</p>
          <p className="text-xs text-slate-400 mt-1">You are completely up to date.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(item => (
            <div
              key={item.notification.id}
              onClick={() => handleItemClick(item)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                !item.is_read
                  ? 'bg-white border-amber-300 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {getIconForCategory(item.notification.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {item.notification.category || 'ANNOUNCEMENT'}
                    </span>
                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                    )}
                  </div>
                  <span className="text-[10.5px] text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#06294D] group-hover:text-amber-600 transition-colors">
                  {item.notification.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.notification.body}
                </p>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#06294D] flex items-center justify-center shrink-0 transition-colors hidden sm:flex self-center">
                <ArrowRight size={13} className="text-slate-500 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
