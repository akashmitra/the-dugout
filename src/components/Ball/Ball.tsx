import { useDrag } from '../../hooks/useDrag'

interface BallProps {
  x: number
  y: number
  pitchRef: React.RefObject<HTMLElement | null>
  onMove: (x: number, y: number) => void
}

export function Ball({ x, y, pitchRef, onMove }: BallProps) {
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({ onMove, containerRef: pitchRef })

  return (
    <div
      className="absolute select-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        touchAction: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src="/images/ball.png"
        alt="ball"
        width={22}
        height={22}
        draggable={false}
        onError={e => {
          // Fallback SVG ball
          const img = e.currentTarget
          const parent = img.parentElement
          if (!parent) return
          img.remove()
          parent.innerHTML = `<svg viewBox="0 0 22 22" width="22" height="22">
            <circle cx="11" cy="11" r="11" fill="white" stroke="#333" stroke-width="1"/>
            <path d="M11 2 L14 8 L20 8 L15 12 L17 18 L11 14 L5 18 L7 12 L2 8 L8 8 Z" fill="#222"/>
          </svg>`
        }}
      />
    </div>
  )
}
