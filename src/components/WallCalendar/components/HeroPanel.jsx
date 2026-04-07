/**
 * HeroPanel — full-bleed hero image with:
 * - Crossfade transitions between months
 * - Blue geometric SVG overlay with month/year badge
 * - Graceful fallback if image fails to load
 * - lazy + async decoding for performance
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_CONFIG } from '../constants/calendarData';
import { useCalendar } from '../context/CalendarContext';

// Gradient fallback palette — one per month
const FALLBACK_GRADIENTS = [
  'from-slate-700 to-blue-900',   // Jan
  'from-pink-800 to-rose-600',    // Feb
  'from-emerald-700 to-teal-500', // Mar
  'from-green-800 to-lime-600',   // Apr
  'from-cyan-700 to-sky-500',     // May
  'from-blue-800 to-cyan-600',    // Jun
  'from-green-900 to-emerald-600',// Jul
  'from-amber-700 to-yellow-600', // Aug
  'from-orange-800 to-sky-600',   // Sep
  'from-orange-900 to-red-700',   // Oct
  'from-slate-800 to-slate-600',  // Nov
  'from-blue-900 to-indigo-800',  // Dec
];

/** Blue diagonal geometric SVG overlay — bottom-right corner */
function GeometricOverlay({ monthName, year }) {
  return (
    <div className="absolute bottom-0 right-0 w-64 h-44 pointer-events-none select-none">
      <svg viewBox="0 0 256 176" className="w-full h-full" fill="none" aria-hidden="true">
        <polygon points="256,176 70,176 256,36" fill="#0369a1" opacity="0.9" />
        <polygon points="256,176 115,176 256,66" fill="#0EA5E9" opacity="0.95" />
        <polygon points="256,176 175,176 256,116" fill="#38bdf8" opacity="0.8" />
      </svg>
      <div className="absolute bottom-5 right-4 text-right text-white select-none">
        <div className="text-[11px] font-semibold tracking-[0.25em] opacity-85 uppercase tabular-nums">
          {year}
        </div>
        <div className="text-2xl font-black tracking-wider uppercase leading-tight drop-shadow-xl">
          {monthName}
        </div>
      </div>
    </div>
  );
}

/** Single image tile with error fallback */
function HeroImage({ config, monthIndex, priority }) {
  const [errored, setErrored] = useState(false);

  return (
    <>
      {!errored ? (
        <img
          src={config.image}
          alt={config.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setErrored(true)}
        />
      ) : (
        /* Gradient fallback when image fails */
        <div
          className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[monthIndex]} flex items-center justify-center`}
        >
          <div className="text-white/20 text-7xl font-black tracking-widest uppercase">
            {config.short}
          </div>
        </div>
      )}
    </>
  );
}

export function HeroPanel({ isDark }) {
  const { state } = useCalendar();
  const { currentMonth, currentYear } = state;
  const config = MONTH_CONFIG[currentMonth];

  // imageKey drives the AnimatePresence crossfade
  const [imageKey, setImageKey] = useState(currentMonth);

  // Preload all 12 images in the background on mount to eliminate network latency
  useEffect(() => {
    MONTH_CONFIG.forEach(config => {
      const img = new window.Image();
      img.src = config.image;
    });
  }, []);

  useEffect(() => {
    setImageKey(currentMonth);
  }, [currentMonth]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-tl-2xl rounded-bl-2xl md:rounded-tr-none md:rounded-bl-2xl">
      {/* Hero image with crossfade */}
      <AnimatePresence>
        <motion.div
          key={imageKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <HeroImage config={config} monthIndex={currentMonth} priority={currentMonth === new Date().getMonth()} />
        </motion.div>
      </AnimatePresence>

      {/* Dark scrim gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />

      {/* Geometric overlay + month badge */}
      <GeometricOverlay monthName={config.month} year={currentYear} />

      {/* Photo caption tag */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] text-white/60 bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-sm font-medium tracking-wide">
          {config.imageAlt}
        </span>
      </div>
    </div>
  );
}
