import type { Position } from '../types'

// Horizontal pitch. Team A attacks left→right (GK near x=8).
// x = depth (0–100%), y = vertical position (0–100%)
// Team B is mirrored: x becomes 100 - x
type FormationMap = Record<string, Position[]>

// index 0 = GK, then defenders top→bottom, midfielders top→bottom, forwards top→bottom
const FORMATIONS_A: FormationMap = {
  '4-4-2': [
    { x: 8,  y: 50 }, // GK
    { x: 22, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 22, y: 80 }, // DEF
    { x: 42, y: 20 }, { x: 42, y: 40 }, { x: 42, y: 60 }, { x: 42, y: 80 }, // MID
    { x: 62, y: 35 }, { x: 62, y: 65 }, // FWD
  ],
  '4-3-3': [
    { x: 8,  y: 50 },
    { x: 22, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 22, y: 80 },
    { x: 42, y: 30 }, { x: 42, y: 50 }, { x: 42, y: 70 },
    { x: 65, y: 18 }, { x: 68, y: 50 }, { x: 65, y: 82 },
  ],
  '4-2-3-1': [
    { x: 8,  y: 50 },
    { x: 22, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 22, y: 80 },
    { x: 38, y: 38 }, { x: 38, y: 62 },
    { x: 55, y: 20 }, { x: 55, y: 50 }, { x: 55, y: 80 },
    { x: 70, y: 50 },
  ],
  '3-5-2': [
    { x: 8,  y: 50 },
    { x: 22, y: 28 }, { x: 22, y: 50 }, { x: 22, y: 72 },
    { x: 40, y: 15 }, { x: 40, y: 35 }, { x: 40, y: 50 }, { x: 40, y: 65 }, { x: 40, y: 85 },
    { x: 65, y: 35 }, { x: 65, y: 65 },
  ],
  '5-3-2': [
    { x: 8,  y: 50 },
    { x: 20, y: 15 }, { x: 20, y: 33 }, { x: 20, y: 50 }, { x: 20, y: 67 }, { x: 20, y: 85 },
    { x: 42, y: 30 }, { x: 42, y: 50 }, { x: 42, y: 70 },
    { x: 65, y: 35 }, { x: 65, y: 65 },
  ],
  '4-1-4-1': [
    { x: 8,  y: 50 },
    { x: 22, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 22, y: 80 },
    { x: 36, y: 50 },
    { x: 52, y: 18 }, { x: 52, y: 38 }, { x: 52, y: 62 }, { x: 52, y: 82 },
    { x: 70, y: 50 },
  ],
}

function mirrorX(pos: Position): Position {
  return { x: 100 - pos.x, y: pos.y }
}

export function getFormationPositions(formation: string, slot: 'A' | 'B'): Position[] {
  const base = FORMATIONS_A[formation] ?? FORMATIONS_A['4-4-2']
  return slot === 'A' ? base : base.map(mirrorX)
}
