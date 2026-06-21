import { useRef, useState } from 'react'
import { Board } from './components/Board/Board'
import { TeamSelector } from './components/Controls/TeamSelector'
import { Toolbar } from './components/Controls/Toolbar'
import { SlidePanel } from './components/SlidePanel/SlidePanel'
import { SquadModal } from './components/SquadModal/SquadModal'
import { PlayModal } from './components/PlayModal/PlayModal'
import { TokenControls } from './components/Controls/TokenControls'

export default function App() {
  const boardRef = useRef<HTMLElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000000', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Row 1 — Logo + Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 52,
        background: '#1a1a1a',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Green accent mark */}
          <div style={{ width: 3, height: 20, borderRadius: 2, background: '#03b16b', flexShrink: 0 }} />
          <span style={{
            fontWeight: 800, fontSize: 15, letterSpacing: '0.06em',
            color: '#ffffff', textTransform: 'uppercase',
          }}>
            The Dugout
          </span>
        </div>
        <Toolbar boardRef={boardRef} onPlay={() => setIsPlaying(true)} />
      </div>

      {/* Row 2 — Team selectors */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: 54,
        background: '#1a1a1a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Team A — left aligned */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <TeamSelector slot="A" />
        </div>

        {/* VS badge */}
        <div style={{
          flexShrink: 0,
          padding: '4px 16px',
          borderRadius: 6,
          background: 'rgba(3,177,107,0.08)',
          border: '1px solid rgba(3,177,107,0.2)',
          color: '#03b16b',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.14em',
          margin: '0 12px',
        }}>VS</div>

        {/* Team B — right aligned */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
          <TeamSelector slot="B" />
        </div>
      </div>

      {/* Token style controls — only shown when a team is loaded */}
      <TokenControls />

      {/* Pitch */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        minHeight: 0,
        overflow: 'hidden',
        background: '#000000',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'min(100%, calc((100vh - 200px) * 16 / 9))',
          aspectRatio: '16/9',
        }}>
          <Board boardRef={boardRef} />
        </div>
      </main>

      {/* Slide panel */}
      <SlidePanel />

      {/* Squad selection modal — rendered at root level to escape stacking contexts */}
      <SquadModal />

      {/* Play modal */}
      {isPlaying && <PlayModal onClose={() => setIsPlaying(false)} />}
    </div>
  )
}
