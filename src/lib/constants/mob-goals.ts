import type { GoalPreset } from "@/types/mobs";

/** The 4 intent-based goal presets for the mob funnel. */
export const GOAL_PRESETS: GoalPreset[] = [
  {
    key: "starter",
    label: "Just Starting Out",
    subtitle: "Low-level creatures perfect for learning combat",
    icon: "🌱",
    filter: { sort: "level" },
  },
  {
    key: "loot",
    label: "Making PED",
    subtitle: "Best returns for your ammo investment",
    icon: "💰",
    filter: { sort: "lootScore" },
  },
  {
    key: "codex",
    label: "Codex Hunting",
    subtitle: "Complete your codex efficiently",
    icon: "📖",
    filter: { sort: "level" },
  },
  {
    key: "biggame",
    label: "Big Game",
    subtitle: "High-level targets for experienced hunters",
    icon: "🎯",
    filter: { sort: "levelDesc" },
  },
];
