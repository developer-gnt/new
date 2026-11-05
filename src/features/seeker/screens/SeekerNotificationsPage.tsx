import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';

export const SeekerNotificationsPage: React.FC = () => {
  const { notifications } = useSeekerStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'DISBURSEMENT':
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      case 'DOCUMENT_REQUIRED':
        return <AlertCircle size={18} className="text-rose-600" />;
      case 'STATUS_CHANGE':
        return <Clock size={18} className="text-amber-600" />;
      default:
        return <Bell size={18} className="text-[#06294D]" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
            <Bell size={14} className="text-[#06294D]" />
            <span>Alerts & Activity</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
            Notifications & Status Alerts
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Stay updated with your aid assessments, document feedback, and relief disbursements.
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white border-[#DCE4EC]'
                  : 'bg-[#FFF9E6]/60 border-[#FAD465] shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#DBE5EE] flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0B2F52]">{notif.title}</h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(notif.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#34516D] leading-relaxed">{notif.message}</p>

                {notif.action_url && (
                  <div className="pt-1.5">
                    <Link
                      to={notif.action_url}
                      className="text-[11px] font-bold text-[#06294D] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View in Application Tracker</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#DCE4EC] text-xs text-gray-400">
            No notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};

