"use client";

import { useState, useEffect } from "react";
import { useTopBar } from "@/context/TopBarContext";
import {
  Panel,
  SectionHeader,
  Card,
  StatBlock,
  SegmentedBar,
  Badge,
  DataTable,
  Skeleton,
  Button,
  SearchInput,
  Select,
  Toggle,
  Pagination,
  Breadcrumb,
  Tooltip,
} from "@/components/ui";
import type { Column } from "@/components/ui";
import {
  Diamond,
  Pickaxe,
  Shield,
  Rocket,
  Star,
  Zap,
  Flame,
  Eye,
} from "lucide-react";
import {
  HudBarChart,
  HudLineChart,
  HudPieChart,
  HudRadarChart,
  HudGauge,
  DialGauge,
  Sankey,
} from "@/components/ui/charts";
import type {
  BarSeries,
  LineSeries,
  PieSlice,
  RadarSeries,
  SankeyNode,
  SankeyLink,
} from "@/components/ui/charts";
import styles from "./page.module.css";

/* ── Subtab keys ── */
const SUB_TABS = [
  { key: "primitives", label: "Primitives" },
  { key: "components", label: "Components" },
  { key: "compositions", label: "Compositions" },
  { key: "visuals", label: "Visuals" },
];

/* ── Sample data for DataTable ── */
interface MinerRow {
  id: number;
  name: string;
  runs: number;
  profit: string;
  rarity: string;
}
const MINERS: MinerRow[] = [
  { id: 1, name: "Elessar", runs: 342, profit: "+12,480 PED", rarity: "Epic" },
  {
    id: 2,
    name: "Nightfall",
    runs: 281,
    profit: "+8,920 PED",
    rarity: "Rare",
  },
  {
    id: 3,
    name: "StoneViper",
    runs: 195,
    profit: "+5,340 PED",
    rarity: "Uncommon",
  },
  {
    id: 4,
    name: "FrostByte",
    runs: 156,
    profit: "-1,200 PED",
    rarity: "Common",
  },
];
const MINER_COLS: Column<MinerRow>[] = [
  { key: "name", label: "Miner" },
  { key: "runs", label: "Runs", width: "80px" },
  { key: "profit", label: "Net P&L", width: "120px" },
  {
    key: "rarity",
    label: "Tier",
    width: "100px",
    render: (row: MinerRow) => (
      <Badge
        variant={
          row.rarity.toLowerCase() as
            | "common"
            | "uncommon"
            | "rare"
            | "epic"
            | "legendary"
        }
      >
        {row.rarity}
      </Badge>
    ),
  },
];

/* ═══════════════════════════════════════════════════
   TAB PANELS
   ═══════════════════════════════════════════════════ */

