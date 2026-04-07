/**
 * DateGrid — premium polished version.
 *
 * Enhancements:
 * - Connected range pill: rounded only at start/end, flat in the middle
 * - Hover glow ring on all in-month cells
 * - Spring pop-in for range endpoints with subtle shadow
 * - Press scale feedback via whileTap
 * - Smooth range fill with motion
 */
import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isSameDay } from 'date-fns';
import { WEEKDAY_LABELS, HOLIDAYS } from '../constants/calendarData';
import {
  buildCalendarGrid,
  getDayCellType,
  formatHolidayKey,
} from '../utils/dateHelpers';
import { useCalendar, ACTIONS } from '../context/CalendarContext';

// ─── Weekday Header Row ───────────────────────────────────────────────────────
const WeekdayHeaders = memo(function WeekdayHeaders({ isDark }) {
  return (
    <div className="grid grid-cols-8 px-2 pt-2 pb-1">
      {WEEKDAY_LABELS.map((label, i) => (
        <div
          key={label + i}
          className={`text-center text-[10px] font-bold tracking-widest uppercase py-1.5
            transition-colors duration-200 ${
            i === 0
              ? isDark ? 'text-slate-700' : 'text-gray-200'
              : i >= 6
              ? 'text-sky-400 font-extrabold'
              : isDark ? 'text-slate-400' : 'text-gray-400'
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
});

// ─── Holiday Tooltip ──────────────────────────────────────────────────────────
const HolidayTooltip = memo(function HolidayTooltip({ holiday, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.88 }}
          transition={{ duration: 0.18, ease: [0.34, 1.3, 0.64, 1] }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 bg-gray-900/95 backdrop-blur-sm
            text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg
            whitespace-nowrap shadow-xl shadow-black/30 ring-1 ring-white/10">
            <span className="text-sm leading-none">{holiday.emoji}</span>
            <span>{holiday.name}</span>
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-gray-900/95 rotate-45 -mt-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Day Cell ─────────────────────────────────────────────────────────────────
const DayCell = memo(function DayCell({
  dayInfo,
  today,
  isDark,
  dispatch,
  rangeStart,
  rangeEnd,
  hoverDate,
  clickPhase,
  mergedHolidays,
}) {
  const { date, inMonth } = dayInfo;
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const holidayKey = formatHolidayKey(date);
  const holiday = mergedHolidays[holidayKey];

  const cellType = useMemo(
    () => getDayCellType(date, today, rangeStart, rangeEnd, hoverDate, inMonth),
    [date, today, rangeStart, rangeEnd, hoverDate, inMonth],
  );

  // Rapid-click guard
  const lastClickRef = useRef(0);
  const handleClick = useCallback(() => {
    if (!inMonth) return;
    const now = Date.now();
    if (now - lastClickRef.current < 80) return;
    lastClickRef.current = now;
    dispatch({ type: ACTIONS.SELECT_DATE, payload: { date } });
  }, [date, inMonth, dispatch]);

  const handleMouseEnter = useCallback(() => {
    if (inMonth && clickPhase === 1) {
      dispatch({ type: ACTIONS.HOVER_DATE, payload: { date } });
    }
    if (holiday && inMonth) setTooltipVisible(true);
  }, [date, inMonth, clickPhase, holiday, dispatch]);

  const handleMouseLeave = useCallback(() => {
    setTooltipVisible(false);
    if (inMonth && clickPhase === 1) dispatch({ type: ACTIONS.CLEAR_HOVER });
  }, [inMonth, clickPhase, dispatch]);

  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ' ') && inMonth) {
      e.preventDefault();
      dispatch({ type: ACTIONS.SELECT_DATE, payload: { date } });
    }
  }, [date, inMonth, dispatch]);

  // ─── Derived flags ──────────────────────────────────────────────────────────
  const isWeekend = date.getDay() === 6 || date.getDay() === 0;
  const isRangeEndpoint = cellType === 'start' || cellType === 'end' || cellType === 'single';
  const isStart = cellType === 'start' || cellType === 'single';
  const isEnd   = cellType === 'end'   || cellType === 'single';
  const isRange = cellType === 'range';
  const isToday = cellType === 'today';

  // Effective range used for connector detection
  const effectiveEnd = rangeEnd ?? hoverDate;
  const hasActiveRange = rangeStart && effectiveEnd;

  // Is this cell immediately after rangeStart (first range-fill cell)?
  // Is this cell immediately before rangeEnd (last range-fill cell)?
  // Used to decide rounded ends on the fill strip.
  const isFirstRange = isRange && rangeStart && isSameDay(
    new Date(date.getTime() - 86400000),
    rangeStart,
  );
  const isLastRange = isRange && effectiveEnd && isSameDay(
    new Date(date.getTime() + 86400000),
    effectiveEnd,
  );

  // ─── Text color ─────────────────────────────────────────────────────────────
  const numberColor =
    isRangeEndpoint ? 'text-white font-bold' :
    isRange         ? (isDark ? 'text-sky-100 font-semibold' : 'text-sky-800 font-semibold') :
    isToday         ? (isDark ? 'text-sky-300 font-bold' : 'text-sky-600 font-bold') :
    !inMonth        ? (isDark ? 'text-slate-700' : 'text-gray-300') :
    isWeekend       ? 'text-sky-500 font-semibold' :
                      (isDark ? 'text-slate-200' : 'text-gray-700');

  return (
    <motion.div
      className={`group day-cell relative flex flex-col items-center justify-center h-full min-h-0
        select-none ${inMonth ? 'cursor-pointer day-cell-glow' : 'cursor-default pointer-events-none'}
        transition-shadow duration-150`}
      style={{ touchAction: 'manipulation' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={inMonth ? 0 : -1}
      role="button"
      aria-label={`${date.toDateString()}${holiday ? `, ${holiday.name}` : ''}${isToday ? ', today' : ''}${isRangeEndpoint ? ', selected' : ''}`}
      aria-pressed={isRangeEndpoint}
      aria-disabled={!inMonth}
      whileHover={inMonth ? { scale: 1.08 } : {}}
      whileTap={inMonth ? { scale: 0.92 } : {}}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
    >
      {/* ── Range fill strip (connected pill) ── */}
      {isRange && (
        <motion.div
          className={`absolute inset-y-[4px] left-0 right-0 z-0
            ${isFirstRange ? 'rounded-l-full' : ''}
            ${isLastRange  ? 'rounded-r-full' : ''}
            ${isDark ? 'bg-sky-900/50' : 'bg-sky-100'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        />
      )}

      {/* ── Half-strip connectors on endpoint cells ── */}
      {isStart && !isEnd && hasActiveRange && (
        <div className={`absolute inset-y-[4px] right-0 left-1/2 z-0
          ${isDark ? 'bg-sky-900/50' : 'bg-sky-100'}`} />
      )}
      {isEnd && !isStart && rangeStart && (
        <div className={`absolute inset-y-[4px] left-0 right-1/2 z-0
          ${isDark ? 'bg-sky-900/50' : 'bg-sky-100'}`} />
      )}

      {/* ── Today marker ring ── */}
      {isToday && (
        <motion.div
          className={`absolute inset-1 rounded-xl ring-2
            ${isDark ? 'ring-sky-500/80 bg-sky-950/30' : 'ring-sky-400 bg-sky-50/60'}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        />
      )}

      {/* ── Endpoint filled circle ── */}
      {isRangeEndpoint && (
        <motion.div
          className={`absolute z-10 w-9 h-9 rounded-full
            bg-sky-500 shadow-lg shadow-sky-500/40
            flex items-center justify-center`}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        />
      )}

      {/* ── Default hover fill ── */}
      {cellType === 'default' && inMonth && (
        <div className={`absolute inset-1 rounded-xl opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          ${isDark ? 'bg-slate-700/50' : 'bg-sky-50'}`} />
      )}

      {/* ── Date number ── */}
      <span className={`relative z-10 text-sm leading-none transition-colors duration-100 ${numberColor}`}>
        {date.getDate()}
      </span>

      {/* ── Holiday dot ── */}
      {holiday && inMonth && (
        <motion.div
          className="relative z-10 mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: holiday.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, type: 'spring', stiffness: 600 }}
          aria-hidden="true"
        />
      )}

      {/* ── Holiday tooltip ── */}
      {holiday && inMonth && <HolidayTooltip holiday={holiday} visible={tooltipVisible} />}
    </motion.div>
  );
});

// ─── Date Grid ────────────────────────────────────────────────────────────────
export function DateGrid({ isDark }) {
  const { state, dispatch } = useCalendar();
  const {
    currentYear,
    currentMonth,
    rangeStart,
    rangeEnd,
    hoverDate,
    animationDirection,
    clickPhase,
    customHolidays,
  } = state;

  const today = useMemo(() => new Date(), []);

  const weeks = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const mergedHolidays = useMemo(
    () => ({ ...HOLIDAYS, ...customHolidays }),
    [customHolidays],
  );

  return (
    <div 
      className="flex-1 px-2 pb-3 overflow-hidden flex flex-col" 
      onDoubleClick={() => dispatch({ type: ACTIONS.CLEAR_SELECTION })}
    >
      <WeekdayHeaders isDark={isDark} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          className="flex-1 flex flex-col min-h-0"
          initial={{ x: animationDirection === 'next' ? 60 : -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: animationDirection === 'next' ? -60 : 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-8 flex-1 min-h-0">
              {/* ISO Week number */}
              <div
                className={`flex items-center justify-center text-[9px] font-bold
                  tracking-wider h-full transition-colors duration-150 ${
                  isDark ? 'text-slate-700' : 'text-gray-200'
                }`}
                aria-label={`Week ${week[0].weekNum}`}
              >
                {week[0].weekNum}
              </div>

              {week.map((dayInfo) => (
                <DayCell
                  key={dayInfo.date.toISOString()}
                  dayInfo={dayInfo}
                  today={today}
                  isDark={isDark}
                  dispatch={dispatch}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  hoverDate={hoverDate}
                  clickPhase={clickPhase}
                  mergedHolidays={mergedHolidays}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
