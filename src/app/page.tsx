"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock";
import { SegmentedBar } from "@/components/ui/SegmentedBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Tooltip } from "@/components/ui/Tooltip";
import { Toggle } from "@/components/ui/Toggle";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  HudGauge,
  Sankey,
  DialGauge,
  type SankeyNode,
  type SankeyLink,
} from "@/components/ui/charts";
import styles from "./page.module.css";

/* ── Tiny sample data ── */
interface GearRow {
  id: number;
  name: string;
  type: string;
  dps: number;
}

const GEAR_COLS: Column<GearRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type" },
  { key: "dps", label: "DPS", sortable: true },
];

const GEAR_DATA: GearRow[] = [
  { id: 1, name: "Opalo", type: "Laser", dps: 12.4 },
  { id: 2, name: "Sollomate Rubio", type: "Laser", dps: 8.1 },
  { id: 3, name: "ArMatrix LR-20", type: "Laser", dps: 22.7 },
  { id: 4, name: "Herman CAP-101", type: "Pistol", dps: 14.3 },
];

const SANKEY_SOURCES: SankeyNode[] = [{ id: "ped", label: "PED In" }];

const SANKEY_TARGETS: SankeyNode[] = [
  { id: "ammo", label: "Ammo" },
  { id: "decay", label: "Decay" },
  { id: "loot", label: "Loot" },
];

const SANKEY_LINKS: SankeyLink[] = [
  { source: "ped", target: "ammo", value: 60 },
  { source: "ped", target: "decay", value: 40 },
  { source: "ammo", target: "loot", value: 55 },
  { source: "decay", target: "loot", value: 30 },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("");
  const [toggle, setToggle] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>The Howling Mine</h1>
        <p className={styles.pageSubtitle}>Component Kit</p>
      </header>

      {/* Breadcrumb */}
      <section className={styles.section}>
        <p className={styles.label}>Breadcrumb</p>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Getting Started" },
          ]}
        />
      </section>

      {/* Badges */}
      <section className={styles.section}>
        <SectionHeader title="Badges" size="sm" />
        <div className={styles.row}>
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="rare" glow>
            Rare
          </Badge>
          <Badge variant="legendary" glow>
            Legendary
          </Badge>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section}>
        <SectionHeader title="Buttons" size="sm" />
        <div className={styles.row}>
          <Button variant="primary" size="sm">
            Primary SM
          </Button>
          <Button variant="primary">Primary MD</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <SectionHeader title="Stat Blocks" size="sm" />
        <div className={styles.statRow}>
          <StatBlock
            label="TT Return"
            value="97.2%"
            trend={{ value: "2.1", direction: "up" }}
          />
          <StatBlock label="Hunts" value={342} />
          <StatBlock label="Avg Cost" value="14.8" sub="PED/run" accent />
        </div>
      </section>

      {/* Segmented Bars */}
      <section className={styles.section}>
        <SectionHeader title="Segmented Bars" size="sm" />
        <div className={styles.stack}>
          <SegmentedBar
            label="Efficiency"
            value={72}
            variant="primary"
            showValue
          />
          <SegmentedBar label="Eco" value={45} variant="accent" showValue />
          <SegmentedBar label="DPP" value={88} variant="success" showValue />
        </div>
      </section>

      {/* Controls */}
      <section className={styles.section}>
        <SectionHeader title="Controls" size="sm" />
        <div className={styles.stack}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search gear..."
          />
          <Select
            options={[
              { value: "all", label: "All Types" },
              { value: "laser", label: "Laser" },
              { value: "blp", label: "BLP" },
              { value: "mindforce", label: "Mindforce" },
            ]}
            value={select}
            onChange={setSelect}
            placeholder="Filter type"
          />
          <Toggle checked={toggle} onChange={setToggle} label="Enhanced only" />
        </div>
      </section>

      {/* Cards */}
      <section className={styles.section}>
        <SectionHeader title="Cards" size="sm" />
        <div className={styles.grid}>
          <Card variant="default">
            <h3
              style={{
                color: "var(--text-accent)",
                marginBottom: "var(--space-2)",
              }}
            >
              Mining Guide
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Finder amps, depth, and claim size explained.
            </p>
          </Card>
          <Card variant="interactive">
            <h3
              style={{
                color: "var(--text-accent)",
                marginBottom: "var(--space-2)",
              }}
            >
              Crafting 101
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Blueprints, residue, and near-success mechanics.
            </p>
          </Card>
          <Card variant="accent">
            <h3
              style={{
                color: "var(--text-bright)",
                marginBottom: "var(--space-2)",
              }}
            >
              Economy Tips
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Markup, MU hunting, and TT cycling basics.
            </p>
          </Card>
        </div>
      </section>

      {/* Panels */}
      <section className={styles.section}>
        <SectionHeader title="Panels" size="sm" />
        <div className={styles.grid}>
          <Panel variant="default" size="md">
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Default panel with HUD corners.
            </p>
          </Panel>
          <Panel variant="accent" size="md">
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Accent panel — highlighted info.
            </p>
          </Panel>
          <Panel variant="ghost" size="md">
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Ghost panel — minimal border.
            </p>
          </Panel>
        </div>
      </section>

      {/* DataTable */}
      <section className={styles.section}>
        <SectionHeader title="Data Table" size="sm" />
        <DataTable
          columns={GEAR_COLS}
          data={GEAR_DATA}
          keyField="id"
          striped
          sortable
        />
      </section>

      {/* Pagination */}
      <section className={styles.section}>
        <SectionHeader title="Pagination" size="sm" />
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
      </section>

      {/* Tooltip */}
      <section className={styles.section}>
        <SectionHeader title="Tooltip" size="sm" />
        <Tooltip content="3.14 PED/click economy rating">
          <Badge variant="primary" glow>
            Hover me
          </Badge>
        </Tooltip>
      </section>

      {/* Skeletons */}
      <section className={styles.section}>
        <SectionHeader title="Skeletons" size="sm" />
        <div className={styles.row}>
          <Skeleton variant="stat" />
          <Skeleton variant="stat" />
          <Skeleton variant="stat" />
        </div>
        <Skeleton variant="text" lines={3} />
      </section>

      {/* Gauges */}
      <section className={styles.section}>
        <SectionHeader title="Gauges" size="sm" />
        <div className={styles.grid}>
          <HudGauge label="Efficiency" value={72} />
          <DialGauge label="Eco" value={64} max={100} size={280} />
        </div>
      </section>

      {/* Sankey */}
      <section className={styles.section}>
        <SectionHeader title="Sankey Flow" size="sm" />
        <Sankey
          sources={SANKEY_SOURCES}
          targets={SANKEY_TARGETS}
          links={SANKEY_LINKS}
          height={220}
        />
      </section>
    </div>
  );
}
