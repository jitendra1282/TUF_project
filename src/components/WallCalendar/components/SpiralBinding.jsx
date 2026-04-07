/**
 * SpiralBinding — decorative SVG spiral circles along the top of the calendar.
 */
import { memo } from 'react';

export const SpiralBinding = memo(function SpiralBinding({ isDark }) {
  const holes = Array.from({ length: 18 }, (_, i) => i);

  return (
    <div
      className="flex items-center justify-center gap-0 w-full h-8 relative z-20"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="32"
        viewBox="0 0 800 32"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
      >
        {holes.map((i) => {
          const x = 24 + i * (752 / (holes.length - 1));
          return (
            <g key={i}>
              {/* Shadow ring */}
              <circle cx={x} cy={18} r={9} fill={isDark ? '#1e293b' : '#d1d5db'} opacity="0.5" />
              {/* Outer ring */}
              <circle
                cx={x}
                cy={16}
                r={9}
                fill={isDark ? '#334155' : '#e5e7eb'}
                stroke={isDark ? '#475569' : '#9ca3af'}
                strokeWidth="1.5"
              />
              {/* Inner hole */}
              <circle cx={x} cy={16} r={5} fill={isDark ? '#0f172a' : '#f3f4f6'} />
              {/* Shine */}
              <circle cx={x - 2} cy={13} r={1.5} fill="white" opacity="0.6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
});
