import React from 'react';
import type { ImpactStats } from '../types/userHome.types';
import { Users, FileText, Handshake, ArrowRight } from 'lucide-react';

interface ImpactSectionProps {
  stats: ImpactStats;
  onDetailsPress?: () => void;
}

const indianNumberFormatter = new Intl.NumberFormat('en-IN');

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  stats,
  onDetailsPress,
}) => {
  const metrics = [
    {
      key: 'members',
      label: 'Active Members',
      val: stats.members,
      icon: <Users size={18} className="text-[#FAD465]" strokeWidth={1.8} />,
    },
    {
      key: 'complaints',
      label: 'Complaints Handled',
      val: stats.complaintsHandled,
      icon: <FileText size={18} className="text-[#FAD465]" strokeWidth={1.8} />,
    },
    {
      key: 'cases',
      label: 'Cases Resolved',
      val: stats.casesResolved,
      icon: <Handshake size={18} className="text-[#FAD465]" strokeWidth={1.8} />,
    },
  ];

  return (
    <div className="w-full bg-[#072444] rounded-2xl p-5 sm:p-6 border border-amber-400/30 border-t-[3px] border-t-amber-500 shadow-xl text-white">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-[#FAD465] uppercase tracking-wider">
              Verified National Mission
            </span>
          </div>
          <h3
            style={{ color: '#FFFFFF' }}
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-white !text-white"
          >
            Our Impact
          </h3>
        </div>

        {onDetailsPress && (
          <button
            type="button"
            onClick={onDetailsPress}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FAD465] hover:text-amber-300 transition-colors cursor-pointer"
            aria-label="View Details on Our Impact"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {metrics.map(metric => (
          <div
            key={metric.key}
            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center mb-1.5 sm:mb-2.5 shrink-0">
              {metric.icon}
            </div>
            <div className="text-sm sm:text-2xl font-extrabold text-white tracking-tight tabular-nums truncate w-full">
              {indianNumberFormatter.format(metric.val)}+
            </div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5 sm:mt-1 leading-tight line-clamp-2">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

