
# The Dugout: Tactical Whiteboard for Football

## What Is It?

The Dugout is a browser-based football tactics whiteboard built for managers, coaches, and analysts who want to visualise and communicate game plans without the friction of traditional tools.

It gives you a full-pitch canvas, two real squads, and a slide-by-slide phase system — so you can build an entire tactical sequence and walk your team through it, move by move, with smooth animations.


## The Problem It Solves

Tactical communication in football is hard. Most tools fall into one of two camps:

- **Too simple** — whiteboards and screenshot-based tools are static. You draw a position, take a screenshot, repeat. There's no sense of movement or timing.

- **Too complex** — professional video analysis platforms (Wyscout, Hudl, Instat) are expensive, require training, and are overkill for a coach who just needs to show their midfielder where to press from.

The Dugout sits in the middle: lightweight enough to run in any browser, powerful enough to show multi-phase tactical sequences with animated player movement — shareable as a PDF, PNG, or a gameplan file your assistant can reload.


## Who Is It For?

| Role | Use case |
|---|---|
| **Grassroots coach** | Show your players the shape for Saturday's match before training |
| **Academy analyst** | Break down an opposition's build-up play phase by phase |
| **Tactical content creator** | Produce clean, branded tactical breakdowns for social media or YouTube |
| **Football teacher** | Illustrate formations, pressing triggers, and set-piece shapes in the classroom |
| **Pro analyst (lightweight use)** | Quickly sketch a gameplan for a pre-match meeting without opening heavy software |


## Core Features

### Squads & Formations

- **11 built-in national squads** — Brazil, Argentina, Germany, Spain, England, Netherlands, Belgium, France, Norway, Portugal, Croatia — with real names, jersey numbers, and squad depth sourced from FotMob

- **6 formations** — 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-1-4-1— auto-placed on selection

- **Squad selection modal** — choose your starting 11 from the full squad, filtered by position

- **Custom team import** — load any team via a simple JSON file; add your own club, national team, or hypothetical XI


### The Pitch

- Full 16:9 horizontal pitch rendered as a clean SVG — boundary lines, penalty areas, centre circle, corner arcs, goal nets

- Draggable player tokens with jersey number, name label, and team colour

- Draggable ball with a premium SVG football


### Token Style Controls

- Per-team **size** slider (18–52px) — make one team larger to emphasise the focus of the analysis

- Per-team **opacity** slider (20–100%) — fade out the opposition to draw attention to your team's movement


### Slide System

- Build a multi-phase tactical sequence — each slide is a moment in the move

- **Duplicate** any slide to carry positions forward, then adjust for the next phase

- Slide panel at the bottom shows thumbnails of every phase


### Play Mode

- Full-screen presentation with a clean header showing both team badges and names

- **Animated transitions** — every player token and the ball glides smoothly to its new position (700ms easing) when you advance to the next phase

- **Manual navigation** — Prev / Next; Next locks during animation so you can't skip ahead

- **Progress indicator** — compact pill-style dots showing which phase you're on

- **Goal-mouth ball scaling** — the ball subtly shrinks as it crosses the goalline, giving a sense of depth

- Done button on the last phase closes the presentation

  
### Export

- **PNG** — current slide as a 16:9 image, ready for a presentation or social post

- **PDF** — all slides as a multi-page landscape PDF, one phase per page

- **Gameplan JSON** — full session export including both squads, all slides, formations, and token styles — reload it anytime


## A Typical Session

```
1. Select Germany (4-2-3-1) vs France (4-3-3)

2. Pick your starting 11 for each side

3. Drag players and ball into Phase 1 positions (e.g. France in possession, building from the back)

4. Duplicate the slide → drag tokens into Phase 2 (Germany's press triggers)

5. Duplicate again → Phase 3 (ball recovery, transition)

6. Hit Play → walk through the sequence with smooth animations

7. Export as PDF to share with the coaching staff
```

## Why It Works

**Speed.** From opening the app to a fully animated 3-phase tactical sequence takes under 5 minutes. There's no account creation, no file system to navigate, no render queue.

**Clarity.** The FotMob-inspired dark UI — black pitch surround, `#1a1a1a` headers, `#03b16b` green accents — keeps the focus on the pitch. Nothing competes with the tactical content.

**Portability.** It runs entirely in the browser. The gameplan JSON export means you can work on a session at home, hand the file to your assistant, and they can pick it up exactly where you left off.

**Extensibility.** Any team can be added in minutes with a JSON file. The format is simple enough that a club analyst could script the creation of every squad in their league.


## Technical Foundation

Built with React 18, TypeScript, Vite, and Zustand. No backend required — everything runs client-side. The dev server has a small plugin for saving custom team JSONs to disk, but the app itself has zero server dependencies.

| Capability | Implementation |
|---|---|
| Drag and drop | Pointer Events API, constrained to pitch bounds |
| Animation | CSS `transition` on `left`/`top`/`transform` |
| PNG export | dom-to-image-more |
| PDF export | jsPDF, iterates slides |
| State | Zustand — slides, teams, formations, token styles |
| Pitch | Pure SVG, `viewBox="0 0 160 90"`, `preserveAspectRatio="none"` |

## Setup

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).



## Player Images
Player photos are resolved from `public/images/` using the naming convention:

```
{TEAM_CODE}_{JERSEY_NUMBER}.png
```

Examples: `BRA_10.png`, `GER_7.png`, `ENG_9.png`

If an image is missing, the token falls back to an SVG avatar showing the jersey number in the team's primary colour.


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

**`teamAssetCode`** is the team ID — the badge is loaded from `src/assets/teambadge`

**Positions:** `GK`, `RB`, `CB`, `LB`, `CDM`, `CM`, `CAM`, `RM`, `LM`, `RW`, `LW`, `ST`, `CF`

Then either:
- Click **↑ JSON** in the app to upload it (saves to `src/data/` and opens the squad modal), or
- Drop the file into `src/data/` and import it in `src/components/Controls/TeamSelector.tsx`

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

## What's Next
The foundation is solid. Logical next features include:

- **Arrow annotations** — draw movement vectors directly on the pitch (passing lanes, runs, press triggers)
- **More formations** — 3-4-3, 4-4-1-1, 4-3-2-1 and others
- **Club teams** — Premier League, La Liga, Bundesliga squads via JSON packs
- **Set piece mode** — corner and free kick designer with arc/zone overlays
- **Presenter mode** — auto-advance with configurable timing for team meeting playback
- **Mobile support** — touch-optimised drag for pitch-side tablet use

---

*The Dugout is open and extensible by design. The JSON team format means anyone can build squad packs for their league, and the slide system is generic enough to support any tactical concept — not just 11v11.*