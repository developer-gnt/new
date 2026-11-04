import React from 'react';
import { Users, HeartHandshake, MessageSquare, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import type { AnalyticsKpiData, DatePresetKey } from '../types/reports.types';

interface ReportKpiCardsProps {
  kpis?: AnalyticsKpiData;
  selectedPreset: DatePresetKey;
}

const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const ReportKpiCards: React.FC<ReportKpiCardsProps> = ({ kpis, selectedPreset }) => {
  const getPeriodComparisonLabel = (): string => {
    switch (selectedPreset) {
      case 'THIS_MONTH':
        return 'vs last month';
      case 'LAST_MONTH':
        return 'vs prev month';
      case 'THIS_QUARTER':
        return 'vs last quarter';
      case 'THIS_FY':
        return 'vs last FY';
      case 'LAST_FY':
        return 'vs prev FY';
      default:
        return 'vs prev period';
    }
  };

  const periodLabel = getPeriodComparisonLabel();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Users */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {kpis?.total_users != null ? kpis.total_users.toLocaleString('en-IN') : '—'}
          </div>
          <div className="mt-2 flex items-center text-xs">
            {(kpis?.users_growth_pct ?? 0) >= 0 ? (
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                +{kpis?.users_growth_pct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-600 font-medium">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                {kpis?.users_growth_pct}%
              </span>
            )}
            <span className="text-slate-400 ml-1.5">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Donations */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donations</span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <HeartHandshake className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {kpis ? formatINR(kpis.total_donations_amount) : '—'}
          </div>
          <div className="mt-2 flex items-center text-xs">
            {(kpis?.donations_growth_pct ?? 0) >= 0 ? (
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                +{kpis?.donations_growth_pct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-600 font-medium">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                {kpis?.donations_growth_pct}%
              </span>
            )}
            <span className="text-slate-400 ml-1.5">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Total Complaints */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</span>
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {kpis?.total_complaints != null ? kpis.total_complaints.toLocaleString('en-IN') : '—'}
          </div>
          <div className="mt-2 flex items-center text-xs">
            {(kpis?.complaints_growth_pct ?? 0) <= 0 ? (
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                {kpis?.complaints_growth_pct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-600 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                +{kpis?.complaints_growth_pct}%
              </span>
            )}
            <span className="text-slate-400 ml-1.5">{periodLabel}</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Events */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</span>
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {kpis?.total_events != null ? kpis.total_events.toLocaleString('en-IN') : '—'}
          </div>
          <div className="mt-2 flex items-center text-xs">
            {(kpis?.events_growth_pct ?? 0) >= 0 ? (
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                +{kpis?.events_growth_pct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-600 font-medium">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                {kpis?.events_growth_pct}%
              </span>
            )}
            <span className="text-slate-400 ml-1.5">{periodLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
