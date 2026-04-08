/**
 * SeasonalBackground — animated weather effects that change with the month.
 * Seasons (Northern Hemisphere / Indian climate):
 *   Winter  : Dec Jan Feb  — snow + cold blue
 *   Spring  : Mar Apr      — petals + soft green
 *   Summer  : May Jun      — sun + warm orange
 *   Monsoon : Jul Aug Sep  — rain + dark clouds
 *   Autumn  : Oct Nov      — leaves + amber
 */
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── helpers ──────────────────────────────────────────────────────────────────
const rnd = (min, max) => min + Math.random() * (max - min);

// ─── Season data ─────────────────────────────────────────────────────────────
export const SEASON_MAP = {
  winter: {
    months: [11, 0, 1],
    label: 'Winter', emoji: '❄️', effect: 'snow',
    lightBg: 'linear-gradient(155deg, #e0f2fe 0%, #bfdbfe 45%, #e0e7ff 100%)',
    darkBg:  'linear-gradient(155deg, #060d16 0%, #0b1e34 45%, #0c1230 100%)',
  },
  spring: {
    months: [2, 3],
    label: 'Spring', emoji: '🌸', effect: 'petals',
    lightBg: 'linear-gradient(155deg, #d1fae5 0%, #bbf7d0 45%, #fef9c3 100%)',
    darkBg:  'linear-gradient(155deg, #021a0e 0%, #042d18 45%, #141005 100%)',
  },
  summer: {
    months: [4, 5],
    label: 'Summer', emoji: '☀️', effect: 'sun',
    lightBg: 'linear-gradient(155deg, #fef08a 0%, #fbbf24 35%, #f97316 70%, #ef4444 100%)',
    darkBg:  'linear-gradient(155deg, #1c0a00 0%, #3d1500 35%, #2d0b00 70%, #1a0500 100%)',
  },
  monsoon: {
    months: [6, 7, 8],
    label: 'Monsoon', emoji: '🌧️', effect: 'rain',
    lightBg: 'linear-gradient(155deg, #94a3b8 0%, #7094b8 45%, #4a6080 100%)',
    darkBg:  'linear-gradient(155deg, #050810 0%, #080d1c 45%, #040610 100%)',
  },
  autumn: {
    months: [9, 10],
    label: 'Autumn', emoji: '🍂', effect: 'leaves',
    lightBg: 'linear-gradient(155deg, #fff7ed 0%, #fdba74 45%, #fca5a5 100%)',
    darkBg:  'linear-gradient(155deg, #180600 0%, #2d0e00 45%, #1a0300 100%)',
  },
};

export function getSeasonForMonth(month) {
  for (const [key, s] of Object.entries(SEASON_MAP)) {
    if (s.months.includes(month)) return { key, ...s };
  }
  return { key: 'spring', ...SEASON_MAP.spring };
}

// ─── Cloud SVG ────────────────────────────────────────────────────────────────
// forceLight=true → always white clouds (snow); forceLight=false (default) → colored by isDark
function Cloud({ x, y, scale = 1, opacity = 0.85, isDark, driftDelay = 0, forceWhite = false }) {
  const fill = forceWhite
    ? 'rgba(255,255,255,0.95)'
    : isDark
      ? 'rgba(71,85,105,0.75)'
      : 'rgba(148,163,184,0.9)';
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ x: [0, 22, 0] }}
      transition={{ duration: 18 + driftDelay, repeat: Infinity, ease: 'easeInOut', delay: driftDelay }}
    >
      <svg width={180 * scale} height={68 * scale} viewBox="0 0 180 68" fill="none" aria-hidden="true">
        <ellipse cx="65" cy="46" rx="65" ry="26" fill={fill} opacity={opacity} />
        <ellipse cx="115" cy="50" rx="50" ry="21" fill={fill} opacity={opacity} />
        <ellipse cx="85" cy="30" rx="42" ry="30" fill={fill} opacity={opacity} />
        <ellipse cx="138" cy="36" rx="34" ry="22" fill={fill} opacity={opacity * 0.9} />
      </svg>
    </motion.div>
  );
}

