/**
 * ExportButton — copies a plain-text summary to clipboard and shows a toast.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import { MONTH_CONFIG } from '../constants/calendarData';
import {
  formatMonthKey,
  formatRangeKey,
  formatDisplayDate,
  isValidRange,
} from '../utils/dateHelpers';

export function ExportButton({ isDark }) {
  const { state } = useCalendar();
  const [copied, setCopied] = useState(false);
  const { currentYear, currentMonth, rangeStart, rangeEnd, monthNotes, rangeNotes } = state;

  const handleCopy = useCallback(async () => {
    const monthName = MONTH_CONFIG[currentMonth].month;
    const monthDate = new Date(currentYear, currentMonth, 1);
    const monthKey = formatMonthKey(monthDate);
    const monthNote = monthNotes[monthKey] || '(no note)';

    let summary = `📅 ${monthName} ${currentYear}\n`;
    summary += `${'─'.repeat(30)}\n`;
    summary += `📝 Month Note:\n${monthNote}\n\n`;

    if (isValidRange(rangeStart, rangeEnd)) {
      const rangeKey = formatRangeKey(rangeStart, rangeEnd);
      const rangeNote = rangeNotes[rangeKey] || '(no note)';
      summary += `📌 Selected Range: ${formatDisplayDate(rangeStart)} – ${formatDisplayDate(rangeEnd)}\n`;
      summary += `📝 Range Note:\n${rangeNote}\n`;
    } else {
      summary += `📌 No date range selected.\n`;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = summary;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [state]);

  return (
    <div className="relative">
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          copied
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
            : isDark
            ? 'bg-transparent text-slate-200 border border-slate-600/60 hover:bg-slate-800'
            : 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        aria-label="Copy calendar summary to clipboard"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={14} />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Copy size={14} />
            </motion.span>
          )}
        </AnimatePresence>
        <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
      </motion.button>
    </div>
  );
}
