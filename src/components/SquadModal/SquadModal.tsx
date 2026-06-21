import { useState, useEffect } from 'react'
import { useBoardStore } from '../../store/useBoardStore'
import type { Player } from '../../types'

const POSITION_GROUPS: Record<string, string[]> = {
  GK:  ['GK'],
  DEF: ['RB', 'CB', 'LB', 'CDM'],
  MID: ['CM', 'CAM', 'RM', 'LM'],
  FWD: ['RW', 'LW', 'ST', 'CF'],
}

function getGroup(pos: string): string {
  for (const [group, codes] of Object.entries(POSITION_GROUPS)) {
    if (codes.includes(pos)) return group
  }
  return 'MID'
}

const GROUP_ORDER = ['GK', 'DEF', 'MID', 'FWD']
const GROUP_LABEL: Record<string, string> = { GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards' }
const GROUP_COLOR: Record<string, string> = { GK: '#f59e0b', DEF: '#3b82f6', MID: '#10b981', FWD: '#ef4444' }

function contrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111' : '#fff'
}

export function SquadModal() {
  const { pendingTeam, pendingSlot, closeSquadModal, confirmSquad } = useBoardStore()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<string>('ALL')

  // Reset selection when modal opens
  useEffect(() => {
    if (pendingTeam) {
      setSelected(new Set())
      setFilter('ALL')
    }
  }, [pendingTeam])

  if (!pendingTeam || !pendingSlot) return null

  const team = pendingTeam
  const slot = pendingSlot
  const count = selected.size
  const canConfirm = count === 11

  function togglePlayer(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= 11) return prev // block >11
        next.add(id)
      }
      return next
    })
  }

  function handleConfirm() {
    const players = team.players.filter(p => selected.has(p.id))
    confirmSquad(slot, team, players)
  }

  // Group players
  const grouped: Record<string, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] }
  team.players.forEach(p => {
    const g = getGroup(p.position)
    grouped[g].push(p)
  })

  const filteredGroups = filter === 'ALL' ? GROUP_ORDER : [filter]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSquadModal}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)', zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 520, maxWidth: '95vw', maxHeight: '85vh',
        background: '#161b27',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column',
        zIndex: 101, overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
        }}>
          {/* Team badge */}
          {team.teamAssetCode ? (
            <img
              src={`src/assets/teambadge//${team.teamAssetCode}.png`}
              alt={team.team}
              width={44} height={44}
              style={{ objectFit: 'contain', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: team.primaryColor,
              border: `3px solid ${team.secondaryColor === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : team.secondaryColor}`,
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: contrastColor(team.primaryColor) }}>
                {team.code}
              </span>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{team.team}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {team.coach} · Select your starting 11
            </div>
          </div>

          {/* Counter badge */}
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: canConfirm ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${canConfirm ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: canConfirm ? '#a5b4fc' : '#f1f5f9' }}>
              {count}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>/11</span>
          </div>

          {/* Close */}
          <button
            onClick={closeSquadModal}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6,
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              width: 28, height: 28, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Position filter tabs */}
        <div style={{
          display: 'flex', gap: 6, padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          {['ALL', ...GROUP_ORDER].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11,
                fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
                border: `1px solid ${filter === tab ? (tab === 'ALL' ? '#6366f1' : GROUP_COLOR[tab]) : 'rgba(255,255,255,0.08)'}`,
                background: filter === tab ? (tab === 'ALL' ? 'rgba(99,102,241,0.15)' : `${GROUP_COLOR[tab]}22`) : 'transparent',
                color: filter === tab ? (tab === 'ALL' ? '#a5b4fc' : GROUP_COLOR[tab]) : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'ALL' ? 'All' : GROUP_LABEL[tab]}
              {tab !== 'ALL' && (
                <span style={{ marginLeft: 6, opacity: 0.6 }}>({grouped[tab].length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Player list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
          {filteredGroups.map(group => (
            <div key={group}>
              {/* Group heading */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 8px 6px',
                position: 'sticky', top: 0, background: '#161b27', zIndex: 1,
              }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: GROUP_COLOR[group] }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: GROUP_COLOR[group] }}>
                  {GROUP_LABEL[group].toUpperCase()}
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {grouped[group].map(player => {
                const isSelected = selected.has(player.id)
                const isDisabled = !isSelected && count >= 11
                return (
                  <div
                    key={player.id}
                    onClick={() => !isDisabled && togglePlayer(player.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      background: isSelected ? `${team.primaryColor}1a` : 'transparent',
                      border: `1px solid ${isSelected ? team.primaryColor + '55' : 'transparent'}`,
                      opacity: isDisabled ? 0.35 : 1,
                      transition: 'all 0.12s',
                    }}
                  >
                    {/* Jersey number */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isSelected ? team.primaryColor : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${isSelected ? (team.secondaryColor === '#FFFFFF' ? 'rgba(255,255,255,0.4)' : team.secondaryColor) : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800,
                        color: isSelected ? contrastColor(team.primaryColor) : 'rgba(255,255,255,0.6)',
                      }}>
                        {player.number}
                      </span>
                    </div>

                    {/* Name */}
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: isSelected ? '#f1f5f9' : 'rgba(255,255,255,0.65)' }}>
                      {player.name}
                    </span>

                    {/* Position badge */}
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                      padding: '2px 7px', borderRadius: 4,
                      background: `${GROUP_COLOR[group]}22`,
                      color: GROUP_COLOR[group],
                      border: `1px solid ${GROUP_COLOR[group]}44`,
                    }}>
                      {player.position}
                    </span>

                    {/* Checkmark */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 5,
                      background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.15)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      {isSelected && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: 'rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            {canConfirm ? '✓ Starting 11 ready' : `${11 - count} more player${11 - count !== 1 ? 's' : ''} needed`}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={closeSquadModal}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              style={{
                padding: '8px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: canConfirm ? '#6366f1' : 'rgba(99,102,241,0.3)',
                color: canConfirm ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: canConfirm ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Confirm Squad
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