// ─── Rain ─────────────────────────────────────────────────────────────────────
function RainEffect({ isDark }) {
  const drops = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 2.5),
      duration: rnd(0.42, 0.85),
      height: rnd(13, 25),
      opacity: rnd(0.25, 0.55),
    })), []);

  return (
    <>
      <Cloud x={-8} y={0} scale={1.4} opacity={0.9} isDark={isDark} driftDelay={0} />
      <Cloud x={24} y={1} scale={1.1} opacity={0.8} isDark={isDark} driftDelay={5} />
      <Cloud x={56} y={0} scale={1.3} opacity={0.85} isDark={isDark} driftDelay={9} />
      <Cloud x={77} y={1} scale={1.0} opacity={0.75} isDark={isDark} driftDelay={3} />
      {drops.map(d => (
        <div key={d.id} className="absolute top-0 rounded-full"
          style={{
            left: `${d.left}%`,
            width: 1.5, height: d.height,
            background: isDark ? 'rgba(147,197,253,0.85)' : 'rgba(59,130,246,0.7)',
            opacity: d.opacity,
            animation: `s-rain ${d.duration}s linear ${d.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}
      {/* Occasional lightning flash */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.1)', animation: 's-lightning 9s linear 2s infinite', zIndex: 3 }}
      />
    </>
  );
}

function SnowEffect({ isDark }) {
  const flakes = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 7),
      duration: rnd(4.5, 9),
      size: rnd(4, 11),
      opacity: rnd(0.45, 0.9),
      drift: rnd(-35, 35),
    })), []);

  return (
    <>
      {/* Always white/light clouds for snow */}
      <Cloud x={-5} y={0} scale={1.3} opacity={0.92} isDark={isDark} driftDelay={0} forceWhite />
      <Cloud x={32} y={1} scale={1.1} opacity={0.85} isDark={isDark} driftDelay={4} forceWhite />
      <Cloud x={65} y={0} scale={1.2} opacity={0.9} isDark={isDark} driftDelay={7} forceWhite />
      {flakes.map(f => (
        <div key={f.id} className="absolute top-0 rounded-full"
          style={{
            left: `${f.left}%`,
            width: f.size, height: f.size,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 0 5px rgba(255,255,255,0.6)',
            opacity: f.opacity,
            '--s-drift': `${f.drift}px`,
            animation: `s-snow ${f.duration}s ease-in-out ${f.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
function SunEffect({ isDark }) {
  return (
    <div className="absolute pointer-events-none select-none" style={{ top: '6%', right: '10%', zIndex: 2 }}>
      {/* Outer glow halo */}
      <motion.div className="absolute rounded-full"
        style={{
          width: 220, height: 220, top: -60, left: -60,
          background: isDark
            ? 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Rotating rays */}
      <motion.div style={{ width: 100, height: 100, position: 'relative' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="absolute"
            style={{
              width: 3, height: 20,
              background: isDark ? 'rgba(251,191,36,0.55)' : 'rgba(217,119,6,0.65)',
              borderRadius: 2,
              top: '50%', left: '50%',
              transformOrigin: '50% 100%',
              transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-50px)`,
            }}
          />
        ))}
      </motion.div>
      {/* Core */}
      <motion.div className="absolute rounded-full"
        style={{
          width: 62, height: 62, top: 19, left: 19,
          background: isDark
            ? 'radial-gradient(circle, #fbbf24 30%, #f59e0b 100%)'
            : 'radial-gradient(circle, #fef08a 30%, #fbbf24 100%)',
          boxShadow: isDark
            ? '0 0 28px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)'
            : '0 0 28px rgba(251,191,36,0.8), 0 0 60px rgba(251,191,36,0.45)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── Spring Petals ────────────────────────────────────────────────────────────
function PetalsEffect({ isDark }) {
  const petals = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 9),
      duration: rnd(5.5, 11),
      size: rnd(9, 19),
      opacity: rnd(0.55, 0.9),
      drift: rnd(-55, 55),
      color: ['#fda4af','#f9a8d4','#fbcfe8','#fed7aa','#fde68a','#a5f3fc'][Math.floor(rnd(0, 6))],
    })), []);

  return (
    <>
      <SunEffect isDark={isDark} />
      {petals.map(p => (
        <div key={p.id} className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size * 0.6,
            borderRadius: '50% 0 50% 0',
            background: p.color,
            opacity: p.opacity,
            '--s-drift': `${p.drift}px`,
            animation: `s-petal ${p.duration}s ease-in-out ${p.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

// ─── Autumn Leaves ────────────────────────────────────────────────────────────
function LeavesEffect({ isDark }) {
  const leaves = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 8),
      duration: rnd(5, 10),
      size: rnd(16, 30),
      opacity: rnd(0.65, 0.95),
      drift: rnd(-70, 70),
      char: ['🍂','🍁','🍃'][Math.floor(rnd(0, 3))],
    })), []);

  return (
    <>
      {/* Warm ambient sun for autumn */}
      <div className="absolute pointer-events-none" style={{ top: '5%', right: '8%', zIndex: 1 }}>
        <motion.div className="rounded-full"
          style={{
            width: 80, height: 80,
            background: isDark
              ? 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(251,146,60,0.5) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {leaves.map(l => (
        <div key={l.id} className="absolute top-0 select-none"
          style={{
            left: `${l.left}%`,
            fontSize: l.size,
            opacity: l.opacity,
            '--s-drift': `${l.drift}px`,
            animation: `s-leaf ${l.duration}s ease-in-out ${l.delay}s infinite`,
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {l.char}
        </div>
      ))}
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function SeasonalBackground({ month, isDark }) {
  const season = getSeasonForMonth(month);
  const bg = isDark ? season.darkBg : season.lightBg;

  return (
    <>
      {/* ── Layer A: Gradient background (z-0) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${season.key}-${isDark ? 'd' : 'l'}`}
          className="absolute inset-0"
          style={{ background: bg, zIndex: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* ── Layer B: Weather particles (z-[200], pointer-events-none) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`fx-${season.key}`}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {season.effect === 'rain'   && <RainEffect   isDark={isDark} />}
          {season.effect === 'snow'   && <SnowEffect   isDark={isDark} />}
          {season.effect === 'sun'    && <SunEffect    isDark={isDark} />}
          {season.effect === 'petals' && <PetalsEffect isDark={isDark} />}
          {season.effect === 'leaves' && <LeavesEffect isDark={isDark} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Season badge (bottom-left, z-[201]) ── */}
      <div className="absolute bottom-1 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold pointer-events-none select-none"
        style={{
          zIndex: 201,
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          backdropFilter: 'blur(6px)',
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
        }}
      >
        <span>{season.emoji}</span>
        <span>{season.label}</span>
      </div>
    </>
  );
}
