import { useRef, useState, useEffect } from 'react'
import { useBoardStore } from '../../store/useBoardStore'
import type { TeamSlot } from '../../types'
import { FORMATIONS } from '../../types'
import BRA from '../../data/BRA.json'
import ARG from '../../data/ARG.json'
import GER from '../../data/GER.json'
import ESP from '../../data/ESP.json'
import ENG from '../../data/ENG.json'
import NED from '../../data/NED.json'
import BEL from '../../data/BEL.json'
import FRA from '../../data/FRA.json'
import NOR from '../../data/NOR.json'
import POR from '../../data/POR.json'
import CRO from '../../data/CRO.json'

const BUILT_IN_TEAMS = [BRA, ARG, GER, ESP, ENG, NED, BEL, FRA, NOR, POR, CRO]

const selectStyle: React.CSSProperties = {
  fontSize: 12,
  borderRadius: 6,
  padding: '5px 10px',
  background: '#2c2c2c',
  color: '#e8edf5',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 500,
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display: string
  primaryColor: string
}

function SliderRow({ label, value, min, max, step, onChange, display, primaryColor }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100
  const trackBg = `linear-gradient(to right, ${primaryColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: primaryColor,
          background: `${primaryColor}18`,
          padding: '1px 6px', borderRadius: 4,
          letterSpacing: '0.04em',
        }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
          width: '100%',
          height: 3,
          borderRadius: 99,
          background: trackBg,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

interface Props { slot: TeamSlot }

export function TeamSelector({ slot }: Props) {
  const setFormation   = useBoardStore(s => s.setFormation)
  const openSquadModal = useBoardStore(s => s.openSquadModal)
  const team           = useBoardStore(s => slot === 'A' ? s.teamA : s.teamB)
  const formation      = useBoardStore(s => slot === 'A' ? s.formationA : s.formationB)
  const tokenSize      = useBoardStore(s => slot === 'A' ? s.tokenSizeA : s.tokenSizeB)
  const tokenOpacity   = useBoardStore(s => slot === 'A' ? s.tokenOpacityA : s.tokenOpacityB)
  const setTokenStyle  = useBoardStore(s => s.setTokenStyle)

  const fileRef    = useRef<HTMLInputElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    const found = BUILT_IN_TEAMS.find(t => t.code === code)
    if (found) openSquadModal(slot, found as any)
    e.target.value = team?.code ?? ''
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      try {
        await fetch('/api/save-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: data.code, content: text }),
        })
      } catch { /* non-fatal */ }
      openSquadModal(slot, data)
    } catch {
      alert('Invalid JSON file. Please check the format.')
    }
  }

  const isRight      = slot === 'B'
  const primaryColor = team?.primaryColor ?? '#03b16b'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isRight ? 'row-reverse' : 'row' }}>
      {/* Badge + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isRight ? 'row-reverse' : 'row' }}>
        {team?.teamAssetCode ? (
          <img
            src={`src/assets/teambadge//${team.teamAssetCode}.png`}
            alt={team.team}
            width={26} height={26}
            style={{ objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
          />
        ) : (
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
          </div>
        )}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {slot === 'A' ? 'Team A' : 'Team B'}
        </span>
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* Team dropdown */}
      <select style={selectStyle} value={team?.code ?? ''} onChange={handleTeamChange}>
        <option value="" disabled>Select team…</option>
        {BUILT_IN_TEAMS.map(t => <option key={t.code} value={t.code}>{t.team}</option>)}
      </select>

      {/* Formation dropdown */}
      <select style={selectStyle} value={formation} onChange={e => setFormation(slot, e.target.value)}>
        {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      {/* Token style trigger — only when team loaded */}
      {team && (
        <div style={{ position: 'relative' }}>
          <button
            ref={triggerRef}
            onClick={() => setOpen(o => !o)}
            title="Token style"
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              background: open ? `${primaryColor}22` : '#2c2c2c',
              border: `1px solid ${open ? primaryColor + '55' : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {/* Sliders icon — two horizontal lines with knobs */}
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
              <line x1="0" y1="2.5" x2="13" y2="2.5" stroke={open ? primaryColor : 'rgba(255,255,255,0.45)'} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="4" cy="2.5" r="2" fill={open ? primaryColor : 'rgba(255,255,255,0.45)'} />
              <line x1="0" y1="8.5" x2="13" y2="8.5" stroke={open ? primaryColor : 'rgba(255,255,255,0.45)'} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="9" cy="8.5" r="2" fill={open ? primaryColor : 'rgba(255,255,255,0.45)'} />
            </svg>
          </button>

          {/* Floating accordion panel */}
          {open && (
            <div
              ref={panelRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                [isRight ? 'right' : 'left']: 0,
                width: 188,
                background: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                padding: '14px 14px 22px',
                zIndex: 100,
                display: 'flex', flexDirection: 'column', gap: 14,
              }}
            >
              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: -2 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: primaryColor,
                  boxShadow: `0 0 6px ${primaryColor}88`,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Token Style
                </span>
              </div>

              <SliderRow
                label="Size"
                value={tokenSize}
                min={18} max={52} step={2}
                onChange={v => setTokenStyle(slot, v, tokenOpacity)}
                display={`${tokenSize}px`}
                primaryColor={primaryColor}
              />
              <SliderRow
                label="Opacity"
                value={Math.round(tokenOpacity * 100)}
                min={20} max={100} step={5}
                onChange={v => setTokenStyle(slot, tokenSize, v / 100)}
                display={`${Math.round(tokenOpacity * 100)}%`}
                primaryColor={primaryColor}
              />
            </div>
          )}
        </div>
      )}

      {/* Custom JSON upload */}
      <button
        onClick={() => fileRef.current?.click()}
        title="Load custom team JSON"
        style={{ ...selectStyle, padding: '5px 10px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}
      >
        ↑ JSON
      </button>
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Coach name */}
      {team && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {team.coach}
        </span>
      )}
    </div>
  )
}
