/* ═══════════════════════════════════════════════════════════════════════════
   HowlingMineMap — 3D interactive area map for CMS-driven POIs
   Raw Three.js — orbit controls, POI spheres, sprite labels, starfield
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTopBar } from "@/context/TopBarContext";
import { AsteroidStatsCard } from "./AsteroidStatsCard";
import styles from "./HowlingMineMap.module.css";

/* ── Types ── */
export interface MapPoi {
  _id: string;
  name: string;
  category: string;
  euX: number;
  euY: number;
  euZ: number;
  icon?: string;
  description?: string;
  pvpLootable?: boolean;
}

interface HowlingMineMapProps {
  pois: MapPoi[];
}

/* ── Category visuals ── */
const CAT_COLORS: Record<string, number> = {
  station: 0x66ddff,
  "asteroid-c": 0x8b7355,
  "asteroid-f": 0x2d5a27,
  "asteroid-s": 0x5a7d9a,
  "asteroid-m": 0xeab308,
  "asteroid-nd": 0xc850c0,
  "asteroid-scrap": 0xa0a0a0,
  landmark: 0xf59e0b,
  "pvp-zone": 0xef4444,
  "safe-zone": 0x22c55e,
};

const CAT_LABELS: Record<string, string> = {
  station: "Station",
  "asteroid-c": "C-Type",
  "asteroid-f": "F-Type",
  "asteroid-s": "S-Type",
  "asteroid-m": "M-Type",
  "asteroid-nd": "ND-Type",
  "asteroid-scrap": "Scrap",
  landmark: "Landmark",
  "pvp-zone": "PVP Zone",
  "safe-zone": "Safe Zone",
};

function getCatColor(cat: string): number {
  return CAT_COLORS[cat] ?? 0x888888;
}

/* ── EU → Three.js coordinate mapping ── */
function euToThree(
  euX: number,
  euY: number,
  euZ: number,
  center: { x: number; y: number; z: number },
  scale: number,
): THREE.Vector3 {
  return new THREE.Vector3(
    (euX - center.x) * scale,
    (euZ - center.z) * scale, // EU Z → Three Y (up)
    -(euY - center.y) * scale, // EU Y → Three -Z (depth, inverted so higher Y = further)
  );
}

