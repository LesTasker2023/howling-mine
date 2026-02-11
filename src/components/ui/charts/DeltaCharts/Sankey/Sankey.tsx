"use client";

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import styles from "../DeltaCharts.module.css";

/* ── Types ── */

export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

export interface SankeyLink {
  source: string; // node id
  target: string; // node id
  value: number; // weight / flow magnitude
}

export interface SankeyProps {
  /** Left-side nodes (e.g. professions) */
  sources: SankeyNode[];
  /** Right-side nodes (e.g. skills) */
  targets: SankeyNode[];
  /** Weighted links between source → target */
  links: SankeyLink[];
  /** Chart title */
  title?: string;
  /** Width of the SVG viewBox — default 900 */
  width?: number;
  /** Height of the SVG viewBox — default 400 */
  height?: number;
}

/* ── Default palette ── */

const PALETTE = [
  "#3b82f6",
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#facc15",
  "#f97316",
  "#ef4444",
];

/* ── Layout engine ── */

interface LayoutNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  h: number; // height in px
  totalFlow: number;
  /** Running cursor for stacking link ribbons */
  _cursor: number;
}

interface LayoutLink {
  sourceId: string;
  targetId: string;
  value: number;
  color: string;
  sy: number; // source y start
  sh: number; // source ribbon height
  ty: number; // target y start
  th: number; // target ribbon height
}

function layout(
  props: SankeyProps,
  pad: { top: number; bottom: number; nodeWidth: number; colGap: number },
) {
  const { sources, targets, links, width = 900 } = props;
  const nodeGap = 6;
  const MIN_NODE_H = 12;

  /* Aggregate flow per node */
  const srcFlow = new Map<string, number>();
  const tgtFlow = new Map<string, number>();
  for (const l of links) {
    srcFlow.set(l.source, (srcFlow.get(l.source) ?? 0) + l.value);
    tgtFlow.set(l.target, (tgtFlow.get(l.target) ?? 0) + l.value);
  }

  const totalSrcFlow = [...srcFlow.values()].reduce((a, b) => a + b, 0);
  const totalTgtFlow = [...tgtFlow.values()].reduce((a, b) => a + b, 0);

  /*
   * Two-pass layout: first compute bars at a provisional scale, then measure
   * the actual extent and expand the viewBox if nodes overflow.
   */
  const provisionalH = props.height ?? 400;
  const usableH = provisionalH - pad.top - pad.bottom;

  /* Build left nodes */
  const srcGaps = Math.max(sources.length - 1, 0) * nodeGap;
  const srcScale = (usableH - srcGaps) / Math.max(totalSrcFlow, 1);
  let sy = pad.top;
  const srcNodes: LayoutNode[] = sources.map((n, i) => {
    const flow = srcFlow.get(n.id) ?? 0;
    const h = Math.max(flow * srcScale, MIN_NODE_H);
    const node: LayoutNode = {
      id: n.id,
      label: n.label,
      color: n.color ?? PALETTE[i % PALETTE.length],
      x: 0,
      y: sy,
      h,
      totalFlow: flow,
      _cursor: sy,
    };
    sy += h + nodeGap;
    return node;
  });

  /* Build right nodes — sort by total flow descending for neatness */
  const sortedTargets = [...targets].sort(
    (a, b) => (tgtFlow.get(b.id) ?? 0) - (tgtFlow.get(a.id) ?? 0),
  );
  const tgtGaps = Math.max(sortedTargets.length - 1, 0) * nodeGap;
  const tgtScale = (usableH - tgtGaps) / Math.max(totalTgtFlow, 1);
  let ty = pad.top;
  const tgtNodes: LayoutNode[] = sortedTargets.map((n, i) => {
    const flow = tgtFlow.get(n.id) ?? 0;
    const h = Math.max(flow * tgtScale, MIN_NODE_H);
    const node: LayoutNode = {
      id: n.id,
      label: n.label,
      color: n.color ?? "#94a3b8",
      x: width - pad.nodeWidth,
      y: ty,
      h,
      totalFlow: flow,
      _cursor: ty,
    };
    ty += h + nodeGap;
    return node;
  });

  /* Measure actual extents — use the larger of both columns */
  const srcBottom = srcNodes.length
    ? srcNodes[srcNodes.length - 1].y + srcNodes[srcNodes.length - 1].h
    : 0;
  const tgtBottom = tgtNodes.length
    ? tgtNodes[tgtNodes.length - 1].y + tgtNodes[tgtNodes.length - 1].h
    : 0;
  const height = Math.max(
    provisionalH,
    Math.max(srcBottom, tgtBottom) + pad.bottom,
  );

  const nodeMap = new Map<string, LayoutNode>();
  for (const n of srcNodes) nodeMap.set(n.id, n);
  for (const n of tgtNodes) nodeMap.set(n.id, n);

  /* Build ribbons — sort links by value desc so biggest flow on top */
  const sorted = [...links].sort((a, b) => b.value - a.value);
  const layoutLinks: LayoutLink[] = sorted.map((l) => {
    const src = nodeMap.get(l.source)!;
    const tgt = nodeMap.get(l.target)!;
    const sh = Math.max((l.value / src.totalFlow) * src.h, 2);
    const th = Math.max((l.value / tgt.totalFlow) * tgt.h, 2);
    const ribbon: LayoutLink = {
      sourceId: l.source,
      targetId: l.target,
      value: l.value,
      color: src.color,
      sy: src._cursor,
      sh,
      ty: tgt._cursor,
      th,
    };
    src._cursor += sh;
    tgt._cursor += th;
    return ribbon;
  });

  return { srcNodes, tgtNodes, layoutLinks, height };
}

