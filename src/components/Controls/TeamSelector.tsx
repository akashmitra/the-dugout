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

interface Props {
  slot: TeamSlot
}

export function TeamSelector({ slot }: Props) {
  const loadTeam = useBoardStore(s => s.loadTeam)
  const setFormation = useBoardStore(s => s.setFormation)
  const team = useBoardStore(s => slot === 'A' ? s.teamA : s.teamB)
  const formation = useBoardStore(s => slot === 'A' ? s.formationA : s.formationB)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    if (!code) return
    const found = BUILT_IN_TEAMS.find(t => t.code === code)
    if (found) loadTeam(slot, found as any)
  }

  function handleFormationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormation(slot, e.target.value)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        loadTeam(slot, data)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const accentColor = team?.primaryColor ?? '#6b7280'
  const label = slot === 'A' ? 'Team A' : 'Team B'

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Colour dot + label */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: accentColor, border: '1px solid rgba(255,255,255,0.3)' }}
        />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-12">{label}</span>
      </div>

      {/* Team dropdown */}
      <select
        className="text-xs rounded px-2 py-1.5 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-gray-400"
        onChange={handleTeamChange}
        value={team?.code ?? ''}
      >
        <option value="" disabled>Select team…</option>
        {BUILT_IN_TEAMS.map(t => (
          <option key={t.code} value={t.code}>{t.team}</option>
        ))}
      </select>

      {/* Formation dropdown */}
      <select
        className="text-xs rounded px-2 py-1.5 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-gray-400"
        value={formation}
        onChange={handleFormationChange}
      >
        {FORMATIONS.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {/* Custom JSON upload */}
      <button
        className="text-xs rounded px-2 py-1.5 bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors whitespace-nowrap"
        onClick={() => fileRef.current?.click()}
        title="Load custom team JSON"
      >
        ↑ JSON
      </button>
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />

      {/* Coach name */}
      {team && (
        <span className="text-xs text-gray-500 hidden xl:block truncate max-w-32">{team.coach}</span>
      )}
    </div>
  )
}
