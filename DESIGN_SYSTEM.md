# The Delta Project — Design System Reference

## Brand Constants

| Token        | Value     | Usage                                                      |
| ------------ | --------- | ---------------------------------------------------------- |
| Primary      | `#3b82f6` | Interactive elements, map highlights, active states, links |
| Accent / CTA | `#06b6d4` | Buttons, clickables, warnings, call-to-action              |
| Theme        | Dark      | Full dark theme, no light mode                             |

---

## Visual Direction

**Style:** Sci-fi tactical dashboard / HUD
**Mood:** Data-dense, clean, military-grade interface — not flashy cyberpunk

---

## Reference Analysis

### Reference 1 — Tactical Map Dashboard

**Source:** Dribbble (server monitoring dashboard)
**What we like:**

- **Map as hero element** — takes ~60% of viewport, everything else frames it
- **Line-art / wireframe map** — no satellite imagery, no textures. Just strokes on dark background. Data points (dots, regions) become the visual focus
- **Bracket-style panel headers** — `[ SERVERS ]`, `[ DATA USED ]` — military/tactical HUD feel
- **Floating panels over map** — semi-transparent overlays, not separate page sections
- **High data density, still readable** — dark bg + cyan/blue accents create clear hierarchy
- **Bottom ticker bar** — persistent key stats always visible

**How it applies to us:**

- Interactive map page: wireframe SVG/canvas planet maps instead of raster images
- Mob spawn polygons rendered as glowing regions with density heat
- Click region → panel slides in with area mobs
- Bottom bar for global stats (economy, hunt session, etc.)
- Polygon data from spawn coordinates drives the map — data-driven art

**Palette adaptation:**

- Background: deep navy (`#0a0f1a` range)
- Map lines: muted blue (`#1e3a5f`)
- Active regions/dots: primary `#3b82f6`
- CTAs/interactives: cyan `#06b6d4`
- Stat highlights: white or light blue

---

## Emerging Patterns

_Updated as references are reviewed_

### Layout

- [ ] Map-centric hero sections
- [ ] Floating panels / overlays
- [ ] Bottom persistent stat bar

### Typography

- [ ] Bracket-wrapped section headers `[ TITLE ]`
- [ ] Monospace for data values
- [ ] Sans-serif for labels/body

### Components

- [ ] Wireframe map (SVG/Canvas)
- [ ] Floating data panels
- [ ] Stat blocks with sparklines
- [ ] Radial / donut charts
- [ ] Status indicators (colored dots)
- [ ] Bottom ticker bar

### Effects

- [ ] Subtle glow on active elements
- [ ] Semi-transparent panel backgrounds
- [ ] Line-art over solid fills

---

## Color Tokens (Draft)

```css
:root {
  /* Core */
  --color-primary: #3b82f6;
  --color-accent: #06b6d4;

  /* Backgrounds */
  --bg-base: #0a0f1a;
  --bg-surface: #0d1524;
  --bg-panel: rgba(13, 21, 36, 0.85);
  --bg-elevated: #111d32;

  /* Map */
  --map-line: #1e3a5f;
  --map-region-active: rgba(59, 130, 246, 0.2);
  --map-dot: #3b82f6;
  --map-dot-danger: #06b6d4;

  /* Text */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #475569;

  /* Borders */
  --border-subtle: rgba(59, 130, 246, 0.15);
  --border-panel: rgba(59, 130, 246, 0.25);

  /* Status */
  --status-success: #22c55e;
  --status-warning: #eab308;
  --status-danger: #ef4444;
}
```

### Reference 2 — Sci-Fi HUD Dashboard

**Source:** Dribbble (space station HUD)
**What we like:**

- **Decorative corner borders** — panels have clipped/notched corners with small accent ticks, dots, and lines at edges. Not simple `border-radius` — these are styled frame elements. THE defining visual detail.
- **Panel headers with accent line** — section titles sit inside a bordered tab/tag shape with a horizontal rule extending from it
- **Radar / spider charts** — pentagon chart for multi-axis data. Perfect for mob stat comparisons (damage, HP, defense, speed, etc.)
- **Radial progress rings** — glowing donut charts with large % in center. Great for codex completion, loot efficiency, markup vs TT ratios
- **Multi-line waveform charts** — colored oscillating lines (cyan, red, green). Useful for price history, loot trends over time
- **Large stat numbers with sub-labels** — bold oversized monospace numbers (`1,222,355 m`) with small descriptive label above
- **Bottom stat row** — horizontal card strip with big number + change indicator (↑8% MOM)
- **Color-coded status bars** — horizontal stacked bars with red/green/blue segments for at-a-glance data

