import { RESEARCH } from "@/config";

type Vec3 = { x: number; y: number; z: number };

type GraphNode = {
  id: string;
  hub: boolean;
  rest: Vec3;
  offset: Vec3;
  vel: Vec3;
  phase: number;
  freq: number;
  heldBob: Vec3 | null;
};

type Drag =
  | { kind: "none" }
  | { kind: "pending"; pointerId: number; x: number; y: number; pointerType: string }
  | { kind: "orbit"; pointerId: number; x: number; y: number; lastT: number }
  | {
      kind: "tug";
      pointerId: number;
      node: GraphNode;
      startX: number;
      startY: number;
      origin: Vec3;
      depthZ: number;
    };

type Palette = {
  fg: string;
  muted: string;
  quorum: string;
  track: string;
  packet: string;
};

const HUB_SHORT = "DSRL";
const PERSPECTIVE = 2.65;
const AUTO_SPIN = 0.2;
const DRAG_RANGE_PX = 78;
const SPRING = 46;
const DAMPING = 9.2;
const BOB = 0.036;
const PITCH_MIN = -0.58;
const PITCH_MAX = 0.66;

function satelliteSlots(count: number): Vec3[] {
  return Array.from({ length: count }, (_, index) => {
    const azimuth = (index / count) * Math.PI * 2 + 0.18;
    const elevation = Math.sin(index * 1.82 + 0.4) * 0.46;
    return {
      x: Math.cos(elevation) * Math.cos(azimuth),
      y: Math.sin(elevation),
      z: Math.cos(elevation) * Math.sin(azimuth),
    };
  });
}

function hexRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number) {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function palette(): Palette {
  const light = document.documentElement.dataset.theme === "light";
  if (light) {
    return {
      fg: "#10141f",
      muted: "#5b6478",
      quorum: "#d6a93b",
      track: "rgba(138,102,31,0.38)",
      packet: "#8a661f",
    };
  }
  return {
    fg: "#f5f6f8",
    muted: "#8b93a6",
    quorum: "#d6a93b",
    track: "rgba(214,169,59,0.22)",
    packet: "#d6a93b",
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function copy(v: Vec3): Vec3 {
  return { x: v.x, y: v.y, z: v.z };
}

function normalize(v: Vec3, radius: number): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  const s = radius / len;
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function createNodes(): GraphNode[] {
  const slots = satelliteSlots(RESEARCH.length);
  const nodes: GraphNode[] = [
    {
      id: HUB_SHORT,
      hub: true,
      rest: { x: 0, y: 0, z: 0 },
      offset: { x: 0, y: 0, z: 0 },
      vel: { x: 0, y: 0, z: 0 },
      phase: 0.4,
      freq: 0.7,
      heldBob: null,
    },
  ];

  RESEARCH.forEach((item, index) => {
    const slot = slots[index] ?? { x: 1, y: 0, z: 0 };
    nodes.push({
      id: item.short,
      hub: false,
      rest: normalize(slot, 1.08 + (index % 2) * 0.06),
      offset: { x: 0, y: 0, z: 0 },
      vel: { x: 0, y: 0, z: 0 },
      phase: index * 1.17,
      freq: 0.62 + index * 0.07,
      heldBob: null,
    });
  });

  return nodes;
}

function buildEdges(hub: GraphNode, satellites: GraphNode[]) {
  const edges: Array<{ a: GraphNode; b: GraphNode; spoke: boolean }> = satellites.map((node) => ({
    a: hub,
    b: node,
    spoke: true,
  }));
  const seen = new Set<string>();
  const link = (from: GraphNode | undefined, to: GraphNode | undefined) => {
    if (!from || !to || from === to) return;
    const key = from.id < to.id ? `${from.id}|${to.id}` : `${to.id}|${from.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ a: from, b: to, spoke: false });
  };
  for (let i = 0; i < satellites.length; i += 1) {
    link(satellites[i], satellites[(i + 1) % satellites.length]);
    link(satellites[i], satellites[(i + 2) % satellites.length]);
  }
  return edges;
}

function worldPoint(node: GraphNode, time: number, reduced: boolean): Vec3 {
  const bob = node.heldBob ?? (
    reduced
      ? { x: 0, y: 0, z: 0 }
      : {
          x: Math.sin(time * node.freq + node.phase) * BOB,
          y: Math.cos(time * node.freq * 0.86 + node.phase) * BOB,
          z: Math.sin(time * node.freq * 0.7 + node.phase + 1.1) * BOB * 0.8,
        }
  );

  return {
    x: node.rest.x + node.offset.x + bob.x,
    y: node.rest.y + node.offset.y + bob.y,
    z: node.rest.z + node.offset.z + bob.z,
  };
}

type Projected = { x: number; y: number; z: number; s: number };

function project(
  p: Vec3,
  rotX: number,
  rotY: number,
  cx: number,
  cy: number,
  zoom: number,
): Projected {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;
  const scale = PERSPECTIVE / (PERSPECTIVE - z2);
  return {
    x: cx + x1 * scale * zoom,
    y: cy + y2 * scale * zoom,
    z: z2,
    s: scale,
  };
}

function softenScreenDelta(dx: number, dy: number) {
  const dist = Math.hypot(dx, dy);
  if (dist < 0.0001) return { x: 0, y: 0 };
  const follow = DRAG_RANGE_PX * Math.tanh(dist / DRAG_RANGE_PX);
  const gain = follow / dist;
  return { x: dx * gain, y: dy * gain };
}

function screenDeltaToWorld(
  dx: number,
  dy: number,
  rotX: number,
  rotY: number,
  depthZ: number,
  zoom: number,
): Vec3 {
  const scale = PERSPECTIVE / (PERSPECTIVE - depthZ);
  const px = dx / (zoom * scale);
  const py = dy / (zoom * scale);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const z1 = -py * sinX;
  return {
    x: px * cosY + z1 * sinY,
    y: py * cosX,
    z: -px * sinY + z1 * cosY,
  };
}

function pointerXY(canvas: HTMLCanvasElement, event: PointerEvent) {
  const box = canvas.getBoundingClientRect();
  return { x: event.clientX - box.left, y: event.clientY - box.top };
}

export function attachTopologyGraph(canvas: HTMLCanvasElement) {
  const raw = canvas.getContext("2d", { alpha: true, desynchronized: true })
    ?? canvas.getContext("2d", { alpha: true });
  if (!raw) return () => undefined;
  const ctx = raw;

  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarseQuery = window.matchMedia("(pointer: coarse)");
  const nodes = createNodes();
  const hub = nodes[0];
  if (!hub) return () => undefined;
  const satellites = nodes.slice(1);
  const edges = buildEdges(hub, satellites);

  let colors = palette();
  let reduced = reducedQuery.matches;
  let drag: Drag = { kind: "none" };
  let yaw = 0.62;
  let pitchBase = 0.36;
  let yawVel = reduced ? 0 : AUTO_SPIN;
  let pitchVel = 0;
  let time = 0;
  let lastTs = 0;
  let raf = 0;
  let alive = true;
  let inView = true;
  let cssW = 0;
  let cssH = 0;
  let zoom = 120;
  let cx = 0;
  let cy = 0;
  let hoverNode: GraphNode | null = null;

  const projected = new Map<GraphNode, Projected>();

  function running() {
    return alive && inView && document.visibilityState === "visible";
  }

  function needsFrame() {
    if (!reduced) return true;
    if (drag.kind !== "none") return true;
    if (Math.abs(yawVel) > 0.002 || Math.abs(pitchVel) > 0.002) return true;
    return nodes.some((node) => (
      Math.hypot(node.offset.x, node.offset.y, node.offset.z) > 0.0006
      || Math.hypot(node.vel.x, node.vel.y, node.vel.z) > 0.0006
    ));
  }

  function ensureLoop() {
    if (!raf && running()) raf = requestAnimationFrame(frame);
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    cssW = Math.max(1, box.width);
    cssH = Math.max(1, box.height);
    const cap = coarseQuery.matches ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    const nextW = Math.round(cssW * dpr);
    const nextH = Math.round(cssH * dpr);
    if (canvas.width !== nextW) canvas.width = nextW;
    if (canvas.height !== nextH) canvas.height = nextH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = cssW * 0.5;
    cy = cssH * 0.52;
    zoom = Math.min(cssW, cssH) * 0.36;
  }

  function depthAlpha(z: number) {
    return clamp(0.38 + (z + 1.1) * 0.32, 0.28, 1);
  }

  function hitTest(x: number, y: number) {
    let best: GraphNode | null = null;
    let bestZ = -Infinity;
    for (const node of nodes) {
      const p = projected.get(node);
      if (!p) continue;
      const radius = (node.hub ? 20 : 13) * p.s + 10;
      if (Math.hypot(p.x - x, p.y - y) <= radius && p.z >= bestZ) {
        best = node;
        bestZ = p.z;
      }
    }
    return best;
  }

  function syncCursor() {
    canvas.classList.toggle("is-grabbing", drag.kind === "orbit" || drag.kind === "tug");
    canvas.classList.toggle("is-node", drag.kind === "tug" || (drag.kind === "none" && Boolean(hoverNode)));
  }

  function projectAll() {
    const pitch = pitchBase + (reduced || drag.kind !== "none" ? 0 : Math.sin(time * 0.34) * 0.045);
    projected.clear();
    for (const node of nodes) {
      projected.set(node, project(worldPoint(node, time, reduced), pitch, yaw, cx, cy, zoom));
    }
    return pitch;
  }

  function tick(dt: number) {
    if (drag.kind !== "orbit" && drag.kind !== "tug") {
      yaw += yawVel * dt;
      pitchBase += pitchVel * dt;
      pitchBase = clamp(pitchBase, PITCH_MIN, PITCH_MAX);
      const spinTarget = reduced ? 0 : AUTO_SPIN;
      yawVel += (spinTarget - yawVel) * (1 - Math.exp(-dt * 1.6));
      pitchVel += (0 - pitchVel) * (1 - Math.exp(-dt * 3.2));
    }

    for (const node of nodes) {
      if (drag.kind === "tug" && drag.node === node) continue;
      node.vel.x += (-SPRING * node.offset.x - DAMPING * node.vel.x) * dt;
      node.vel.y += (-SPRING * node.offset.y - DAMPING * node.vel.y) * dt;
      node.vel.z += (-SPRING * node.offset.z - DAMPING * node.vel.z) * dt;
      node.offset.x += node.vel.x * dt;
      node.offset.y += node.vel.y * dt;
      node.offset.z += node.vel.z * dt;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    projectAll();
    ctx.lineWidth = 1;

    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      if (!edge) continue;
      const pa = projected.get(edge.a);
      const pb = projected.get(edge.b);
      if (!pa || !pb) continue;
      const alpha = depthAlpha((pa.z + pb.z) * 0.5) * (edge.spoke ? 1 : 0.72);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = colors.track;
      ctx.lineWidth = edge.spoke ? 1.15 : 0.9;
      ctx.globalAlpha = alpha * (edge.spoke ? 0.95 : 0.7);
      ctx.stroke();

      if (!reduced && edge.spoke) {
        const t = (time * 0.22 + i * 0.13) % 1;
        const x = pa.x + (pb.x - pa.x) * t;
        const y = pa.y + (pb.y - pa.y) * t;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = colors.packet;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    const order = nodes.slice().sort((a, b) => {
      const pa = projected.get(a);
      const pb = projected.get(b);
      return (pa?.z ?? 0) - (pb?.z ?? 0);
    });

    for (const node of order) {
      const p = projected.get(node);
      if (!p) continue;
      const holding = drag.kind === "tug" && drag.node === node;
      const alpha = depthAlpha(p.z);
      const core = (node.hub ? 6.2 : 4.1) * p.s;
      const ring = (node.hub ? 17 : 11.5) * p.s;
      const glow = ring * 1.55;

      ctx.beginPath();
      ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
      ctx.fillStyle = rgba(colors.quorum, (holding ? 0.16 : 0.08) * alpha);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, ring, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(colors.quorum, (holding ? 0.7 : 0.38) * alpha);
      ctx.lineWidth = 1.15;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, core, 0, Math.PI * 2);
      ctx.fillStyle = node.hub ? colors.quorum : rgba(colors.fg, alpha);
      ctx.fill();

      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const outward = node.hub ? 22 * p.s : 16 * p.s;
      ctx.font = `500 ${Math.max(11, (node.hub ? 13.5 : 12.5) * Math.min(p.s, 1.25))}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = rgba(colors.muted, clamp(alpha + 0.15, 0.45, 1));
      ctx.textAlign = node.hub ? "center" : dx < 0 ? "end" : "start";
      ctx.textBaseline = "middle";
      ctx.fillText(
        node.id,
        node.hub ? p.x : p.x + (dx / dist) * outward,
        node.hub ? p.y + outward + 2 : p.y + (dy / dist) * outward * 0.35,
      );
    }
    ctx.globalAlpha = 1;
  }

  function frame(ts: number) {
    raf = 0;
    if (!running()) return;
    const dt = lastTs ? clamp((ts - lastTs) / 1000, 0, 0.032) : 0.016;
    lastTs = ts;
    if (!reduced || drag.kind !== "none") time += dt;
    tick(dt);
    draw();
    if (running() && needsFrame()) raf = requestAnimationFrame(frame);
  }

  function endDrag() {
    if (drag.kind === "tug") {
      drag.node.heldBob = null;
      drag.node.vel.x = 0;
      drag.node.vel.y = 0;
      drag.node.vel.z = 0;
    }
    drag = { kind: "none" };
    canvas.classList.remove("is-grabbing");
    if (!reduced && Math.abs(yawVel) < 0.04) yawVel = AUTO_SPIN;
    syncCursor();
    ensureLoop();
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const { x, y } = pointerXY(canvas, event);
    projectAll();
    const node = hitTest(x, y);
    if (node) {
      const bob = worldPoint(node, time, reduced);
      node.heldBob = {
        x: bob.x - node.rest.x - node.offset.x,
        y: bob.y - node.rest.y - node.offset.y,
        z: bob.z - node.rest.z - node.offset.z,
      };
      node.vel.x = 0;
      node.vel.y = 0;
      node.vel.z = 0;
      drag = {
        kind: "tug",
        pointerId: event.pointerId,
        node,
        startX: x,
        startY: y,
        origin: copy(node.offset),
        depthZ: projected.get(node)?.z ?? 0,
      };
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      syncCursor();
      ensureLoop();
      return;
    }

    drag = {
      kind: "pending",
      pointerId: event.pointerId,
      x,
      y,
      pointerType: event.pointerType,
    };
  }

  function onPointerMove(event: PointerEvent) {
    const { x, y } = pointerXY(canvas, event);

    if (drag.kind === "pending" && event.pointerId === drag.pointerId) {
      const dx = x - drag.x;
      const dy = y - drag.y;
      if (Math.hypot(dx, dy) < 8) return;
      if (drag.pointerType === "touch" && Math.abs(dy) > Math.abs(dx) * 1.15) {
        drag = { kind: "none" };
        return;
      }
      yawVel = 0;
      pitchVel = 0;
      drag = { kind: "orbit", pointerId: event.pointerId, x, y, lastT: performance.now() };
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      syncCursor();
      ensureLoop();
      return;
    }

    if (drag.kind === "orbit" && event.pointerId === drag.pointerId) {
      const dx = x - drag.x;
      const dy = y - drag.y;
      const now = performance.now();
      const dt = Math.max(8, now - drag.lastT);
      yaw += dx * 0.0052;
      pitchBase = clamp(pitchBase + dy * 0.0044, PITCH_MIN, PITCH_MAX);
      yawVel = clamp((dx / dt) * 5.4, -2.1, 2.1);
      pitchVel = clamp((dy / dt) * 3.8, -1.1, 1.1);
      drag.x = x;
      drag.y = y;
      drag.lastT = now;
      event.preventDefault();
      return;
    }

    if (drag.kind === "tug" && event.pointerId === drag.pointerId) {
      const pulled = softenScreenDelta(x - drag.startX, y - drag.startY);
      const world = screenDeltaToWorld(pulled.x, pulled.y, pitchBase, yaw, drag.depthZ, zoom);
      drag.node.offset.x = drag.origin.x + world.x;
      drag.node.offset.y = drag.origin.y + world.y;
      drag.node.offset.z = drag.origin.z + world.z;
      event.preventDefault();
      return;
    }

    if (drag.kind === "none") {
      hoverNode = hitTest(x, y);
      syncCursor();
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (drag.kind !== "none" && event.pointerId === drag.pointerId) endDrag();
  }

  function onPointerLeave() {
    if (drag.kind === "none") {
      hoverNode = null;
      syncCursor();
    }
  }

  function onTheme() {
    colors = palette();
    draw();
  }

  function onReduced() {
    reduced = reducedQuery.matches;
    if (reduced) {
      yawVel = 0;
      pitchVel = 0;
    } else if (drag.kind === "none") {
      yawVel = AUTO_SPIN;
    }
    ensureLoop();
  }

  function onVisibility() {
    lastTs = 0;
    if (running()) ensureLoop();
  }

  resize();
  draw();
  ensureLoop();

  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(canvas);

  const io = new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    lastTs = 0;
    if (inView) ensureLoop();
  }, { threshold: 0.08 });
  io.observe(canvas);

  const themeObs = new MutationObserver(onTheme);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("lostpointercapture", onPointerUp);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  reducedQuery.addEventListener("change", onReduced);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    themeObs.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("lostpointercapture", onPointerUp);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    reducedQuery.removeEventListener("change", onReduced);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
