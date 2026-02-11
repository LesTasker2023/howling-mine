"use client";

import { useEffect, useState } from "react";
import { useTopBar } from "@/context/TopBarContext";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock";
import { SegmentedBar } from "@/components/ui/SegmentedBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, MobCard, PlanetCard, MobCardV2 } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Tooltip } from "@/components/ui/Tooltip";
import { Toggle } from "@/components/ui/Toggle";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import styles from "./page.module.css";
import {
  CombatStats,
  DamageProfile,
  DamageRadar,
  ThreatRing,
  HudGauge,
  MaturityLine,
  DefenseBars,
  AttackBars,
  AttributeBars,
  Sankey,
  DialGauge,
  type SankeyNode,
  type SankeyLink,
} from "@/components/ui/charts";
import type {
  MobDefense,
  Maturity,
  MobAttack,
  MobAttributes,
  MobSummary,
  PlanetStats,
} from "@/types/mobs";

/* ── Showcase Tabs ── */
const SHOWCASE_TABS = [
  { key: "primitives", label: "Primitives" },
  { key: "data", label: "Data" },
  { key: "inputs", label: "Inputs" },
  { key: "composed", label: "Composed" },
  { key: "charts", label: "Charts" },
  { key: "cards", label: "Cards" },
];

/* ── Sample table data ── */
interface MobRow {
  id: number;
  name: string;
  level: string;
  health: number;
  damage: number;
  planet: string;
  threat: string;
}

const SAMPLE_MOBS: MobRow[] = [
  {
    id: 1,
    name: "Atrox",
    level: "1-80",
    health: 8000,
    damage: 240,
    planet: "Calypso",
    threat: "High",
  },
  {
    id: 2,
    name: "Cornundacauda",
    level: "1-20",
    health: 200,
    damage: 40,
    planet: "Calypso",
    threat: "Low",
  },
  {
    id: 3,
    name: "Kerberos",
    level: "10-60",
    health: 4500,
    damage: 180,
    planet: "Next Island",
    threat: "High",
  },
  {
    id: 4,
    name: "Longu",
    level: "1-50",
    health: 3200,
    damage: 140,
    planet: "Calypso",
    threat: "Medium",
  },
  {
    id: 5,
    name: "Falxangius",
    level: "1-30",
    health: 1800,
    damage: 90,
    planet: "Arkadia",
    threat: "Medium",
  },
  {
    id: 6,
    name: "Mulciber",
    level: "5-40",
    health: 2600,
    damage: 110,
    planet: "Cyrene",
    threat: "Medium",
  },
  {
    id: 7,
    name: "Daspletor",
    level: "20-60",
    health: 5000,
    damage: 200,
    planet: "Calypso",
    threat: "High",
  },
  {
    id: 8,
    name: "Proteronoid",
    level: "1-15",
    health: 150,
    damage: 30,
    planet: "Toulan",
    threat: "Low",
  },
];

const MOB_COLUMNS: Column<MobRow>[] = [
  { key: "name", label: "Name" },
  { key: "level", label: "Level", sortable: false },
  { key: "health", label: "Health" },
  { key: "damage", label: "Damage" },
  { key: "planet", label: "Planet" },
  {
    key: "threat",
    label: "Threat",
    render: (row: MobRow) => {
      const v =
        row.threat === "High"
          ? "danger"
          : row.threat === "Medium"
            ? "warning"
            : "success";
      return (
        <Badge variant={v} dot>
          {row.threat}
        </Badge>
      );
    },
  },
];

const PLANET_OPTIONS = [
  { label: "All Planets", value: "" },
  { label: "Calypso", value: "calypso" },
  { label: "Arkadia", value: "arkadia" },
  { label: "Cyrene", value: "cyrene" },
  { label: "Next Island", value: "next-island" },
  { label: "Toulan", value: "toulan" },
  { label: "Monria", value: "monria" },
];

