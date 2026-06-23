export interface Player {
  id: number
  name: string
  number: number
  position: string
  image: string
}

export interface TeamData {
  code: string
  team: string
  coach: string
  primaryColor: string
  secondaryColor: string
  teamAssetCode?: string
  players: Player[]
}

export interface Position {
  x: number
  y: number
}

export interface FormationSlot extends Position {
  pos: string
}

export interface Slide {
  id: string
  positionsA: Record<number, Position>
  positionsB: Record<number, Position>
  ballPosition: Position
}

export type TeamSlot = 'A' | 'B'

export const FORMATIONS = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2', '4-1-4-1'] as const
export type Formation = typeof FORMATIONS[number]