**How it applies to us:**

- Panel component needs decorative corners (CSS clip-path or pseudo-elements with border accents)
- Mob detail page: spider chart for damage profile across maturities
- Economy page: radial rings for markup %, TT return ratios
- Price history: waveform multi-line charts
- Hub pages: large stat callouts (total mobs, avg loot, active players)
- Bottom persistent bar with key metrics + trend arrows

**Key CSS techniques needed:**

- `clip-path` for notched corners
- `::before` / `::after` pseudo-elements for corner accent marks
- `box-shadow` with blue glow for active panels
- Monospace font for all numeric data

---

## Emerging Patterns

_Updated as references are reviewed_

### Layout

- [x] Map-centric hero sections (Ref 1)
- [x] Floating panels / overlays (Ref 1)
- [x] Bottom persistent stat bar (Ref 1, 2)
- [x] Horizontal stat card rows (Ref 2)

### Typography

- [x] Bracket-wrapped section headers `[ TITLE ]` (Ref 1)
- [x] Monospace for data values (Ref 1, 2)
- [x] Sans-serif for labels/body (Ref 1, 2)
- [x] Large oversized stat numbers (Ref 2)
- [x] Small caps sub-labels above stats (Ref 2)

### Components

- [x] Wireframe map (SVG/Canvas) (Ref 1)
- [x] Floating data panels (Ref 1)
- [x] Stat blocks with sparklines (Ref 1)
- [x] Radial / donut charts (Ref 1, 2)
- [x] Status indicators (colored dots) (Ref 1)
- [x] Bottom ticker bar (Ref 1)
- [x] Decorative corner-framed panels (Ref 2) ★ KEY ELEMENT
- [x] Radar / spider charts (Ref 2)
- [x] Radial progress rings with glow (Ref 2)
- [x] Multi-line waveform charts (Ref 2)
- [x] Horizontal stacked status bars (Ref 2)

### Reference 3 — Aetheria Planet Mission Screen

**Source:** Dribbble (Sci-Fi Game UI Concept)
**What we like:** EVERYTHING. This is the template for planet-specific pages (`/calypso`, `/howling-mine`, etc.)

- **3-column planet layout** — left info panel (briefing), center planet hero (3D globe with orbital lines), right stats panel (deployment, progress, warnings)
- **Planet as centerpiece** — the globe dominates the viewport. Orbital ring lines, coordinate markers, map pins on the surface. For us: wireframe planet map with spawn overlays
- **Decorative title treatment** — icon + planet name + subtitle, flanked by horizontal dashed lines (`— — AETHERIA. — —`). Uppercase, wide letter-spacing
- **Briefing hierarchy** — PRIMARY: / SECONDARY: / OPTIONAL: with diamond ◆ icon markers. Maps to: "Best For Hunting" / "Also Good For" / "Rare Finds" or hunt difficulty tiers
- **Segmented progress bars** — blocky bar segments, not smooth gradients. Perfect for codex completion, exploration %, loot thresholds
- **Warning / danger callouts** — red-tinted background panels with ⚠ icons. "PLANET INFESTATION: LEVEL 4" with segmented red bar → mob threat level per area
- **Deployment coordinates** — bordered coordinate boxes (`45.2° N, 88.4° W`). Perfect for spawn location readouts
- **Bottom action bar** — `[ESC] BACK` left | gold CTA center (`START MISSION`) | `[□] SELECT` right — keyboard-hint style navigation. Game-like feel.
- **Tab navigation at top** — MISSION / MARINES / SUPPLIES — underlined active tab, uppercase, letter-spaced
- **Section headers** — `:: DEPLOYMENT` and `MISSION ——` patterns with decorative line extensions

**How it applies to us:**

- `/calypso`, `/howling-mine`, `/arkadia` etc. use this exact 3-column layout
- Center: wireframe planet map with mob spawn regions highlighted
- Left panel: planet brief — what's here, who hunts here, key resources
- Right panel: planet stats — total mobs, threat level bars, active events, economy metrics
- Bottom bar: navigation (back to planets) + primary CTA ("Explore Mobs" or "Open Map")
- Tab nav: Overview / Mobs / Resources / Map
- Hunt difficulty shown as segmented bars (like "INFESTATION: LEVEL 4")
- Spawn coordinates in bordered readout boxes

---

## Emerging Patterns

_Updated as references are reviewed_

### Layout

