import { useRef } from 'react'
import { Board } from './components/Board/Board'
import { TeamSelector } from './components/Controls/TeamSelector'
import { Toolbar } from './components/Controls/Toolbar'
import { SlidePanel } from './components/SlidePanel/SlidePanel'

export default function App() {
  const boardRef = useRef<HTMLElement>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d1117', color: 'white' }}>

      {/* Row 1 — Logo + Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 48,
        background: '#0d1117',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚽</span>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', color: '#e2e8f0' }}>
            FM WHITEBOARD
          </span>
        </div>
        <Toolbar boardRef={boardRef} />
      </div>

      {/* Row 2 — Team selectors */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        height: 52,
        background: 'rgba(255,255,255,0.02)',
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
          padding: '3px 14px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.25)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          margin: '0 16px',
        }}>VS</div>

        {/* Team B — right aligned */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
          <TeamSelector slot="B" />
        </div>
      </div>

      {/* Pitch */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 20px',
        minHeight: 0,
        overflow: 'hidden',
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
    </div>
  )
}
