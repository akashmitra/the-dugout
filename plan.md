# The Dugout — Implementation Plan

## Overview
A football tactics whiteboard for managers and analysts. Users load two teams onto a pitch, arrange players using formation presets or freely, duplicate slides to show movement phases, and export as PNG or PDF.

---

## Data Schema

### Team JSON (`data/BRA.json`)
```json
{
  "code": "BRA",
  "team": "Brazil",
  "coach": "Dorival Júnior",
  "primaryColor": "#FFD700",
  "secondaryColor": "#009C3B",
  "players": [
    { "id": 1, "name": "Alisson", "number": 1, "position": "GK", "image": "BRA_1.png" }
  ]
}
```

**Position codes:** `GK`, `RB`, `CB`, `LB`, `CDM`, `CM`, `CAM`, `RM`, `LM`, `RW`, `LW`, `ST`, `CF`

### Image Convention
- Location: `public/images/{CODE}_{NUMBER}.png`
- Fallback: SVG avatar (team primary color + jersey number) rendered when image is missing
- Example: `BRA_10.png`, `ARG_10.png`, `GER_9.png`

---

## Tech Stack
| Concern | Library |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| State | Zustand |
| Styling | Tailwind CSS |
| Drag | Native pointer events (no library) |
| PNG Export | html2canvas |
| PDF Export | jsPDF |
| Icons | Lucide React |

---

## Application Structure

```
fm-whiteboard/
├── public/
│   ├── images/          # Player PNGs: BRA_1.png, ARG_10.png ...
│   └── ball.png         # Football image
├── src/
│   ├── data/            # Team JSONs: BRA.json, ARG.json, GER.json ...
│   ├── store/
│   │   └── useBoardStore.ts     # Zustand store
│   ├── types/
│   │   └── index.ts             # TeamData, Player, SlideState, etc.
│   ├── components/
│   │   ├── Pitch/
│   │   │   └── Pitch.tsx        # SVG football pitch
│   │   ├── PlayerToken/
│   │   │   └── PlayerToken.tsx  # Draggable player (image + number + name)
│   │   ├── Ball/
│   │   │   └── Ball.tsx         # Draggable football
│   │   ├── Controls/
│   │   │   ├── TeamSelector.tsx # Dropdown: team + formation
│   │   │   └── Toolbar.tsx      # + duplicate, export PNG, export PDF
│   │   ├── SlidePanel/
│   │   │   └── SlidePanel.tsx   # Slide thumbnails strip (bottom)
│   │   └── Board/
│   │       └── Board.tsx        # Composes pitch + tokens + ball
│   ├── hooks/
│   │   └── useDrag.ts           # Reusable pointer-event drag hook
│   ├── utils/
│   │   ├── formations.ts        # Formation coordinate presets
│   │   ├── exportPNG.ts         # html2canvas wrapper
│   │   └── exportPDF.ts         # jsPDF wrapper (16:9)
│   └── App.tsx
```

---

## Zustand Store Shape

```ts
interface BoardStore {
  slides: Slide[]
  activeSlideIndex: number
  teamA: TeamData | null
  teamB: TeamData | null
  formationA: string
  formationB: string

  // Actions
  loadTeam: (slot: 'A' | 'B', team: TeamData) => void
  setFormation: (slot: 'A' | 'B', formation: string) => void
  updatePlayerPosition: (slideIndex: number, teamSlot: 'A' | 'B', playerId: number, x: number, y: number) => void
  updateBallPosition: (slideIndex: number, x: number, y: number) => void
  duplicateSlide: (index: number) => void
  setActiveSlide: (index: number) => void
}

interface Slide {
  id: string
  positionsA: Record<number, { x: number; y: number }>
  positionsB: Record<number, { x: number; y: number }>
  ballPosition: { x: number; y: number }
}
```

---

## Formation Presets
Coordinates are expressed as percentages of pitch width/height (0–100), so they scale with any container size.

Formations included: `4-4-2`, `4-3-3`, `4-2-3-1`, `3-5-2`, `5-3-2`, `4-1-4-1`

Each formation defines positions for: 1 GK + 10 outfield players.

Team A attacks upward (GK at bottom), Team B attacks downward (GK at top) — mirrored.

---

## Hardcoded Teams (Phase 1)
| Code | Nation | Primary | Secondary |
|---|---|---|---|
| BRA | Brazil | #FFD700 | #009C3B |
| ARG | Argentina | #74ACDF | #FFFFFF |
| GER | Germany | #FFFFFF | #000000 |
| ESP | Spain | #AA151B | #F1BF00 |
| ENG | England | #FFFFFF | #CF081F |

---

## Phase-wise Execution Plan

### Phase 1 — Foundation & Pitch
- [ ] Scaffold Vite + React + TypeScript + Tailwind project
- [ ] Install dependencies (Zustand, html2canvas, jsPDF, lucide-react)
- [ ] Define TypeScript types (`types/index.ts`)
- [ ] Create `Pitch.tsx` — SVG pitch with all standard markings (center circle, penalty areas, goal areas, halfway line, corner arcs)
- [ ] Render pitch inside `Board.tsx` with correct 16:9 aspect ratio

### Phase 2 — Data & Store
- [ ] Write team JSONs: BRA, ARG, GER, ESP, ENG (full 23-man squads)
- [ ] Place placeholder player PNGs in `public/images/` (or confirm real assets later)
- [ ] Implement `useBoardStore.ts` with full Zustand store
- [ ] Implement `formations.ts` with 6 formation presets

### Phase 3 — Player Tokens & Drag
- [ ] Build `PlayerToken.tsx` — circular image, number badge, name label, team color border
- [ ] Implement `useDrag.ts` — pointer event drag hook, constrained to pitch bounds
- [ ] Integrate drag with store (`updatePlayerPosition`)
- [ ] Build `Ball.tsx` — draggable football token

### Phase 4 — Controls & Team Loading
- [ ] Build `TeamSelector.tsx` — team dropdown + formation dropdown for each slot
- [ ] Auto-place players on pitch when formation is selected
- [ ] Support custom JSON upload (File input → parse → load into store)
- [ ] Build `Toolbar.tsx` — duplicate slide button (+), export buttons

### Phase 5 — Slides
- [ ] Build `SlidePanel.tsx` — horizontal thumbnail strip at bottom
- [ ] Duplicate slide copies current player positions as starting point
- [ ] Active slide highlighted, click to switch
- [ ] Slide count indicator

### Phase 6 — Export
- [ ] `exportPNG.ts` — capture board div via html2canvas, download as PNG (16:9 enforced)
- [ ] `exportPDF.ts` — all slides as pages in a single PDF (16:9, A4 landscape or custom)
- [ ] Export current slide or all slides options

### Phase 7 — Polish
- [ ] Responsive layout
- [ ] Empty state (no team loaded yet)
- [ ] Missing image fallback SVG avatar
- [ ] Keyboard shortcut: `Cmd+D` duplicate slide
- [ ] Slide reordering (drag thumbnails)
- [ ] Provision stubs for Phase 2: arrow/annotation layer (empty overlay component, wired but inactive)