/* ── Cubic Bézier ribbon path ── */

function ribbonPath(
  sx: number,
  sy0: number,
  sy1: number,
  tx: number,
  ty0: number,
  ty1: number,
): string {
  const mx = (sx + tx) / 2;
  return [
    `M ${sx} ${sy0}`,
    `C ${mx} ${sy0}, ${mx} ${ty0}, ${tx} ${ty0}`,
    `L ${tx} ${ty1}`,
    `C ${mx} ${ty1}, ${mx} ${sy1}, ${sx} ${sy1}`,
    "Z",
  ].join(" ");
}

/* ── Component ── */

export function Sankey({
  sources,
  targets,
  links,
  title,
  width = 900,
  height: heightProp,
}: SankeyProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const pad = { top: 8, bottom: 8, nodeWidth: 14, colGap: 60 };
  const labelW = 180;

  const { srcNodes, tgtNodes, layoutLinks, height } = useMemo(
    () => layout({ sources, targets, links, width, height: heightProp }, pad),
    [sources, targets, links, width, heightProp],
  );

  /* Build a lookup: when a source is hovered, find its weight per target */
  const linkMap = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    for (const l of links) {
      if (!m.has(l.source)) m.set(l.source, new Map());
      m.get(l.source)!.set(l.target, l.value);
    }
    return m;
  }, [links]);

  const srcBarX = labelW;
  const tgtBarX = width - pad.nodeWidth - labelW;

  return (
    <Panel size="flush" noAnimation>
      <div className={styles.chartInner}>
        {title && <div className={styles.chartTitle}>{title}</div>}

        <div className={styles.sankeyWrap}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%" }}>
            {/* Ribbons */}
            {layoutLinks.map((l, i) => {
              const isActive =
                hovered === null ||
                hovered === l.sourceId ||
                hovered === l.targetId;
              return (
                <path
                  key={i}
                  d={ribbonPath(
                    srcBarX + pad.nodeWidth,
                    l.sy,
                    l.sy + l.sh,
                    tgtBarX,
                    l.ty,
                    l.ty + l.th,
                  )}
                  fill={l.color}
                  fillOpacity={isActive ? 0.25 : 0.04}
                  stroke={l.color}
                  strokeOpacity={isActive ? 0.4 : 0.06}
                  strokeWidth={1}
                  className={styles.sankeyRibbon}
                  onMouseEnter={() => setHovered(l.sourceId)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>{`${l.sourceId} → ${l.targetId}: ${l.value}%`}</title>
                </path>
              );
            })}

            {/* Source bars */}
            {srcNodes.map((n) => {
              const isActive = hovered === null || hovered === n.id;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={srcBarX}
                    y={n.y}
                    width={pad.nodeWidth}
                    height={n.h}
                    rx={3}
                    fill={n.color}
                    fillOpacity={isActive ? 0.85 : 0.25}
                  />
                  <text
                    x={srcBarX - 10}
                    y={n.y + n.h / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    className={
                      isActive ? styles.sankeyLabelActive : styles.sankeyLabel
                    }
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* Target bars */}
            {tgtNodes.map((n) => {
              const isActive =
                hovered === null ||
                hovered === n.id ||
                layoutLinks.some(
                  (l) => l.targetId === n.id && l.sourceId === hovered,
                );
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={tgtBarX}
                    y={n.y}
                    width={pad.nodeWidth}
                    height={n.h}
                    rx={3}
                    fill={n.color}
                    fillOpacity={isActive ? 0.85 : 0.25}
                  />
                  <text
                    x={tgtBarX + pad.nodeWidth + 10}
                    y={n.y + n.h / 2}
                    textAnchor="start"
                    dominantBaseline="central"
                    className={
                      isActive ? styles.sankeyLabelActive : styles.sankeyLabel
                    }
                  >
                    {n.label}
                    {(() => {
                      const w =
                        hovered && linkMap.has(hovered)
                          ? linkMap.get(hovered)!.get(n.id)
                          : undefined;
                      return w !== undefined ? (
                        <tspan className={styles.sankeyWeight}> {w}%</tspan>
                      ) : null;
                    })()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </Panel>
  );
}
