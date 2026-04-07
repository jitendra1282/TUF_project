/**
 * ThemeSwitcher — Light / Dark / Auto theme toggle in the top-right corner.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { THEME_OPTIONS } from '../constants/calendarData';
import { useCalendar, ACTIONS } from '../context/CalendarContext';

export const ThemeSwitcher = memo(function ThemeSwitcher({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { theme } = state;

  return (
    <div
      className={`flex items-center gap-0.5 rounded-xl p-1 shadow-inner ${isDark ? 'bg-slate-800/40 ring-1 ring-white/10' : 'bg-gray-100/50 ring-1 ring-gray-200/50'}`}
      role="group"
      aria-label="Theme selector"
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.value;
        return (
          <motion.button
            key={option.value}
            onClick={() =>
              dispatch({ type: ACTIONS.SET_THEME, payload: { theme: option.value } })
            }
            className={`relative flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? isDark
                  ? 'text-white'
                  : 'text-gray-800'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-pressed={isActive}
            aria-label={`${option.label} theme`}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                className={`absolute inset-0 rounded-lg ${isDark ? 'bg-slate-600 shadow-md ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-black/5'}`}
                layoutId="theme-indicator"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.icon}</span>
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
});
