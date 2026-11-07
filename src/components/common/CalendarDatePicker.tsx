import type React from 'react';
import { useState, useEffect, useRef, useId, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatDateToDMY, calculateAge } from '../../utils/age';

export interface CalendarDatePickerProps {
  value: string; // ISO date string: YYYY-MM-DD
  onChange: (dateIso: string) => void;
  label?: string;
  required?: boolean;
  minAge?: number; // e.g. 18 for mandatory 18+ check
  maxDate?: string; // ISO string: YYYY-MM-DD
  minDate?: string; // ISO string: YYYY-MM-DD (defaults to 1920-01-01)
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Pure constants computed once outside render
const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const TODAY_ISO = NOW.toISOString().split('T')[0];

function computeDefaultCutoff(minAge?: number, propMaxDate?: string): string {
  if (propMaxDate) return propMaxDate;
  if (minAge && minAge > 0) {
    const cutoff = new Date(NOW.getFullYear() - minAge, NOW.getMonth(), NOW.getDate());
    return cutoff.toISOString().split('T')[0];
  }
  return TODAY_ISO;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
  label,
  required,
  minAge,
  maxDate: propMaxDate,
  minDate = '1920-01-01',
  error,
  placeholder = 'dd-mm-yyyy',
  disabled = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalId = useId();

  // Compute effective maxDate (e.g. 18 years ago today if minAge is set)
  const effectiveMaxDate = useMemo(
    () => computeDefaultCutoff(minAge, propMaxDate),
    [minAge, propMaxDate]
  );

  // Popover open state
  const [isOpen, setIsOpen] = useState(false);

  // Derive initial year and month
  const initialYearMonth = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    if (effectiveMaxDate) {
      const [y, m] = effectiveMaxDate.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    return { year: 2000, month: 0 };
  }, [value, effectiveMaxDate]);

  // Calendar navigation state (year & month)
  const [viewYear, setViewYear] = useState<number>(initialYearMonth.year);
  const [viewMonth, setViewMonth] = useState<number>(initialYearMonth.month);

  // View mode switcher: 'days' | 'months' | 'years' | 'decades'
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years' | 'decades'>('days');
  const [decadeStart, setDecadeStart] = useState<number>(() =>
    Math.floor(initialYearMonth.year / 10) * 10
  );

  // Keep decade aligned with viewYear
  useEffect(() => {
    setDecadeStart(Math.floor(viewYear / 10) * 10);
  }, [viewYear]);

  // Reset view mode on popover close
  useEffect(() => {
    if (!isOpen) {
      setViewMode('days');
    }
  }, [isOpen]);

  // Click outside and Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Generate Year & Decade options
  const startYear = parseInt(minDate.split('-')[0], 10) || 1920;
  const startDecade = Math.floor(startYear / 10) * 10;
  const currentDecade = Math.floor(CURRENT_YEAR / 10) * 10;

  // 12-year grid for decade view: from (decadeStart - 1) to (decadeStart + 10)
  const decadeGridYears = useMemo(() => {
    const list: Array<{
      year: number;
      isCurrentDecade: boolean;
      isDisabled: boolean;
      isUnderAge: boolean;
    }> = [];
    for (let y = decadeStart - 1; y <= decadeStart + 10; y++) {
      const isSelectable = y >= startYear && y <= CURRENT_YEAR;
      const isUnderAge = effectiveMaxDate
        ? y > parseInt(effectiveMaxDate.split('-')[0], 10)
        : false;
      list.push({
        year: y,
        isCurrentDecade: y >= decadeStart && y <= decadeStart + 9,
        isDisabled: !isSelectable,
        isUnderAge,
      });
    }
    return list;
  }, [decadeStart, startYear, effectiveMaxDate]);

  // Available decades for direct switching
  const availableDecades = useMemo(() => {
    const list: number[] = [];
    for (let d = currentDecade; d >= startDecade; d -= 10) {
      list.push(d);
    }
    return list;
  }, [currentDecade, startDecade]);

