# Component Registry — The Howling Mine

> **Last updated:** 2026-02-11
>
> **RULE: NEVER create raw styled elements when a component exists in this registry.**
> **RULE: Always check the showcase (`/`) before building a new pattern.**
> **RULE: All pages fill available shell space — NO `max-width` + `margin: 0 auto` centering.**

This document is the single source of truth for every UI component in the design system.

---

## Import

All UI primitives export from the barrel:

```tsx
import { Card, Badge, StatBlock, Panel, Button, ... } from "@/components/ui";
```

All charts export from:

```tsx
import { HudBarChart, HudGauge, Sankey, DialGauge, ... } from "@/components/ui/charts";
```

---

## Component Inventory

### 1. Layout

| #   | Component         | Path                           | What it does                                                                  | Props                                  |
| --- | ----------------- | ------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------- | ------ |
| 1   | **NavShell**      | `components/layout/NavShell/`  | Full app shell — collapsible sidebar, top bar with tabs, settings drawer      | `children`                             |
| 2   | **ThemeSettings** | `components/ui/ThemeSettings/` | Dark/light toggle, 6 accent presets, hue slider, BG brightness + tint sliders | _(reads from `useTheme()` internally)_ |
| 3   | **Drawer**        | `components/ui/Drawer/`        | Slide-in panel (left/right) with backdrop, Esc-close, focus trap              | `open`, `onClose`, `title`, `width: sm | md  | lg`, `side: left | right` |

### 2. Controls

| #   | Component       | Path                         | What it does                                            | Props                                                    |
| --- | --------------- | ---------------------------- | ------------------------------------------------------- | -------------------------------------------------------- | --------------- | -------------------- | --- | ---------------------------- |
| 4   | **Button**      | `components/ui/Button/`      | Styled button with HUD aesthetic                        | `variant: primary                                        | secondary       | ghost`, `size: sm    | md  | lg`, `fullWidth`, `iconOnly` |
| 5   | **SearchInput** | `components/ui/SearchInput/` | Debounced text input with search icon + clear button    | `value`, `onChange`, `placeholder`, `size: sm            | md              | lg`, `debounce` (ms) |
| 6   | **Select**      | `components/ui/Select/`      | Custom dropdown with keyboard nav + outside-click-close | `options`, `value`, `onChange`, `placeholder`, `size: sm | md              | lg`, `label`         |
| 7   | **Toggle**      | `components/ui/Toggle/`      | Accessible switch (`role="switch"`) with optional label | `checked`, `onChange`, `label`, `size: sm                | md`, `disabled` |

### 3. Data Display

| #   | Component        | Path                          | What it does                                                     | Props                                                                                                                            |
| --- | ---------------- | ----------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------- | ---- | --------------------------------- |
| 8   | **Badge**        | `components/ui/Badge/`        | Tags/chips — 11 color variants, optional dot + glow              | `variant` (default / primary / accent / success / warning / danger / common / uncommon / rare / epic / legendary), `dot`, `glow` |
| 9   | **StatBlock**    | `components/ui/StatBlock/`    | Big number with label, trend arrow ↑↓→, subtitle                 | `label`, `value`, `trend: { value, direction }`, `sub`, `size: sm                                                                | md    | lg`, `accent` |
| 10  | **SegmentedBar** | `components/ui/SegmentedBar/` | Discrete-segment horizontal progress bar (0–100)                 | `label`, `value` (0–100), `segments` (default 10), `variant`, `size`, `showValue`                                                |
| 11  | **Skeleton**     | `components/ui/Skeleton/`     | Loading shimmers — text, block, circle, stat, card shapes        | `variant: text                                                                                                                   | block | circle        | stat | card`, `width`, `height`, `lines` |
| 12  | **DataTable**    | `components/ui/DataTable/`    | Generic sortable table with column defs, striped rows, row click | `columns: Column<T>[]`, `data: T[]`, `keyField`, `sortable`, `striped`, `compact`, `onRowClick`                                  |

### 4. Containers

| #   | Component         | Path                           | What it does                                                            | Props              |
| --- | ----------------- | ------------------------------ | ----------------------------------------------------------------------- | ------------------ | ----------- | ------------- | --------------------------------------------------------- | ----------------- | --- | --- | ---------------- | ------- | ------- | --------------------- |
| 13  | **Panel**         | `components/ui/Panel/`         | Core HUD card frame — SVG corner brackets, glow, Framer Motion entrance | `variant: default  | interactive | accent        | danger                                                    | ghost`, `size: sm | md  | lg  | flush`, `as: div | section | article | aside`, `noAnimation` |
| 14  | **Card**          | `components/ui/Card/`          | Panel wrapper with optional header image, bg icon/image watermark       | `variant: default  | interactive | accent        | compact`, `size`, `image`, `bgIcon`, `bgImage`, `onClick` |
| 15  | **SectionHeader** | `components/ui/SectionHeader/` | Title inside HUD-style brackets `[ TITLE ]`                             | `title`, `size: sm | md          | lg`, `accent` |

