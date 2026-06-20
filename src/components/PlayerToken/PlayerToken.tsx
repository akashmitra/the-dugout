import { useState } from 'react'
import { useDrag } from '../../hooks/useDrag'
import type { Player } from '../../types'

interface PlayerTokenProps {
  player: Player
  x: number
  y: number
  primaryColor: string
  secondaryColor: string
  pitchRef: React.RefObject<HTMLElement | null>
  onMove: (x: number, y: number) => void
}

function SvgAvatar({ number, primary, secondary }: { number: number; primary: string; secondary: string }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" style={{ position: 'absolute', inset: 0 }}>
      <circle cx="20" cy="20" r="20" fill={primary} />
      <text
        x="20" y="26"
        textAnchor="middle"
        fontSize="17"
        fontWeight="bold"
        fill={secondary}
        fontFamily="system-ui, sans-serif"
      >
        {number}
      </text>
    </svg>
  )
}

export function PlayerToken({ player, x, y, primaryColor, secondaryColor, pitchRef, onMove }: PlayerTokenProps) {
  const [imgError, setImgError] = useState(false)
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({ onMove, containerRef: pitchRef })

  const shortName = player.name.split(' ').pop() ?? player.name

  return (
    <div
      className="absolute flex flex-col items-center select-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Circle image / avatar */}
      <div
        className="relative rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          border: `3px solid ${primaryColor}`,
          boxShadow: `0 0 0 1.5px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.6)`,
          background: primaryColor,
        }}
      >
        {imgError ? (
          <SvgAvatar number={player.number} primary={primaryColor} secondary={secondaryColor} />
        ) : (
          <img
            src={`/images/${player.image}`}
            alt={player.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            draggable={false}
            onError={() => setImgError(true)}
          />
        )}

        {/* Jersey number badge */}
        <div
          className="absolute bottom-0 right-0 rounded-full flex items-center justify-center font-bold leading-none"
          style={{
            width: 15,
            height: 15,
            background: primaryColor,
            color: secondaryColor,
            border: `1.5px solid ${secondaryColor}`,
            fontSize: 8,
          }}
        >
          {player.number}
        </div>
      </div>

      {/* Player name */}
      <div
        className="mt-0.5 px-1 py-px rounded text-center leading-tight"
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          fontSize: 9,
          maxWidth: 60,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {shortName}
      </div>
    </div>
  )
}
