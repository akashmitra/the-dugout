import { useBoardStore } from '../../store/useBoardStore'

export function SlidePanel() {
  const { slides, activeSlideIndex, setActiveSlide, duplicateSlide } = useBoardStore()

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.4)' }}>
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => setActiveSlide(i)}
          className="flex-shrink-0 flex flex-col items-center gap-1 group"
        >
          {/* Thumbnail */}
          <div
            className="rounded overflow-hidden transition-all"
            style={{
              width: 80,
              height: 45,
              background: '#2d6a2d',
              border: i === activeSlideIndex
                ? '2px solid #6366f1'
                : '2px solid rgba(255,255,255,0.15)',
              boxShadow: i === activeSlideIndex ? '0 0 0 1px #6366f1' : 'none',
            }}
          >
            {/* Mini pitch lines */}
            <svg viewBox="0 0 80 45" width="80" height="45" style={{ opacity: 0.6 }}>
              <rect width="80" height="45" fill="#2d6a2d" />
              <rect x="2" y="1" width="76" height="43" fill="none" stroke="white" strokeWidth="0.8" />
              <line x1="2" y1="22.5" x2="78" y2="22.5" stroke="white" strokeWidth="0.6" />
              <circle cx="40" cy="22.5" r="7" fill="none" stroke="white" strokeWidth="0.6" />
            </svg>
          </div>
          {/* Slide number */}
          <span
            className="text-xs"
            style={{ color: i === activeSlideIndex ? '#a5b4fc' : '#6b7280' }}
          >
            {i + 1}
          </span>
        </button>
      ))}

      {/* Add slide button */}
      <button
        onClick={() => duplicateSlide(slides.length - 1)}
        className="flex-shrink-0 flex items-center justify-center rounded text-gray-400 hover:text-white transition-colors"
        style={{
          width: 80,
          height: 45,
          border: '2px dashed rgba(255,255,255,0.2)',
          fontSize: 22,
        }}
        title="Add slide"
      >
        +
      </button>
    </div>
  )
}
