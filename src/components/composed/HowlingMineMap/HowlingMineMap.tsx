/* ═══════════════════════════════════════════════════════════════════════════
   HowlingMineMap — 3D interactive area map for CMS-driven POIs
   Raw Three.js — orbit controls, POI spheres, sprite labels, starfield
   ═══════════════════════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Copy, Check, X, ShieldAlert } from "lucide-react";
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
  landmark: "Landmark",
  "pvp-zone": "PVP Zone",
  "safe-zone": "Safe Zone",
};

function getCatColor(cat: string): number {
  return CAT_COLORS[cat] ?? 0x888888;
}

function formatCoord(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
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
  canvas.width = 512;
  canvas.height = 128;

  ctx.font = `bold ${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 64);

  // Crisp pass
  ctx.shadowBlur = 0;
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.6, 0.4, 1);
  return sprite;
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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const selectedRef = useRef<string | null>(null);

  /* ── Copy ── */
  const copyValue = useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      /* noop */
    }
  }, []);

  const copyAll = useCallback(() => {
    if (!selectedPoi) return;
    const txt = `/wp [${selectedPoi.name}, ${formatCoord(selectedPoi.euX)}, ${formatCoord(selectedPoi.euY)}, ${formatCoord(selectedPoi.euZ)}]`;
    copyValue("all", txt);
  }, [selectedPoi, copyValue]);

  /* ── Filter ── */
  const categories = Array.from(new Set(pois.map((p) => p.category))).sort();

  const toggleFilter = (cat: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

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

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x050508, 1);
    container.appendChild(renderer.domElement);

    // ─── Scene ───
    const scene = new THREE.Scene();

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050508, 0.06);

    // Ambient + directional
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const dirLight = new THREE.DirectionalLight(0xeab308, 0.3);
    dirLight.position.set(5, 8, 3);
    scene.add(dirLight);

    // ─── Camera ───
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.01,
      200,
    );
    camera.position.set(0, 6, 8);

    // ─── Controls ───
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.target.set(0, 0, 0);

    // ─── Starfield ───
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ─── Reference grid (subtle) ───
    const gridHelper = new THREE.GridHelper(12, 24, 0x1a1a10, 0x1a1a10);
    gridHelper.position.y = -2;
    (gridHelper.material as THREE.Material).opacity = 0.3;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // ─── POI meshes ───
    const poiMeshes = new Map<string, THREE.Mesh>();
    const poiRings = new Map<string, THREE.Mesh>();
    const labelSprites = new Map<string, THREE.Sprite>();

    for (const poi of pois) {
      const pos = euToThree(poi.euX, poi.euY, poi.euZ, center, scale);
      const color = getCatColor(poi.category);
      const isStation = poi.category === "station";
      const radius = isStation ? 0.12 : 0.06;

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
    }

    // ─── M-Type PVP zone sphere ───
    const mPois = pois.filter((p) => p.category === "asteroid-m");
    if (mPois.length > 1) {
      let cx = 0,
        cy = 0,
        cz = 0;
      for (const m of mPois) {
        cx += m.euX;
        cy += m.euY;
        cz += m.euZ;
      }
      cx /= mPois.length;
      cy /= mPois.length;
      cz /= mPois.length;
      const pvpCenter = euToThree(cx, cy, cz, center, scale);

      // Find max distance from center for radius
      let maxDist = 0;
      for (const m of mPois) {
        const p = euToThree(m.euX, m.euY, m.euZ, center, scale);
        const d = p.distanceTo(pvpCenter);
        if (d > maxDist) maxDist = d;
      }

      const zoneGeo = new THREE.SphereGeometry(maxDist + 0.3, 32, 32);
      const zoneMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
      zoneMesh.position.copy(pvpCenter);
      scene.add(zoneMesh);

      // Zone wireframe
      const wireGeo = new THREE.SphereGeometry(maxDist + 0.3, 16, 16);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
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
    raycaster.params.Points = { threshold: 0.1 };
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
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
    <div className={styles.mapContainer}>
      {/* 3D canvas mount point */}
      <div ref={containerRef} className={styles.canvasWrap} />

      {/* ── Filter chips ── */}
      {categories.length > 1 && (
        <div className={styles.filterBar}>
          {categories.map((cat) => {
            const active = activeFilters.size === 0 || activeFilters.has(cat);
            const color =
              "#" + new THREE.Color(getCatColor(cat)).getHexString();
            return (
              <button
                key={cat}
                className={`${styles.filterChip} ${active ? styles.filterChipActive : ""}`}
                onClick={() => toggleFilter(cat)}
                style={active ? { borderColor: color, color } : undefined}
              >
                {CAT_LABELS[cat] ?? cat}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Legend ── */}
      <div className={styles.legend}>
        {legendItems.map((item) => (
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
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <span className={styles.detailName}>{selectedPoi.name}</span>
            <button
              className={styles.detailClose}
              onClick={() => {
                selectedRef.current = null;
                setSelectedPoi(null);
              }}
            >
              <X size={16} />
            </button>
          </div>

          <span className={styles.detailCategory}>
            {CAT_LABELS[selectedPoi.category] ?? selectedPoi.category}
          </span>

          {selectedPoi.pvpLootable && (
            <span className={styles.pvpBadge}>
              <ShieldAlert size={12} /> PVP Lootable
            </span>
          )}

          {selectedPoi.description && (
            <p className={styles.detailDesc}>{selectedPoi.description}</p>
          )}

          {(
            [
              ["X", selectedPoi.euX],
              ["Y", selectedPoi.euY],
              ["Z", selectedPoi.euZ],
            ] as [string, number][]
          ).map(([axis, val]) => (
            <div key={axis} className={styles.coordRow}>
              <span className={styles.coordLabel}>{axis}</span>
              <span className={styles.coordValue}>{formatCoord(val)}</span>
              <button
                className={`${styles.copyBtn} ${copiedField === axis ? styles.copied : ""}`}
                onClick={() => copyValue(axis, String(val))}
                title={`Copy ${axis}`}
              >
                {copiedField === axis ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          ))}

          <button
            className={`${styles.copyAllBtn} ${copiedField === "all" ? styles.copied : ""}`}
            onClick={copyAll}
          >
            {copiedField === "all" ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Waypoint
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