- [x] Map-centric hero sections (Ref 1)
- [x] Floating panels / overlays (Ref 1)
- [x] Bottom persistent stat bar (Ref 1, 2)
- [x] Horizontal stat card rows (Ref 2)
- [x] 3-column planet layout: info | hero | stats (Ref 3) ★ PLANET PAGES
- [x] Bottom action bar with keyboard hints (Ref 3)
- [x] Top tab navigation, uppercase, underlined active (Ref 3)

### Typography

- [x] Bracket-wrapped section headers `[ TITLE ]` (Ref 1)
- [x] Monospace for data values (Ref 1, 2)
- [x] Sans-serif for labels/body (Ref 1, 2)
- [x] Large oversized stat numbers (Ref 2)
- [x] Small caps sub-labels above stats (Ref 2)
- [x] Decorative flanked titles `— — NAME — —` (Ref 3)
- [x] Wide letter-spacing on headers (Ref 3)
- [x] Hierarchy markers ◆ PRIMARY: / ◇ SECONDARY: (Ref 3)

### Components

- [x] Wireframe map (SVG/Canvas) (Ref 1)
- [x] Floating data panels (Ref 1)
- [x] Stat blocks with sparklines (Ref 1)
- [x] Radial / donut charts (Ref 1, 2)
- [x] Status indicators (colored dots) (Ref 1)
- [x] Bottom ticker bar (Ref 1)
- [x] Decorative corner-framed panels (Ref 2) ★ KEY ELEMENT
- [x] Radar / spider charts (Ref 2)
- [x] Radial progress rings with glow (Ref 2)
- [x] Multi-line waveform charts (Ref 2)
- [x] Horizontal stacked status bars (Ref 2)
- [x] Segmented progress bars (Ref 3) ★ KEY ELEMENT
- [x] Warning / danger callout panels (Ref 3)
- [x] Coordinate readout boxes (Ref 3)
- [x] Planet hero globe with orbital lines (Ref 3)
- [x] Briefing panel with hierarchy (Ref 3)
- [x] Bottom action bar with CTA (Ref 3)

### Reference 4 — FPS Inventory / Loadout Screen

**Source:** Dribbble (FPS Video Game UI Inventory)
**What we like:** Confirms the core aesthetic — **wireframe art + notched corners**

- **Wireframe item illustrations** — weapons shown as line-art drawings, not photos or 3D renders. Dark background, light stroke. THIS is the item card aesthetic for weapons, armor, tools across the site
- **Side-by-side comparison cards** — PRIMARY WEAPON | SECONDARY WEAPON with equal-sized cards. Perfect for weapon/armor comparison pages and "vs" views
- **XP / level progress bars** — thin cyan/teal bar under each item. Clean, subtle, no label clutter
- **Equipment slot grid** — bottom row of square icon tiles with colored borders: gold = equipped/active, purple = special, default = empty. Maps to: weapon attachments, enhancers, armor set pieces
- **Gold/amber CTA buttons** — CONFIRM in dark gold. Our cyan `#06b6d4` fills this exact role
- **Mobile-first thinking** — same components stack vertically on phone. Designing for responsive from day one
- **Minimal surrounding chrome** — very little decoration beyond the cards themselves. The content and wireframe art ARE the design
- **Status indicator dots** — `●●●` subtle cyan dots for attachment/mod slots

**How it applies to us:**

- `/weapons/[slug]` detail page: wireframe weapon art + stat card side-by-side
- `/armor/[slug]`: wireframe armor illustration + protection stats
- Comparison tool: two cards side-by-side, same layout
- Equipment slots grid: enhancer slots, scope/sight/amp attachments shown as icon grid with rarity borders
- Item cards everywhere use wireframe illustration style
- CTA buttons use cyan `#06b6d4` on dark backgrounds

**Core aesthetic confirmed:**

> **Wireframe illustrations + notched corner panels + dark theme + blue/cyan palette**

---

## ★ DESIGN IDENTITY (Crystallized)

After 4 references, the visual identity is clear:

1. **Wireframe / line-art imagery** — items, maps, planets rendered as strokes not fills
2. **Notched corner panels** — clip-path borders with accent tick marks at corners
3. **Dark navy base** — `#0a0f1a` to `#0d1524` range
4. **Blue primary (`#3b82f6`)** — data, interactive states, borders, glows
5. **Cyan accent (`#06b6d4`)** — CTAs, clickables, warnings, highlights
6. **Monospace numbers** — all data/stats in monospace, labels in sans-serif
7. **Segmented bars** — blocky progress, not smooth gradients
8. **Bracket headers** — `[ SECTION ]` or `:: SECTION` or `SECTION ——`
9. **High data density** — lots of info, but hierarchy through size and opacity
10. **Game-feel navigation** — keyboard hints, bottom action bars, tab systems

