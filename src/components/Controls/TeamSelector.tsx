import { useRef } from 'react'
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
  background: 'rgba(255,255,255,0.06)',
  color: '#e8edf5',
  border: '1px solid rgba(255,255,255,0.09)',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 500,
}

interface Props { slot: TeamSlot }

export function TeamSelector({ slot }: Props) {
  const setFormation  = useBoardStore(s => s.setFormation)
  const openSquadModal = useBoardStore(s => s.openSquadModal)
  const team      = useBoardStore(s => slot === 'A' ? s.teamA : s.teamB)
  const formation = useBoardStore(s => slot === 'A' ? s.formationA : s.formationB)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    const found = BUILT_IN_TEAMS.find(t => t.code === code)
    if (found) openSquadModal(slot, found as any)
    // Reset the select visually so re-selecting same team re-opens modal
    e.target.value = team?.code ?? ''
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      // Persist to src/data via dev server plugin
      try {
        await fetch('/api/save-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: data.code, content: text }),
        })
      } catch {
        // Non-fatal — save to disk fails silently in prod; team still loads
      }
      openSquadModal(slot, data)
    } catch {
      alert('Invalid JSON file. Please check the format.')
    }
  }

  const isRight = slot === 'B'

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
      <select
        style={selectStyle}
        value={team?.code ?? ''}
        onChange={handleTeamChange}
      >
        <option value="" disabled>Select team…</option>
        {BUILT_IN_TEAMS.map(t => <option key={t.code} value={t.code}>{t.team}</option>)}
      </select>

      {/* Formation dropdown */}
      <select style={selectStyle} value={formation} onChange={e => setFormation(slot, e.target.value)}>
        {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

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
