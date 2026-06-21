# The Dugout

A football tactics whiteboard for managers and analysts. Arrange two squads on a full-pitch canvas, build move sequences across slides, animate them in a full-screen presentation, and export as PNG, PDF, or a shareable gameplan file.

---

## Features

### Pitch & Tokens
- **16:9 horizontal pitch** — Team A on the left, Team B on the right, rendered as a clean SVG with grass stripes, penalty boxes, and centre circle
- **Draggable player tokens** — circular tokens with player photo (or jersey-number fallback), name label, and team colour
- **Draggable ball** — premium football SVG, snaps anywhere on the pitch
- **Token style controls** — per-team floating accordion panel (accessed via the sliders icon next to each formation dropdown) lets you adjust **token size** (18–52px) and **opacity** (20–100%) independently for each team; changes reflect live in both the board and Play mode

### Squads & Formations
- **11 built-in national squads** — Brazil, Argentina, Germany, Spain, England, Netherlands, Belgium, France, Norway, Portugal, Croatia; all sourced from FotMob with real jersey numbers and squad depth
- **Squad selection modal** — pick your starting 11 from the full squad, grouped by position (GK / DEF / MID / FWD), with a player count badge and a confirm button
- **6 formations** — 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-1-4-1; tokens auto-place on selection
- **Custom teams** — load any squad via **↑ JSON** upload; file is saved to `src/data/` automatically and the squad modal opens immediately
- **Team badges** — FotMob CDN badges displayed next to each team name in the header

### Slide System
- **Multi-slide canvas** — build up phases of play across as many slides as needed
- **Duplicate** — copies the current slide (positions and ball) to carry play forward
- **Delete** — removes a slide (disabled when only one slide remains)
- **Slide panel** — thumbnail strip at the bottom with active-slide highlight and a quick-add button
- **Gameplan export / import** — save the entire session (both teams, all slides, formations, token styles) to a `.json` file and reload it later

### Play Mode
- **Play button** — opens a full-screen presentation modal starting from the current slide
- **Animated transitions** — all player tokens and the ball glide smoothly to their new positions (700ms `cubic-bezier` easing) when advancing slides
- **Manual navigation** — Prev / Next buttons; Next is locked during animation to prevent skipping
- **Progress indicator** — compact pill-style dots show current phase and completion; active dot expands and turns green
- **Team header** — both team badges, names, and coach names are visible at the top of the Play modal
- **Done** — on the last slide, Next is replaced by a Done button that closes the modal

### Export
- **PNG** — exports the current slide as a 16:9 image
- **PDF** — exports all slides as a multi-page landscape PDF (one slide per page)
- **Gameplan JSON** — full session export including token size/opacity, usable as a save file

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| State | Zustand |
| Styling | Tailwind CSS (via `@tailwindcss/vite`) + inline styles |
| PNG export | dom-to-image-more |
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

If an image is missing, the token falls back to an SVG avatar showing the jersey number in the team's primary colour.

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

**`teamAssetCode`** is the FotMob team ID — the badge is loaded from  
`https://images.fotmob.com/image_resources/logo/teamlogo/{teamAssetCode}.png`

**Positions:** `GK`, `RB`, `CB`, `LB`, `CDM`, `CM`, `CAM`, `RM`, `LM`, `RW`, `LW`, `ST`, `CF`

Then either:
- Click **↑ JSON** in the app to upload it (saves to `src/data/` and opens the squad modal), or
- Drop the file into `src/data/` and import it in `src/components/Controls/TeamSelector.tsx`

---

## Typical Workflow

1. Select a team and formation for each side — squad modal opens to confirm your starting 11
2. Drag players and the ball into the starting positions for Phase 1
3. Click **Duplicate** to copy the slide, then drag tokens into Phase 2 positions
4. Repeat for as many phases as needed
5. Click **Play** to run through the sequence with smooth animations in full-screen
6. Export as **PDF** to share all phases, **PNG** for a single frame, or **Gameplan** to save and reload the session

---

## Project Structure

```
src/
  components/
    Ball/           # Draggable football
    Board/          # Pitch container + player/ball rendering
    Controls/
      TeamSelector  # Team dropdown, formation, token style accordion
      Toolbar       # Play, Duplicate, Delete, PNG, PDF, Gameplan buttons
    Pitch/          # SVG pitch drawing
    PlayModal/      # Full-screen animated slide presentation
    PlayerToken/    # Circular player token with photo/fallback + drag
    SlidePanel/     # Slide thumbnails + add/delete
    SquadModal/     # 11-player selection modal
  data/             # Team JSON files (one per squad)
  hooks/
    useDrag.ts      # Pointer-event drag, constrained to pitch bounds
  store/
    useBoardStore.ts  # Zustand store — slides, teams, formations, token styles, modal state
  types/
    index.ts        # Shared TypeScript interfaces
  utils/
    formations.ts   # Formation coordinate presets
    exportPNG.ts    # dom-to-image-more PNG export
    exportPDF.ts    # jsPDF multi-slide PDF export
    gameplan.ts     # Gameplan JSON serialise / deserialise
public/
  images/           # Player PNGs + ball.svg
```
