import type { Position, FormationSlot } from '../types'

// Horizontal pitch. Team A attacks left→right (GK near x=8).
// x = depth (0–100%), y = vertical position (0–100%)
// Team B is mirrored: x becomes 100 - x
type FormationMap = Record<string, FormationSlot[]>

const FORMATIONS_A: FormationMap = {
  '4-4-2': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'RB',  x: 22, y: 20 }, { pos: 'CB',  x: 22, y: 40 }, { pos: 'CB',  x: 22, y: 60 }, { pos: 'LB',  x: 22, y: 80 },
    { pos: 'RM',  x: 42, y: 20 }, { pos: 'CM',  x: 42, y: 40 }, { pos: 'CM',  x: 42, y: 60 }, { pos: 'LM',  x: 42, y: 80 },
    { pos: 'ST',  x: 62, y: 35 }, { pos: 'ST',  x: 62, y: 65 },
  ],
  '4-3-3': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'RB',  x: 22, y: 20 }, { pos: 'CB',  x: 22, y: 40 }, { pos: 'CB',  x: 22, y: 60 }, { pos: 'LB',  x: 22, y: 80 },
    { pos: 'CM',  x: 42, y: 30 }, { pos: 'CM',  x: 42, y: 50 }, { pos: 'CM',  x: 42, y: 70 },
    { pos: 'RW',  x: 65, y: 18 }, { pos: 'ST',  x: 68, y: 50 }, { pos: 'LW',  x: 65, y: 82 },
  ],
  '4-2-3-1': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'RB',  x: 22, y: 20 }, { pos: 'CB',  x: 22, y: 40 }, { pos: 'CB',  x: 22, y: 60 }, { pos: 'LB',  x: 22, y: 80 },
    { pos: 'CDM', x: 38, y: 38 }, { pos: 'CDM', x: 38, y: 62 },
    { pos: 'RM',  x: 55, y: 20 }, { pos: 'CAM', x: 55, y: 50 }, { pos: 'LM',  x: 55, y: 80 },
    { pos: 'ST',  x: 70, y: 50 },
  ],
  '3-5-2': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'CB',  x: 22, y: 28 }, { pos: 'CB',  x: 22, y: 50 }, { pos: 'CB',  x: 22, y: 72 },
    { pos: 'RB',  x: 40, y: 15 }, { pos: 'CDM', x: 40, y: 35 }, { pos: 'CM',  x: 40, y: 50 }, { pos: 'CDM', x: 40, y: 65 }, { pos: 'LB',  x: 40, y: 85 },
    { pos: 'ST',  x: 65, y: 35 }, { pos: 'ST',  x: 65, y: 65 },
  ],
  '5-3-2': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'RB',  x: 20, y: 15 }, { pos: 'CB',  x: 20, y: 33 }, { pos: 'CB',  x: 20, y: 50 }, { pos: 'CB',  x: 20, y: 67 }, { pos: 'LB',  x: 20, y: 85 },
    { pos: 'CM',  x: 42, y: 30 }, { pos: 'CM',  x: 42, y: 50 }, { pos: 'CM',  x: 42, y: 70 },
    { pos: 'ST',  x: 65, y: 35 }, { pos: 'ST',  x: 65, y: 65 },
  ],
  '4-1-4-1': [
    { pos: 'GK',  x: 8,  y: 50 },
    { pos: 'RB',  x: 22, y: 20 }, { pos: 'CB',  x: 22, y: 40 }, { pos: 'CB',  x: 22, y: 60 }, { pos: 'LB',  x: 22, y: 80 },
    { pos: 'CDM', x: 36, y: 50 },
    { pos: 'RM',  x: 52, y: 18 }, { pos: 'CM',  x: 52, y: 38 }, { pos: 'CM',  x: 52, y: 62 }, { pos: 'LM',  x: 52, y: 82 },
    { pos: 'ST',  x: 70, y: 50 },
  ],
}

function mirrorX(slot: FormationSlot): FormationSlot {
  return { ...slot, x: 100 - slot.x }
}

export function getFormationSlots(formation: string, slot: 'A' | 'B'): FormationSlot[] {
  const base = FORMATIONS_A[formation] ?? FORMATIONS_A['4-4-2']
  return slot === 'A' ? base : base.map(mirrorX)
}

// Kept for backwards compatibility — strips pos label
export function getFormationPositions(formation: string, slot: 'A' | 'B'): Position[] {
  return getFormationSlots(formation, slot)
}

// Position-to-group lookup for fallback matching
const POSITION_GROUP: Record<string, string> = {
  GK:  'GK',
  RB: 'DEF', LB: 'DEF', CB: 'DEF',
  RM: 'MID', LM: 'MID', CM: 'MID', CAM: 'MID', CDM: 'MID', DM: 'MID',
  RW: 'FWD', LW: 'FWD', ST: 'FWD', CF: 'FWD', SS: 'FWD',
}

const SLOT_GROUP: Record<string, string> = {
  GK:  'GK',
  RB: 'DEF', LB: 'DEF', CB: 'DEF',
  RM: 'MID', LM: 'MID', CM: 'MID', CAM: 'MID', CDM: 'MID',
  RW: 'FWD', LW: 'FWD', ST: 'FWD', CF: 'FWD',
}

export function matchPlayersToSlots(
  players: { id: number; position: string }[],
  slots: FormationSlot[],
): Record<number, Position> {
  const unassignedSlots = [...slots]
  const posMap: Record<number, Position> = {}

  const take = (slotIndex: number, playerId: number) => {
    const { pos: _pos, ...xy } = unassignedSlots[slotIndex]
    posMap[playerId] = xy
    unassignedSlots.splice(slotIndex, 1)
  }

  for (const player of players) {
    // 1. Exact position match
    let idx = unassignedSlots.findIndex(s => s.pos === player.position)
    if (idx !== -1) { take(idx, player.id); continue }

    // 2. Group match
    const playerGroup = POSITION_GROUP[player.position]
    if (playerGroup) {
      idx = unassignedSlots.findIndex(s => SLOT_GROUP[s.pos] === playerGroup)
      if (idx !== -1) { take(idx, player.id); continue }
    }

    // 3. Any remaining slot
    if (unassignedSlots.length > 0) { take(0, player.id) }
  }

  return posMap
}
