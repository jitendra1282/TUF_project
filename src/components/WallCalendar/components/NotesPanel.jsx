/**
 * NotesPanel — two-tab notes system: Month Note + Range Note.
 * Animated tab switching with slide effect.
 */
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendar, ACTIONS } from '../context/CalendarContext';
import {
  formatMonthKey,
  formatRangeKey,
  formatDisplayDate,
  isValidRange,
} from '../utils/dateHelpers';
import { MONTH_CONFIG } from '../constants/calendarData';

const MAX_CHARS = 300;

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabButton({ active, onClick, icon: Icon, label, disabled, isDark }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg transition-all duration-200 ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : active
          ? isDark
            ? 'bg-slate-700 text-sky-400 shadow-sm'
            : 'bg-white text-sky-600 shadow-sm'
          : isDark
          ? 'text-slate-400 hover:text-slate-200'
          : 'text-gray-400 hover:text-gray-600'
      }`}
      aria-selected={active}
      role="tab"
    >
      <Icon size={12} />
      {label}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
          layoutId="tab-indicator"
        />
      )}
    </button>
  );
}

// ─── Month Note Tab ────────────────────────────────────────────────────────────
function MonthNote({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { currentYear, currentMonth, monthNotes } = state;
  const monthDate = new Date(currentYear, currentMonth, 1);
  const key = formatMonthKey(monthDate);
  const value = monthNotes[key] || '';
  const monthName = MONTH_CONFIG[currentMonth].month;

  return (
    <div className="flex flex-col gap-2">
      <textarea
        className={`notes-textarea lined-paper w-full resize-none text-sm p-3 rounded-xl border transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500'
            : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-400'
        }`}
        rows={4}
        placeholder={`Add a note for ${monthName} ${currentYear}...`}
        value={value}
        maxLength={MAX_CHARS}
        onChange={(e) =>
          dispatch({
            type: ACTIONS.SET_MONTH_NOTE,
            payload: { key, value: e.target.value },
          })
        }
        aria-label={`Monthly note for ${monthName} ${currentYear}`}
      />
      <div className={`text-right text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        {value.length}/{MAX_CHARS}
      </div>
    </div>
  );
}

// ─── Range Note Tab ────────────────────────────────────────────────────────────
function RangeNote({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { rangeStart, rangeEnd, rangeNotes } = state;
  const hasRange = isValidRange(rangeStart, rangeEnd);

  if (!hasRange) {
    return (
      <div className={`flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed ${
        isDark ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-400'
      }`}>
        <Calendar size={20} className="mb-2 opacity-50" />
        <p className="text-xs font-medium">Select a date range to add a note</p>
      </div>
    );
  }

  const key = formatRangeKey(rangeStart, rangeEnd);
  const value = rangeNotes[key] || '';
  const rangeLabel = `${formatDisplayDate(rangeStart)} – ${formatDisplayDate(rangeEnd)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 w-fit ${
        isDark ? 'bg-sky-900/40 text-sky-300' : 'bg-sky-50 text-sky-700'
      }`}>
        <Calendar size={11} />
        {rangeLabel}
      </div>
      <textarea
        className={`notes-textarea lined-paper w-full resize-none text-sm p-3 rounded-xl border transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500'
            : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-400'
        }`}
        rows={4}
        placeholder={`Note for ${rangeLabel}...`}
        value={value}
        maxLength={MAX_CHARS}
        onChange={(e) =>
          dispatch({
            type: ACTIONS.SET_RANGE_NOTE,
            payload: { key, value: e.target.value },
          })
        }
        aria-label={`Range note for ${rangeLabel}`}
      />
      <div className={`text-right text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        {value.length}/{MAX_CHARS}
      </div>
    </div>
  );
}

// ─── Notes Panel ──────────────────────────────────────────────────────────────
export function NotesPanel({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { activeNotesTab, rangeStart, rangeEnd } = state;
  const hasRange = isValidRange(rangeStart, rangeEnd);

  return (
    <div className={`border-t px-4 py-3 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
      {/* Tab bar */}
      <div className="flex gap-1 mb-3" role="tablist" aria-label="Notes tabs">
        <TabButton
          active={activeNotesTab === 'month'}
          onClick={() => dispatch({ type: ACTIONS.SWITCH_TAB, payload: { tab: 'month' } })}
          icon={FileText}
          label="Month Note"
          isDark={isDark}
        />
        <TabButton
          active={activeNotesTab === 'range'}
          onClick={() =>
            hasRange &&
            dispatch({ type: ACTIONS.SWITCH_TAB, payload: { tab: 'range' } })
          }
          icon={Calendar}
          label="Range Note"
          disabled={!hasRange}
          isDark={isDark}
        />
      </div>

      {/* Tab content with slide animation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeNotesTab}
          initial={{ x: activeNotesTab === 'range' ? 20 : -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: activeNotesTab === 'range' ? -20 : 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {activeNotesTab === 'month' ? (
            <MonthNote isDark={isDark} />
          ) : (
            <RangeNote isDark={isDark} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
