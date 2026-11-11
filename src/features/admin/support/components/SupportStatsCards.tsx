import type React from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { TicketStatsData, TicketTabKey } from '../types/support.types';

interface SupportStatsCardsProps {
  stats: TicketStatsData;
  activeTab: TicketTabKey;
  onSelectTab: (tabKey: TicketTabKey) => void;
}

export const SupportStatsCards: React.FC<SupportStatsCardsProps> = ({
  stats,
  activeTab,
  onSelectTab,
}) => {
  const cards: Array<{
    id: TicketTabKey;
    title: string;
    count: number;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
    iconBg: string;
    iconColor: string;
    ringColor: string;
  }> = [
    {
      id: 'ALL',
      title: 'Total Tickets',
      count: stats.total,
      subtitle: 'All grievances & inquiries',
      icon: MessageSquare,
      accentColor: '#011F39',
      iconBg: 'bg-[#011F39]/10',
      iconColor: 'text-[#011F39]',
      ringColor: 'ring-[#011F39]',
    },
    {
      id: 'SUBMITTED',
      title: 'Open / Submitted',
      count: stats.open,
      subtitle: 'Awaiting triage or review',
      icon: AlertCircle,
      accentColor: '#D97706',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      ringColor: 'ring-amber-500',
    },
    {
      id: 'UNDER_REVIEW',
      title: 'In Progress',
      count: stats.inProgress,
      subtitle: 'Under active investigation',
      icon: Clock,
      accentColor: '#0284C7',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700',
      ringColor: 'ring-sky-500',
    },
    {
      id: 'RESOLVED',
      title: 'Resolved',
      count: stats.resolved,
      subtitle: 'Solutions delivered to citizens',
      icon: CheckCircle2,
      accentColor: '#16A34A',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      ringColor: 'ring-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeTab === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectTab(c.id)}
            className={`text-left bg-white rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
              isActive
                ? `border-transparent ring-2 ${c.ringColor} shadow-md bg-slate-50/50`
                : 'border-slate-200/90 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {c.title}
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
