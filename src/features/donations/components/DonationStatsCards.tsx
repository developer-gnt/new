import React from 'react';
import { Banknote, Users, HeartHandshake, RefreshCw } from 'lucide-react';
import type { DonationStatItem } from '../types/donations.types';

interface DonationStatsCardsProps {
  stats: DonationStatItem[];
}

export const DonationStatsCards: React.FC<DonationStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const isFirst = idx === 0;
        const isSecond = idx === 1;
        const isThird = idx === 2;

        const iconBg = isFirst
          ? 'bg-[#011F39]/10 text-[#011F39]'
          : isSecond
          ? 'bg-amber-100 text-amber-700'
          : isThird
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-[#FAD465]/30 text-[#011F39]';

        const IconComponent = isFirst
          ? Banknote
          : isSecond
          ? Users
          : isThird
          ? HeartHandshake
          : RefreshCw;

        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 font-serif">
                {stat.value}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{stat.supportText}</span>
                {stat.subLabel && (
                  <span className="text-slate-400 text-[11px]">{stat.subLabel}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
