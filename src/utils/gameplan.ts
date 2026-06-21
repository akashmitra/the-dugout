import type { TeamData, Slide } from '../types'

export interface GameplanFile {
  version: 1
  exportedAt: string
  formationA: string
  formationB: string
  teamA: TeamData | null
  teamB: TeamData | null
  slides: (Slide & { annotations: unknown[] })[]
}

export function exportGameplan(
  teamA: TeamData | null,
  teamB: TeamData | null,
  formationA: string,
  formationB: string,
  slides: Slide[]
): void {
  const data: GameplanFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    formationA,
    formationB,
    teamA,
    teamB,
    slides: slides.map(s => ({ ...s, annotations: [] })),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gameplan-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function parseGameplan(json: unknown): GameplanFile {
  if (typeof json !== 'object' || json === null) throw new Error('Invalid gameplan file')
  const file = json as Record<string, unknown>
  if (file.version !== 1) throw new Error(`Unsupported gameplan version: ${file.version}`)
  if (!Array.isArray(file.slides) || file.slides.length === 0) throw new Error('Gameplan has no slides')
  return file as unknown as GameplanFile
}
