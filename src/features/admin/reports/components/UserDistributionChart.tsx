import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import type { UserDistributionSlice } from '../types/reports.types';

interface UserDistributionChartProps {
  data: UserDistributionSlice[];
  totalUsers?: number;
}

export const UserDistributionChart: React.FC<UserDistributionChartProps> = ({
  data,
  totalUsers,
}) => {
  const computedTotal = totalUsers || data.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59

  const slicesWithOffsets = useMemo(() => {
    return data.reduce<Array<UserDistributionSlice & { dashLength: number; offset: number }>>(
      (acc, item) => {
        const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dashLength : 0;
        const sliceFraction = item.count / computedTotal;
        const dashLength = sliceFraction * circumference;
        return [
          ...acc,
          {
            ...item,
            dashLength,
            offset: prevOffset,
          },
        ];
      },
      []
    );
  }, [data, computedTotal, circumference]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-serif">User Distribution</h4>
            <p className="text-xs text-slate-500">Categorical membership breakdown.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
          All Users
        </span>
      </div>

      {/* Donut and Legend row */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg width="150" height="150" viewBox="0 0 140 140" className="rotate-[-90deg]">
            {slicesWithOffsets.map((item, idx) => (
              <circle
                key={`slice-${idx}`}
                cx="70"
                cy="70"
                r={radius}
                stroke={item.color}
                strokeWidth="18"
                fill="none"
                strokeDasharray={`${item.dashLength.toFixed(1)} ${circumference.toFixed(1)}`}
                strokeDashoffset={(-item.offset).toFixed(1)}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-85"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-lg font-bold text-slate-900 font-serif leading-none">
              {computedTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
              Total Users
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                <span className="font-semibold text-slate-800">{item.count.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-400">({item.pct})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
