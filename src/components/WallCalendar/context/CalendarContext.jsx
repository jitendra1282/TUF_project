/**
 * Calendar context + reducer — enhanced with:
 * - localStorage persistence (notes + theme)
 * - GOTO_TODAY action
 * - SET_YEAR for dynamic year control
 * - SET_CUSTOM_HOLIDAYS for external data injection
 * - onRangeChange / onNoteChange callback support
 * - Graceful degradation when storage is unavailable
 */

import { createContext, useContext, useReducer, useMemo, useEffect, useRef } from 'react';
import { orderRange, getPrevMonth, getNextMonth } from '../utils/dateHelpers';

// ─── Safe localStorage helpers ────────────────────────────────────────────────
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — silently ignore */
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────
const today = new Date();

function buildInitialState(overrides = {}) {
  return {
    currentYear: overrides.initialYear ?? today.getFullYear(),
    currentMonth: overrides.initialMonth ?? today.getMonth(), // 0-indexed
    rangeStart: null,
    rangeEnd: null,
    hoverDate: null,
    monthNotes: storageGet('wc_monthNotes', {}),
    rangeNotes: storageGet('wc_rangeNotes', {}),
    activeNotesTab: 'month',
    theme: storageGet('wc_theme', 'auto'),
    animationDirection: 'next',
    clickPhase: 0, // 0=none, 1=start picked, 2=range done
    customHolidays: overrides.customHolidays ?? {},
  };
}