/* ── Create text sprite ── */
function createLabel(text: string, color: string, fontSize = 48): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Measure text first to size canvas correctly
  const font = `bold ${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
  ctx.font = font;
  const measured = ctx.measureText(text);
  const padding = fontSize; // breathing room for glow
  const w = Math.ceil(measured.width + padding * 2);
  const h = Math.ceil(fontSize * 2 + padding);
  canvas.width = w;
  canvas.height = h;

  // Re-set font after resize (canvas reset clears it)
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.fillText(text, w / 2, h / 2);

  // Crisp pass
  ctx.shadowBlur = 0;
  ctx.fillText(text, w / 2, h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  const aspect = w / h;
  const baseScale = fontSize / 120; // normalise so 48px ≈ 0.4 height like before
  sprite.scale.set(baseScale * aspect, baseScale, 1);
  return sprite;
}

/* ── Procedural nebula cloud texture ── */
function createNebulaTexture(
  r: number,
  g: number,
  b: number,
  size = 512,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;

  // Base radial gradient
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.48);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.18)`);
  grad.addColorStop(0.55, `rgba(${r},${g},${b},0.06)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Sub-clouds for wispy structure
  for (let i = 0; i < 8; i++) {
    const ox = cx + (Math.random() - 0.5) * size * 0.5;
    const oy = cy + (Math.random() - 0.5) * size * 0.5;
    const rad = size * (0.1 + Math.random() * 0.22);
    const r2 = Math.min(255, r + Math.floor(Math.random() * 50 - 25));
    const g2 = Math.min(255, g + Math.floor(Math.random() * 50 - 25));
    const b2 = Math.min(255, b + Math.floor(Math.random() * 50 - 25));
    const sg = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
    sg.addColorStop(0, `rgba(${r2},${g2},${b2},0.22)`);
    sg.addColorStop(0.5, `rgba(${r2},${g2},${b2},0.07)`);
    sg.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ── Soft glow halo texture ── */
function createGlowTexture(
  r: number,
  g: number,
  b: number,
  size = 64,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.15)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export function HowlingMineMap({ pois }: HowlingMineMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneDataRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    poiMeshes: Map<string, THREE.Mesh>;
    poiRings: Map<string, THREE.Mesh>;
    labelSprites: Map<string, THREE.Sprite>;
    animId: number;
  } | null>(null);

  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);
  const selectedRef = useRef<string | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const hintDismissed = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /* Detect mobile once */
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  /* ── TopBar context: expose filters as multi-select subtabs ── */
  const {
    activeSubTabs: activeFilters,
    setSubTabs,
    setSubTabMultiSelect,
  } = useTopBar();

  const categories = Array.from(new Set(pois.map((p) => p.category))).sort();

  /* Push category subtabs into NavShell on mount / when categories change */
  useEffect(() => {
    setSubTabMultiSelect(true);
    setSubTabs(
      categories.map((cat) => ({
        key: cat,
        label: CAT_LABELS[cat] ?? cat,
        color: "#" + new THREE.Color(getCatColor(cat)).getHexString(),
      })),
    );
    return () => {
      setSubTabs([]);
      setSubTabMultiSelect(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join(","), setSubTabs, setSubTabMultiSelect]);

  /* ── Three.js setup ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pois.length) return;

    // ─── Compute center & scale ───
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;
    for (const p of pois) {
      if (p.euX < minX) minX = p.euX;
      if (p.euX > maxX) maxX = p.euX;
      if (p.euY < minY) minY = p.euY;
      if (p.euY > maxY) maxY = p.euY;
      if (p.euZ < minZ) minZ = p.euZ;
      if (p.euZ > maxZ) maxZ = p.euZ;
    }
    const center = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2,
    };
    const range = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1000);
    const scale = 8 / range; // Fit into ~8 Three.js units

    // ─── Mobile detection ───
    const mobile = window.innerWidth <= 768;

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x050508, 1);
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    // ─── Scene ───
    const scene = new THREE.Scene();

    // Fog — only affects POIs (space visuals use fog:false)
    scene.fog = new THREE.FogExp2(0x050508, 0.035);

    // Ambient + directional
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const dirLight = new THREE.DirectionalLight(0xeab308, 0.3);
    dirLight.position.set(5, 8, 3);
    scene.add(dirLight);

    // Subtle blue fill from below for depth
    const fillLight = new THREE.DirectionalLight(0x334488, 0.15);
    fillLight.position.set(-3, -5, -2);
    scene.add(fillLight);

    // ─── Camera ───
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.01,
      500,
    );
    // Pull camera back on portrait/mobile for better overview
    if (mobile) {
      camera.position.set(0, 8, 11);
    } else {
      camera.position.set(0, 6, 8);
    }

    // ─── Controls ───
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);

    // Better touch handling on mobile
    if (mobile) {
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;
      controls.panSpeed = 0.5;
    }

    // ─── Deep Starfield (3 density layers) ───

    // Layer 1 — Dense far-field (tiny, cool-dominant)
    const farCount = mobile ? 2500 : 5000;
    const farGeo = new THREE.BufferGeometry();
    const farPos = new Float32Array(farCount * 3);
    const farCol = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      farPos[i * 3] = (Math.random() - 0.5) * 160;
      farPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      farPos[i * 3 + 2] = (Math.random() - 0.5) * 160;
      const temp = Math.random();
      if (temp < 0.55) {
        farCol[i * 3] = 0.72;
        farCol[i * 3 + 1] = 0.78;
        farCol[i * 3 + 2] = 1.0;
      } else if (temp < 0.8) {
        farCol[i * 3] = 1.0;
        farCol[i * 3 + 1] = 0.93;
        farCol[i * 3 + 2] = 0.78;
      } else if (temp < 0.92) {
        farCol[i * 3] = 1.0;
        farCol[i * 3 + 1] = 0.82;
        farCol[i * 3 + 2] = 0.5;
      } else {
        farCol[i * 3] = 1.0;
        farCol[i * 3 + 1] = 0.55;
        farCol[i * 3 + 2] = 0.35;
      }
    }
    farGeo.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
    farGeo.setAttribute("color", new THREE.BufferAttribute(farCol, 3));
    scene.add(
      new THREE.Points(
        farGeo,
        new THREE.PointsMaterial({
          size: 0.04,
          transparent: true,
          opacity: 0.4,
          sizeAttenuation: true,
          vertexColors: true,
          fog: false,
        }),
      ),
    );

    // Layer 2 — Mid-field (larger, bolder)
    const midCount = mobile ? 750 : 1500;
    const midGeo = new THREE.BufferGeometry();
    const midPos = new Float32Array(midCount * 3);
    const midCol = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      midPos[i * 3] = (Math.random() - 0.5) * 100;
      midPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      midPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      const temp = Math.random();
      if (temp < 0.5) {
        midCol[i * 3] = 0.8;
        midCol[i * 3 + 1] = 0.87;
        midCol[i * 3 + 2] = 1.0;
      } else if (temp < 0.78) {
        midCol[i * 3] = 1.0;
        midCol[i * 3 + 1] = 0.95;
        midCol[i * 3 + 2] = 0.82;
      } else {
        midCol[i * 3] = 1.0;
        midCol[i * 3 + 1] = 0.72;
        midCol[i * 3 + 2] = 0.5;
      }
    }
    midGeo.setAttribute("position", new THREE.BufferAttribute(midPos, 3));
    midGeo.setAttribute("color", new THREE.BufferAttribute(midCol, 3));
    scene.add(
      new THREE.Points(
        midGeo,
        new THREE.PointsMaterial({
          size: 0.08,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: true,
          vertexColors: true,
          fog: false,
        }),
      ),
    );

    // Layer 3 — Bright accent stars (sparse, eye-catching)
    const brightCount = mobile ? 50 : 100;
    const brightGeo = new THREE.BufferGeometry();
    const brightPos = new Float32Array(brightCount * 3);
    const brightCol = new Float32Array(brightCount * 3);
    for (let i = 0; i < brightCount; i++) {
      brightPos[i * 3] = (Math.random() - 0.5) * 110;
      brightPos[i * 3 + 1] = (Math.random() - 0.5) * 110;
      brightPos[i * 3 + 2] = (Math.random() - 0.5) * 110;
      const h = Math.random();
      if (h < 0.35) {
        brightCol[i * 3] = 0.7;
        brightCol[i * 3 + 1] = 0.8;
        brightCol[i * 3 + 2] = 1.0;
      } else if (h < 0.65) {
        brightCol[i * 3] = 1.0;
        brightCol[i * 3 + 1] = 1.0;
        brightCol[i * 3 + 2] = 0.95;
      } else {
        brightCol[i * 3] = 1.0;
        brightCol[i * 3 + 1] = 0.85;
        brightCol[i * 3 + 2] = 0.5;
      }
    }
    brightGeo.setAttribute("position", new THREE.BufferAttribute(brightPos, 3));
    brightGeo.setAttribute("color", new THREE.BufferAttribute(brightCol, 3));
    const brightMat = new THREE.PointsMaterial({
      size: 0.18,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      fog: false,
    });
    scene.add(new THREE.Points(brightGeo, brightMat));

    // ─── Star glow halos (brightest points get visible halos) ───
    const haloCount = mobile ? 15 : 35;
    for (let i = 0; i < haloCount; i++) {
      const warm = Math.random() > 0.5;
      const tex = createGlowTexture(
        warm ? 255 : 180,
        warm ? 220 : 200,
        warm ? 170 : 255,
      );
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      const s = new THREE.Sprite(mat);
      s.position.set(
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 90,
      );
      s.scale.setScalar(0.6 + Math.random() * 1.0);
      scene.add(s);
    }

    // ─── Nebula clouds ───
    const nebulaSprites: THREE.Sprite[] = [];
    const nebulaDefs = [
      { r: 90, g: 40, b: 160, x: -28, y: 10, z: -38, s: 32, rot: 0.0 },
      { r: 25, g: 75, b: 140, x: 32, y: -6, z: -42, s: 38, rot: 1.2 },
      { r: 145, g: 45, b: 75, x: -18, y: -12, z: 32, s: 26, rot: 0.5 },
      { r: 45, g: 115, b: 125, x: 22, y: 14, z: 28, s: 30, rot: 2.1 },
      { r: 140, g: 85, b: 25, x: -32, y: 4, z: -12, s: 24, rot: 3.8 },
      { r: 55, g: 28, b: 115, x: 38, y: -9, z: -22, s: 34, rot: 4.5 },
      { r: 115, g: 40, b: 95, x: -6, y: 18, z: -48, s: 42, rot: 1.8 },
      { r: 35, g: 95, b: 95, x: 12, y: -14, z: 42, s: 28, rot: 5.2 },
    ];
    const activeNebulae = mobile ? nebulaDefs.slice(0, 4) : nebulaDefs;
    for (const nd of activeNebulae) {
      const tex = createNebulaTexture(nd.r, nd.g, nd.b);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(nd.x, nd.y, nd.z);
      sprite.scale.setScalar(nd.s);
      mat.rotation = nd.rot;
      scene.add(sprite);
      nebulaSprites.push(sprite);
    }

    // ─── Floating cosmic dust (2 counter-rotating layers) ───
    const dustLayers: THREE.Points[] = [];
    const dustLayerCount = mobile ? 1 : 2;
    for (let layer = 0; layer < dustLayerCount; layer++) {
      const count = mobile ? 800 : 1800;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        const warmth = layer * 0.1;
        col[i * 3] = 0.65 + Math.random() * 0.3 + warmth;
        col[i * 3 + 1] = 0.55 + Math.random() * 0.25;
        col[i * 3 + 2] = 0.45 + Math.random() * 0.2;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.025,
        transparent: true,
        opacity: 0.18,
        sizeAttenuation: true,
        vertexColors: true,
        fog: false,
        depthWrite: false,
      });
      dustLayers.push(new THREE.Points(geo, mat));
      scene.add(dustLayers[layer]);
    }

    // ─── Reference grid (subtle, deep-space tint) ───
    const gridHelper = new THREE.GridHelper(12, 24, 0x0c0c1a, 0x0c0c1a);
    gridHelper.position.y = -2;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // ─── Reference planets & stations (visual orientation aids) ───
    const textureLoader = new THREE.TextureLoader();

    const refBodies: {
      name: string;
      euX: number;
      euY: number;
      euZ: number;
      color: number;
      radius: number;
      isPlanet: boolean;
      /** Path to texture image (planets with artwork). */
      texture?: string;
      /** Native image width (for aspect-correct scaling). */
      imgW?: number;
      /** Native image height (for aspect-correct scaling). */
      imgH?: number;
    }[] = [
      // Major planets (with textures where available)
      {
        name: "Calypso",
        euX: 58271,
        euY: 69165,
        euZ: -845,
        color: 0x4fa8e8,
        radius: 0.066,
        isPlanet: true,
        texture: "/images/planets/calypso.png",
        imgW: 300,
        imgH: 278,
      },
      {
        name: "Arkadia",
        euX: 77643,
        euY: 59366,
        euZ: -250,
        color: 0x5cb85c,
        radius: 0.067,
        isPlanet: true,
        texture: "/images/planets/arkadia.png",
        imgW: 300,
        imgH: 282,
      },
      {
        name: "Cyrene",
        euX: 60586,
        euY: 59458,
        euZ: -1573,
        color: 0xd5a03a,
        radius: 0.069,
        isPlanet: true,
        texture: "/images/planets/cyrene.png",
        imgW: 393,
        imgH: 329,
      },
      {
        name: "Rocktropia",
        euX: 70095,
        euY: 79916,
        euZ: -1172,
        color: 0xc44e52,
        radius: 0.72,
        isPlanet: true,
        texture: "/images/planets/rocktropia.png",
        imgW: 300,
        imgH: 269,
      },
      {
        name: "Next Island",
        euX: 88732,
        euY: 69513,
        euZ: 1755,
        color: 0x38b2a5,
        radius: 0.204,
        isPlanet: true,
        texture: "/images/planets/next-island.png",
        imgW: 300,
        imgH: 309,
      },
      {
        name: "Toulan",
        euX: 85139,
        euY: 80302,
        euZ: 1350,
        color: 0xc28840,
        radius: 0.64,
        isPlanet: true,
        texture: "/images/planets/toulan.png",
        imgW: 300,
        imgH: 282,
      },
    ];

    const planetSprites: THREE.Sprite[] = [];
    const haloSprites: THREE.Sprite[] = [];

    // Push all reference bodies to the boundary — preserve direction, fixed distance
    const BOUNDARY_RADIUS = 42;

    for (const body of refBodies) {
      // Get real direction from map center, then push to boundary
      const rawPos = euToThree(body.euX, body.euY, body.euZ, center, scale);
      const dir = rawPos.clone().normalize();
      const pos = dir.multiplyScalar(BOUNDARY_RADIUS);

      if (body.isPlanet) {
        if (body.texture) {
          // Textured planet — render as billboard sprite so artwork shows correctly
          const tex = textureLoader.load(body.texture);
          tex.colorSpace = THREE.SRGBColorSpace;
          const spriteMat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.1,
            depthWrite: false,
            fog: false,
            toneMapped: false,
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.frustumCulled = false;
          sprite.position.copy(pos);
          // Aspect-correct scaling — no vertical stretch
          const sz = body.radius * 14.0;
          const aspect = (body.imgW ?? 1) / (body.imgH ?? 1);
          sprite.scale.set(sz * aspect, sz, 1);
          scene.add(sprite);
        } else {
          // Fallback — plain translucent sphere (Toulan etc.)
          const geo = new THREE.SphereGeometry(body.radius, 32, 32);
          const mat = new THREE.MeshStandardMaterial({
            color: body.color,
            emissive: body.color,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.95,
            roughness: 0.4,
            metalness: 0.1,
            depthWrite: false,
            fog: false,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.frustumCulled = false;
          mesh.position.copy(pos);
          scene.add(mesh);
        }

        // Atmospheric halo
        const haloTex = createGlowTexture(
          (body.color >> 16) & 0xff,
          (body.color >> 8) & 0xff,
          body.color & 0xff,
          128,
        );
        const haloMat = new THREE.SpriteMaterial({
          map: haloTex,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
        });
        const halo = new THREE.Sprite(haloMat);
        halo.frustumCulled = false;
        halo.position.copy(pos);
        halo.scale.setScalar(body.radius * 20.0);
        scene.add(halo);
        haloSprites.push(halo);
      } else {
        // Moon / minor body — smaller, simpler
        const geo = new THREE.SphereGeometry(body.radius, 20, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 0.9,
          transparent: true,
          opacity: 0.95,
          roughness: 0.3,
          metalness: 0.2,
          depthWrite: false,
          fog: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        scene.add(mesh);
      }

      // Name label — small, subtle, below the planet
      const hexColor = "#" + new THREE.Color(body.color).getHexString();
      const label = createLabel(body.name, hexColor, 132);
      label.frustumCulled = false;
      label.position.copy(pos);
      label.position.y -= body.radius * 14.0 * 0.55 + 0.3;
      (label.material as THREE.SpriteMaterial).opacity = 0.6;
      (label.material as THREE.SpriteMaterial).fog = false;
      (label.material as THREE.SpriteMaterial).toneMapped = false;
      scene.add(label);
    }

    // ─── POI meshes ───
    const poiMeshes = new Map<string, THREE.Mesh>();
    const poiRings = new Map<string, THREE.Mesh>();
    const labelSprites = new Map<string, THREE.Sprite>();

    // Pre-compute positions and detect collisions
    // Visual radii: station ring=0.22, station label ~0.35 above; other ring=0.13
    function getVisualRadius(cat: string): number {
      return cat === "station" ? 0.55 : 0.22;
    }
    const poiPositions: {
      poi: MapPoi;
      pos: THREE.Vector3;
      original: THREE.Vector3;
    }[] = [];

    for (const poi of pois) {
      const pos = euToThree(poi.euX, poi.euY, poi.euZ, center, scale);
      poiPositions.push({ poi, pos: pos.clone(), original: pos.clone() });
    }

    // Iterative repulsion — push overlapping POIs apart
    for (let iteration = 0; iteration < 20; iteration++) {
      let anyMoved = false;
      for (let i = 0; i < poiPositions.length; i++) {
        for (let j = i + 1; j < poiPositions.length; j++) {
          const a = poiPositions[i];
          const b = poiPositions[j];
          const minSep =
            getVisualRadius(a.poi.category) + getVisualRadius(b.poi.category);
          const dist = a.pos.distanceTo(b.pos);
          if (dist < minSep && dist > 0.001) {
            const overlap = (minSep - dist) / 2;
            const dir = new THREE.Vector3()
              .subVectors(b.pos, a.pos)
              .normalize();
            // Push the smaller POI more than the station
            const aIsStation = a.poi.category === "station";
            const bIsStation = b.poi.category === "station";
            if (aIsStation && !bIsStation) {
              b.pos.addScaledVector(dir, overlap * 2);
            } else if (bIsStation && !aIsStation) {
              a.pos.addScaledVector(dir, -overlap * 2);
            } else {
              a.pos.addScaledVector(dir, -overlap);
              b.pos.addScaledVector(dir, overlap);
            }
            anyMoved = true;
          } else if (dist <= 0.001) {
            // Nearly identical positions — offset on a random axis
            b.pos.x += minSep * 0.6;
            b.pos.z += minSep * 0.4;
            anyMoved = true;
          }
        }
      }
      if (!anyMoved) break;
    }

    for (const { poi, pos, original } of poiPositions) {
      const color = getCatColor(poi.category);
      const isStation = poi.category === "station";
      const radius = isStation ? (mobile ? 0.16 : 0.12) : mobile ? 0.09 : 0.06;

      // Core sphere
      const geo = new THREE.SphereGeometry(radius, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData = { poiId: poi._id };
      scene.add(mesh);
      poiMeshes.set(poi._id, mesh);

      // Glowing ring
      const ringGeo = new THREE.RingGeometry(
        isStation ? 0.2 : 0.12,
        isStation ? 0.22 : 0.13,
        32,
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(camera.position);
      scene.add(ring);
      poiRings.set(poi._id, ring);

      // Label sprite
      const hexColor = "#" + new THREE.Color(color).getHexString();
      const label = createLabel(poi.name, hexColor, isStation ? 52 : 40);
      label.position.copy(pos);
      label.position.y += isStation ? 0.35 : 0.2;
      scene.add(label);
      labelSprites.set(poi._id, label);

      // PVP indicator — small red dot below
      if (poi.pvpLootable) {
        const pvpGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const pvpMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          transparent: true,
          opacity: 0.8,
        });
        const pvpDot = new THREE.Mesh(pvpGeo, pvpMat);
        pvpDot.position.copy(pos);
        pvpDot.position.y -= isStation ? 0.18 : 0.1;
        scene.add(pvpDot);
      }

      // Offset indicator — thin line from displayed position to true position
      if (pos.distanceTo(original) > 0.01) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          original,
          pos,
        ]);
        const lineMat = new THREE.LineDashedMaterial({
          color,
          transparent: true,
          opacity: 0.35,
          dashSize: 0.05,
          gapSize: 0.03,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        scene.add(line);

        // Small dot at true position
        const trueDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.015, 8, 8),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.4,
          }),
        );
        trueDot.position.copy(original);
        scene.add(trueDot);
      }
    }

    // ─── M-Type PVP zone sphere ───
    // Hardcoded EU center (matches ProjectDelta reference) — manually tuned
    // to encompass all M-type asteroids without reaching ND-type clusters.
    const mPois = pois.filter((p) => p.category === "asteroid-m");
    if (mPois.length > 1) {
      const pvpCenter = euToThree(78200, 76900, -1550, center, scale);

      // Find max distance from center to any M-type asteroid
      let maxDist = 0;
      for (const m of mPois) {
        const p = euToThree(m.euX, m.euY, m.euZ, center, scale);
        const d = p.distanceTo(pvpCenter);
        if (d > maxDist) maxDist = d;
      }

      // Tight padding — just enough to visually wrap the outermost M-type
      const pvpRadius = maxDist + 0.05;

      const zoneGeo = new THREE.SphereGeometry(pvpRadius, 32, 32);
      const zoneMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
      zoneMesh.position.copy(pvpCenter);
      scene.add(zoneMesh);

      // Zone wireframe
      const wireGeo = new THREE.SphereGeometry(pvpRadius, 16, 16);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      wireMesh.position.copy(pvpCenter);
      scene.add(wireMesh);
    }

    // ─── Raycaster ───
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: mobile ? 0.3 : 0.1 };
    const mouse = new THREE.Vector2();

    // Track drag vs click
    let pointerDownPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      // Dismiss touch hint on first interaction
      if (!hintDismissed.current) {
        hintDismissed.current = true;
        setShowHint(false);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    const onClick = (e: MouseEvent) => {
      // Ignore if the user dragged (panned/rotated)
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (dx * dx + dy * dy > 25) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(poiMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const poiId = hit.userData.poiId as string;
        const poi = pois.find((p) => p._id === poiId);
        if (poi) {
          if (selectedRef.current === poiId) {
            selectedRef.current = null;
            setSelectedPoi(null);
          } else {
            selectedRef.current = poiId;
            setSelectedPoi(poi);
          }
        }
      } else {
        // Only deselect on a deliberate click on empty space
        // (drag detection above already filters out pans)
        selectedRef.current = null;
        setSelectedPoi(null);
      }
    };

    renderer.domElement.addEventListener("click", onClick);

    // ─── Hover cursor ───
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(poiMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);
      renderer.domElement.style.cursor =
        intersects.length > 0 ? "pointer" : "grab";
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // ─── Animation loop ───
    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      controls.update();

      // Billboard rings toward camera
      for (const [, ring] of poiRings) {
        ring.lookAt(camera.position);
      }

      // Pulse selected POI
      if (selectedRef.current) {
        const mesh = poiMeshes.get(selectedRef.current);
        const ring = poiRings.get(selectedRef.current);
        if (mesh) {
          const s = 1 + Math.sin(t * 4) * 0.15;
          mesh.scale.setScalar(s);
        }
        if (ring) {
          (ring.material as THREE.MeshBasicMaterial).opacity =
            0.3 + Math.sin(t * 3) * 0.2;
        }
      }

      // Gentle station glow pulse
      for (const poi of pois) {
        if (poi.category === "station" && poi._id !== selectedRef.current) {
          const mesh = poiMeshes.get(poi._id);
          if (mesh) {
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
              0.4 + Math.sin(t * 1.5) * 0.2;
          }
        }
      }

      // ─── Space environment animation ───

      // Cosmic dust drift — counter-rotating layers
      if (dustLayers[0]) {
        dustLayers[0].rotation.y += 0.00015;
        dustLayers[0].rotation.x += 0.00003;
      }
      if (dustLayers[1]) {
        dustLayers[1].rotation.y -= 0.00012;
        dustLayers[1].rotation.x -= 0.00004;
      }

      // Nebula micro-rotation
      for (const ns of nebulaSprites) {
        ns.material.rotation += 0.00008;
      }

      // Bright-star shimmer
      brightMat.opacity = 0.7 + Math.sin(t * 0.6) * 0.15;

      // Planet halo breathing
      for (let i = 0; i < haloSprites.length; i++) {
        const ps = haloSprites[i];
        ps.material.opacity = 0.5 + Math.sin(t * 0.4 + i * 1.7) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize ───
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ─── Store refs ───
    sceneDataRef.current = {
      renderer,
      scene,
      camera,
      controls,
      raycaster,
      mouse,
      poiMeshes,
      poiRings,
      labelSprites,
      animId,
    };

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pois]);

  /* ── Filter visibility ── */
  useEffect(() => {
    const data = sceneDataRef.current;
    if (!data) return;

    for (const poi of pois) {
      const visible =
        activeFilters.size === 0 || activeFilters.has(poi.category);
      const mesh = data.poiMeshes.get(poi._id);
      const ring = data.poiRings.get(poi._id);
      const label = data.labelSprites.get(poi._id);
      if (mesh) mesh.visible = visible;
      if (ring) ring.visible = visible;
      if (label) label.visible = visible;
    }
  }, [activeFilters, pois]);

  /* ── Legend entries (only categories present in data) ── */
  const legendItems = categories.map((cat) => ({
    cat,
    label: CAT_LABELS[cat] ?? cat,
    color: "#" + new THREE.Color(getCatColor(cat)).getHexString(),
  }));

  return (
    <div ref={mapContainerRef} className={styles.mapContainer}>
      {/* 3D canvas mount point */}
      <div ref={containerRef} className={styles.canvasWrap} />

      {/* ── Touch hint overlay (mobile only) ── */}
      {isMobile && showHint && (
        <div className={styles.touchHint}>
          Pinch to zoom · Tap a POI
        </div>
      )}

      {/* ── Legend (collapsible on mobile) ── */}
      <div
        className={`${styles.legend} ${legendOpen ? styles.legendExpanded : ""}`}
      >
        {isMobile && (
          <button
            className={styles.legendToggle}
            onClick={() => setLegendOpen((o) => !o)}
            aria-label={legendOpen ? "Collapse legend" : "Expand legend"}
          >
            <span className={styles.legendToggleLabel}>Legend</span>
            <span className={styles.legendToggleIcon}>
              {legendOpen ? "▾" : "▸"}
            </span>
          </button>
        )}
        {(!isMobile || legendOpen) &&
          legendItems.map((item) => (
            <div key={item.cat} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              {item.label}
            </div>
          ))}
      </div>

      {/* ── Detail panel ── */}
      {selectedPoi && (
        <AsteroidStatsCard
          key={selectedPoi._id}
          poi={selectedPoi}
          onClose={() => {
            selectedRef.current = null;
            setSelectedPoi(null);
          }}
        />
      )}
    </div>
  );
}
