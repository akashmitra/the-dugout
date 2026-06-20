export function Pitch() {
  const line = 'rgba(255,255,255,0.82)'
  const sw = 0.35

  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <defs>
        {/* Alternating grass stripes */}
        <pattern id="grass" patternUnits="userSpaceOnUse" width="12" height="90">
          <rect width="6"  height="90" fill="#2d7a2d" />
          <rect x="6" width="6" height="90" fill="#297029" />
        </pattern>
        {/* Vignette overlay */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>

      {/* Grass base */}
      <rect width="160" height="90" fill="url(#grass)" />

      {/* Vignette */}
      <rect width="160" height="90" fill="url(#vignette)" />

      {/* ── Pitch lines ── */}

      {/* Outer boundary */}
      <rect x="4" y="3" width="152" height="84" fill="none" stroke={line} strokeWidth={sw} />

      {/* Halfway line */}
      <line x1="80" y1="3" x2="80" y2="87" stroke={line} strokeWidth={sw} />

      {/* Centre circle */}
      <circle cx="80" cy="45" r="11" fill="none" stroke={line} strokeWidth={sw} />
      <circle cx="80" cy="45" r="0.8" fill={line} />

      {/* Centre spot arc caps (small tick marks at pitch edge) */}
      <line x1="80" y1="3" x2="80" y2="5" stroke={line} strokeWidth={sw * 2} />
      <line x1="80" y1="85" x2="80" y2="87" stroke={line} strokeWidth={sw * 2} />

      {/* ── Left (Team A) ── */}
      {/* Penalty area */}
      <rect x="4" y="20" width="22" height="50" fill="none" stroke={line} strokeWidth={sw} />
      {/* Goal area */}
      <rect x="4" y="31" width="9" height="28" fill="none" stroke={line} strokeWidth={sw} />
      {/* Goal */}
      <rect x="0.5" y="37" width="3.5" height="16"
        fill="rgba(255,255,255,0.08)" stroke={line} strokeWidth={sw} />
      {/* Penalty spot */}
      <circle cx="16" cy="45" r="0.8" fill={line} />
      {/* Penalty arc */}
      <path d="M 26 34 A 11 11 0 0 0 26 56" fill="none" stroke={line} strokeWidth={sw} />
      {/* Corner arcs */}
      <path d="M 4 6.5 A 3.5 3.5 0 0 1 7.5 3" fill="none" stroke={line} strokeWidth={sw} />
      <path d="M 4 83.5 A 3.5 3.5 0 0 0 7.5 87" fill="none" stroke={line} strokeWidth={sw} />

      {/* ── Right (Team B) ── */}
      {/* Penalty area */}
      <rect x="134" y="20" width="22" height="50" fill="none" stroke={line} strokeWidth={sw} />
      {/* Goal area */}
      <rect x="147" y="31" width="9" height="28" fill="none" stroke={line} strokeWidth={sw} />
      {/* Goal */}
      <rect x="156" y="37" width="3.5" height="16"
        fill="rgba(255,255,255,0.08)" stroke={line} strokeWidth={sw} />
      {/* Penalty spot */}
      <circle cx="144" cy="45" r="0.8" fill={line} />
      {/* Penalty arc */}
      <path d="M 134 34 A 11 11 0 0 1 134 56" fill="none" stroke={line} strokeWidth={sw} />
      {/* Corner arcs */}
      <path d="M 156 6.5 A 3.5 3.5 0 0 0 152.5 3" fill="none" stroke={line} strokeWidth={sw} />
      <path d="M 156 83.5 A 3.5 3.5 0 0 1 152.5 87" fill="none" stroke={line} strokeWidth={sw} />
    </svg>
  )
}
