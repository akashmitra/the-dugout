import { useRef } from 'react'
import { Pitch } from '../Pitch/Pitch'
import { PlayerToken } from '../PlayerToken/PlayerToken'
import { Ball } from '../Ball/Ball'
import { useBoardStore } from '../../store/useBoardStore'

interface Props {
  boardRef: React.RefObject<HTMLElement | null>
}

export function Board({ boardRef }: Props) {
  const pitchRef = useRef<HTMLDivElement>(null)
  const { slides, activeSlideIndex, teamA, teamB, updatePlayerPosition, updateBallPosition } = useBoardStore()
  const slide = slides[activeSlideIndex]

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(45,120,45,0.12)',
      position: 'relative',
    }}>
      <div
        ref={el => {
          pitchRef.current = el
          if (boardRef && 'current' in boardRef)
            (boardRef as React.MutableRefObject<HTMLElement | null>).current = el
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Pitch />

        {/* Annotation layer stub — Phase 2 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} />

        {/* Team A */}
        {teamA && teamA.players.slice(0, 11).map(player => {
          const pos = slide.positionsA[player.id] ?? { x: 20, y: 50 }
          return (
            <PlayerToken
              key={`a-${player.id}`}
              player={player}
              x={pos.x} y={pos.y}
              primaryColor={teamA.primaryColor}
              secondaryColor={teamA.secondaryColor}
              pitchRef={pitchRef}
              onMove={(x, y) => updatePlayerPosition(activeSlideIndex, 'A', player.id, { x, y })}
            />
          )
        })}

        {/* Team B */}
        {teamB && teamB.players.slice(0, 11).map(player => {
          const pos = slide.positionsB[player.id] ?? { x: 80, y: 50 }
          return (
            <PlayerToken
              key={`b-${player.id}`}
              player={player}
              x={pos.x} y={pos.y}
              primaryColor={teamB.primaryColor}
              secondaryColor={teamB.secondaryColor}
              pitchRef={pitchRef}
              onMove={(x, y) => updatePlayerPosition(activeSlideIndex, 'B', player.id, { x, y })}
            />
          )
        })}

        {/* Ball */}
        <Ball
          x={slide.ballPosition.x}
          y={slide.ballPosition.y}
          pitchRef={pitchRef}
          onMove={(x, y) => updateBallPosition(activeSlideIndex, { x, y })}
        />

        {/* Empty state */}
        {!teamA && !teamB && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', pointerEvents: 'none', zIndex: 2,
          }}>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: 36 }}>⚽</div>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500 }}>Select two teams to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
