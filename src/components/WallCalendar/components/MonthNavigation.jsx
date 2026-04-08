/**
 * MonthNavigation — prev/next arrows, Today button, month + year dropdowns.
 */
import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import { MONTH_CONFIG } from '../constants/calendarData';
import { useCalendar, ACTIONS } from '../context/CalendarContext';

const YEARS = Array.from({ length: 51 }, (_, i) => 2000 + i); // 2000–2050

/** Thin wrapper that suppresses the native select arrow and shows a custom one. */
function SelectWrapper({ children, isDark, maxWidth }) {
  return (
    <div className="relative inline-flex items-center" style={{ maxWidth }}>
      {children}
      {/* Custom chevron — pointer-events-none so clicks pass through to the select */}
      <span
        className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px] leading-none ${
          isDark ? 'text-slate-400' : 'text-gray-400'
        }`}
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}

export const MonthNavigation = memo(function MonthNavigation({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { currentYear, currentMonth } = state;
  const today = new Date();
  const isToday =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const handlePrev = useCallback(() => dispatch({ type: ACTIONS.PREV_MONTH }), [dispatch]);
  const handleNext = useCallback(() => dispatch({ type: ACTIONS.NEXT_MONTH }), [dispatch]);
  const handleToday = useCallback(() => dispatch({ type: ACTIONS.GOTO_TODAY }), [dispatch]);

  const handleMonthChange = useCallback(
    (e) => {
      dispatch({
        type: ACTIONS.GOTO_MONTH,
        payload: { year: currentYear, month: Number(e.target.value) },
      });
    },
    [dispatch, currentYear],
  );

  const handleYearChange = useCallback(
    (e) => {
      const year = Number(e.target.value);
      if (!isNaN(year) && year >= 1900 && year <= 2100) {
        dispatch({
          type: ACTIONS.GOTO_MONTH,
          payload: { year, month: currentMonth },
        });
      }
    },
    [dispatch, currentMonth],
  );

  const selectBase = `w-full text-xs font-bold rounded-lg pl-1 pr-4 py-1 border-0 outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer transition-all ${
    isDark
      ? 'glass-premium-dark text-slate-200 hover:bg-slate-700/80 shadow-sm'
      : 'glass-premium-light text-gray-700 hover:bg-sky-50 shadow-sm'
  }`;

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 border-b ${
        isDark ? 'border-slate-700' : 'border-gray-100'
      }`}
    >
      {/* Prev arrow */}
      <motion.button
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        onClick={handlePrev}
        className={`p-1.5 rounded-xl transition-all shadow-sm hover:shadow-md ${
          isDark
            ? 'glass-premium-dark text-slate-400 hover:text-white'
            : 'glass-premium-light text-gray-500 hover:text-sky-600'
        }`}
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </motion.button>

      {/* Centre: month dropdown + year dropdown */}
      <div className="flex flex-col items-center gap-0.5">
        {/* Year — small text above */}
        <SelectWrapper isDark={isDark} maxWidth={70}>
          <select
            value={currentYear}
            onChange={handleYearChange}
            className={`${selectBase} text-[11px] tracking-widest text-center`}
            aria-label="Select year"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </SelectWrapper>

        {/* Month — large bold below */}
        <SelectWrapper isDark={isDark} maxWidth={130}>
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className={`${selectBase} text-base font-black uppercase tracking-wide text-center`}
            aria-label="Select month"
          >
            {MONTH_CONFIG.map((m, i) => (
              <option key={m.month} value={i}>{m.month.toUpperCase()}</option>
            ))}
          </select>
        </SelectWrapper>
      </div>

      {/* Right: Today pill + Next arrow */}
      <div className="flex items-center gap-1">
        {/* Today button — faded when on today's month */}
        <motion.button
          initial={false}
          animate={{ opacity: isToday ? 0.35 : 1 }}
          transition={{ duration: 0.2 }}
          whileHover={!isToday ? { scale: 1.05, y: -1 } : {}}
          whileTap={!isToday ? { scale: 0.95 } : {}}
          onClick={handleToday}
          disabled={isToday}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
            isDark
              ? 'glass-premium-dark text-sky-300 hover:bg-sky-900/40 hover:shadow-md'
              : 'glass-premium-light text-sky-600 hover:bg-sky-100 hover:shadow-md'
          } ${isToday ? 'pointer-events-none' : ''}`}
          aria-label="Go to today"
        >
          <CalendarCheck size={12} />
          <span className="hidden sm:inline">Today</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12, y: -1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNext}
          className={`p-1.5 rounded-xl transition-all shadow-sm hover:shadow-md ${
            isDark
              ? 'glass-premium-dark text-slate-400 hover:text-white'
              : 'glass-premium-light text-gray-500 hover:text-sky-600'
          }`}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
});