// ─── Actions ──────────────────────────────────────────────────────────────────
export const ACTIONS = {
  NEXT_MONTH: 'NEXT_MONTH',
  PREV_MONTH: 'PREV_MONTH',
  GOTO_TODAY: 'GOTO_TODAY',
  GOTO_MONTH: 'GOTO_MONTH',       // { year, month }
  SET_YEAR: 'SET_YEAR',           // { year }
  SELECT_DATE: 'SELECT_DATE',     // { date }
  HOVER_DATE: 'HOVER_DATE',       // { date }
  CLEAR_HOVER: 'CLEAR_HOVER',
  SET_MONTH_NOTE: 'SET_MONTH_NOTE', // { key, value }
  SET_RANGE_NOTE: 'SET_RANGE_NOTE', // { key, value }
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SWITCH_TAB: 'SWITCH_TAB',        // { tab }
  SET_THEME: 'SET_THEME',          // { theme }
  SET_CUSTOM_HOLIDAYS: 'SET_CUSTOM_HOLIDAYS', // { holidays }
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function calendarReducer(state, action) {
  switch (action.type) {
    case ACTIONS.NEXT_MONTH: {
      const { year, month } = getNextMonth(state.currentYear, state.currentMonth);
      return { ...state, currentYear: year, currentMonth: month, animationDirection: 'next' };
    }
    case ACTIONS.PREV_MONTH: {
      const { year, month } = getPrevMonth(state.currentYear, state.currentMonth);
      return { ...state, currentYear: year, currentMonth: month, animationDirection: 'prev' };
    }
    case ACTIONS.GOTO_TODAY: {
      const t = new Date();
      const nowYear = t.getFullYear();
      const nowMonth = t.getMonth();
      const sameMonth = nowYear === state.currentYear && nowMonth === state.currentMonth;
      const dir = nowYear > state.currentYear ||
        (nowYear === state.currentYear && nowMonth > state.currentMonth)
          ? 'next' : 'prev';
      return {
        ...state,
        currentYear: nowYear,
        currentMonth: nowMonth,
        animationDirection: sameMonth ? state.animationDirection : dir,
        rangeStart: null,
        rangeEnd: null,
        hoverDate: null,
        clickPhase: 0,
        activeNotesTab: 'month',
      };
    }
    case ACTIONS.GOTO_MONTH: {
      const { year, month } = action.payload;
      const dir = year > state.currentYear ||
        (year === state.currentYear && month > state.currentMonth)
          ? 'next' : 'prev';
      return {
        ...state,
        currentYear: year,
        currentMonth: month,
        animationDirection: dir,
      };
    }
    case ACTIONS.SET_YEAR: {
      const { year } = action.payload;
      const clamped = Math.max(1900, Math.min(2100, year));
      return { ...state, currentYear: clamped };
    }
    case ACTIONS.SELECT_DATE: {
      const { date } = action.payload;
      const { clickPhase, rangeStart } = state;

      // Guard: invalid date
      if (!date || isNaN(date.getTime())) return state;

      if (clickPhase === 0 || clickPhase === 2) {
        // Phase → 1: set start only
        return {
          ...state,
          rangeStart: date,
          rangeEnd: null,
          hoverDate: null,
          clickPhase: 1,
          activeNotesTab: 'month',
        };
      } else {
        // Phase → 2: finalize range (auto-swap if end < start)
        const isSameSelection = rangeStart && 
          rangeStart.getFullYear() === date.getFullYear() && 
          rangeStart.getMonth() === date.getMonth() && 
          rangeStart.getDate() === date.getDate();
        
        if (isSameSelection) {
          // Double-click toggle behavior: unselect the date instead of making a 1-day range
          return {
            ...state,
            rangeStart: null,
            rangeEnd: null,
            hoverDate: null,
            clickPhase: 0,
            activeNotesTab: 'month',
          };
        }

        const [start, end] = orderRange(rangeStart, date);
        return {
          ...state,
          rangeStart: start,
          rangeEnd: end,
          hoverDate: null,
          clickPhase: 2,
          // Auto-switch to range tab once a range is set
          activeNotesTab: 'range',
        };
      }
    }
    case ACTIONS.HOVER_DATE:
      return { ...state, hoverDate: action.payload.date };
    case ACTIONS.CLEAR_HOVER:
      return { ...state, hoverDate: null };
    case ACTIONS.SET_MONTH_NOTE: {
      const notes = { ...state.monthNotes, [action.payload.key]: action.payload.value };
      storageSet('wc_monthNotes', notes);
      return { ...state, monthNotes: notes };
    }
    case ACTIONS.SET_RANGE_NOTE: {
      const notes = { ...state.rangeNotes, [action.payload.key]: action.payload.value };
      storageSet('wc_rangeNotes', notes);
      return { ...state, rangeNotes: notes };
    }
    case ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        rangeStart: null,
        rangeEnd: null,
        hoverDate: null,
        clickPhase: 0,
        activeNotesTab: 'month',
      };
    case ACTIONS.SWITCH_TAB:
      return { ...state, activeNotesTab: action.payload.tab };
    case ACTIONS.SET_THEME: {
      storageSet('wc_theme', action.payload.theme);
      return { ...state, theme: action.payload.theme };
    }
    case ACTIONS.SET_CUSTOM_HOLIDAYS:
      return { ...state, customHolidays: action.payload.holidays ?? {} };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CalendarContext = createContext(null);

/**
 * CalendarProvider — wraps the calendar subtree with shared state.
 *
 * @param {{ children: React.ReactNode, initialYear?: number, initialMonth?: number,
 *           customHolidays?: object, onRangeChange?: Function, onNoteChange?: Function }} props
 */
export function CalendarProvider({
  children,
  initialYear,
  initialMonth,
  customHolidays,
  onRangeChange,
  onNoteChange,
}) {
  const [state, dispatch] = useReducer(
    calendarReducer,
    { initialYear, initialMonth, customHolidays },
    buildInitialState,
  );

  // Fire external callbacks on range/note changes
  const prevRange = useRef({ start: null, end: null });
  useEffect(() => {
    const { rangeStart, rangeEnd } = state;
    const prev = prevRange.current;
    if (
      onRangeChange &&
      (rangeStart !== prev.start || rangeEnd !== prev.end)
    ) {
      onRangeChange(rangeStart, rangeEnd);
      prevRange.current = { start: rangeStart, end: rangeEnd };
    }
  }, [state.rangeStart, state.rangeEnd, onRangeChange]);

  // Sync customHolidays prop changes
  useEffect(() => {
    if (customHolidays) {
      dispatch({ type: ACTIONS.SET_CUSTOM_HOLIDAYS, payload: { holidays: customHolidays } });
    }
  }, [customHolidays]);

  const value = useMemo(
    () => ({ state, dispatch, onNoteChange }),
    [state, onNoteChange],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}
