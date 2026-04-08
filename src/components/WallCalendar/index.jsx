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
import { SeasonalBackground } from './components/SeasonalBackground';

import logoImg from '../../assets/logo.png';

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
  const { theme, currentYear, currentMonth, weatherEnabled } = state;
  const isDark = useIsDark(theme);

  const handleToggleWeather = useCallback(
    () => dispatch({ type: ACTIONS.TOGGLE_WEATHER }),
    [dispatch],
  );

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleSwipeLeft = useCallback(() => dispatch({ type: ACTIONS.NEXT_MONTH }), [dispatch]);
  const handleSwipeRight = useCallback(() => dispatch({ type: ACTIONS.PREV_MONTH }), [dispatch]);
  const { onTouchStart, onTouchEnd } = useSwipe(handleSwipeLeft, handleSwipeRight);

  // ─── Resizable Notes Panel Logic ───
  const notesContainerRef = useRef(null);
  // On mobile use a smaller default, on desktop 250px
  const notesHeightRef = useRef(
    typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 250
  );

  const startDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startHeight = notesHeightRef.current;

    const onMove = (moveEvent) => {
      const currentY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      const deltaY = startY - currentY;
      const isMobile = window.innerWidth < 640;
      const minH = isMobile ? window.innerHeight * 0.18 : window.innerHeight * 0.25;
      const maxH = isMobile ? window.innerHeight * 0.45 : window.innerHeight * 0.5;
      const newHeight = Math.max(minH, Math.min(startHeight + deltaY, maxH));
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
      className={`h-screen h-[100dvh] w-full flex flex-col overflow-hidden relative ${
        isDark ? 'text-slate-100' : 'text-gray-800'
      }`}
    >
      {/* ── Seasonal animated background ── */}
      {weatherEnabled && <SeasonalBackground month={currentMonth} isDark={isDark} />}

      {/* ── Top toolbar ── */}
      <div className={`w-full flex items-center justify-between px-3 py-2 shadow-sm z-20 relative ${
        isDark
          ? 'bg-[#1e2025]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-white/80 backdrop-blur-md border-b border-black/5'
      }`}>
        <div
          className={`text-xs sm:text-sm lg:text-base font-black tracking-widest uppercase flex items-center gap-1.5 min-w-0 ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}
        >
          <img src={logoImg} alt="App Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm flex-shrink-0" />
          <span className="truncate hidden xs:block">Jitendra's Calendar</span>
          <span className="truncate xs:hidden">Calendar</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Weather toggle */}
          <button
            id="weather-toggle-btn"
            onClick={handleToggleWeather}
            title={weatherEnabled ? 'Stop weather effects' : 'Start weather effects'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
              weatherEnabled
                ? isDark
                  ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'
                  : 'bg-sky-100 text-sky-600 hover:bg-sky-200 border border-sky-200'
                : isDark
                  ? 'glass-premium-dark text-slate-400 hover:text-slate-200'
                  : 'glass-premium-light text-gray-400 hover:text-gray-600'
            }`}
            aria-label={weatherEnabled ? 'Disable weather effects' : 'Enable weather effects'}
            aria-pressed={weatherEnabled}
          >
            <span className="text-sm leading-none">{weatherEnabled ? '🌤️' : '⛅'}</span>
            <span className="hidden sm:inline">{weatherEnabled ? 'Stop Effects' : 'Effects Off'}</span>
          </button>
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
        {/* Main row: hero left + content right — side-by-side at sm+ (covers landscape phones too) */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">

          {/* Hero — full width in portrait, fixed slice in landscape/desktop */}
          <div className="cal-hero-wrapper sm:w-2/5 lg:w-1/2 relative flex-shrink-0">
            <div className="w-full h-full">
              <HeroPanel isDark={isDark} />
            </div>
          </div>

          {/* Content panel — fills remaining */}
          <div
            className={`cal-content-panel sm:w-3/5 lg:w-1/2 flex flex-col flex-1 min-h-0 border-t sm:border-t-0 sm:border-l lg:border-l relative z-10 ${
              isDark
                ? 'bg-[#1a1d21]/92 border-slate-700/60 backdrop-blur-sm'
                : 'bg-white/92 border-slate-200 backdrop-blur-sm'
            }`}
          >
            {/* Month nav — sticky on mobile portrait, static in row layout */}
            <div className={`sm:static sticky top-0 z-10 ${
              isDark ? 'bg-[#1a1d21]/95' : 'bg-white/95'
            } backdrop-blur-sm`}>
              <MonthNavigation isDark={isDark} />
            </div>

            {/* Date grid — fills all available flex space */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <DateGrid isDark={isDark} />
            </div>

            {/* Resizer handle */}
            <div
              className={`h-5 w-full cursor-ns-resize flex flex-col items-center justify-center transition-colors select-none touch-none ${
                isDark ? 'hover:bg-slate-800 border-t border-slate-700/60' : 'hover:bg-gray-100 border-t border-gray-100'
              }`}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              role="separator"
              aria-orientation="horizontal"
              title="Drag to resize notes panel"
            >
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`} />
            </div>

            {/* Notes panel */}
            <div
              ref={notesContainerRef}
              className="cal-notes-container flex flex-col flex-shrink-0"
              style={{ height: typeof window !== 'undefined' && window.innerWidth < 640 ? '160px' : '220px' }}
            >
              <NotesPanel isDark={isDark} />
            </div>
          </div>
        </div>
      </div>

      {/* Usage hint — hidden on very small screens to save space */}
      <div
        className={`hidden sm:block text-[11px] font-medium text-center py-1 ${
          isDark ? 'text-slate-600' : 'text-gray-400'
        }`}
      >
        Tap a date to start · Tap again to deselect · Swipe to change month
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
