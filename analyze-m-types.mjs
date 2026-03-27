import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

console.log("📊 Analyzing M-Type asteroid spatial distribution...\n");

// Query all M-Type asteroids
const asteroids = await client.fetch(
  `*[_type == "mapPoi" && category == "asteroid-m"]`,
);

console.log(`Found ${asteroids.length} M-Type asteroids\n`);

// Calculate spatial metrics
const coords = asteroids.map((a) => ({ euX: a.euX, euY: a.euY, euZ: a.euZ }));

// Center point (mean)
const centerX = coords.reduce((sum, c) => sum + c.euX, 0) / coords.length;
const centerY = coords.reduce((sum, c) => sum + c.euY, 0) / coords.length;

// Z distribution
const zValues = coords.map((c) => c.euZ).sort((a, b) => a - b);
const zMin = zValues[0];
const zMax = zValues[zValues.length - 1];
const zMid = (zMin + zMax) / 2;
const zQ1 = zValues[Math.floor(zValues.length * 0.25)];
const zQ3 = zValues[Math.floor(zValues.length * 0.75)];

// Distance from center
const distances = asteroids.map((a) => {
  const dx = a.euX - centerX;
  const dy = a.euY - centerY;
  return Math.sqrt(dx * dx + dy * dy);
});

const distMin = Math.min(...distances);
const distMax = Math.max(...distances);
const distMid = (distMin + distMax) / 2;

console.log(`📍 CENTER: (${Math.round(centerX)}, ${Math.round(centerY)})`);
console.log(
  `🔲 XY DISTANCE RANGE: ${Math.round(distMin)} to ${Math.round(distMax)}\n`,
);

console.log(`📈 Z DISTRIBUTION:`);
console.log(`   Min:  ${zMin}`);
console.log(`   Q1:   ${zQ1}`);
console.log(`   Q2:   ${zMid}`);
console.log(`   Q3:   ${zQ3}`);
console.log(`   Max:  ${zMax}\n`);

// Classify each asteroid
const classified = asteroids
  .map((a, idx) => {
    const dx = a.euX - centerX;
    const dy = a.euY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const distPct = (dist - distMin) / (distMax - distMin);

    // Z classification
    let zClass = "mid";
    if (a.euZ <= zQ1) zClass = "deep";
    else if (a.euZ >= zQ3) zClass = "high";

    // Distance classification
    let ringClass = "outer";
    if (dist < distMid * 0.6) ringClass = "inner";
    else if (dist < distMid * 1.1) ringClass = "crossover";
    else ringClass = "outer";

    // Size based on combination
    let size = "medium";
    if ((zClass === "deep" || zClass === "high") && ringClass !== "crossover")
      size = "large";
    else if (ringClass === "crossover") size = "small";
    else if (zClass === "mid" && ringClass === "inner") size = "small";

    return {
      _id: a._id,
      name: a.name,
      euX: a.euX,
      euY: a.euY,
      euZ: a.euZ,
      dist,
      distPct: Math.round(distPct * 100),
      zClass,
      ringClass,
      size,
    };
  })
  .sort((a, b) => b.dist - a.dist);

// Summary by category
const summary = {
  large: classified.filter((a) => a.size === "large"),
  medium: classified.filter((a) => a.size === "medium"),
  small: classified.filter((a) => a.size === "small"),
};

console.log(`📦 SIZE CLASSIFICATION:`);
console.log(`   Large (${summary.large.length}):  Deep/High Z + Outer ring`);
console.log(`   Medium (${summary.medium.length}): Mid-range`);
console.log(
  `   Small (${summary.small.length}):  Crossover zones + Inner ring\n`,
);

// Show 3 samples from each
console.log(`🔍 SAMPLE ASTEROIDS BY SIZE:\n`);

console.log(`LARGE (outer + extreme Z):`);
summary.large.slice(0, 3).forEach((a) => {
  console.log(
    `  ${a.name.padEnd(10)} | (${a.euX}, ${a.euY}, ${a.euZ}) | Z: ${a.zClass} | Ring: ${a.ringClass}`,
  );
});

console.log(`\nMEDIUM (mid-range):`);
summary.medium.slice(0, 3).forEach((a) => {
  console.log(
    `  ${a.name.padEnd(10)} | (${a.euX}, ${a.euY}, ${a.euZ}) | Z: ${a.zClass} | Ring: ${a.ringClass}`,
  );
});

console.log(`\nSMALL (crossover + inner):`);
summary.small.slice(0, 3).forEach((a) => {
  console.log(
    `  ${a.name.padEnd(10)} | (${a.euX}, ${a.euY}, ${a.euZ}) | Z: ${a.zClass} | Ring: ${a.ringClass}`,
  );
});

// Export for next step
console.log(`\n✨ Analysis complete. Ready to generate names & descriptions.`);
console.log(
  `\nMetrics for generation:\n${JSON.stringify(
    {
      center: { x: Math.round(centerX), y: Math.round(centerY) },
      zRange: [zMin, zMax],
      zThresholds: { q1: zQ1, q3: zQ3 },
      distRange: [Math.round(distMin), Math.round(distMax)],
      summary: {
        large: summary.large.length,
        medium: summary.medium.length,
        small: summary.small.length,
      },
    },
    null,
    2,
  )}`,
);
