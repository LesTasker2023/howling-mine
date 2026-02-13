import { defineType, defineField } from "sanity";

/* ═══════════════════════════════════════════════════════════════════════════
   miningStats — Singleton: aggregated mining analytics data
   Updated via seed script or manually in the CMS.
   ═══════════════════════════════════════════════════════════════════════════ */

export const miningStatsType = defineType({
  name: "miningStats",
  title: "Mining Stats",
  type: "document",
  icon: () => "📊",

  fields: [
    /* ── Overview metrics ── */
    defineField({
      name: "periodLabel",
      title: "Period Label",
      type: "string",
      description: "E.g. 'Last 30 Days', 'January 2026'",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "totalRuns",
      title: "Total Runs",
      type: "number",
      validation: (r) => r.required().min(0),
    }),

    defineField({
      name: "totalGlobals",
      title: "Total Globals",
      type: "number",
      validation: (r) => r.required().min(0),
    }),

    defineField({
      name: "totalPedMined",
      title: "Total PED Mined",
      type: "number",
      description: "Gross PED output across all runs",
      validation: (r) => r.required().min(0),
    }),

    defineField({
      name: "totalPedCost",
      title: "Total PED Cost",
      type: "number",
      description: "Probe/amp/fuel cost across all runs",
      validation: (r) => r.required().min(0),
    }),

    defineField({
      name: "netProfit",
      title: "Net Profit (PED)",
      type: "number",
    }),

    defineField({
      name: "returnPercent",
      title: "Return %",
      type: "number",
      description: "Average return percentage across all runs",
    }),

    defineField({
      name: "avgGlobal",
      title: "Average Global Value (PED)",
      type: "number",
    }),

    defineField({
      name: "highestGlobal",
      title: "Highest Global (PED)",
      type: "number",
    }),

    defineField({
      name: "hofCount",
      title: "Hall of Fames",
      type: "number",
      validation: (r) => r.min(0),
    }),

    defineField({
      name: "uniqueMiners",
      title: "Active Miners",
      type: "number",
    }),

    defineField({
      name: "asteroidsHit",
      title: "Asteroids Hit",
      type: "number",
    }),

    /* ── Trend data ── */
    defineField({
      name: "profitTrend",
      title: "Profit Trend",
      type: "string",
      options: { list: ["up", "down", "neutral"] },
    }),

    defineField({
      name: "profitTrendValue",
      title: "Profit Trend Value",
      type: "string",
      description: "E.g. '+12%', '-5%'",
    }),

    defineField({
      name: "globalsTrend",
      title: "Globals Trend",
      type: "string",
      options: { list: ["up", "down", "neutral"] },
    }),

    defineField({
      name: "globalsTrendValue",
      title: "Globals Trend Value",
      type: "string",
    }),

    /* ── Charts: Activity over time ── */
    defineField({
      name: "activityTimeline",
      title: "Activity Timeline",
      type: "array",
      description:
        "Time series for line/bar chart. E.g. daily or weekly buckets.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Label", type: "string" }),
            defineField({ name: "globals", title: "Globals", type: "number" }),
            defineField({ name: "ped", title: "PED Value", type: "number" }),
            defineField({ name: "runs", title: "Runs", type: "number" }),
          ],
        },
      ],
    }),

    /* ── Charts: Asteroid type breakdown ── */
    defineField({
      name: "asteroidBreakdown",
      title: "Asteroid Type Breakdown",
      type: "array",
      description: "For pie chart — PED value per asteroid type",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Type", type: "string" }),
            defineField({ name: "value", title: "PED Value", type: "number" }),
          ],
        },
      ],
    }),

    /* ── Charts: Hourly distribution ── */
    defineField({
      name: "hourlyDistribution",
      title: "Hourly Distribution",
      type: "array",
      description: "Globals count per hour (0–23) for bar chart",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Hour", type: "string" }),
            defineField({ name: "globals", title: "Globals", type: "number" }),
            defineField({ name: "ped", title: "PED", type: "number" }),
          ],
        },
      ],
    }),

    /* ── Charts: Value distribution ── */
    defineField({
      name: "valueDistribution",
      title: "Value Distribution",
      type: "array",
      description: "Histogram buckets of global values",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Range", type: "string" }),
            defineField({ name: "count", title: "Count", type: "number" }),
          ],
        },
      ],
    }),

    /* ── Top miners ── */
    defineField({
      name: "topMiners",
      title: "Top Miners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "totalPed",
              title: "Total PED",
              type: "number",
            }),
            defineField({ name: "globals", title: "Globals", type: "number" }),
            defineField({ name: "hofs", title: "HoFs", type: "number" }),
          ],
        },
      ],
    }),

    /* ── Top asteroids ── */
    defineField({
      name: "topAsteroids",
      title: "Top Asteroids",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "totalPed",
              title: "Total PED",
              type: "number",
            }),
            defineField({ name: "globals", title: "Globals", type: "number" }),
            defineField({
              name: "miners",
              title: "Unique Miners",
              type: "number",
            }),
          ],
        },
      ],
    }),

    /* ── Recent globals (feed) ── */
    defineField({
      name: "recentGlobals",
      title: "Recent Globals",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "miner", title: "Miner", type: "string" }),
            defineField({
              name: "asteroid",
              title: "Asteroid",
              type: "string",
            }),
            defineField({ name: "value", title: "PED Value", type: "number" }),
            defineField({ name: "isHof", title: "HoF?", type: "boolean" }),
            defineField({
              name: "timestamp",
              title: "Timestamp",
              type: "datetime",
            }),
          ],
        },
      ],
    }),

    /* ── Records / milestones ── */
    defineField({
      name: "biggestHit",
      title: "Biggest Hit",
      type: "object",
      fields: [
        defineField({ name: "miner", title: "Miner", type: "string" }),
        defineField({ name: "asteroid", title: "Asteroid", type: "string" }),
        defineField({ name: "value", title: "PED Value", type: "number" }),
        defineField({ name: "date", title: "Date", type: "datetime" }),
      ],
    }),

    defineField({
      name: "bestReturnRun",
      title: "Best Return Run",
      type: "object",
      fields: [
        defineField({ name: "miner", title: "Miner", type: "string" }),
        defineField({ name: "returnPct", title: "Return %", type: "number" }),
        defineField({ name: "pedOut", title: "PED Output", type: "number" }),
      ],
    }),

    /* ── Performance gauges ── */
    defineField({
      name: "avgReturnPct",
      title: "Avg Return % (for dial gauge)",
      type: "number",
    }),

    defineField({
      name: "hofRate",
      title: "HoF Rate % (for dial gauge)",
      type: "number",
      description: "Percentage of globals that are HoF",
    }),

    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
    }),
  ],

  preview: {
    select: { title: "periodLabel", sub: "updatedAt" },
    prepare: ({ title, sub }) => ({
      title: title ?? "Mining Stats",
      subtitle: sub
        ? `Updated ${new Date(sub).toLocaleDateString()}`
        : "No update date",
    }),
  },
});
