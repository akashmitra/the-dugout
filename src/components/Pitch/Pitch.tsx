export function Pitch() {
  const stroke = 'rgba(255,255,255,0.7)'
  const sw = 0.3

  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="90">
          <rect width="5" height="90" fill="#2d6a2d" />
          <rect x="5" width="5" height="90" fill="#2a5f2a" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="160" height="90" fill="url(#stripes)" />

      {/* Outer boundary */}
      <rect x="3" y="3" width="154" height="84" fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Halfway line */}
      <line x1="80" y1="3" x2="80" y2="87" stroke={stroke} strokeWidth={sw} />

      {/* Centre circle */}
      <circle cx="80" cy="45" r="10" fill="none" stroke={stroke} strokeWidth={sw} />
      <circle cx="80" cy="45" r="0.7" fill={stroke} />

      {/* Penalty areas */}
      {/* Left */}
      <rect x="3" y="22" width="20" height="46" fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Right */}
      <rect x="137" y="22" width="20" height="46" fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Goal areas (6-yard boxes) */}
      {/* Left */}
      <rect x="3" y="33" width="8" height="24" fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Right */}
      <rect x="149" y="33" width="8" height="24" fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Goals */}
      {/* Left */}
      <rect x="0" y="38" width="3" height="14" fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Right */}
      <rect x="157" y="38" width="3" height="14" fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Penalty spots */}
      <circle cx="15" cy="45" r="0.7" fill={stroke} />
      <circle cx="145" cy="45" r="0.7" fill={stroke} />

      {/* Penalty arcs */}
      <path d="M 23 36 A 10 10 0 0 0 23 54" fill="none" stroke={stroke} strokeWidth={sw} />
      <path d="M 137 36 A 10 10 0 0 1 137 54" fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Corner arcs */}
      <path d="M 3 6 A 3 3 0 0 1 6 3" fill="none" stroke={stroke} strokeWidth={sw} />
      <path d="M 154 3 A 3 3 0 0 1 157 6" fill="none" stroke={stroke} strokeWidth={sw} />
      <path d="M 157 84 A 3 3 0 0 1 154 87" fill="none" stroke={stroke} strokeWidth={sw} />
      <path d="M 6 87 A 3 3 0 0 1 3 84" fill="none" stroke={stroke} strokeWidth={sw} />
    </svg>
  )
}
