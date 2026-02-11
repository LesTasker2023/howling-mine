# Component Registry — TheDeltaProject

> **RULE: NEVER create raw styled elements when a component exists in this registry.**
> **RULE: Always check the Composed tab in the showcase (`/`) before building a new pattern.**
> **RULE: All pages fill available shell space — NO `max-width` + `margin: 0 auto` centering.**

This document is the single source of truth for every UI component in the design system. Before writing _any_ new page or feature, reference this file and compose from existing components.

---

## Import

All components export from the barrel at:

```tsx
import { Card, Badge, StatBlock, ... } from "@/components/ui";
```

Or individually:

```tsx
import { Card } from "@/components/ui/Card/Card";
```

Composed components (thin wrappers combining primitives):

```tsx
import { MobCard } from "@/components/composed/MobCard";
import { PlanetCard } from "@/components/composed/PlanetCard";
```

---

## Component Inventory

### Primitives (`@/components/ui`)

| Component         | Variants / Sizes                                                                   | Use For                                           |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Panel**         | `default`, `accent`, `ghost`; sm/md/lg                                             | Page sections, containers, grouped content        |
| **SectionHeader** | size: `sm`, `md`, `lg`                                                             | Section titles with bracket `[ TITLE ]` styling   |
| **Card**          | `default`, `interactive`, `accent`, `compact`; sm/md/lg                            | Clickable items, data cards, entity cards         |
| **StatBlock**     | size: `sm`, `md`, `lg`                                                             | Label+value pairs (Level, HP, Damage, Loot Score) |
| **SegmentedBar**  | `primary`, `success`, `warning`, `danger`; sm/md/lg                                | Progress/threat indicators                        |
| **Badge**         | `default`, `primary`, `success`, `warning`, `danger`, `accent`, `uncommon` + `dot` | Tags, labels, status indicators                   |
| **DataTable**     | `sortable`, `striped`, `compact`                                                   | Tabular data (maturities, loot, items)            |
| **Skeleton**      | —                                                                                  | Loading placeholders                              |
| **Button**        | `primary`, `secondary`, `ghost`; sm/md/lg                                          | Actions, navigation triggers                      |
| **SearchInput**   | size: `sm`, `md`                                                                   | Search fields with debounce                       |
| **Select**        | size: `sm`, `md`                                                                   | Dropdowns (sort, filter)                          |
| **Toggle**        | —                                                                                  | Boolean switches                                  |
| **Pagination**    | —                                                                                  | Page navigation                                   |
| **Breadcrumb**    | —                                                                                  | Route breadcrumbs                                 |
| **Drawer**        | position: `left`, `right`                                                          | Settings, filters, side panels                    |
| **Tooltip**       | —                                                                                  | Hover hints                                       |

### Composed (`@/components/composed`)

| Component      | Props                                                         | Use For                                                   |
| -------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| **MobCard**    | `mob: MobSummary`, `onClick?`, `className?`                   | Mob browse grid, search results, similar mobs, favourites |
| **PlanetCard** | `planet: PlanetStats`, `onClick?`, `highlight?`, `className?` | Funnel planet picker                                      |

---

## Composition Patterns

### Mob Browse Card (use `MobCard` — never inline)

```tsx
import { MobCard } from "@/components/composed/MobCard";

<MobCard mob={mob} onClick={() => navigate(path)} />;
```

Internally composes: Card → SectionHeader → StatBlock × 3 → Badge row → SegmentedBar.
Threat level is auto-computed from level + HP.

### Planet Picker Card (use `PlanetCard` — never inline)

```tsx
import { PlanetCard } from "@/components/composed/PlanetCard";

<PlanetCard
  planet={planet}
  onClick={() => selectPlanet(planet.planetName)}
  highlight={planet.planetName === "Calypso"}
/>;
```

Internally composes: Card → Globe icon → SectionHeader → StatBlock → optional Badge.

### Entity Detail Hero Stats

```tsx
<div className={styles.heroStats}>
  <StatBlock label="Level" value="1-80" />
  <StatBlock label="HP" value="40-8000" />
  <StatBlock label="Loot Score" value="7.2" />
</div>
```

### Data Tables (maturities, loot, items)

```tsx
<DataTable
  columns={COLUMNS}
  data={rows}
  keyField="id"
  compact
  striped
  sortable
/>
```

### Empty States

```tsx
<Panel variant="ghost">
  <div className={styles.empty}>
    <Icon size={40} />
    <p>No results.</p>
    <Button variant="secondary" size="sm" onClick={handleClear}>
      Clear filters
    </Button>
  </div>
</Panel>
```

### Planet/Goal Cards (funnel pages)

Use `PlanetCard` for planet selection. Goal cards still use `Card` directly:

```tsx
<Card variant="interactive" onClick={() => selectGoal(goal)}>
  <span>{goal.icon}</span>
  <SectionHeader title={goal.label} size="sm" />
  <p>{goal.subtitle}</p>
</Card>
```

---

## Layout Rules

1. **Fill the shell** — pages use `padding: var(--space-6) var(--space-8)` with NO `max-width` or `margin: 0 auto`
2. **Grid cards** — `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
3. **Stat rows** — `grid-template-columns: repeat(3, 1fr)` inside cards
4. **Badge rows** — `display: flex; flex-wrap: wrap; gap: var(--space-2)`
5. **Spacing** — use `var(--space-N)` tokens, never raw px

---

## CSS Module Helpers

Each page module should define these reusable layout classes as needed:

```css
.statRow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}
.badgeRow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.spacer {
  height: var(--space-2);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}
```

---

## Checklist Before Building Any Page

- [ ] Read this registry — does a component already exist for what you need?
- [ ] Check the showcase Composed tab — is there a pattern for this entity type?
- [ ] No `max-width` + `margin: 0 auto` — content fills the shell
- [ ] Using `Card variant="interactive"` for clickable items (not raw `<button>`)
- [ ] Using `StatBlock` for label+value pairs (not raw `<div>` + CSS)
- [ ] Using `Badge` for tags/labels (not raw `<span>` + CSS)
- [ ] Using `DataTable` for tabular data (not raw `<table>` + CSS)
- [ ] Using `Panel` for section containers
- [ ] Using `Button` for actions (not raw `<button>` + CSS)
- [ ] Using `SectionHeader` for section titles (not raw `<h2>` + CSS)