### 5. Navigation

| #   | Component      | Path                        | What it does                                    | Props                                                                     |
| --- | -------------- | --------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- | --- |
| 16  | **Breadcrumb** | `components/ui/Breadcrumb/` | Trail with separator, aria-current on last item | `items: BreadcrumbItem[]`, `separator` (default `"›"`)                    |
| 17  | **Pagination** | `components/ui/Pagination/` | Page buttons with ellipsis, prev/next arrows    | `page`, `totalPages`, `onPageChange`, `maxVisible` (default 7), `size: sm | md` |

### 6. Overlays

| #   | Component   | Path                     | What it does                                            | Props                                  |
| --- | ----------- | ------------------------ | ------------------------------------------------------- | -------------------------------------- | ------ | ---- | -------------------- |
| 18  | **Tooltip** | `components/ui/Tooltip/` | Portal-rendered bubble, 4 placements, viewport clamping | `content`, `children`, `placement: top | bottom | left | right`, `delay` (ms) |

### 7. Charts — DeltaCharts (Custom SVG)

| #   | Component     | Path                            | What it does                                         | Props                                                                          |
| --- | ------------- | ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| 19  | **HudGauge**  | `charts/DeltaCharts/HudGauge`   | Full-circle segmented ring gauge (60 segments)       | `value` (0–100), `color`, `label`, `size` (px), `title`                        |
| 20  | **DialGauge** | `charts/DeltaCharts/DialGauge/` | Semi-circle dial with animated needle                | `value`, `max`, `label`, `size` (px), `displayValue`, `hint`, `animMs`, `bare` |
| 21  | **Sankey**    | `charts/DeltaCharts/Sankey/`    | Flow diagram with Bézier ribbons, hover highlighting | `sources`, `targets`, `links`, `title`, `width`, `height`                      |

### 8. Charts — KreCharts (Recharts wrappers)

| #   | Component         | Path                             | What it does                                 | Props                                                                   |
| --- | ----------------- | -------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| 22  | **HudBarChart**   | `charts/KreCharts/HudBarChart`   | Bar chart with HUD glow filters              | `data`, `series: BarSeries[]`, `title`, `height`                        |
| 23  | **HudLineChart**  | `charts/KreCharts/HudLineChart`  | Line chart with neon glow lines              | `data`, `series: LineSeries[]`, `title`, `height`                       |
| 24  | **HudPieChart**   | `charts/KreCharts/HudPieChart`   | Pie/donut with glow per cell, sidebar legend | `data: PieSlice[]`, `title`, `outerRadius`, `innerRadius`, `showLegend` |
| 25  | **HudRadarChart** | `charts/KreCharts/HudRadarChart` | Radar with polar grid, multi-series overlay  | `data`, `series: RadarSeries[]`, `title`, `height`                      |

### 9. Hooks & Utilities

| #   | Name                  | Path                                   | What it does                                                                                            |
| --- | --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 26  | **useHudTheme**       | `charts/KreCharts/useHudTheme.ts`      | Live theme-reactive chart colors via `useThemeColors()` → `{ PALETTE, DUO, AXIS, GRID, TOOLTIP_STYLE }` |
| 27  | **hud-theme.ts**      | `charts/KreCharts/hud-theme.ts`        | Static chart constants — `HUD_PALETTE`, `HUD_DUO`, `HUD_AXIS`, etc.                                     |
| 28  | **hud-primitives.ts** | `charts/DeltaCharts/hud-primitives.ts` | SVG geometry helpers — `polarXY`, `segPath`, `buildTicks`                                               |

### 10. Barrel Exports

| Barrel                                      | Exports                                                         |
| ------------------------------------------- | --------------------------------------------------------------- |
| `components/ui/index.ts`                    | All 16 UI primitives + types (Panel, Card, Badge, Button, etc.) |
| `components/ui/charts/index.ts`             | All 7 chart components + types                                  |
| `components/ui/charts/KreCharts/index.ts`   | 4 Recharts wrappers + `HUD_PALETTE`, `HUD_DUO`                  |
| `components/ui/charts/DeltaCharts/index.ts` | HudGauge, DialGauge, Sankey                                     |
| `components/layout/index.ts`                | NavShell                                                        |

---

## MoSCoW — Remaining Components

### MUST Have