  // Calculate days in current view month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isoString: string;
      isDisabled: boolean;
    }> = [];

    // Previous month overflow days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const iso = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      days.push({
        day: prevDay,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isoString: iso,
        isDisabled: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAfterMax = effectiveMaxDate ? iso > effectiveMaxDate : false;
      const isBeforeMin = minDate ? iso < minDate : false;
      days.push({
        day,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isoString: iso,
        isDisabled: isAfterMax || isBeforeMin,
      });
    }

    // Next month overflow days (fill up grid to 35 or 42 cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const iso = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isoString: iso,
        isDisabled: true,
      });
    }

    return days;
  }, [viewYear, viewMonth, effectiveMaxDate, minDate]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Select a date
  const handleSelectDate = (iso: string) => {
    onChange(iso);
    setIsOpen(false);
  };

  // Quick 18 years cutoff shortcut
  const handleSet18Cutoff = () => {
    if (effectiveMaxDate) {
      onChange(effectiveMaxDate);
      const [y, m] = effectiveMaxDate.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
      setIsOpen(false);
    }
  };

  const calculatedApplicantAge = value ? calculateAge(value) : null;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Label and Badge */}
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={internalId}
            className="text-xs font-semibold text-slate-700"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {minAge && minAge > 0 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Must be {minAge}+ Years
            </span>
          )}
        </div>
      )}

      {/* Input Box Trigger */}
      <div
        id={internalId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            // When opening, ensure view centers on current value if present
            if (!isOpen && value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
              const [y, m] = value.split('-').map(Number);
              setViewYear(y);
              setViewMonth(m - 1);
            }
            setIsOpen(!isOpen);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition cursor-pointer select-none ${
          error
            ? 'border-rose-300 bg-rose-50/20'
            : isOpen
            ? 'border-[#011F39] bg-white ring-2 ring-[#011F39]/10 shadow-xs'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <CalendarIcon
            size={18}
            className={`shrink-0 ${error ? 'text-rose-500' : 'text-slate-400'}`}
          />
          {value ? (
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm font-semibold text-slate-900 tracking-wide font-mono">
                {formatDateToDMY(value)}
              </span>
              {calculatedApplicantAge !== null && (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                  {calculatedApplicantAge} yrs
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-400 font-medium font-mono">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Clear date"
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#011F39]' : ''
            }`}
          />
        </div>
      </div>

      {/* Field Error Message */}
      {error && (
        <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE CALENDAR DROPDOWN POPOVER                          */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-full sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* VIEW MODE: DAYS */}
          {viewMode === 'days' && (
            <div className="animate-in fade-in duration-100">
              {/* Calendar Header: Month & Year Controls */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] transition cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    aria-label="Select month"
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#0B2F52] hover:bg-white hover:shadow-xs transition cursor-pointer"
                  >
                    {MONTH_NAMES[viewMonth]}
                  </button>
                  <span className="text-slate-300 text-xs px-0.5 font-light">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDecadeStart(Math.floor(viewYear / 10) * 10);
                      setViewMode('years');
                    }}
                    aria-label="Select year"
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#0B2F52] hover:bg-white hover:shadow-xs transition cursor-pointer"
                  >
                    {viewYear}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Weekday Names Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {WEEKDAY_NAMES.map((weekday) => (
                  <span
                    key={weekday}
                    className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1"
                  >
                    {weekday}
                  </span>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => {
                  const isSelected = value === item.isoString;
                  const isToday = TODAY_ISO === item.isoString;

                  return (
                    <button
                      key={`${item.isoString}-${idx}`}
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => {
                        if (!item.isDisabled) handleSelectDate(item.isoString);
                      }}
                      className={`h-9 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#011F39] text-[#FAD465] font-bold shadow-md ring-2 ring-[#011F39]/20'
                          : item.isDisabled
                          ? 'text-slate-300 opacity-30 cursor-not-allowed bg-transparent'
                          : !item.isCurrentMonth
                          ? 'text-slate-400 opacity-50 hover:bg-slate-50'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#011F39]'
                      } ${
                        isToday && !isSelected
                          ? 'border border-[#FAD465] font-bold text-[#011F39]'
                          : ''
                      }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE: MONTHS SELECTOR */}
          {viewMode === 'months' && (
            <div className="animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewYear((y) => y - 1)}
                  aria-label="Previous Year"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] transition cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecadeStart(Math.floor(viewYear / 10) * 10);
                    setViewMode('years');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-[#0B2F52] bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 transition cursor-pointer"
                >
                  <span>Year {viewYear}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewYear((y) => y + 1)}
                  aria-label="Next Year"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 12 Months Grid: 3 cols x 4 rows */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {MONTH_NAMES.map((name, idx) => {
                  const isSelected = viewMonth === idx;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setViewMonth(idx);
                        setViewMode('days');
                      }}
                      className={`h-11 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#011F39] text-[#FAD465] font-bold shadow-md ring-2 ring-[#011F39]/20'
                          : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-[#011F39] border border-slate-200/70'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE: YEARS SELECTOR */}
          {viewMode === 'years' && (
            <div className="animate-in fade-in duration-100">
              {/* Header: Decade Pagination */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecadeStart((d) => Math.max(startDecade, d - 10))}
                  disabled={decadeStart <= startDecade}
                  aria-label="Previous Decade"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('decades')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-[#0B2F52] bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 transition cursor-pointer"
                >
                  <span>{decadeStart} – {decadeStart + 9}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setDecadeStart((d) => Math.min(currentDecade, d + 10))}
                  disabled={decadeStart >= currentDecade}
                  aria-label="Next Decade"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#011F39] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 12 Years Grid: 3 cols x 4 rows */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {decadeGridYears.map((item) => {
                  const isSelected = viewYear === item.year;
                  return (
                    <button
                      key={item.year}
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => {
                        if (!item.isDisabled) {
                          setViewYear(item.year);
                          setViewMode('days');
                        }
                      }}
                      className={`h-11 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#011F39] text-[#FAD465] font-bold shadow-md ring-2 ring-[#011F39]/20'
                          : item.isDisabled
                          ? 'text-slate-300 opacity-30 cursor-not-allowed border border-transparent'
                          : !item.isCurrentDecade
                          ? 'text-slate-400 opacity-60 hover:bg-slate-50 border border-dashed border-slate-200'
                          : item.isUnderAge
                          ? 'bg-amber-50/70 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                          : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-[#011F39] border border-slate-200/70'
                      }`}
                    >
                      <span>{item.year}</span>
                      {item.isUnderAge && item.isCurrentDecade && (
                        <span className="text-[9px] font-medium text-amber-700 leading-none mt-0.5">
                          &lt;18 yrs
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE: DECADES SELECTOR */}
          {viewMode === 'decades' && (
            <div className="animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('years')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#011F39] px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <ChevronLeft size={15} />
                  <span>Years</span>
                </button>
                <span className="text-xs font-bold text-[#0B2F52]">
                  Select Decade
                </span>
                <span className="w-12" />
              </div>

              {/* Decades Grid: 3 cols x 4 rows */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {availableDecades.map((dec) => {
                  const isSelected = decadeStart === dec;
                  return (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => {
                        setDecadeStart(dec);
                        setViewMode('years');
                      }}
                      className={`h-11 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#011F39] text-[#FAD465] font-bold shadow-md ring-2 ring-[#011F39]/20'
                          : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-[#011F39] border border-slate-200/70'
                      }`}
                    >
                      {dec}s
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Shortcuts & Action Toolbar */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {viewMode !== 'days' ? (
              <button
                type="button"
                onClick={() => setViewMode('days')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#011F39] px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <ChevronLeft size={13} />
                <span>Calendar</span>
              </button>
            ) : minAge && minAge > 0 ? (
              <button
                type="button"
                onClick={handleSet18Cutoff}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition cursor-pointer"
              >
                <Clock size={12} />
                <span>18 Years Cutoff</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Select Date</span>
            )}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-[#011F39] hover:bg-[#011F39]/10 px-3 py-1 rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
