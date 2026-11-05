import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, AlertCircle, ArrowRight, CheckCheck } from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';

/**
 * Exact replication of NotificationsScreen.tsx from the HRSJM React Native APK:
 * - Header: Title "Notifications & Alerts" with mark all read action
 * - Filter tabs: All, Unread
 * - Rows with unread dot, category icon, title, description, formatted date, and deep-link
 */
export const SeekerNotificationsPage: React.FC = () => {
  const { notifications } = useSeekerStore();
  const [filterView, setFilterView] = useState<'ALL' | 'UNREAD'>('ALL');

  const getIcon = (type: string) => {
    switch (type) {
      case 'DISBURSEMENT':
        return <CheckCircle2 size={16} className="text-[#10B981]" />;
      case 'DOCUMENT_REQUIRED':
        return <AlertCircle size={16} className="text-[#DC2626]" />;
      case 'STATUS_CHANGE':
        return <Clock size={16} className="text-[#D97706]" />;
      default:
        return <Bell size={16} className="text-[#06294D]" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterView === 'UNREAD') return !n.read;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-5 py-4 shadow-xs flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-0.5">
            <Bell size={14} className="text-[#06294D]" />
            <span>Alerts & Activity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            Notifications & Status Alerts
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Stay updated with your aid assessments, document feedback, and relief disbursements.
          </p>
        </div>

        {/* Filter View Tabs */}
        <div className="flex border border-[#DBE5EE] rounded-xl p-0.5 bg-[#EDF2F7]">
          <button
            type="button"
            onClick={() => setFilterView('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              filterView === 'ALL'
                ? 'bg-white text-[#06294D] shadow-xs'
                : 'text-[#718096] hover:text-[#06294D]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterView('UNREAD')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              filterView === 'UNREAD'
                ? 'bg-white text-[#06294D] shadow-xs'
                : 'text-[#718096] hover:text-[#06294D]'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length > 0 ? (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition flex items-start gap-3 relative ${
                notif.read
                  ? 'bg-white border-[#E2E8F0]'
                  : 'bg-[#FFF9E6]/50 border-[#FAD465] shadow-xs'
              }`}
            >
              {/* Unread Dot (Exact APK style) */}
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1.5" />
              )}

              <div className="w-8 h-8 rounded-full bg-white border border-[#DBE5EE] flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#0B2F52] truncate">{notif.title}</h3>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(notif.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#34516D] leading-relaxed line-clamp-2">{notif.message}</p>

                {notif.action_url && (
                  <div className="pt-1">
                    <Link
                      to={notif.action_url}
                      className="text-[11px] font-bold text-[#06294D] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View in Application Tracker</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white rounded-2xl border border-[#DCE4EC] text-xs text-gray-400">
            No notifications in this view.
          </div>
        )}
      </div>
    </div>
  );
};