| Component                   | Why                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| **Modal / Dialog**          | Centered modal with confirm/cancel. Focus trap, portal, Esc-close. Drawer is not the same.     |
| **Toast / Notification**    | Feedback for user actions (saved, error, copied). Auto-dismiss + action slot.                  |
| **Input / TextField**       | General text input with label, error states, helper text. SearchInput is too specialized.      |
| **Tabs**                    | Reusable in-page content switcher. NavShell has a concept but it's not a standalone component. |
| **Accordion / Collapsible** | Expandable sections for dense content — FAQ, settings groups, filter panels.                   |
| **Avatar / UserBadge**      | Profile images / initials with status indicator. Any user-facing page needs this.              |

### SHOULD Have

| Component                            | Why                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **ProgressBar** (linear, continuous) | SegmentedBar is discrete. Smooth linear/indeterminate progress needed for uploads, loading.       |
| **Checkbox**                         | Toggle is boolean but visually different. Multi-select forms need checkboxes.                     |
| **Radio Group**                      | Exclusive choice from a list — common in settings, forms.                                         |
| **Tag / Chip Input**                 | Editable tag list — adding/removing tags inline. Badge is display-only.                           |
| **EmptyState**                       | Illustration + message + action button for zero-data views. Better than ad-hoc empty divs.        |
| **Alert / Banner**                   | Persistent in-page message (info/warning/error/success). Different from toast (doesn't dismiss).  |
| **Dropdown Menu**                    | Action menu (right-click or button-triggered). Different from Select (fires actions, not values). |
| **HudAreaChart**                     | Filled area chart to complete the Recharts set — useful for volume/timeline data.                 |

### COULD Have

| Component                    | Why                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| **Stepper / Wizard**         | Multi-step form flow with progress indicators.                                        |
| **Calendar / DatePicker**    | Date selection UI. Complex but needed if there's scheduling/filtering.                |
| **Slider** (general purpose) | ThemeSettings has sliders baked in, but a reusable Slider primitive would be cleaner. |
| **Popover**                  | Tooltip on steroids — interactive content on hover/click. Mini filter panels, etc.    |
| **Timeline**                 | Vertical event feed with timestamps + icons. Changelogs, activity.                    |
| **Command Palette**          | Ctrl+K quick-search overlay for power users.                                          |
| **HudScatterChart**          | Dot plot / scatter to round out the chart library.                                    |
| **Code Block**               | Syntax-highlighted code display with copy button.                                     |

### WON'T Have (for now)

| Component                     | Why not                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| **Rich Text Editor**          | Huge scope — pull in Tiptap or similar if ever needed.         |
| **File Upload / Dropzone**    | Not relevant until there's a backend that accepts files.       |
| **Color Picker** (standalone) | Theme settings already covers this with hue slider.            |
| **Map / Geo**                 | No geographic data requirements.                               |
| **Video Player**              | No video content planned.                                      |
| **Tree View**                 | Hierarchical nav — not needed unless there's deep nested data. |

---

## Quick Stats

- **Total existing components:** 25 (18 UI primitives + 7 charts)
- **Hooks/Utilities:** 3
- **MoSCoW remaining:** 6 Must, 8 Should, 8 Could

---

## Layout Rules

1. **Fill the shell** — pages use `padding: var(--space-6) var(--space-8)` with NO `max-width` or `margin: 0 auto`
2. **Grid cards** — `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
3. **Stat rows** — `grid-template-columns: repeat(3, 1fr)` inside cards
4. **Badge rows** — `display: flex; flex-wrap: wrap; gap: var(--space-2)`
5. **Spacing** — use `var(--space-N)` tokens, never raw px
6. **Colors** — use `var(--color-primary)`, `var(--color-accent)`, `var(--bg-*)`, `var(--text-*)` tokens, never raw hex

---

## Checklist Before Building Any Page

- [ ] Read this registry — does a component already exist?
- [ ] Check the showcase (`/`) — is there a pattern for this?
- [ ] No `max-width` + `margin: 0 auto` — content fills the shell
- [ ] Using `Card variant="interactive"` for clickable items (not raw `<button>`)
- [ ] Using `StatBlock` for label+value pairs (not raw `<div>` + CSS)
- [ ] Using `Badge` for tags/labels (not raw `<span>` + CSS)
- [ ] Using `DataTable` for tabular data (not raw `<table>` + CSS)
- [ ] Using `Panel` for section containers (not raw `<div>`)
- [ ] Using `Button` for actions (not raw `<button>` + CSS)
- [ ] Using `SectionHeader` for section titles (not raw `<h2>` + CSS)
- [ ] Using CSS custom properties for all colors and spacing
