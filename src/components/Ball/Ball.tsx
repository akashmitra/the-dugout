import { useDrag } from '../../hooks/useDrag'

interface BallProps {
  x: number
  y: number
  pitchRef: React.RefObject<HTMLElement | null>
  onMove: (x: number, y: number) => void
}

const SIZE = 28

export function Ball({ x, y, pitchRef, onMove }: BallProps) {
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({ onMove, containerRef: pitchRef })

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: SIZE,
        height: SIZE,
        zIndex: 20,
        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.8))',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src="/images/ball.svg"
        alt="ball"
        width={SIZE}
        height={SIZE}
        draggable={false}
        style={{ display: 'block', width: SIZE, height: SIZE }}
      />
    </div>
  )
}
