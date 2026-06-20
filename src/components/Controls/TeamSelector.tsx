import { useRef } from 'react'
import { useBoardStore } from '../../store/useBoardStore'
import type { TeamSlot } from '../../types'
import { FORMATIONS } from '../../types'
import BRA from '../../data/BRA.json'
import ARG from '../../data/ARG.json'
import GER from '../../data/GER.json'
import ESP from '../../data/ESP.json'
import ENG from '../../data/ENG.json'

const BUILT_IN_TEAMS = [BRA, ARG, GER, ESP, ENG]

const selectStyle: React.CSSProperties = {
  fontSize: 12,
  borderRadius: 6,
  padding: '5px 8px',
  background: 'rgba(255,255,255,0.05)',
  color: '#e2e8f0',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  cursor: 'pointer',
}

interface Props { slot: TeamSlot }

export function TeamSelector({ slot }: Props) {
  const loadTeam = useBoardStore(s => s.loadTeam)
  const setFormation = useBoardStore(s => s.setFormation)
  const team = useBoardStore(s => slot === 'A' ? s.teamA : s.teamB)
  const formation = useBoardStore(s => slot === 'A' ? s.formationA : s.formationB)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    const found = BUILT_IN_TEAMS.find(t => t.code === code)
    if (found) loadTeam(slot, found as any)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { loadTeam(slot, JSON.parse(ev.target?.result as string)) }
      catch { alert('Invalid JSON') }
    }
    reader.readAsText(file)
  }

  const isRight = slot === 'B'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isRight ? 'row-reverse' : 'row' }}>
      {/* Colour swatch + team name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRight ? 'row-reverse' : 'row' }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: team?.primaryColor ?? 'rgba(255,255,255,0.2)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
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

      {/* Custom JSON */}
      <button
        onClick={() => fileRef.current?.click()}
        title="Load custom team JSON"
        style={{ ...selectStyle, padding: '5px 10px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}
      >
        ↑ JSON
      </button>
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Coach */}
      {team && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {team.coach}
        </span>
      )}
    </div>
  )
}
