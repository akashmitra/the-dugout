import { useRef } from 'react'
import { Board } from './components/Board/Board'
import { TeamSelector } from './components/Controls/TeamSelector'
import { Toolbar } from './components/Controls/Toolbar'
import { SlidePanel } from './components/SlidePanel/SlidePanel'

export default function App() {
  const boardRef = useRef<HTMLElement>(null)

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0f0f1a', color: 'white' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.5)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          minHeight: 52,
          gap: 0,
        }}
      >
        {/* Left: logo + team selectors — scrollable if too wide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', flex: 1, paddingRight: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>⚽</span>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>FM Whiteboard</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', width: 1, alignSelf: 'stretch', flexShrink: 0 }} />
          <TeamSelector slot="A" />

          <div style={{ background: 'rgba(255,255,255,0.1)', width: 1, alignSelf: 'stretch', flexShrink: 0 }} />
          <TeamSelector slot="B" />
        </div>

        {/* Right: toolbar — always visible, never scrolls */}
        <div style={{ flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 12 }}>
          <Toolbar boardRef={boardRef} />
        </div>
      </header>

      {/* Main pitch — full width, 16:9 height */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '10px 14px', overflow: 'auto', minHeight: 0 }}>
        <div style={{ width: '100%', aspectRatio: '16/9', flexShrink: 0 }}>
          <Board boardRef={boardRef} />
        </div>
      </main>

      <SlidePanel />
    </div>
  )
}
