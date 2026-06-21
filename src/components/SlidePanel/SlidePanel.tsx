import { useBoardStore } from '../../store/useBoardStore'

export function SlidePanel() {
  const { slides, activeSlideIndex, setActiveSlide, duplicateSlide } = useBoardStore()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 20px',
      overflowX: 'auto',
      background: '#0a0f1e',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      scrollbarWidth: 'thin',
    }}>
      {slides.map((slide, i) => {
        const isActive = i === activeSlideIndex
        return (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(i)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {/* Mini pitch thumbnail */}
            <div style={{
              width: 96,
              height: 54,
              borderRadius: 6,
              overflow: 'hidden',
              border: isActive
                ? '2px solid #03b16b'
                : '2px solid rgba(255,255,255,0.1)',
              boxShadow: isActive ? '0 0 0 1px #03b16b, 0 0 12px rgba(3,177,107,0.25)' : 'none',
              transition: 'all 0.15s',
              position: 'relative',
            }}>
              {/* Mini pitch SVG */}
              <svg viewBox="0 0 96 54" width="96" height="54" style={{ display: 'block' }}>
                {/* Grass stripes */}
                <defs>
                  <pattern id={`g${i}`} patternUnits="userSpaceOnUse" width="8" height="54">
                    <rect width="4"  height="54" fill="#2d7a2d" />
                    <rect x="4" width="4" height="54" fill="#297029" />
                  </pattern>
                </defs>
                <rect width="96" height="54" fill={`url(#g${i})`} />
                {/* Boundary */}
                <rect x="2" y="2" width="92" height="50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                {/* Halfway */}
                <line x1="48" y1="2" x2="48" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                {/* Centre circle */}
                <circle cx="48" cy="27" r="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                {/* Penalty boxes */}
                <rect x="2" y="14" width="13" height="26" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                <rect x="81" y="14" width="13" height="26" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
              </svg>

              {/* Slide number overlay */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: 3, right: 5,
                  fontSize: 9, fontWeight: 700, color: '#03b16b',
                }}>
                  ●
                </div>
              )}
            </div>

            {/* Label */}
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#03b16b' : 'rgba(255,255,255,0.35)',
              letterSpacing: '0.04em',
            }}>
              {i + 1}
            </span>
          </button>
        )
      })}

      {/* Add slide */}
      <button
        onClick={() => duplicateSlide(slides.length - 1)}
        style={{
          flexShrink: 0,
          width: 96,
          height: 54,
          borderRadius: 6,
          border: '2px dashed rgba(255,255,255,0.12)',
          background: 'transparent',
          color: 'rgba(255,255,255,0.25)',
          fontSize: 22,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
        }}
        title="Add slide"
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.25)' }}
      >
        +
      </button>
    </div>
  )
}
