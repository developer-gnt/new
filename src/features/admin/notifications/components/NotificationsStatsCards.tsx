import React from 'react';
import { Bell, AlertTriangle, Radio, CheckCircle2 } from 'lucide-react';
import type { NotificationStats } from '../types/notifications.types';

interface NotificationsStatsCardsProps {
  stats: NotificationStats;
}

export const NotificationsStatsCards: React.FC<NotificationsStatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      id: 'total',
      label: 'Inbox Notifications',
      value: stats.total,
      subtitle: 'Total received in administrator inbox',
      icon: Bell,
      iconBg: 'bg-[#011F39]/10 text-[#011F39] border-[#011F39]/20',
      numColor: 'text-slate-900',
    },
    {
      id: 'unread',
      label: 'Unread Alerts',
      value: stats.unread,
      subtitle: 'Awaiting administrative review',
      icon: CheckCircle2,
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      numColor: stats.unread > 0 ? 'text-amber-800' : 'text-slate-900',
    },
    {
      id: 'urgent',
      label: 'High Priority & Urgent',
      value: stats.highPriority,
      subtitle: 'Require expedited grievance attention',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
      numColor: stats.highPriority > 0 ? 'text-rose-700' : 'text-slate-900',
    },
    {
      id: 'broadcasts',
      label: 'Announcements Sent',
      value: stats.broadcastsSent,
      subtitle: 'Central circulars & broad notifications',
      icon: Radio,
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      numColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {c.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${c.iconBg}`}
                >
                  <IconComponent size={18} />
                </div>
              </div>

              <div
                className={`font-serif font-bold text-2xl lg:text-3xl tracking-tight leading-none mb-1.5 ${c.numColor}`}
              >
                {c.value}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium truncate pt-2 border-t border-slate-100 mt-2">
              {c.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
