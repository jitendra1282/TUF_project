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

  // ─── Resizable Notes Panel Logic ───
  const notesContainerRef = useRef(null);
  const notesHeightRef = useRef(250);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startHeight = notesHeightRef.current;

    const onMove = (moveEvent) => {
      const currentY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      const deltaY = startY - currentY;
      const newHeight = Math.max(120, Math.min(startHeight + deltaY, window.innerHeight * 0.7));
      notesHeightRef.current = newHeight;
      if (notesContainerRef.current) {
        notesContainerRef.current.style.height = `${newHeight}px`;
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  }, []);

  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-colors duration-400 ${
        isDark
          ? 'bg-[#181a1f] text-slate-100'
          : 'bg-[#f0f9ff] text-gray-800'
      }`}
    >
      {/* ── Top toolbar ── */}
      <div className={`w-full flex items-center justify-between p-3 lg:px-6 shadow-sm z-20 relative ${
        isDark ? 'bg-[#1e2025]' : 'bg-white'
      }`}>
        <div
          className={`text-sm lg:text-base font-black tracking-widest uppercase ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}
        >
          📅 Wall Calendar
        </div>
        <div className="flex items-center gap-2">
          <ExportButton isDark={isDark} />
          <ThemeSwitcher isDark={isDark} />
        </div>
      </div>

      {/* ── Calendar card (Full Screen Flex) ── */}
      <div
        className="w-full flex-1 flex flex-col overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Main: hero left + content right */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Hero image panel */}
          <div className="lg:w-1/2 h-48 sm:h-72 lg:h-auto relative flex flex-col">
            <div className="flex-1 w-full h-full min-h-[400px]">
              <HeroPanel isDark={isDark} />
            </div>
          </div>

          {/* Content panel */}
          <div
            className={`lg:w-1/2 flex flex-col border-t lg:border-t-0 lg:border-l relative z-10 ${
              isDark 
                ? 'bg-[#1a1d21] border-slate-700/60' 
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Sticky on mobile so month nav stays visible when scrolling grid */}
            <div
              className={`lg:static sticky top-0 z-10 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}
            >
              <MonthNavigation isDark={isDark} />
            </div>

            <DateGrid isDark={isDark} />
            {/* Resizer Handle */}
            <div
              className={`h-4 w-full cursor-ns-resize flex flex-col items-center justify-center transition-colors select-none ${
                isDark ? 'hover:bg-slate-800 border-t border-slate-700/60' : 'hover:bg-gray-100 border-t border-gray-100'
              }`}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              role="separator"
              aria-orientation="horizontal"
              title="Drag to resize notes panel"
            >
              <div className={`w-8 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`} />
            </div>

            <div
              ref={notesContainerRef}
              style={{ height: '250px' }}
              className="flex flex-col min-h-[120px]"
            >
              <NotesPanel isDark={isDark} />
            </div>
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
