import type React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { EventStatsSummary, EventStatusFilter } from '../types/events.types';

interface EventsStatsCardsProps {
  stats: EventStatsSummary;
  selectedStatus: EventStatusFilter;
  onSelectStatus: (status: EventStatusFilter) => void;
}

export const EventsStatsCards: React.FC<EventsStatsCardsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards: Array<{
    key: EventStatusFilter;
    label: string;
    count: number;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
    iconBg: string;
    iconColor: string;
    ringColor: string;
  }> = [
    {
      key: 'ALL',
      label: 'Total Events',
      count: stats.total,
      subtitle: 'All organized activities',
      icon: Calendar,
      accentColor: '#011F39',
      iconBg: 'bg-[#011F39]/10',
      iconColor: 'text-[#011F39]',
      ringColor: 'ring-[#011F39]',
    },
    {
      key: 'UPCOMING',
      label: 'Upcoming',
      count: stats.upcoming,
      subtitle: 'Open for registration',
      icon: Clock,
      accentColor: '#D97706',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      ringColor: 'ring-amber-500',
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      count: stats.completed,
      subtitle: 'Successfully concluded',
      icon: CheckCircle2,
      accentColor: '#16A34A',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      ringColor: 'ring-emerald-500',
    },
    {
      key: 'CANCELLED',
      label: 'Cancelled',
      count: stats.cancelled,
      subtitle: 'Withdrawn or rescheduled',
      icon: XCircle,
      accentColor: '#DC2626',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-700',
      ringColor: 'ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedStatus === c.key;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelectStatus(c.key)}
            className={`text-left bg-white rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
              isSelected
                ? `border-transparent ring-2 ${c.ringColor} shadow-md bg-slate-50/50`
                : 'border-slate-200/90 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {c.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg} ${c.iconColor}`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="font-serif font-bold text-2xl lg:text-3xl text-slate-900 tracking-tight leading-none mb-1.5">
              {c.count}
            </div>

            <div className="text-[11px] text-slate-500 font-medium truncate">
              {c.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
};
