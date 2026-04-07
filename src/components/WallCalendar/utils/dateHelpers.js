/**
 * Pure date utility functions for the Wall Calendar.
 * Enhanced with: isLeapYear, clampToMonth, edge-case grid guarantee.
 */

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  getISOWeek,
  format,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  addDays,
  getDaysInMonth,
} from 'date-fns';

/**
 * Returns true if the given year is a leap year.
 * @param {number} year
 * @returns {boolean}
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a given month/year,
 * correctly handling leap years.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function daysInMonth(year, month) {
  return getDaysInMonth(new Date(year, month, 1));
}

/**
 * Clamps a day number so it stays within the valid range for a month.
 * e.g. clampToMonth(31, 2026, 1) → 28 (Feb 2026 has 28 days)
 * @param {number} day
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function clampToMonth(day, year, month) {
  return Math.min(day, daysInMonth(year, month));
}

/**
 * Build a guaranteed 6-row (42-cell) calendar grid for a month.
 * Grid starts on Monday (ISO week, weekStartsOn: 1).
 *
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {{ date: Date, inMonth: boolean, weekNum: number }[][]} — 6 rows of 7 days
 */
export function buildCalendarGrid(year, month) {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const lastDay = endOfMonth(firstDay);

  const gridStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const allDays = [];
  let cursor = gridStart;

  // Always produce exactly 42 days
  while (allDays.length < 42) {
    allDays.push(cursor);
    cursor = addDays(cursor, 1);
  }

  // Group into 6 rows of 7
  const weeks = [];
  for (let i = 0; i < 42; i += 7) {
    const week = allDays.slice(i, i + 7).map((date) => ({
      date,
      inMonth: isSameMonth(date, firstDay),
      weekNum: getISOWeek(date),
    }));
    weeks.push(week);
  }

  return weeks;
}

/**
 * Format as "YYYY-MM" for monthNote key.
 * @param {Date} date
 * @returns {string}
 */
export function formatMonthKey(date) {
  return format(date, 'yyyy-MM');
}

/**
 * Format range as "YYYY-MM-DD:YYYY-MM-DD" for rangeNote key.
 * @param {Date} start
 * @param {Date} end
 * @returns {string}
 */
export function formatRangeKey(start, end) {
  return `${format(start, 'yyyy-MM-dd')}:${format(end, 'yyyy-MM-dd')}`;
}

/**
 * Format a date for display: "Apr 7"
 * @param {Date} date
 * @returns {string}
 */
export function formatDisplayDate(date) {
  return format(date, 'MMM d');
}

/**
 * Format a date as "YYYY-MM-DD" for holiday lookup.
 * @param {Date} date
 * @returns {string}
 */
export function formatHolidayKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Determine the visual type of a day cell.
 *
 * @param {Date} date
 * @param {Date} today
 * @param {Date|null} rangeStart
 * @param {Date|null} rangeEnd
 * @param {Date|null} hoverDate - live preview end while phase===1
 * @param {boolean} inMonth
 * @returns {'out'|'single'|'start'|'end'|'range'|'today'|'default'}
 */
export function getDayCellType(date, today, rangeStart, rangeEnd, hoverDate, inMonth) {
  if (!inMonth) return 'out';

  const isStart = rangeStart && isSameDay(date, rangeStart);
  const isEnd = rangeEnd && isSameDay(date, rangeEnd);

  // Same-day selection → single dot
  if (rangeStart && rangeEnd && isSameDay(rangeStart, rangeEnd)) {
    if (isStart) return 'single';
  }

  if (isStart) return rangeEnd ? 'start' : 'single';
  if (isEnd) return 'end';

  // Determine effective range (use hoverDate for live preview)
  const lo = rangeStart;
  const hiRaw = rangeEnd ?? hoverDate;
  if (lo && hiRaw) {
    const [low, high] = isAfter(lo, hiRaw) ? [hiRaw, lo] : [lo, hiRaw];
    if (isWithinInterval(date, { start: low, end: high })) {
      return 'range';
    }
  }

  if (isSameDay(date, today)) return 'today';
  return 'default';
}

/**
 * Returns whether two dates form a valid non-null range.
 * @param {Date|null} start
 * @param {Date|null} end
 * @returns {boolean}
 */
export function isValidRange(start, end) {
  if (!start || !end) return false;
  return !isAfter(start, end);
}

/**
 * Return (start, end) ordered so start ≤ end.
 * Handles same-day → returns [date, date].
 * @param {Date} a
 * @param {Date} b
 * @returns {[Date, Date]}
 */
export function orderRange(a, b) {
  return isAfter(a, b) ? [b, a] : [a, b];
}

/**
 * Get previous month's {year, month}.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {{ year: number, month: number }}
 */
export function getPrevMonth(year, month) {
  const d = subMonths(new Date(year, month, 1), 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/**
 * Get next month's {year, month}.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {{ year: number, month: number }}
 */
export function getNextMonth(year, month) {
  const d = addMonths(new Date(year, month, 1), 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/**
 * Format month/year for display: "April 2026"
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {string}
 */
export function formatMonthYear(year, month) {
  return format(new Date(year, month, 1), 'MMMM yyyy');
}