/* ─── PRIMITIVES ─── */
function PrimitivesTab() {
  return (
    <>
      {/* 1 · Typography */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <p className={styles.sectionDesc}>
          Content heading styles as rendered in news articles and guides.
        </p>

        <Panel variant="default">
          <div style={{ fontFamily: "var(--font-mono)" }}>
            <h2
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                fontSize: "var(--text-2xl)",
                fontWeight: 700,
                marginTop: 0,
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: "var(--color-primary)" }}>{"// "}</span>
              Heading Level 2
            </h2>
            <h3
              style={{
                letterSpacing: "0.02em",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: "var(--color-primary)" }}>&gt; </span>
              Heading Level 3
            </h3>
            <h4
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Heading Level 4
            </h4>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Body text in the standard reading style. Words like{" "}
            <strong style={{ color: "var(--text-primary)" }}>bold</strong>,{" "}
            <em>italic</em>, and{" "}
            <code
              style={{
                fontFamily: "var(--font-mono)",
                background: "rgba(234,179,8,0.08)",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "0.9em",
              }}
            >
              inline code
            </code>{" "}
            are styled with the gold accent theme.
          </p>

          <blockquote
            style={{
              borderRadius: "var(--radius-md)",
              background: "rgba(234,179,8,0.04)",
              border: "1px solid var(--border-subtle)",
              padding: "var(--space-4) var(--space-5)",
              margin: "var(--space-4) 0",
              fontStyle: "italic",
              color: "var(--text-secondary)",
            }}
          >
            &ldquo;The best miners don&apos;t chase HoFs — they optimise their
            return rate and let the HoFs come to them.&rdquo;
          </blockquote>
        </Panel>
      </section>

      {/* 3 · Icons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Icon Library</h2>
        <p className={styles.sectionDesc}>
          Lucide icons used throughout the UI — available for CMS content and
          map markers.
        </p>
        <div className={styles.inlineRow}>
          {[
            { Icon: Diamond, name: "Diamond" },
            { Icon: Pickaxe, name: "Pickaxe" },
            { Icon: Shield, name: "Shield" },
            { Icon: Rocket, name: "Rocket" },
            { Icon: Star, name: "Star" },
            { Icon: Zap, name: "Zap" },
            { Icon: Flame, name: "Flame" },
            { Icon: Eye, name: "Eye" },
          ].map(({ Icon, name }) => (
            <Tooltip key={name} content={name}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  minWidth: 64,
                }}
              >
                <Icon size={24} color="var(--color-primary)" />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  {name}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* 4 · Section Headers */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Section Headers</h2>
        <p className={styles.sectionDesc}>
          Bracketed titles used to label content sections. Three sizes, optional
          accent.
        </p>
        <div className={styles.typeStack}>
          <SectionHeader title="Large Header" size="lg" />
          <SectionHeader title="Medium Header (Default)" size="md" />
          <SectionHeader title="Small Header" size="sm" />
          <SectionHeader title="Accent Header" size="md" accent />
        </div>
      </section>
    </>
  );
}

