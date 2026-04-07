/**
 * WallCalendar — root component.
 *
 * Features:
 * - Swipe left/right on mobile for month navigation (≥50px threshold)
 * - Sticky month navigation on mobile
 * - Extensibility props: initialYear, initialMonth, customHolidays,
 *   onRangeChange, onNoteChange
 * - System dark mode detection with "Auto" theme
 *
 * @module WallCalendar
 *
 * @param {object}   [props]
 * @param {number}   [props.initialYear]       - Starting year (default: current)
 * @param {number}   [props.initialMonth]      - Starting month 0-indexed (default: current)
 * @param {object}   [props.customHolidays]    - Extra holidays merged with built-ins
 *                                               Format: { "YYYY-MM-DD": { name, color, emoji } }
 * @param {Function} [props.onRangeChange]     - Called with (start: Date|null, end: Date|null)
 * @param {Function} [props.onNoteChange]      - Called with (key: string, value: string)
 */

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { CalendarProvider, useCalendar, ACTIONS } from './context/CalendarContext';
import { SpiralBinding } from './components/SpiralBinding';
import { HeroPanel } from './components/HeroPanel';
import { MonthNavigation } from './components/MonthNavigation';
import { DateGrid } from './components/DateGrid';
import { NotesPanel } from './components/NotesPanel';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ExportButton } from './components/ExportButton';

// ─── Theme util ───────────────────────────────────────────────────────────────
function useIsDark(theme) {
  const systemDark = useMemo(() => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  }, []);
  return theme === 'dark' || (theme === 'auto' && systemDark);
}

// ─── Swipe hook ───────────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 50; // px

function useSwipe(onSwipeLeft, onSwipeRight) {
  const touchStartX = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (delta < -SWIPE_THRESHOLD) onSwipeLeft();
      else if (delta > SWIPE_THRESHOLD) onSwipeRight();
    },
    [onSwipeLeft, onSwipeRight],
  );

  return { onTouchStart, onTouchEnd };
}

// ─── Inner calendar ───────────────────────────────────────────────────────────
function CalendarInner() {
  const { state, dispatch } = useCalendar();
  const { theme, currentYear, currentMonth } = state;
  const isDark = useIsDark(theme);

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleSwipeLeft = useCallback(() => dispatch({ type: ACTIONS.NEXT_MONTH }), [dispatch]);
  const handleSwipeRight = useCallback(() => dispatch({ type: ACTIONS.PREV_MONTH }), [dispatch]);
  const { onTouchStart, onTouchEnd } = useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start py-6 sm:py-8 px-3 sm:px-4 transition-colors duration-400 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100'
          : 'bg-gradient-to-br from-[#f8fafc] via-[#f0f9ff] to-[#f8fafc] text-gray-800'
      }`}
    >
      {/* ── Top toolbar ── */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-1">
        <div
          className={`text-xs sm:text-sm font-black tracking-widest uppercase ${
            isDark ? 'text-slate-500' : 'text-gray-400'
          }`}
        >
          📅 Wall Calendar
        </div>
        <div className="flex items-center gap-2">
          <ExportButton isDark={isDark} />
          <ThemeSwitcher isDark={isDark} />
        </div>
      </div>

      {/* ── Calendar card ── */}
      <div
        className={`w-full max-w-4xl rounded-2xl overflow-hidden transition-all duration-400 ${
          isDark 
            ? 'bg-slate-800/95 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/5' 
            : 'bg-white shadow-[0_20px_50px_-12px_rgba(14,165,233,0.15),0_0_0_1px_rgba(14,165,233,0.05)]'
        }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Spiral binding strip */}
        <div className={`${isDark ? 'bg-slate-700' : 'bg-gray-100'} rounded-t-2xl`}>
          <SpiralBinding isDark={isDark} />
        </div>

        {/* Main: hero left + content right */}
        <div className="flex flex-col lg:flex-row">
          {/* Hero image panel */}
          <div className="lg:w-[55%] h-52 sm:h-72 lg:h-auto lg:min-h-[520px] relative">
            <HeroPanel isDark={isDark} />
          </div>

          {/* Content panel */}
          <div
            className={`lg:w-[45%] flex flex-col border-t lg:border-t-0 lg:border-l relative z-10 ${
              isDark 
                ? 'border-slate-700/60 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.2)]' 
                : 'border-slate-100 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]'
            }`}
          >
            {/* Sticky on mobile so month nav stays visible when scrolling grid */}
            <div
              className={`lg:static sticky top-0 z-10 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            >
              <MonthNavigation isDark={isDark} />
            </div>

            <DateGrid isDark={isDark} />
            <NotesPanel isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Usage hint */}
      <div
        className={`mt-5 text-[11px] font-medium text-center ${
          isDark ? 'text-slate-600' : 'text-gray-400'
        }`}
      >
        Click a date to start · Click it again to deselect
        <span className="ml-2 hidden sm:inline">· Swipe to change month on mobile</span>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function WallCalendar({
  initialYear,
  initialMonth,
  customHolidays,
  onRangeChange,
  onNoteChange,
} = {}) {
  return (
    <CalendarProvider
      initialYear={initialYear}
      initialMonth={initialMonth}
      customHolidays={customHolidays}
      onRangeChange={onRangeChange}
      onNoteChange={onNoteChange}
    >
      <CalendarInner />
    </CalendarProvider>
  );
}
