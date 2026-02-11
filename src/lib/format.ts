/**
 * Compact number formatter.
 * 1,000 → "1k", 12,500 → "12.5k", 1,000,000 → "1m", etc.
 * Numbers below 1,000 are returned as-is with locale grouping.
 * Trailing ".0" is stripped for clean output.
 */
export function compactNumber(n: number): string {
  const abs = Math.abs(n);

  if (abs >= 1_000_000_000) {
    return strip(n / 1_000_000_000) + "b";
  }
  if (abs >= 1_000_000) {
    return strip(n / 1_000_000) + "m";
  }
  if (abs >= 1_000) {
    return strip(n / 1_000) + "k";
  }

  return n.toLocaleString();
}

/** Round to 1 decimal and strip trailing ".0" */
function strip(v: number): string {
  const s = v.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}
