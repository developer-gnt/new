import React, { useState } from 'react';
import { Calendar, SlidersHorizontal, RotateCw } from 'lucide-react';
import type { DatePresetKey, DateRangePreset } from '../types/reports.types';
import { getDatePresets } from '../data/reportsFixtures';
import { CustomDateModal } from './CustomDateModal';

interface ReportDateSelectorProps {
  selectedPreset: DatePresetKey;
  startDate: string;
  endDate: string;
  onSelectPreset: (presetKey: DatePresetKey) => void;
  onApplyCustom: (startDate: string, endDate: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  subText?: string;
}

export const ReportDateSelector: React.FC<ReportDateSelectorProps> = ({
  selectedPreset,
  startDate,
  endDate,
  onSelectPreset,
  onApplyCustom,
  onRefresh,
  isRefreshing = false,
  subText,
}) => {
  const presets: DateRangePreset[] = getDatePresets();
  const [customModalOpen, setCustomModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1.5 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Period:
          </span>
          {presets.map(p => {
            const isActive = selectedPreset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onSelectPreset(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#011F39] text-[#FAD465] shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {/* Custom Option */}
          <button
            type="button"
            onClick={() => setCustomModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              selectedPreset === 'CUSTOM'
                ? 'bg-[#011F39] text-[#FAD465] shadow-sm font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
            Custom
          </button>
        </div>

        {/* Right side: Active range info + Refresh button */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">
            {subText || (
              <span>
                <strong className="text-slate-700">{startDate}</strong> to{' '}
                <strong className="text-slate-700">{endDate}</strong>
              </span>
            )}
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Analytics"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#011F39]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <CustomDateModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        initialStartDate={startDate}
        initialEndDate={endDate}
        onApply={onApplyCustom}
      />
    </div>
  );
};
