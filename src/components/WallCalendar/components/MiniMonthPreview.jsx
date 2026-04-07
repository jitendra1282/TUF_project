/**
 * MiniMonthPreview — a compact non-interactive calendar for prev/next month previews.
 */
import { memo, useMemo } from 'react';
import { buildCalendarGrid } from '../utils/dateHelpers';
import { MONTH_CONFIG } from '../constants/calendarData';
import { getPrevMonth, getNextMonth } from '../utils/dateHelpers';
import { isSameMonth } from 'date-fns';

const MINI_WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function MiniGrid({ year, month, isDark, label }) {
  const config = MONTH_CONFIG[month];
  const weeks = useMemo(() => buildCalendarGrid(year, month), [year, month]);
  const refDate = new Date(year, month, 1);

  return (
    <div className={`flex-1 rounded-xl p-3 ${isDark ? 'bg-slate-800/60' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
          {label}
        </div>
        <div className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
          {config.month.slice(0, 3)} {year}
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {MINI_WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className={`text-center text-[9px] font-bold py-0.5 ${
              i >= 5 ? 'text-sky-400' : isDark ? 'text-slate-500' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((dayInfo, di) => (
            <div
              key={di}
              className={`text-center text-[10px] py-0.5 rounded leading-none ${
                !isSameMonth(dayInfo.date, refDate)
                  ? 'opacity-20'
                  : dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6
                  ? 'text-sky-400 font-semibold'
                  : isDark ? 'text-slate-300' : 'text-gray-600'
              }`}
            >
              {dayInfo.date.getDate()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const MiniMonthPreviews = memo(function MiniMonthPreviews({ currentYear, currentMonth, isDark }) {
  const prev = getPrevMonth(currentYear, currentMonth);
  const next = getNextMonth(currentYear, currentMonth);

  return (
    <div className="flex gap-3 mt-4 px-1">
      <MiniGrid year={prev.year} month={prev.month} isDark={isDark} label="← Previous" />
      <MiniGrid year={next.year} month={next.month} isDark={isDark} label="Next →" />
    </div>
  );
});
