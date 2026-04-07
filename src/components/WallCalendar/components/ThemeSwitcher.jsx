/**
 * ThemeSwitcher — Light / Dark / Auto theme toggle in the top-right corner.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { THEME_OPTIONS } from '../constants/calendarData';
import { useCalendar, ACTIONS } from '../context/CalendarContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ICONS = {
  light: <Sun size={14} />,
  dark: <Moon size={14} />,
  auto: <Monitor size={14} />
};

export const ThemeSwitcher = memo(function ThemeSwitcher({ isDark }) {
  const { state, dispatch } = useCalendar();
  const { theme } = state;

  return (
    <div
      className={`flex items-center gap-1 rounded-full p-1 border ${
        isDark ? 'border-slate-600/60 bg-transparent' : 'border-gray-300 bg-transparent'
      }`}
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
            className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? isDark
                  ? 'text-white'
                  : 'text-gray-900'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-pressed={isActive}
            aria-label={`${option.label} theme`}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isDark ? 'bg-slate-700' : 'bg-gray-200'
                }`}
                layoutId="theme-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center">{ICONS[option.value]}</span>
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
});
