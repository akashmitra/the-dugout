import { useState, useEffect } from 'react'
import { useBoardStore } from '../../store/useBoardStore'
import { Pitch } from '../Pitch/Pitch'

const ANIM_MS = 700

function contrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111' : '#fff'
}

interface PlayTokenProps {
  player: { id: number; name: string; number: number; image: string }
  x: number
  y: number
  primaryColor: string
  secondaryColor: string
  transition: boolean
  size?: number
  opacity?: number
}

function PlayToken({ player, x, y, primaryColor, secondaryColor, transition, size = 36, opacity = 1 }: PlayTokenProps) {
  const [imgError, setImgError] = useState(false)
  const textColor = contrastColor(primaryColor)
  const lastName = (player.name.split(' ').pop() ?? player.name).toUpperCase()
  const SIZE = size

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      transition: transition
        ? `left ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), top ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)`
        : 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      zIndex: 10, pointerEvents: 'none',
      opacity,
      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.7))',
    }}>
      <div style={{
        width: SIZE, height: SIZE, borderRadius: '50%',
        background: primaryColor,
        border: `2px solid ${secondaryColor === '#FFFFFF' ? 'rgba(255,255,255,0.9)' : secondaryColor}`,
        boxShadow: '0 0 0 1.5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {!imgError ? (
          <img
            src={`/images/${player.image}`} alt={player.name}
            width={SIZE} height={SIZE} draggable={false}
            style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <svg viewBox="0 0 36 36" width={SIZE} height={SIZE} style={{ display: 'block' }}>
            <rect width="36" height="36" fill={primaryColor} />
            <line x1="0" y1="36" x2="36" y2="0" stroke={secondaryColor} strokeWidth="5" strokeOpacity="0.12" />
            <text x="18" y="24" textAnchor="middle" fontSize="15" fontWeight="800" fill={textColor}
              fontFamily="system-ui, sans-serif" letterSpacing="-0.5">
              {player.number}
            </text>
          </svg>
        )}
      </div>
      <div style={{
        background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(6px)',
        color: '#e8edf5', fontSize: 8, fontWeight: 700,
        letterSpacing: '0.05em', padding: '2px 6px', borderRadius: 3,
        whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)',
        textTransform: 'uppercase',
      }}>
        {lastName}
      </div>
    </div>
  )
}

interface Props {
  onClose: () => void
}

export function PlayModal({ onClose }: Props) {
  const { slides, activeSlideIndex, teamA, teamB, tokenSizeA, tokenOpacityA, tokenSizeB, tokenOpacityB } = useBoardStore()

  const [slideIndex, setSlideIndex] = useState(activeSlideIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(false)

  // Animated display positions — start from the opening slide, no transition
  const start = slides[activeSlideIndex]
  const [posA, setPosA] = useState({ ...start.positionsA })
  const [posB, setPosB] = useState({ ...start.positionsB })
  const [ball, setBall] = useState({ ...start.ballPosition })

  // Enable transitions after first paint so initial snap-in has no animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setTransitionEnabled(true))
    return () => cancelAnimationFrame(id)
  }, [])

  function navigate(dir: 'next' | 'prev') {
    if (isAnimating) return
    const target = dir === 'next' ? slideIndex + 1 : slideIndex - 1
    if (target < 0 || target >= slides.length) return

    setIsAnimating(true)
    setPosA({ ...slides[target].positionsA })
    setPosB({ ...slides[target].positionsB })
    setBall({ ...slides[target].ballPosition })

    setTimeout(() => {
      setSlideIndex(target)
      setIsAnimating(false)
    }, ANIM_MS)
  }

  const canPrev = slideIndex > 0 && !isAnimating
  const canNext = slideIndex < slides.length - 1 && !isAnimating
  const showDone = slideIndex === slides.length - 1 && !isAnimating

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      zIndex: 200, display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 24px', height: 58,
        background: '#1a1a1a',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0, gap: 16,
      }}>
        {/* Team A */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          {teamA?.teamAssetCode && (
            <img
              src={`src/assets/teambadge/${teamA.teamAssetCode}.png`}
              width={32} height={32}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
            />
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {teamA?.team ?? '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
              {teamA?.coach}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <div key={i} style={{
                height: 5,
                width: i === slideIndex ? 20 : 5,
                borderRadius: 3,
                background: i === slideIndex
                  ? '#03b16b'
                  : i < slideIndex
                  ? 'rgba(3,177,107,0.45)'
                  : 'rgba(255,255,255,0.15)',
                transition: 'all 0.35s ease',
              }} />
            ))}
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
          }}>
            Phase {slideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Team B + Close */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {teamB?.team ?? '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
              {teamB?.coach}
            </div>
          </div>
          {teamB?.teamAssetCode && (
            <img
              src={`src/assets/teambadge/${teamB.teamAssetCode}.png`}
              width={32} height={32}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
            />
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: 8, background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              width: 32, height: 32, fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >×</button>
        </div>
      </div>

      {/* ── Pitch ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 32px', minHeight: 0,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'min(100%, calc((100vh - 168px) * 16 / 9))',
          aspectRatio: '16/9',
          position: 'relative',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.9)',
        }}>
          <Pitch />

          {/* Team A tokens */}
          {teamA?.players.map(player => {
            const pos = posA[player.id]
            if (!pos) return null
            return (
              <PlayToken
                key={`a-${player.id}`}
                player={player} x={pos.x} y={pos.y}
                primaryColor={teamA.primaryColor}
                secondaryColor={teamA.secondaryColor}
                transition={transitionEnabled}
                size={tokenSizeA}
                opacity={tokenOpacityA}
              />
            )
          })}

          {/* Team B tokens */}
          {teamB?.players.map(player => {
            const pos = posB[player.id]
            if (!pos) return null
            return (
              <PlayToken
                key={`b-${player.id}`}
                player={player} x={pos.x} y={pos.y}
                primaryColor={teamB.primaryColor}
                secondaryColor={teamB.secondaryColor}
                transition={transitionEnabled}
                size={tokenSizeB}
                opacity={tokenOpacityB}
              />
            )
          })}

          {/* Ball */}
          <div style={{
            position: 'absolute',
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: transitionEnabled
              ? `left ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), top ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)`
              : 'none',
            zIndex: 20, pointerEvents: 'none',
            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.8))',
          }}>
            <img src="/images/ball.svg" alt="ball" width={28} height={28} draggable={false} style={{ display: 'block' }} />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        padding: '0 24px', height: 60,
        background: '#1a1a1a',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('prev')}
          disabled={!canPrev}
          style={{
            padding: '8px 26px', borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: canPrev ? '#2c2c2c' : 'transparent',
            color: canPrev ? '#e8edf5' : 'rgba(255,255,255,0.2)',
            border: `1px solid ${canPrev ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
            cursor: canPrev ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          ← Prev
        </button>

        {showDone ? (
          <button
            onClick={onClose}
            style={{
              padding: '8px 36px', borderRadius: 6, fontSize: 13, fontWeight: 700,
              background: '#03b16b', color: '#fff',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 0 16px rgba(3,177,107,0.35)',
            }}
          >
            Done
          </button>
        ) : (
          <button
            onClick={() => navigate('next')}
            disabled={!canNext}
            style={{
              padding: '8px 36px', borderRadius: 6, fontSize: 13, fontWeight: 700,
              background: canNext ? '#03b16b' : 'rgba(3,177,107,0.15)',
              color: canNext ? '#fff' : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: canNext ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              boxShadow: canNext ? '0 0 16px rgba(3,177,107,0.3)' : 'none',
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