/* ─── COMPONENTS ─── */
function ComponentsTab() {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("option-1");
  const [page, setPage] = useState(1);

  return (
    <>
      {/* Panels */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Panels</h2>
        <p className={styles.sectionDesc}>
          HUD-framed containers with SVG corner brackets, accent tabs, and hash
          marks. Five variants, four padding sizes.
        </p>

        <div className={styles.subLabel}>Variants</div>
        <div className={styles.grid2}>
          <Panel variant="default">
            <SectionHeader title="Default Panel" size="sm" />
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Standard container with tactical corner brackets.
            </p>
          </Panel>
          <Panel variant="interactive">
            <SectionHeader title="Interactive Panel" size="sm" />
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Hover-reactive with enhanced glow on interaction.
            </p>
          </Panel>
          <Panel variant="accent">
            <SectionHeader title="Accent Panel" size="sm" />
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Primary gold accent for highlighted content.
            </p>
          </Panel>
          <Panel variant="danger">
            <SectionHeader title="Danger Panel" size="sm" />
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Red-tinted for warnings and critical alerts.
            </p>
          </Panel>
          <Panel variant="ghost">
            <SectionHeader title="Ghost Panel" size="sm" />
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Minimal border — background-only container.
            </p>
          </Panel>
        </div>

        <div className={styles.subLabel}>Padding Sizes</div>
        <div className={styles.grid2}>
          <Panel size="flush">
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                padding: "var(--space-2)",
              }}
            >
              Flush (no padding)
            </p>
          </Panel>
          <Panel size="sm">
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Small padding
            </p>
          </Panel>
          <Panel size="md">
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Medium padding (default)
            </p>
          </Panel>
          <Panel size="lg">
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Large padding
            </p>
          </Panel>
        </div>
      </section>

      {/* Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards</h2>
        <p className={styles.sectionDesc}>
          Panel-based cards with optional header images, background icons, and
          click behaviour.
        </p>

        <div className={styles.grid3}>
          <Card variant="default">
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
                margin: "0 0 var(--space-2)",
                color: "var(--text-primary)",
              }}
            >
              Default Card
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "var(--text-sm)",
              }}
            >
              Standard content container.
            </p>
          </Card>
          <Card variant="interactive" onClick={() => {}}>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
                margin: "0 0 var(--space-2)",
                color: "var(--text-primary)",
              }}
            >
              Interactive Card
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "var(--text-sm)",
              }}
            >
              Clickable with hover state.
            </p>
          </Card>
          <Card variant="accent">
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
                margin: "0 0 var(--space-2)",
                color: "var(--text-primary)",
              }}
            >
              Accent Card
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "var(--text-sm)",
              }}
            >
              Gold-highlighted variant.
            </p>
          </Card>
          <Card variant="compact" size="sm">
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
                margin: "0 0 var(--space-2)",
                color: "var(--text-primary)",
              }}
            >
              Compact Card
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "var(--text-sm)",
              }}
            >
              Reduced padding for dense layouts.
            </p>
          </Card>
          <Card variant="default" bgIcon={Diamond}>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
                margin: "0 0 var(--space-2)",
                color: "var(--text-primary)",
              }}
            >
              With BG Icon
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "var(--text-sm)",
              }}
            >
              Subtle watermark icon in the background.
            </p>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <p className={styles.sectionDesc}>
          Three variants, three sizes, full-width and icon-only options.
        </p>

        <div className={styles.subLabel}>Variants</div>
        <div className={styles.inlineRow}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <div className={styles.subLabel}>Sizes</div>
        <div className={styles.inlineRow}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className={styles.subLabel}>Icon Buttons</div>
        <div className={styles.inlineRow}>
          <Button variant="primary" iconOnly size="sm">
            <Rocket size={16} />
          </Button>
          <Button variant="secondary" iconOnly>
            <Pickaxe size={18} />
          </Button>
          <Button variant="ghost" iconOnly size="lg">
            <Shield size={22} />
          </Button>
        </div>

        <div className={styles.subLabel}>Full Width</div>
        <Button variant="primary" fullWidth>
          Full Width Primary
        </Button>
      </section>

      {/* Badges */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badges</h2>
        <p className={styles.sectionDesc}>
          Status indicators and rarity tiers. Optional dot and glow effects.
        </p>

        <div className={styles.subLabel}>Status</div>
        <div className={styles.inlineRow}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot>
            Pending
          </Badge>
          <Badge variant="danger" dot>
            Critical
          </Badge>
        </div>

        <div className={styles.subLabel}>Rarity Tiers</div>
        <div className={styles.inlineRow}>
          <Badge variant="common">Common</Badge>
          <Badge variant="uncommon">Uncommon</Badge>
          <Badge variant="rare">Rare</Badge>
          <Badge variant="epic" glow>
            Epic
          </Badge>
          <Badge variant="legendary" glow>
            Legendary
          </Badge>
        </div>
      </section>

      {/* Stat Blocks */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stat Blocks</h2>
        <p className={styles.sectionDesc}>
          Metric displays with trend indicators. Three sizes.
        </p>

        <div className={styles.grid4}>
          <StatBlock
            label="Total Runs"
            value={12847}
            trend={{ value: "12%", direction: "up" }}
            sub="Last 30 days"
          />
          <StatBlock
            label="Net Profit"
            value="2.4M PED"
            trend={{ value: "8.4%", direction: "up" }}
            sub="This month"
            accent
          />
          <StatBlock
            label="HoF Rate"
            value="3.2%"
            trend={{ value: "0.5%", direction: "down" }}
            sub="vs last month"
          />
          <StatBlock
            label="Active Miners"
            value={847}
            trend={{ value: "0%", direction: "neutral" }}
            sub="Stable"
          />
        </div>

        <div className={styles.subLabel}>Sizes</div>
        <div className={styles.row}>
          <StatBlock label="Small" value="42" size="sm" />
          <StatBlock label="Medium" value="128" size="md" />
          <StatBlock label="Large" value="3,847" size="lg" accent />
        </div>
      </section>

      {/* Segmented Bars */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Segmented Bars</h2>
        <p className={styles.sectionDesc}>
          Progress indicators with segmented fill. Five colour variants, three
          sizes.
        </p>

        <div className={styles.barStack}>
          <SegmentedBar label="Return Rate" value={72} variant="primary" />
          <SegmentedBar label="Markup" value={85} variant="accent" />
          <SegmentedBar label="Success Rate" value={94} variant="success" />
          <SegmentedBar label="Risk Level" value={45} variant="warning" />
          <SegmentedBar label="Threat" value={28} variant="danger" />
        </div>

        <div className={styles.subLabel}>Sizes</div>
        <div className={styles.barStack}>
          <SegmentedBar label="Small" value={60} size="sm" />
          <SegmentedBar label="Medium (default)" value={60} size="md" />
          <SegmentedBar label="Large" value={60} size="lg" />
        </div>
      </section>

      {/* Form Controls */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Form Controls</h2>
        <p className={styles.sectionDesc}>
          Search inputs, dropdowns, and toggles.
        </p>

        <div className={styles.grid2}>
          <div>
            <div className={styles.subLabel}>Search Input</div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search asteroids..."
            />
          </div>
          <div>
            <div className={styles.subLabel}>Select Dropdown</div>
            <Select
              value={select}
              onChange={setSelect}
              options={[
                { label: "C-Type Asteroid", value: "option-1" },
                { label: "F-Type Asteroid", value: "option-2" },
                { label: "S-Type Asteroid", value: "option-3" },
                { label: "M-Type Asteroid", value: "option-4" },
              ]}
            />
          </div>
        </div>

        <div className={styles.subLabel}>Toggles</div>
        <div className={styles.row}>
          <Toggle
            label="Auto-track claims"
            checked={toggle1}
            onChange={setToggle1}
          />
          <Toggle
            label="Show HoF alerts"
            checked={toggle2}
            onChange={setToggle2}
          />
          <Toggle
            label="Disabled"
            checked={false}
            onChange={() => {}}
            disabled
          />
        </div>
      </section>

      {/* Pagination */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pagination</h2>
        <p className={styles.sectionDesc}>Page navigation controls.</p>
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
      </section>

      {/* Breadcrumb */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Breadcrumb</h2>
        <p className={styles.sectionDesc}>
          Navigation trail for nested content.
        </p>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Mining Basics" },
          ]}
        />
      </section>

      {/* Tooltips */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tooltips</h2>
        <p className={styles.sectionDesc}>
          Contextual hover hints with four placement options.
        </p>
        <div className={styles.inlineRow}>
          <Tooltip content="Appears above" placement="top">
            <Button variant="secondary" size="sm">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Appears below" placement="bottom">
            <Button variant="secondary" size="sm">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Appears left" placement="left">
            <Button variant="secondary" size="sm">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Appears right" placement="right">
            <Button variant="secondary" size="sm">
              Right
            </Button>
          </Tooltip>
        </div>
      </section>

      {/* Skeletons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skeletons</h2>
        <p className={styles.sectionDesc}>
          Loading placeholders for content that hasn&apos;t arrived yet.
        </p>
        <div className={styles.grid3}>
          <div>
            <div className={styles.subLabel}>Text</div>
            <Skeleton variant="text" lines={3} />
          </div>
          <div>
            <div className={styles.subLabel}>Stat</div>
            <Skeleton variant="stat" />
          </div>
          <div>
            <div className={styles.subLabel}>Card</div>
            <Skeleton variant="card" />
          </div>
        </div>
        <div className={styles.inlineRow}>
          <Skeleton variant="circle" width="48px" height="48px" />
          <Skeleton variant="block" width="200px" height="48px" />
        </div>
      </section>
    </>
  );
}

/* ─── COMPOSITIONS ─── */
function CompositionsTab() {
  return (
    <>
      {/* Data Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Table</h2>
        <p className={styles.sectionDesc}>
          Sortable data grid with striped rows and custom cell renderers.
        </p>

        <Panel variant="default" size="flush">
          <DataTable columns={MINER_COLS} data={MINERS} keyField="id" striped />
        </Panel>
      </section>

      {/* Callouts */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Callouts</h2>
        <p className={styles.sectionDesc}>
          Four tone variants for in-content notices — info, tip, warning, and
          alert.
        </p>

        <div className={styles.calloutStack}>
          {(
            [
              {
                tone: "info",
                label: "INFO",
                color: "var(--color-primary)",
                bg: "rgba(234,179,8,0.06)",
                border: "rgba(234,179,8,0.2)",
                text: "Mining runs during off-peak hours typically see better claim density due to reduced server load.",
              },
              {
                tone: "tip",
                label: "TIP",
                color: "rgb(var(--color-success-rgb, 34,197,94))",
                bg: "rgba(34,197,94,0.06)",
                border: "rgba(34,197,94,0.2)",
                text: "Pro tip: Use the depth chart to identify under-mined elevation ranges before starting your run.",
              },
              {
                tone: "warning",
                label: "WARNING",
                color: "var(--color-primary)",
                bg: "rgba(234,179,8,0.06)",
                border: "rgba(234,179,8,0.2)",
                text: "M-Type asteroids are in a PVP lootable zone. Ensure you have appropriate equipment before entering.",
              },
              {
                tone: "danger",
                label: "ALERT",
                color: "rgb(var(--color-danger-rgb, 239,68,68))",
                bg: "rgba(239,68,68,0.06)",
                border: "rgba(239,68,68,0.2)",
                text: "Critical: Server maintenance scheduled. All mining data will be temporarily unavailable.",
              },
            ] as const
          ).map((c) => (
            <aside
              key={c.tone}
              style={{
                borderRadius: "var(--radius-md)",
                background: c.bg,
                border: `1px solid ${c.border}`,
                padding: "var(--space-4) var(--space-5)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: c.color,
                  marginBottom: "var(--space-2)",
                }}
              >
                [ {c.label} ]
              </div>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                {c.text}
              </p>
            </aside>
          ))}
        </div>
      </section>

      {/* Code Block */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Code Block</h2>
        <p className={styles.sectionDesc}>
          Syntax-highlighted code with optional filename header.
        </p>

        <Panel variant="default" size="flush">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              padding: "var(--space-2) var(--space-4)",
              background: "rgba(234,179,8,0.06)",
              borderBottom: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            mining-config.ts
          </div>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              padding: "var(--space-4)",
              margin: 0,
              color: "var(--text-primary)",
              overflowX: "auto",
              lineHeight: 1.6,
            }}
          >
            <code>{`export const miningConfig = {
  trackingMode: "auto",
  claimThreshold: 1.5,
  hofAlerts: true,
  depthRange: [200, 800],
  asteroidTypes: ["C", "F", "S"],
};`}</code>
          </pre>
        </Panel>
      </section>

      {/* Combined Dashboard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Combined Dashboard</h2>
        <p className={styles.sectionDesc}>
          A composed dashboard card showing how components work together in the
          real UI.
        </p>

        <Panel variant="default">
          <SectionHeader title="Mining Session Summary" size="md" accent />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "var(--space-4)",
              marginTop: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <StatBlock
              label="Claims"
              value={47}
              trend={{ value: "8", direction: "up" }}
              sub="This session"
              size="sm"
            />
            <StatBlock
              label="Return"
              value="127.3%"
              trend={{ value: "4.2%", direction: "up" }}
              sub="Above average"
              size="sm"
              accent
            />
            <StatBlock
              label="Cost"
              value="842 PED"
              sub="Probes + ammo"
              size="sm"
            />
            <StatBlock
              label="Duration"
              value="2h 14m"
              sub="12 asteroids"
              size="sm"
            />
          </div>

          <SegmentedBar label="Session Progress" value={73} variant="accent" />

          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              marginTop: "var(--space-4)",
            }}
          >
            <Badge variant="success" dot>
              Active
            </Badge>
            <Badge variant="epic" glow>
              HoF Streak
            </Badge>
            <Badge variant="accent">C-Type</Badge>
          </div>
        </Panel>
      </section>
    </>
  );
}

/* ── Chart sample data ── */
const LINE_DATA = [
  { name: "Week 1", profit: 1200, cost: 800 },
  { name: "Week 2", profit: 1800, cost: 950 },
  { name: "Week 3", profit: 1400, cost: 700 },
  { name: "Week 4", profit: 2200, cost: 1100 },
  { name: "Week 5", profit: 1900, cost: 880 },
  { name: "Week 6", profit: 2600, cost: 1250 },
];
const LINE_SERIES: LineSeries[] = [
  { dataKey: "profit", label: "Profit (PED)" },
  { dataKey: "cost", label: "Cost (PED)" },
];

const BAR_DATA = [
  { name: "Lysterium", claims: 48, globals: 3 },
  { name: "Blausariam", claims: 36, globals: 2 },
  { name: "Garcen", claims: 28, globals: 5 },
  { name: "Caldorite", claims: 19, globals: 1 },
  { name: "Belkar", claims: 14, globals: 0 },
];
const BAR_SERIES: BarSeries[] = [
  { dataKey: "claims", label: "Claims" },
  { dataKey: "globals", label: "Globals" },
];

const PIE_DATA: PieSlice[] = [
  { name: "C-Type", value: 42 },
  { name: "F-Type", value: 28 },
  { name: "S-Type", value: 18 },
  { name: "M-Type", value: 8 },
  { name: "ND", value: 4 },
];

const RADAR_DATA = [
  { subject: "Yield", player: 82, average: 60 },
  { subject: "Speed", player: 68, average: 55 },
  { subject: "Depth", player: 91, average: 50 },
  { subject: "Markup", player: 74, average: 65 },
  { subject: "HoF Rate", player: 45, average: 30 },
  { subject: "Efficiency", player: 88, average: 58 },
];
const RADAR_SERIES: RadarSeries[] = [
  { dataKey: "player", label: "You" },
  { dataKey: "average", label: "Server Avg" },
];

const SANKEY_SOURCES: SankeyNode[] = [
  { id: "mining", label: "Mining" },
  { id: "hunting", label: "Hunting" },
  { id: "crafting", label: "Crafting" },
];
const SANKEY_TARGETS: SankeyNode[] = [
  { id: "lysterium", label: "Lysterium" },
  { id: "blausariam", label: "Blausariam" },
  { id: "garcen", label: "Garcen" },
  { id: "caldorite", label: "Caldorite" },
];
const SANKEY_LINKS: SankeyLink[] = [
  { source: "mining", target: "lysterium", value: 60 },
  { source: "mining", target: "blausariam", value: 25 },
  { source: "mining", target: "garcen", value: 15 },
  { source: "hunting", target: "blausariam", value: 35 },
  { source: "hunting", target: "caldorite", value: 20 },
  { source: "crafting", target: "garcen", value: 30 },
  { source: "crafting", target: "caldorite", value: 10 },
];

/* ─── VISUALS ─── */
function VisualsTab() {
  return (
    <>
      {/* Line Chart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Line Chart</h2>
        <p className={styles.sectionDesc}>
          Multi-series line chart with HUD-themed axes, tooltips, and optional
          dual Y-axis. Built on Recharts.
        </p>
        <HudLineChart
          data={LINE_DATA}
          series={LINE_SERIES}
          title="Profit vs Cost — 6 Week Trend"
          height={300}
        />
      </section>

      {/* Bar Chart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bar Chart</h2>
        <p className={styles.sectionDesc}>
          Grouped bar chart for categorical comparisons. Auto-coloured from the
          HUD palette.
        </p>
        <HudBarChart
          data={BAR_DATA}
          series={BAR_SERIES}
          title="Claims by Resource"
          height={300}
        />
      </section>

      {/* Pie / Donut Chart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pie &amp; Donut Charts</h2>
        <p className={styles.sectionDesc}>
          Solid pie or donut (inner radius &gt; 0). Built-in legend with
          percentage labels.
        </p>
        <div className={styles.grid2}>
          <HudPieChart
            data={PIE_DATA}
            title="Asteroid Distribution (Pie)"
            height={260}
          />
          <HudPieChart
            data={PIE_DATA}
            title="Asteroid Distribution (Donut)"
            innerRadius={50}
            height={260}
          />
        </div>
      </section>

      {/* Radar Chart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radar Chart</h2>
        <p className={styles.sectionDesc}>
          Multi-axis radar for comparing stat profiles. Supports overlapping
          series.
        </p>
        <HudRadarChart
          data={RADAR_DATA}
          series={RADAR_SERIES}
          title="Miner Profile vs Server Average"
          height={340}
        />
      </section>

      {/* Gauges */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gauges</h2>
        <p className={styles.sectionDesc}>
          Two gauge styles — a full-ring HUD gauge with 60 segments, and a
          half-circle dial with animated needle.
        </p>

        <div className={styles.subLabel}>HUD Ring Gauge</div>
        <Panel size="flush" noAnimation>
          <div className={styles.gaugeRow}>
            <HudGauge value={73} label="Efficiency" title="Engine" bare />
            <HudGauge value={91} label="Yield" title="Output" bare />
            <HudGauge value={28} label="Risk" title="Threat" bare />
          </div>
        </Panel>

        <div className={styles.subLabel}>Dial Gauge</div>
        <Panel size="flush" noAnimation>
          <div className={styles.gaugeRow}>
            <DialGauge
              value={42}
              max={100}
              label="DPP"
              displayValue="42%"
              bare
            />
            <DialGauge
              value={78}
              max={100}
              label="Return"
              displayValue="78%"
              bare
            />
            <DialGauge
              value={15}
              max={100}
              label="Loss Rate"
              displayValue="15%"
              bare
            />
          </div>
        </Panel>
      </section>

      {/* Sankey */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sankey Flow</h2>
        <p className={styles.sectionDesc}>
          Resource flow diagram with hover-highlight and auto-layout. Custom SVG
          with cubic Bézier ribbons.
        </p>
        <Sankey
          sources={SANKEY_SOURCES}
          targets={SANKEY_TARGETS}
          links={SANKEY_LINKS}
          title="Resource Flow — Activity → Material"
        />
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

export default function DesignSystemPage() {
  const { setSubTabs, activeSubTab, setActiveSubTab } = useTopBar();

  /* Register subtabs in NavShell on mount */
  useEffect(() => {
    setSubTabs(SUB_TABS);
    setActiveSubTab("primitives");
    return () => {
      setSubTabs([]);
    };
  }, [setSubTabs, setActiveSubTab]);

  const tab = activeSubTab || "primitives";

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Design System</h1>
        <p className={styles.heroSub}>
          The Howling Mine component library — every variant, every state, one
          page. Built for Entropia Universe mining operations.
        </p>
      </header>

      {/* Tab Content — controlled by NavShell subtabs */}
      <div className={styles.tabContent}>
        {tab === "primitives" && <PrimitivesTab />}
        {tab === "components" && <ComponentsTab />}
        {tab === "compositions" && <CompositionsTab />}
        {tab === "visuals" && <VisualsTab />}
      </div>
    </div>
  );
}