---

## Emerging Patterns

_Updated as references are reviewed_

### Layout

- [x] Map-centric hero sections (Ref 1)
- [x] Floating panels / overlays (Ref 1)
- [x] Bottom persistent stat bar (Ref 1, 2)
- [x] Horizontal stat card rows (Ref 2)
- [x] 3-column planet layout: info | hero | stats (Ref 3) ★ PLANET PAGES
- [x] Bottom action bar with keyboard hints (Ref 3)
- [x] Top tab navigation, uppercase, underlined active (Ref 3)
- [x] Side-by-side comparison cards (Ref 4)
- [x] Equipment slot icon grid (Ref 4)
- [x] Mobile-responsive stacking (Ref 4)

### Typography

- [x] Bracket-wrapped section headers `[ TITLE ]` (Ref 1)
- [x] Monospace for data values (Ref 1, 2)
- [x] Sans-serif for labels/body (Ref 1, 2)
- [x] Large oversized stat numbers (Ref 2)
- [x] Small caps sub-labels above stats (Ref 2)
- [x] Decorative flanked titles `— — NAME — —` (Ref 3)
- [x] Wide letter-spacing on headers (Ref 3)
- [x] Hierarchy markers ◆ PRIMARY: / ◇ SECONDARY: (Ref 3)

### Components

- [x] Wireframe map (SVG/Canvas) (Ref 1)
- [x] Floating data panels (Ref 1)
- [x] Stat blocks with sparklines (Ref 1)
- [x] Radial / donut charts (Ref 1, 2)
- [x] Status indicators (colored dots) (Ref 1, 4)
- [x] Bottom ticker bar (Ref 1)
- [x] Decorative corner-framed panels (Ref 2) ★ KEY ELEMENT
- [x] Radar / spider charts (Ref 2)
- [x] Radial progress rings with glow (Ref 2)
- [x] Multi-line waveform charts (Ref 2)
- [x] Horizontal stacked status bars (Ref 2)
- [x] Segmented progress bars (Ref 3) ★ KEY ELEMENT
- [x] Warning / danger callout panels (Ref 3)
- [x] Coordinate readout boxes (Ref 3)
- [x] Planet hero globe with orbital lines (Ref 3)
- [x] Briefing panel with hierarchy (Ref 3)
- [x] Bottom action bar with CTA (Ref 3)
- [x] Wireframe item illustration cards (Ref 4) ★ KEY ELEMENT
- [x] Side-by-side comparison layout (Ref 4)
- [x] Equipment slot icon grid with rarity borders (Ref 4)
- [x] Thin XP/level progress bars (Ref 4)

### Effects

- [x] Subtle glow on active elements (Ref 1)
- [x] Semi-transparent panel backgrounds (Ref 1)
- [x] Line-art over solid fills (Ref 1, 4) ★ CORE IDENTITY
- [x] Notched / clipped panel corners (Ref 2) ★ CORE IDENTITY
- [x] Corner accent tick marks (Ref 2) ★ CORE IDENTITY
- [x] Blue glow box-shadow on focus/active (Ref 2)
- [x] Red-tinted danger panels (Ref 3)
- [x] Segmented bar fills (blocky, not smooth) (Ref 3)
- [x] Decorative horizontal rule extensions from headers (Ref 3)
- [x] Rarity border colors on equipment slots (Ref 4)

---

## Color Tokens (Draft)

```css
:root {
  /* Core */
  --color-primary: #3b82f6;
  --color-accent: #06b6d4;

  /* Backgrounds */
  --bg-base: #0a0f1a;
  --bg-surface: #0d1524;
  --bg-panel: rgba(13, 21, 36, 0.85);
  --bg-elevated: #111d32;

  /* Map */
  --map-line: #1e3a5f;
  --map-region-active: rgba(59, 130, 246, 0.2);
  --map-dot: #3b82f6;
  --map-dot-danger: #06b6d4;

  /* Text */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #475569;

  /* Borders */
  --border-subtle: rgba(59, 130, 246, 0.15);
  --border-panel: rgba(59, 130, 246, 0.25);
  --border-accent: rgba(59, 130, 246, 0.4);

  /* Status */
  --status-success: #22c55e;
  --status-warning: #eab308;
  --status-danger: #ef4444;

  /* Glow */
  --glow-primary: 0 0 12px rgba(59, 130, 246, 0.3);
  --glow-accent: 0 0 12px rgba(6, 182, 212, 0.3);
}
```

---

_More references to follow..._