const SORT_OPTIONS = [
  { label: "Name A-Z", value: "name-asc" },
  { label: "Name Z-A", value: "name-desc" },
  { label: "Health: High", value: "health-desc" },
  { label: "Health: Low", value: "health-asc" },
  { label: "Damage: High", value: "damage-desc" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const { activeTab, setTabs } = useTopBar();

  useEffect(() => {
    setTabs(SHOWCASE_TABS);
  }, [setTabs]);

  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>COMPONENTS</h1>
        <p className={styles.pageSubtitle}>
          Design system reference — all variants
        </p>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "primitives" && <PrimitivesTab />}
      {activeTab === "data" && <DataTab />}
      {activeTab === "inputs" && <InputsTab />}
      {activeTab === "composed" && <ComposedTab />}
      {activeTab === "charts" && <ChartsTab />}
      {activeTab === "cards" && <CardsTab />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARDS TAB — New card component explorations
   ═══════════════════════════════════════════════════════════════════════════ */

function CardsTab() {
  const sampleMobs: MobSummary[] = [
    {
      id: 1,
      name: "Atrox (Calypso)",
      mobType: "Creature",
      planetName: "Calypso",
      speciesName: "Atrox",
      isSweatable: true,
      lootScore: 72,
      minLevel: 17,
      maxLevel: 221,
      minHp: 990,
      maxHp: 49420,
      minDamage: 48,
      minRegen: null,
      damageTypes: { Cut: 36, Stab: 23, Impact: 41 },
      archetype: "bruiser",
      archetypeConfidence: "measured",
      lootCount: 24,
      spawnCount: 8,
    },
    {
      id: 2,
      name: "Argonaut (Calypso)",
      mobType: "Creature",
      planetName: "Calypso",
      speciesName: "Argonaut",
      isSweatable: true,
      lootScore: 45,
      minLevel: 5,
      maxLevel: 43,
      minHp: 160,
      maxHp: 1890,
      minDamage: 20,
      minRegen: null,
      damageTypes: { Cut: 25, Impact: 75 },
      archetype: "balanced",
      archetypeConfidence: "measured",
      lootCount: 18,
      spawnCount: 12,
    },
    {
      id: 3,
      name: "Araneatrox",
      mobType: "Creature",
      planetName: "Calypso",
      speciesName: "Araneatrox",
      isSweatable: false,
      lootScore: 88,
      minLevel: 52,
      maxLevel: 141,
      minHp: 1660,
      maxHp: 9800,
      minDamage: 138,
      minRegen: null,
      damageTypes: { Cut: 33, Stab: 33, Impact: 34 },
      archetype: "tank",
      archetypeConfidence: "measured",
      lootCount: 31,
      spawnCount: 5,
    },
    {
      id: 4,
      name: "Cornundacauda",
      mobType: "Creature",
      planetName: "Calypso",
      speciesName: "Cornundacauda",
      isSweatable: false,
      lootScore: 30,
      minLevel: 4,
      maxLevel: 12,
      minHp: 150,
      maxHp: 450,
      minDamage: 19,
      minRegen: null,
      damageTypes: { Impact: 100 },
      archetype: "glass-cannon",
      archetypeConfidence: "inferred",
      lootCount: 8,
      spawnCount: 3,
    },
  ];

  const samplePlanets: PlanetStats[] = [
    { planetName: "Calypso", mobCount: 312 },
    { planetName: "Arkadia", mobCount: 87 },
    { planetName: "Rocktropia", mobCount: 64 },
    { planetName: "Cyrene", mobCount: 53 },
    { planetName: "Toulan", mobCount: 41 },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Cards</h2>
      <p className={styles.sectionSub}>Current card components</p>

      <SectionHeader title="MobCard — current mob browse card" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {sampleMobs.map((mob) => (
          <MobCard key={mob.id} mob={mob} />
        ))}
      </div>

      <SectionHeader title="PlanetCard — current planet selection card" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {samplePlanets.map((planet) => (
          <PlanetCard
            key={planet.planetName}
            planet={planet}
            category="planet"
            highlight={planet.planetName === "Calypso"}
          />
        ))}
      </div>

      <SectionHeader title="MobCardV2 — sci-fi frame" accent />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "var(--space-5)",
        }}
      >
        {sampleMobs.map((mob) => (
          <MobCardV2 key={mob.id} mob={mob} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHARTS TAB — DeltaCharts custom visualizations
   ═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE_DEFENSE: MobDefense = {
  Impact: 42,
  Burn: 28,
  Cold: 18,
  Acid: 12,
  Cut: 35,
  Stab: 22,
  Electric: 8,
  Shrapnel: 15,
  Penetration: 5,
};

const SAMPLE_DEFENSE_B: MobDefense = {
  Impact: 60,
  Burn: 10,
  Cold: 5,
  Acid: 0,
  Cut: 55,
  Stab: 40,
  Electric: 25,
  Shrapnel: 30,
  Penetration: 15,
};

/* Sample maturities for line chart */
const SAMPLE_MATURITIES: Maturity[] = [
  {
    Id: 1,
    Name: "Young",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 60,
          Stab: 20,
          Impact: 10,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 18,
      },
    ],
    Properties: {
      Boss: false,
      Level: 3,
      Health: 120,
      Defense: {
        Cut: 4,
        Stab: 2,
        Impact: 3,
        Burn: 0,
        Cold: 0,
        Electric: 0,
        Acid: 0,
        Shrapnel: 0,
        Penetration: 0,
      },
      Attributes: {
        Strength: 20,
        Stamina: 25,
        Agility: 30,
        Intelligence: 5,
        Psyche: 5,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 18,
      RegenerationAmount: 0.5,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 2,
    Name: "Mature",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 60,
          Stab: 20,
          Impact: 10,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 28,
      },
    ],
    Properties: {
      Boss: false,
      Level: 6,
      Health: 280,
      Defense: {
        Cut: 8,
        Stab: 5,
        Impact: 6,
        Burn: 0,
        Cold: 0,
        Electric: 0,
        Acid: 0,
        Shrapnel: 0,
        Penetration: 0,
      },
      Attributes: {
        Strength: 35,
        Stamina: 40,
        Agility: 45,
        Intelligence: 8,
        Psyche: 8,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 20,
      RegenerationAmount: 1.2,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 3,
    Name: "Old",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 55,
          Stab: 25,
          Impact: 10,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 42,
      },
    ],
    Properties: {
      Boss: false,
      Level: 10,
      Health: 480,
      Defense: {
        Cut: 12,
        Stab: 8,
        Impact: 10,
        Burn: 2,
        Cold: 0,
        Electric: 0,
        Acid: 0,
        Shrapnel: 0,
        Penetration: 0,
      },
      Attributes: {
        Strength: 50,
        Stamina: 55,
        Agility: 55,
        Intelligence: 12,
        Psyche: 10,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 22,
      RegenerationAmount: 2.5,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 4,
    Name: "Provider",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 50,
          Stab: 25,
          Impact: 15,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 65,
      },
      {
        Name: "Charge",
        IsAoE: true,
        Damage: {
          Cut: 10,
          Stab: 0,
          Impact: 70,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 10,
          Penetration: 10,
        },
        TotalDamage: 80,
      },
    ],
    Properties: {
      Boss: false,
      Level: 16,
      Health: 850,
      Defense: {
        Cut: 18,
        Stab: 12,
        Impact: 15,
        Burn: 5,
        Cold: 3,
        Electric: 0,
        Acid: 0,
        Shrapnel: 0,
        Penetration: 2,
      },
      Attributes: {
        Strength: 70,
        Stamina: 75,
        Agility: 60,
        Intelligence: 18,
        Psyche: 15,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 24,
      RegenerationAmount: 5,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 5,
    Name: "Guardian",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 50,
          Stab: 25,
          Impact: 15,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 95,
      },
      {
        Name: "Charge",
        IsAoE: true,
        Damage: {
          Cut: 10,
          Stab: 0,
          Impact: 70,
          Burn: 0,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 10,
          Penetration: 10,
        },
        TotalDamage: 120,
      },
    ],
    Properties: {
      Boss: false,
      Level: 24,
      Health: 1600,
      Defense: {
        Cut: 24,
        Stab: 18,
        Impact: 22,
        Burn: 8,
        Cold: 5,
        Electric: 3,
        Acid: 2,
        Shrapnel: 4,
        Penetration: 5,
      },
      Attributes: {
        Strength: 95,
        Stamina: 100,
        Agility: 75,
        Intelligence: 25,
        Psyche: 20,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 26,
      RegenerationAmount: 8,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 6,
    Name: "Dominant",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 45,
          Stab: 25,
          Impact: 15,
          Burn: 5,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 140,
      },
      {
        Name: "Charge",
        IsAoE: true,
        Damage: {
          Cut: 10,
          Stab: 0,
          Impact: 65,
          Burn: 5,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 10,
          Penetration: 10,
        },
        TotalDamage: 170,
      },
    ],
    Properties: {
      Boss: false,
      Level: 36,
      Health: 3200,
      Defense: {
        Cut: 32,
        Stab: 24,
        Impact: 30,
        Burn: 12,
        Cold: 8,
        Electric: 5,
        Acid: 4,
        Shrapnel: 6,
        Penetration: 8,
      },
      Attributes: {
        Strength: 130,
        Stamina: 140,
        Agility: 90,
        Intelligence: 35,
        Psyche: 28,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 28,
      RegenerationAmount: 12,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
  {
    Id: 7,
    Name: "Alpha",
    Attacks: [
      {
        Name: "Claw",
        IsAoE: false,
        Damage: {
          Cut: 42,
          Stab: 25,
          Impact: 15,
          Burn: 8,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 0,
          Penetration: 10,
        },
        TotalDamage: 200,
      },
      {
        Name: "Charge",
        IsAoE: true,
        Damage: {
          Cut: 10,
          Stab: 0,
          Impact: 60,
          Burn: 10,
          Cold: 0,
          Electric: 0,
          Acid: 0,
          Shrapnel: 10,
          Penetration: 10,
        },
        TotalDamage: 250,
      },
    ],
    Properties: {
      Boss: false,
      Level: 52,
      Health: 6500,
      Defense: {
        Cut: 42,
        Stab: 35,
        Impact: 40,
        Burn: 18,
        Cold: 12,
        Electric: 8,
        Acid: 6,
        Shrapnel: 10,
        Penetration: 12,
      },
      Attributes: {
        Strength: 180,
        Stamina: 190,
        Agility: 110,
        Intelligence: 50,
        Psyche: 40,
      },
      MissChance: null,
      Description: null,
      AttacksPerMinute: 30,
      RegenerationAmount: 20,
      RegenerationInterval: null,
      Taming: { IsTameable: false, TamingLevel: null },
    },
  },
];

/* Sample attributes */
const SAMPLE_ATTRIBUTES: MobAttributes = {
  Strength: 130,
  Stamina: 140,
  Agility: 90,
  Intelligence: 35,
  Psyche: 28,
};

/* Sample Sankey: 3 combat professions → shared skills (real EU data) */
const SANKEY_SOURCES: SankeyNode[] = [
  { id: "BLP Pistoleer", label: "BLP Pistoleer", color: "#3b82f6" },
  { id: "Laser Pistoleer", label: "Laser Pistoleer", color: "#22d3ee" },
];

const SANKEY_SKILLS: SankeyNode[] = [
  { id: "Handgun", label: "Handgun" },
  { id: "BLP Tech", label: "BLP Tech" },
  { id: "Laser Tech", label: "Laser Tech" },
  { id: "Weapons Handling", label: "Wpn Handling" },
  { id: "Aim", label: "Aim" },
  { id: "Marksmanship", label: "Marksmanship" },
  { id: "Combat Reflexes", label: "Cbt Reflexes" },
  { id: "Combat Sense", label: "Combat Sense" },
  { id: "Courage", label: "Courage" },
  { id: "Coolness", label: "Coolness" },
  { id: "Agility", label: "Agility" },
  { id: "Serendipity", label: "Serendipity" },
  { id: "Commando", label: "Commando" },
  { id: "Dexterity", label: "Dexterity" },
  { id: "Perception", label: "Perception" },
];

const SANKEY_LINKS: SankeyLink[] = [
  // BLP Pistoleer
  { source: "BLP Pistoleer", target: "Handgun", value: 38 },
  { source: "BLP Pistoleer", target: "BLP Tech", value: 14 },
  { source: "BLP Pistoleer", target: "Weapons Handling", value: 9 },
  { source: "BLP Pistoleer", target: "Marksmanship", value: 7 },
  { source: "BLP Pistoleer", target: "Combat Sense", value: 5 },
  { source: "BLP Pistoleer", target: "Coolness", value: 5 },
  { source: "BLP Pistoleer", target: "Aim", value: 4 },
  { source: "BLP Pistoleer", target: "Agility", value: 3 },
  { source: "BLP Pistoleer", target: "Combat Reflexes", value: 3 },
  { source: "BLP Pistoleer", target: "Commando", value: 3 },
  { source: "BLP Pistoleer", target: "Courage", value: 3 },
  { source: "BLP Pistoleer", target: "Dexterity", value: 3 },
  { source: "BLP Pistoleer", target: "Perception", value: 2 },
  { source: "BLP Pistoleer", target: "Serendipity", value: 1 },
  // Laser Pistoleer
  { source: "Laser Pistoleer", target: "Handgun", value: 38 },
  { source: "Laser Pistoleer", target: "Laser Tech", value: 14 },
  { source: "Laser Pistoleer", target: "Weapons Handling", value: 9 },
  { source: "Laser Pistoleer", target: "Marksmanship", value: 7 },
  { source: "Laser Pistoleer", target: "Combat Sense", value: 5 },
  { source: "Laser Pistoleer", target: "Coolness", value: 5 },
  { source: "Laser Pistoleer", target: "Aim", value: 4 },
  { source: "Laser Pistoleer", target: "Agility", value: 3 },
  { source: "Laser Pistoleer", target: "Combat Reflexes", value: 3 },
  { source: "Laser Pistoleer", target: "Commando", value: 3 },
  { source: "Laser Pistoleer", target: "Courage", value: 3 },
  { source: "Laser Pistoleer", target: "Dexterity", value: 3 },
  { source: "Laser Pistoleer", target: "Perception", value: 2 },
  { source: "Laser Pistoleer", target: "Serendipity", value: 1 },
];

function ChartsTab() {
  return (
    <>
      {/* ── 1. Ring Gauges ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ring Gauges</h2>
        <p className={styles.componentLabel}>
          HudGauge — segmented arc with value readout. ThreatRing — auto-colored
          from mob stats.
        </p>
        <div className={styles.statRowFour}>
          <HudGauge
            value={72}
            label="Efficiency"
            color="#22d3ee"
            title="Loot Return"
          />
          <HudGauge value={33} label="Economy" color="#facc15" title="Market" />
          <ThreatRing hp={120} damage={12} regen={null} />
          <ThreatRing hp={9500} damage={420} regen={35} />
        </div>
      </div>

      {/* ── 2. Dial Gauges ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Dial Gauges</h2>
        <p className={styles.componentLabel}>
          DialGauge — half-circle needle with green→red gradient.
        </p>
        <div className={styles.statRowFour}>
          <DialGauge value={18} max={100} label="Low Range" />
          <DialGauge value={55} max={100} label="Mid Range" />
          <DialGauge value={92} max={100} label="High Range" />
        </div>
      </div>

      {/* ── 3. Combat Overview ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Combat Overview</h2>
        <p className={styles.componentLabel}>
          CombatStats — stat cards with mini segmented gauges.
        </p>
        <div className={styles.gridWide}>
          <CombatStats
            level={42}
            hp={3200}
            damage={185}
            regen={12}
            apm={28}
            hasAoE
          />
        </div>
      </div>

      {/* ── 4. Damage Profile ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Damage Profile</h2>
        <p className={styles.componentLabel}>
          DamageProfile — concentric donut + stacked bar + legend. DamageRadar —
          9-axis polygon. Two views, same data.
        </p>
        <div className={styles.gridWide}>
          <DamageProfile damage={SAMPLE_DEFENSE_B} />
          <DamageRadar damage={SAMPLE_DEFENSE_B} />
        </div>
      </div>

      {/* ── 6. Maturity Progression ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Maturity Progression</h2>
        <p className={styles.componentLabel}>
          MaturityLine — toggleable line/area series across maturities.
        </p>
        <MaturityLine maturities={SAMPLE_MATURITIES} />
      </div>

      {/* ── 6. Defense, Attack & Attributes ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Defense, Attack &amp; Attributes
        </h2>
        <p className={styles.componentLabel}>
          DefenseBars — ranked horizontal bars. AttackBars — grouped per-attack
          breakdown. AttributeBars — creature stat bars.
        </p>
        <div className={styles.gridWide}>
          <DefenseBars defense={SAMPLE_DEFENSE} />
          <AttackBars attacks={SAMPLE_MATURITIES[5].Attacks} />
        </div>
        <div
          className={styles.gridWide}
          style={{ marginTop: "var(--space-4)" }}
        >
          <AttributeBars attributes={SAMPLE_ATTRIBUTES} />
        </div>
      </div>

      {/* ── 7. Skill Flow ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Skill Flow</h2>
        <p className={styles.componentLabel}>
          Sankey — weighted profession→skill relationships with hover
          highlighting.
        </p>
        <Sankey
          sources={SANKEY_SOURCES}
          targets={SANKEY_SKILLS}
          links={SANKEY_LINKS}
          title="Profession → Skill Weights"
        />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES TAB — SectionHeader, Panel, StatBlock, SegmentedBar, Badge, Button
   ═══════════════════════════════════════════════════════════════════════════ */
function PrimitivesTab() {
  return (
    <>
      {/* SectionHeader */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>SectionHeader</div>
        <div className={styles.stack}>
          <div>
            <div className={styles.componentLabel}>size=sm</div>
            <SectionHeader title="Small Header" size="sm" />
          </div>
          <div>
            <div className={styles.componentLabel}>size=md (default)</div>
            <SectionHeader title="Medium Header" />
          </div>
          <div>
            <div className={styles.componentLabel}>size=lg</div>
            <SectionHeader title="Large Header" size="lg" />
          </div>
          <div>
            <div className={styles.componentLabel}>accent</div>
            <SectionHeader title="Accent Header" accent />
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Panel</div>
        <div className={styles.componentLabel}>variants</div>
        <div className={styles.grid}>
          <Panel>
            <SectionHeader title="Default" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Standard panel with notched corners and tick marks.
            </p>
          </Panel>
          <Panel variant="interactive">
            <SectionHeader title="Interactive" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Hover for glow effect. Cursor pointer.
            </p>
          </Panel>
          <Panel variant="accent">
            <SectionHeader title="Accent" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Accent-colored border and tick marks.
            </p>
          </Panel>
          <Panel variant="danger">
            <SectionHeader title="Danger" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Red tint background. Warning state.
            </p>
          </Panel>
          <Panel variant="ghost">
            <SectionHeader title="Ghost" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Transparent background. Subtle border.
            </p>
          </Panel>
        </div>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>sizes</div>
        <div className={styles.stack}>
          <Panel size="sm">
            <SectionHeader title="Small Panel" size="sm" />
          </Panel>
          <Panel size="md">
            <SectionHeader title="Medium Panel (default)" />
          </Panel>
          <Panel size="lg">
            <SectionHeader title="Large Panel" size="lg" />
          </Panel>
        </div>
      </div>

      {/* StatBlock */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>StatBlock</div>
        <div className={styles.componentLabel}>standard</div>
        <Panel>
          <div className={styles.statRowFour}>
            <StatBlock label="Basic" value={1250} />
            <StatBlock label="Accent" value={2847} accent />
            <StatBlock
              label="With Trend"
              value={1203}
              trend={{ value: "12%", direction: "up" }}
            />
            <StatBlock
              label="Trend Down"
              value={456}
              trend={{ value: "3%", direction: "down" }}
            />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>sizes</div>
        <Panel>
          <div className={styles.statRow}>
            <StatBlock label="Small" value={99} size="sm" />
            <StatBlock label="Medium" value={999} size="md" />
            <StatBlock label="Large" value={9999} size="lg" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>with sub text</div>
        <Panel>
          <div className={styles.statRow}>
            <StatBlock label="DPP" value="3.42" sub="damage per PED" accent />
            <StatBlock
              label="Returns"
              value="87%"
              sub="last 100 runs"
              trend={{ value: "5%", direction: "up" }}
            />
            <StatBlock label="Kill Rate" value="24/hr" sub="avg session" />
          </div>
        </Panel>
      </div>

      {/* SegmentedBar */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>SegmentedBar</div>
        <div className={styles.componentLabel}>variants</div>
        <Panel>
          <div className={styles.stack}>
            <SegmentedBar label="Primary" value={65} variant="primary" />
            <SegmentedBar label="Accent" value={80} variant="accent" />
            <SegmentedBar label="Success" value={90} variant="success" />
            <SegmentedBar label="Warning" value={45} variant="warning" />
            <SegmentedBar label="Danger" value={72} variant="danger" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>sizes</div>
        <Panel>
          <div className={styles.stack}>
            <SegmentedBar label="Small" value={60} size="sm" />
            <SegmentedBar label="Medium (default)" value={60} size="md" />
            <SegmentedBar label="Large" value={60} size="lg" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>segment counts</div>
        <Panel>
          <div className={styles.stack}>
            <SegmentedBar label="5 segments" value={60} segments={5} />
            <SegmentedBar
              label="10 segments (default)"
              value={60}
              segments={10}
            />
            <SegmentedBar label="20 segments" value={60} segments={20} />
          </div>
        </Panel>
      </div>

      {/* Badge */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Badge</div>
        <div className={styles.componentLabel}>status variants</div>
        <Panel>
          <div className={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>with dot indicator</div>
        <Panel>
          <div className={styles.row}>
            <Badge variant="success" dot>
              Online
            </Badge>
            <Badge variant="warning" dot>
              Idle
            </Badge>
            <Badge variant="danger" dot>
              Offline
            </Badge>
            <Badge variant="primary" dot>
              Active
            </Badge>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>rarity tiers</div>
        <Panel>
          <div className={styles.row}>
            <Badge variant="common">Common</Badge>
            <Badge variant="uncommon">Uncommon</Badge>
            <Badge variant="rare">Rare</Badge>
            <Badge variant="epic">Epic</Badge>
            <Badge variant="legendary">Legendary</Badge>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>with glow</div>
        <Panel>
          <div className={styles.row}>
            <Badge variant="primary" glow>
              Glow Primary
            </Badge>
            <Badge variant="accent" glow>
              Glow Accent
            </Badge>
            <Badge variant="legendary" glow>
              Glow Legendary
            </Badge>
          </div>
        </Panel>
      </div>

      {/* Button */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Button</div>
        <div className={styles.componentLabel}>variants</div>
        <Panel>
          <div className={styles.row}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>sizes</div>
        <Panel>
          <div className={styles.row}>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>all variants x sizes</div>
        <Panel>
          <div className={styles.stack}>
            <div className={styles.row}>
              <Button variant="primary" size="sm">
                Primary SM
              </Button>
              <Button variant="primary" size="md">
                Primary MD
              </Button>
              <Button variant="primary" size="lg">
                Primary LG
              </Button>
            </div>
            <div className={styles.row}>
              <Button variant="secondary" size="sm">
                Secondary SM
              </Button>
              <Button variant="secondary" size="md">
                Secondary MD
              </Button>
              <Button variant="secondary" size="lg">
                Secondary LG
              </Button>
            </div>
            <div className={styles.row}>
              <Button variant="ghost" size="sm">
                Ghost SM
              </Button>
              <Button variant="ghost" size="md">
                Ghost MD
              </Button>
              <Button variant="ghost" size="lg">
                Ghost LG
              </Button>
            </div>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>full width</div>
        <Panel>
          <div className={styles.stack}>
            <Button variant="primary" fullWidth>
              Full Width Primary
            </Button>
            <Button variant="secondary" fullWidth>
              Full Width Secondary
            </Button>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>disabled</div>
        <Panel>
          <div className={styles.row}>
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="ghost" disabled>
              Disabled Ghost
            </Button>
          </div>
        </Panel>
      </div>

      {/* Tooltip */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Tooltip</div>
        <div className={styles.componentLabel}>placements</div>
        <Panel>
          <div className={styles.row}>
            <Tooltip content="Appears above the element" placement="top">
              <Badge variant="primary">Hover — Top</Badge>
            </Tooltip>
            <Tooltip content="Appears below the element" placement="bottom">
              <Badge variant="primary">Hover — Bottom</Badge>
            </Tooltip>
            <Tooltip content="Appears to the left" placement="left">
              <Badge variant="primary">Hover — Left</Badge>
            </Tooltip>
            <Tooltip content="Appears to the right" placement="right">
              <Badge variant="primary">Hover — Right</Badge>
            </Tooltip>
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>rich content</div>
        <Panel>
          <div className={styles.row}>
            <Tooltip
              content={
                <div>
                  <strong style={{ color: "var(--text-bright)" }}>Atrox</strong>
                  <br />
                  <span style={{ color: "var(--text-muted)" }}>
                    Level 1-80 · Calypso
                  </span>
                  <br />
                  <span style={{ color: "var(--status-danger)" }}>
                    High threat
                  </span>
                </div>
              }
            >
              <Badge variant="danger" dot>
                Hover for mob info
              </Badge>
            </Tooltip>
            <Tooltip content="DPP = Damage Per PED. Higher is better. Calculated as total damage divided by ammo cost.">
              <Badge variant="accent">Hover for stat explanation</Badge>
            </Tooltip>
          </div>
        </Panel>
      </div>

      {/* Breadcrumb */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Breadcrumb</div>
        <div className={styles.componentLabel}>standard navigation</div>
        <Panel>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Mobs", href: "/mobs" },
              { label: "Calypso", href: "/mobs?planet=calypso" },
              { label: "Atrox" },
            ]}
          />
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>short path</div>
        <Panel>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Weapons" }]}
          />
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>custom separator</div>
        <Panel>
          <Breadcrumb
            items={[
              { label: "Database", href: "/" },
              { label: "Armor Sets", href: "/armor" },
              { label: "Adjusted Pixie" },
            ]}
            separator="/"
          />
        </Panel>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA TAB — DataTable, Card, Skeleton
   ═══════════════════════════════════════════════════════════════════════════ */
function DataTab() {
  return (
    <>
      {/* DataTable */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>DataTable</div>
        <div className={styles.componentLabel}>
          sortable (click column headers)
        </div>
        <DataTable columns={MOB_COLUMNS} data={SAMPLE_MOBS} keyField="id" />
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>striped</div>
        <DataTable
          columns={MOB_COLUMNS}
          data={SAMPLE_MOBS}
          keyField="id"
          striped
        />
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>compact</div>
        <DataTable
          columns={MOB_COLUMNS}
          data={SAMPLE_MOBS}
          keyField="id"
          compact
        />
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>empty state</div>
        <DataTable
          columns={MOB_COLUMNS}
          data={[]}
          keyField="id"
          emptyMessage="No creatures found matching your filters"
        />
      </div>

      {/* Card */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Card</div>
        <div className={styles.componentLabel}>variants</div>
        <div className={styles.grid}>
          <Card>
            <SectionHeader title="Default Card" size="sm" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Base card with subtle border and body padding.
            </p>
          </Card>
          <Card variant="interactive">
            <SectionHeader title="Interactive Card" size="sm" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Lift + glow on hover. Click-ready state.
            </p>
          </Card>
          <Card variant="accent">
            <SectionHeader title="Accent Card" size="sm" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Cyan accent border glow on hover.
            </p>
          </Card>
          <Card variant="compact">
            <SectionHeader title="Compact" size="sm" />
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
              }}
            >
              Tight padding.
            </p>
          </Card>
        </div>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>clickable cards</div>
        <div className={styles.grid}>
          <Card variant="interactive" onClick={() => alert("Atrox clicked")}>
            <SectionHeader title="Atrox" size="sm" />
            <div className={styles.rowTight}>
              <Badge variant="danger" dot>
                Aggressive
              </Badge>
              <Badge variant="uncommon">Uncommon</Badge>
            </div>
          </Card>
          <Card variant="interactive" onClick={() => alert("Longu clicked")}>
            <SectionHeader title="Longu" size="sm" />
            <div className={styles.rowTight}>
              <Badge variant="success" dot>
                Sweatable
              </Badge>
              <Badge variant="common">Common</Badge>
            </div>
          </Card>
        </div>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>sizes</div>
        <div className={styles.grid}>
          <Card size="sm">
            <SectionHeader title="Small Card" size="sm" />
            <Badge variant="primary">sm</Badge>
          </Card>
          <Card size="md">
            <SectionHeader title="Medium Card" size="sm" />
            <Badge variant="primary">md</Badge>
          </Card>
          <Card size="lg">
            <SectionHeader title="Large Card" size="sm" />
            <Badge variant="primary">lg</Badge>
          </Card>
        </div>
      </div>

      {/* Skeleton */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Skeleton</div>
        <div className={styles.componentLabel}>text (single line)</div>
        <Panel>
          <Skeleton variant="text" />
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>text (multi-line)</div>
        <Panel>
          <Skeleton variant="text" lines={4} />
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>block</div>
        <Panel>
          <Skeleton variant="block" height="80px" />
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>circle</div>
        <Panel>
          <div className={styles.row}>
            <Skeleton variant="circle" />
            <Skeleton variant="circle" width="32px" height="32px" />
            <Skeleton variant="circle" width="56px" height="56px" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>stat</div>
        <Panel>
          <div className={styles.statRow}>
            <Skeleton variant="stat" />
            <Skeleton variant="stat" />
            <Skeleton variant="stat" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.componentLabel}>card</div>
        <div className={styles.grid}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>

      {/* Pagination */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Pagination</div>
        <PaginationDemo />
      </div>
    </>
  );
}

function PaginationDemo() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(1);

  return (
    <>
      <div className={styles.componentLabel}>few pages</div>
      <Panel>
        <Pagination page={page1} totalPages={5} onPageChange={setPage1} />
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>many pages (with ellipsis)</div>
      <Panel>
        <Pagination page={page2} totalPages={42} onPageChange={setPage2} />
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>size=sm</div>
      <Panel>
        <Pagination
          page={page3}
          totalPages={10}
          onPageChange={setPage3}
          size="sm"
        />
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>single page (hidden)</div>
      <Panel>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "var(--text-sm)",
            fontStyle: "italic",
          }}
        >
          Pagination auto-hides when totalPages ≤ 1
        </p>
        <Pagination page={1} totalPages={1} onPageChange={() => {}} />
      </Panel>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INPUTS TAB — SearchInput, Select
   ═══════════════════════════════════════════════════════════════════════════ */
function InputsTab() {
  return (
    <>
      {/* SearchInput */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>SearchInput</div>
        <SearchInputDemo />
      </div>

      {/* Select */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Select</div>
        <SelectDemo />
      </div>

      {/* Toggle */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Toggle</div>
        <ToggleDemo />
      </div>

      {/* Combined filter bar */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Filter Bar Pattern</div>
        <FilterBarDemo />
      </div>
    </>
  );
}

function SearchInputDemo() {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("Atrox");

  const filtered = SAMPLE_MOBS.filter((m) =>
    m.name.toLowerCase().includes(search1.toLowerCase()),
  );

  return (
    <>
      <div className={styles.componentLabel}>
        live search — type to filter table below
      </div>
      <Panel>
        <SearchInput
          value={search1}
          onChange={setSearch1}
          placeholder="Search creatures..."
        />
      </Panel>
      {search1 && (
        <>
          <div className={styles.spacer} />
          <DataTable
            columns={MOB_COLUMNS}
            data={filtered}
            keyField="id"
            compact
            emptyMessage="No creatures match your search"
          />
        </>
      )}
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>sizes</div>
      <Panel>
        <div className={styles.stack}>
          <SearchInput placeholder="Small search..." size="sm" />
          <SearchInput placeholder="Medium search (default)..." size="md" />
          <SearchInput placeholder="Large search..." size="lg" />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>
        with initial value (controlled)
      </div>
      <Panel>
        <SearchInput
          value={search2}
          onChange={setSearch2}
          placeholder="Search creatures..."
        />
      </Panel>
    </>
  );
}

function SelectDemo() {
  const [planet, setPlanet] = useState("");
  const [sizeSm, setSizeSm] = useState("");
  const [sizeMd, setSizeMd] = useState("");
  const [sizeLg, setSizeLg] = useState("");
  const [pairPlanet, setPairPlanet] = useState("");
  const [pairSort, setPairSort] = useState("");
  const [disabledVal, setDisabledVal] = useState("");

  return (
    <>
      <div className={styles.componentLabel}>default with label</div>
      <Panel>
        <Select
          label="Planet"
          options={PLANET_OPTIONS}
          value={planet}
          onChange={setPlanet}
          placeholder="Choose planet..."
        />
        {planet && (
          <p
            style={{
              color: "var(--text-accent)",
              fontSize: "var(--text-xs)",
              marginTop: "var(--space-2)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Selected: {planet}
          </p>
        )}
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>sizes</div>
      <Panel>
        <div className={styles.row}>
          <Select
            options={PLANET_OPTIONS}
            value={sizeSm}
            onChange={setSizeSm}
            placeholder="Small..."
            size="sm"
          />
          <Select
            options={PLANET_OPTIONS}
            value={sizeMd}
            onChange={setSizeMd}
            placeholder="Medium..."
            size="md"
          />
          <Select
            options={PLANET_OPTIONS}
            value={sizeLg}
            onChange={setSizeLg}
            placeholder="Large..."
            size="lg"
          />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>
        multiple selects in a row (filter bar pattern)
      </div>
      <Panel>
        <div className={styles.row}>
          <Select
            label="Planet"
            options={PLANET_OPTIONS}
            value={pairPlanet}
            onChange={setPairPlanet}
            placeholder="All planets"
          />
          <Select
            label="Sort"
            options={SORT_OPTIONS}
            value={pairSort}
            onChange={setPairSort}
            placeholder="Sort by..."
          />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>with disabled option</div>
      <Panel>
        <Select
          options={[
            { label: "Available", value: "a" },
            { label: "Disabled", value: "b", disabled: true },
            { label: "Also Available", value: "c" },
          ]}
          value={disabledVal}
          onChange={setDisabledVal}
          placeholder="Pick one..."
        />
      </Panel>
    </>
  );
}

function FilterBarDemo() {
  const [search, setSearch] = useState("");
  const [planet, setPlanet] = useState("");
  const [sort, setSort] = useState("");

  const filtered = SAMPLE_MOBS.filter(
    (m) => !search || m.name.toLowerCase().includes(search.toLowerCase()),
  )
    .filter(
      (m) => !planet || m.planet.toLowerCase().replace(" ", "-") === planet,
    )
    .sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "health-desc":
          return b.health - a.health;
        case "health-asc":
          return a.health - b.health;
        case "damage-desc":
          return b.damage - a.damage;
        default:
          return 0;
      }
    });

  return (
    <>
      <div className={styles.componentLabel}>
        search + selects — all wired to filter the table below
      </div>
      <Panel>
        <div className={styles.row}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search creatures..."
            />
          </div>
          <Select
            options={PLANET_OPTIONS}
            value={planet}
            onChange={setPlanet}
            placeholder="Planet"
            size="md"
          />
          <Select
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
            placeholder="Sort"
            size="md"
          />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <DataTable
        columns={MOB_COLUMNS}
        data={filtered}
        keyField="id"
        striped
        emptyMessage="No creatures match your filters"
      />
    </>
  );
}

function ToggleDemo() {
  const [tog1, setTog1] = useState(false);
  const [tog2, setTog2] = useState(true);
  const [tog3, setTog3] = useState(false);
  const [tog4, setTog4] = useState(true);

  return (
    <>
      <div className={styles.componentLabel}>with labels</div>
      <Panel>
        <div className={styles.stack}>
          <Toggle
            checked={tog1}
            onChange={setTog1}
            label="Show extinct species"
          />
          <Toggle
            checked={tog2}
            onChange={setTog2}
            label="Include maturity variants"
          />
          <Toggle
            checked={tog3}
            onChange={setTog3}
            label="Codex entries only"
          />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>size=sm</div>
      <Panel>
        <div className={styles.row}>
          <Toggle
            checked={tog4}
            onChange={setTog4}
            label="Compact mode"
            size="sm"
          />
        </div>
      </Panel>
      <div className={styles.spacer} />
      <div className={styles.componentLabel}>disabled</div>
      <Panel>
        <div className={styles.row}>
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Locked off"
            disabled
          />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Locked on"
            disabled
          />
        </div>
      </Panel>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPOSED TAB — Real-world composed examples
   ═══════════════════════════════════════════════════════════════════════════ */
function ComposedTab() {
  return (
    <>
      {/* Mob card mockups */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Mob Cards</div>
        <div className={styles.componentLabel}>
          interactive cards with stats + badges + bars
        </div>
        <div className={styles.grid}>
          <Card variant="interactive">
            <SectionHeader title="Atrox" />
            <div className={styles.statRow}>
              <StatBlock label="Level" value="1-80" size="sm" />
              <StatBlock label="Health" value="40-8000" size="sm" />
              <StatBlock label="Damage" value="12-240" size="sm" />
            </div>
            <div className={styles.spacer} />
            <div className={styles.rowTight}>
              <Badge variant="danger" dot>
                Aggressive
              </Badge>
              <Badge variant="primary" dot>
                Codex
              </Badge>
              <Badge variant="uncommon">Uncommon</Badge>
            </div>
            <div className={styles.spacer} />
            <SegmentedBar
              label="Threat Level"
              value={85}
              variant="danger"
              size="sm"
            />
          </Card>

          <Card variant="interactive">
            <SectionHeader title="Cornundacauda" />
            <div className={styles.statRow}>
              <StatBlock label="Level" value="1-20" size="sm" />
              <StatBlock label="Health" value="10-200" size="sm" />
              <StatBlock label="Damage" value="4-40" size="sm" />
            </div>
            <div className={styles.spacer} />
            <div className={styles.rowTight}>
              <Badge variant="success" dot>
                Sweatable
              </Badge>
              <Badge variant="primary" dot>
                Codex
              </Badge>
              <Badge variant="common">Common</Badge>
            </div>
            <div className={styles.spacer} />
            <SegmentedBar
              label="Threat Level"
              value={25}
              variant="success"
              size="sm"
            />
          </Card>

          <Card variant="interactive">
            <SectionHeader title="Kerberos" />
            <div className={styles.statRow}>
              <StatBlock label="Level" value="10-60" size="sm" />
              <StatBlock label="Health" value="800-4500" size="sm" />
              <StatBlock label="Damage" value="50-180" size="sm" />
            </div>
            <div className={styles.spacer} />
            <div className={styles.rowTight}>
              <Badge variant="danger" dot>
                Aggressive
              </Badge>
              <Badge variant="rare">Rare</Badge>
            </div>
            <div className={styles.spacer} />
            <SegmentedBar
              label="Threat Level"
              value={70}
              variant="warning"
              size="sm"
            />
          </Card>
        </div>
      </div>

      {/* Alert panel */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Alert Panel</div>
        <Panel variant="danger">
          <SectionHeader title="Critical Warning" />
          <p
            style={{
              color: "var(--status-danger)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-4)",
            }}
          >
            High levels of ionized radiation detected in sector 7. Deploy hazard
            suits before proceeding. All operatives must maintain minimum safe
            distance of 200m from the epicentre.
          </p>
          <div className={styles.row}>
            <Button variant="primary" size="sm">
              Acknowledge
            </Button>
            <Button variant="ghost" size="sm">
              Dismiss
            </Button>
          </div>
        </Panel>
      </div>

      {/* Stats dashboard */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Hunt Session Dashboard</div>
        <Panel size="lg">
          <SectionHeader title="Session Summary" size="lg" />
          <div className={styles.statRowFour}>
            <StatBlock label="Total Kills" value={342} accent />
            <StatBlock
              label="Globals"
              value={7}
              trend={{ value: "2", direction: "up" }}
            />
            <StatBlock
              label="HOF"
              value={1}
              trend={{ value: "1", direction: "up" }}
            />
            <StatBlock label="Returns" value="94%" sub="above average" />
          </div>
          <div className={styles.spacer} />
          <SegmentedBar
            label="Session Progress"
            value={68}
            variant="primary"
            segments={20}
          />
          <div style={{ marginTop: "var(--space-3)" }}>
            <SegmentedBar
              label="Ammo Remaining"
              value={32}
              variant="warning"
              segments={20}
            />
          </div>
        </Panel>
      </div>

      {/* Hub page mockup */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Hub Page Mockup</div>
        <div className={styles.componentLabel}>
          fully interactive — search, filter, sort, and paginate
        </div>
        <HubMockup />
      </div>

      {/* Loading state mockup */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Loading State</div>
        <div className={styles.componentLabel}>
          what a hub page looks like while fetching data
        </div>
        <Panel>
          <div
            className={styles.row}
            style={{ marginBottom: "var(--space-4)" }}
          >
            <div style={{ flex: 1 }}>
              <Skeleton variant="block" height="36px" />
            </div>
            <Skeleton variant="block" width="160px" height="36px" />
            <Skeleton variant="block" width="160px" height="36px" />
          </div>
          <div className={styles.statRowFour}>
            <Skeleton variant="stat" />
            <Skeleton variant="stat" />
            <Skeleton variant="stat" />
            <Skeleton variant="stat" />
          </div>
        </Panel>
        <div className={styles.spacer} />
        <div className={styles.grid}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    </>
  );
}

const ROWS_PER_PAGE = 4;

function HubMockup() {
  const [search, setSearch] = useState("");
  const [planet, setPlanet] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const filtered = SAMPLE_MOBS.filter(
    (m) => !search || m.name.toLowerCase().includes(search.toLowerCase()),
  )
    .filter(
      (m) => !planet || m.planet.toLowerCase().replace(" ", "-") === planet,
    )
    .sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "health-desc":
          return b.health - a.health;
        case "health-asc":
          return a.health - b.health;
        case "damage-desc":
          return b.damage - a.damage;
        default:
          return 0;
      }
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handlePlanet = (v: string) => {
    setPlanet(v);
    setPage(1);
  };
  const handleSort = (v: string) => {
    setSort(v);
  };

  return (
    <>
      <Panel>
        <div className={styles.row} style={{ marginBottom: "var(--space-4)" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Search creatures..."
            />
          </div>
          <Select
            options={PLANET_OPTIONS}
            value={planet}
            onChange={handlePlanet}
            placeholder="Planet"
          />
          <Select
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSort}
            placeholder="Sort"
          />
        </div>
        <div className={styles.row}>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "var(--text-xs)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {filtered.length} creature{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </Panel>
      <div className={styles.spacer} />
      <DataTable
        columns={MOB_COLUMNS}
        data={paged}
        keyField="id"
        striped
        onRowClick={(row) =>
          alert(`Navigate to /mobs/${row.name.toLowerCase()}`)
        }
        emptyMessage="No creatures match your filters"
      />
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}
