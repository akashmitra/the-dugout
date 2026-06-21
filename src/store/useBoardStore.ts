import { create } from 'zustand'
import type { TeamData, Slide, TeamSlot, Position } from '../types'
import { getFormationPositions } from '../utils/formations'
import { exportGameplan, parseGameplan } from '../utils/gameplan'

interface BoardStore {
  slides: Slide[]
  activeSlideIndex: number
  teamA: TeamData | null
  teamB: TeamData | null
  formationA: string
  formationB: string

  // Pending team: loaded but awaiting squad selection via modal
  pendingTeam: TeamData | null
  pendingSlot: TeamSlot | null

  loadTeam: (slot: TeamSlot, team: TeamData) => void
  setFormation: (slot: TeamSlot, formation: string) => void
  updatePlayerPosition: (slideIndex: number, slot: TeamSlot, playerId: number, pos: Position) => void
  updateBallPosition: (slideIndex: number, pos: Position) => void
  duplicateSlide: (index: number) => void
  deleteSlide: (index: number) => void
  setActiveSlide: (index: number) => void

  // Gameplan import/export
  exportGameplan: () => void
  importGameplan: (file: File) => Promise<void>

  // Modal flow
  openSquadModal: (slot: TeamSlot, team: TeamData) => void
  closeSquadModal: () => void
  confirmSquad: (slot: TeamSlot, team: TeamData, selectedPlayers: TeamData['players']) => void
}

function makeSlide(overrides?: Partial<Slide>): Slide {
  return {
    id: crypto.randomUUID(),
    positionsA: {},
    positionsB: {},
    ballPosition: { x: 50, y: 50 },
    ...overrides,
  }
}

function applyFormation(slide: Slide, slot: TeamSlot, team: TeamData, formation: string): Slide {
  const positions = getFormationPositions(formation, slot)
  const posMap: Record<number, Position> = {}
  team.players.slice(0, 11).forEach((player, i) => {
    posMap[player.id] = positions[i] ?? { x: 50, y: 50 }
  })
  return { ...slide, [slot === 'A' ? 'positionsA' : 'positionsB']: posMap }
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  slides: [makeSlide()],
  activeSlideIndex: 0,
  teamA: null,
  teamB: null,
  formationA: '4-4-2',
  formationB: '4-4-2',
  pendingTeam: null,
  pendingSlot: null,

  loadTeam: (slot, team) => {
    const state = get()
    const formation = slot === 'A' ? state.formationA : state.formationB
    const updatedSlides = state.slides.map(slide => applyFormation(slide, slot, team, formation))
    set({ [slot === 'A' ? 'teamA' : 'teamB']: team, slides: updatedSlides })
  },

  setFormation: (slot, formation) => {
    const state = get()
    const team = slot === 'A' ? state.teamA : state.teamB
    if (!team) { set({ [slot === 'A' ? 'formationA' : 'formationB']: formation }); return }
    const updatedSlides = state.slides.map(slide => applyFormation(slide, slot, team, formation))
    set({ [slot === 'A' ? 'formationA' : 'formationB']: formation, slides: updatedSlides })
  },

  updatePlayerPosition: (slideIndex, slot, playerId, pos) => {
    set(state => {
      const slides = [...state.slides]
      const slide = { ...slides[slideIndex] }
      const key = slot === 'A' ? 'positionsA' : 'positionsB'
      slide[key] = { ...slide[key], [playerId]: pos }
      slides[slideIndex] = slide
      return { slides }
    })
  },

  updateBallPosition: (slideIndex, pos) => {
    set(state => {
      const slides = [...state.slides]
      slides[slideIndex] = { ...slides[slideIndex], ballPosition: pos }
      return { slides }
    })
  },

  duplicateSlide: (index) => {
    set(state => {
      const source = state.slides[index]
      const copy: Slide = {
        ...source,
        id: crypto.randomUUID(),
        positionsA: { ...source.positionsA },
        positionsB: { ...source.positionsB },
        ballPosition: { ...source.ballPosition },
      }
      const slides = [...state.slides]
      slides.splice(index + 1, 0, copy)
      return { slides, activeSlideIndex: index + 1 }
    })
  },

  deleteSlide: (index) => {
    set(state => {
      if (state.slides.length === 1) return state
      const slides = state.slides.filter((_, i) => i !== index)
      const activeSlideIndex = Math.min(state.activeSlideIndex, slides.length - 1)
      return { slides, activeSlideIndex }
    })
  },

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  exportGameplan: () => {
    const { teamA, teamB, formationA, formationB, slides } = get()
    exportGameplan(teamA, teamB, formationA, formationB, slides)
  },

  importGameplan: async (file) => {
    const text = await file.text()
    const data = parseGameplan(JSON.parse(text))
    set({
      teamA: data.teamA,
      teamB: data.teamB,
      formationA: data.formationA,
      formationB: data.formationB,
      slides: data.slides,
      activeSlideIndex: 0,
    })
  },

  openSquadModal: (slot, team) => set({ pendingTeam: team, pendingSlot: slot }),

  closeSquadModal: () => set({ pendingTeam: null, pendingSlot: null }),

  confirmSquad: (slot, team, selectedPlayers) => {
    const state = get()
    const committed: TeamData = { ...team, players: selectedPlayers }
    const formation = slot === 'A' ? state.formationA : state.formationB
    const updatedSlides = state.slides.map(slide => applyFormation(slide, slot, committed, formation))
    set({
      [slot === 'A' ? 'teamA' : 'teamB']: committed,
      slides: updatedSlides,
      pendingTeam: null,
      pendingSlot: null,
    })
  },
}))
