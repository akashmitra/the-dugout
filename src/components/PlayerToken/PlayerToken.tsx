import { useState } from 'react'
import { useDrag } from '../../hooks/useDrag'
import type { Player } from '../../types'

interface Props {
  player: Player
  x: number
  y: number
  primaryColor: string
  secondaryColor: string
  pitchRef: React.RefObject<HTMLElement | null>
  onMove: (x: number, y: number) => void
}

// Luminance-based contrast check — returns black or white text
function contrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? '#111' : '#fff'
}

export function PlayerToken({ player, x, y, primaryColor, secondaryColor, pitchRef, onMove }: Props) {
  const [imgError, setImgError] = useState(false)
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({ onMove, containerRef: pitchRef })

  // Last name only, max 8 chars
  const lastName = (player.name.split(' ').pop() ?? player.name).slice(0, 10)
  const textColor = contrastColor(primaryColor)

  const SIZE = 44

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        zIndex: 10,
        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.55))',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Token circle */}
      <div style={{
        width: SIZE,
        height: SIZE,
        borderRadius: '50%',
        background: primaryColor,
        border: `3px solid ${secondaryColor === '#FFFFFF' ? 'rgba(255,255,255,0.9)' : secondaryColor}`,
        boxShadow: `0 0 0 1.5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Player photo or SVG avatar */}
        {!imgError ? (
          <img
            src={`/images/${player.image}`}
            alt={player.name}
            width={SIZE}
            height={SIZE}
            draggable={false}
            style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <svg viewBox="0 0 44 44" width={SIZE} height={SIZE} style={{ display: 'block' }}>
            {/* Jersey shape */}
            <rect width="44" height="44" fill={primaryColor} />
            {/* Subtle diagonal stripe for visual interest */}
            <line x1="0" y1="44" x2="44" y2="0" stroke={secondaryColor} strokeWidth="6" strokeOpacity="0.12" />
            {/* Number */}
            <text
              x="22" y="29"
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill={textColor}
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-0.5"
            >
              {player.number}
            </text>
          </svg>
        )}
      </div>

      {/* Name pill */}
      <div style={{
        background: 'rgba(10,10,20,0.82)',
        backdropFilter: 'blur(4px)',
        color: '#f1f5f9',
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: '0.03em',
        padding: '2px 6px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
        maxWidth: 64,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.4,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {lastName}
      </div>
    </div>
  )
}
