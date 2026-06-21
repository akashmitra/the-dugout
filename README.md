# The Dugout

A football tactics whiteboard for managers and analysts. Arrange two squads on a full-pitch canvas, build up move sequences slide by slide, and export as PNG or PDF.

---

## Features

- **16:9 horizontal pitch** — Team A on the left, Team B on the right
- **11 built-in national squads** — Brazil, Argentina, Germany, Spain, England, Netherlands, Belgium, France, Norway, Portugal, Croatia
- **Squad selection modal** — pick your starting 11 from the full squad, grouped by position
- **6 formations** — 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-1-4-1; auto-placed on selection
- **Draggable player tokens** — jersey number, name label, and team colour
- **Draggable ball** — premium football SVG at centre
- **Slide system** — duplicate any slide to carry positions forward and show movement phases
- **Export** — PNG (current slide) or PDF (all slides, one page each, 16:9 landscape)
- **Custom teams** — load any team via JSON upload; file is saved to `src/data/` automatically

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| State | Zustand |
| Styling | Tailwind CSS (via `@tailwindcss/vite`) |
| PNG export | html2canvas |
| PDF export | jsPDF |

---

## Setup

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Player Images

Player photos are resolved from `public/images/` using the naming convention:

```
{TEAM_CODE}_{JERSEY_NUMBER}.png
```

Examples: `BRA_10.png`, `GER_7.png`, `ENG_9.png`

If an image is missing, the token falls back to an SVG avatar showing the jersey number.

---

## Adding a Custom Team

Create a JSON file following this schema:

```json
{
  "code": "ITA",
  "team": "Italy",
  "coach": "Luciano Spalletti",
  "primaryColor": "#003DA5",
  "secondaryColor": "#FFFFFF",
  "teamAssetCode": "8254",
  "players": [
    { "id": 1, "name": "Gianluigi Donnarumma", "number": 1, "position": "GK", "image": "ITA_1.png" },
    ...
  ]
}
```

**Positions:** `GK`, `RB`, `CB`, `LB`, `CDM`, `CM`, `CAM`, `RM`, `LM`, `RW`, `LW`, `ST`, `CF`

**`teamAssetCode`** is the FotMob team ID — used to display the team badge from:
`https://images.fotmob.com/image_resources/logo/teamlogo/{teamAssetCode}.png`

Then either:
- Click **↑ JSON** in the app to upload it (saves to `src/data/` and opens the squad modal), or
- Drop the file into `src/data/` and import it in `src/components/Controls/TeamSelector.tsx`

---

## Slide Workflow

1. Select teams and formation for both sides — squad modal opens to pick your starting 11
2. Drag players and the ball into position
3. Click **Duplicate** to copy the current slide — reposition tokens to show the next phase of play
4. Repeat for as many phases as needed
5. Export as **PDF** to share all slides, or **PNG** for the current frame

---

## Project Structure

```
src/
  components/
    Ball/          # Draggable football
    Board/         # Pitch container + player/ball rendering
    Controls/      # TeamSelector (team + formation dropdowns)
    Pitch/         # SVG pitch drawing
    PlayerToken/   # Circular player token with avatar/fallback
    SlidePanel/    # Slide thumbnails + add/delete
    SquadModal/    # 11-player selection modal
    Toolbar/       # PNG/PDF export + duplicate/delete slide
  data/            # Team JSON files (one per squad)
  hooks/
    useDrag.ts     # Pointer-event drag, constrained to pitch bounds
  store/
    useBoardStore.ts  # Zustand store — slides, teams, formations, modal state
  types/
    index.ts       # Shared TypeScript interfaces
  utils/
    formations.ts  # Formation coordinate presets
public/
  images/          # Player PNGs + ball.svg
```
