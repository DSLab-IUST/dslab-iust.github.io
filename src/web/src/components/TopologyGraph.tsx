import type { CSSProperties } from "react";
import { RESEARCH } from "@/config";

const ORIGIN = { x: 540, y: 540 } as const;

const GUIDE_ARCS = [
  "M 319 540 A 221 221 0 0 1 761 540",
  "M 186 540 A 354 354 0 0 1 894 540",
  "M 48 540 A 492 492 0 0 1 1032 540",
] as const;

const GUIDE_RAYS = [
  "M 540 540 L 87.11 347.76",
  "M 540 540 L 192.10 192.10",
  "M 540 540 L 352.51 85.12",
  "M 540 540 L 540.00 48.00",
  "M 540 540 L 992.89 347.76",
  "M 540 540 L 887.90 192.10",
  "M 540 540 L 727.49 85.12",
] as const;

const SATELLITE_SLOTS = [
  { x: 215.98, y: 402.46, dur: "2.38s", delay: "0.00s" },
  { x: 192.1, y: 192.1, dur: "3.32s", delay: "0.42s" },
  { x: 540, y: 48, dur: "3.32s", delay: "0.84s" },
  { x: 887.9, y: 192.1, dur: "3.32s", delay: "1.26s" },
  { x: 864.02, y: 402.46, dur: "2.38s", delay: "1.68s" },
] as const;

const HUB_SHORT = "DIST";
const FLOWS = RESEARCH.filter((item) => item.short !== HUB_SHORT).map((item, index) => ({
  id: item.short,
  ...SATELLITE_SLOTS[index],
}));

function labelLayout(x: number, y: number) {
  const dx = x - ORIGIN.x;
  const dy = y - ORIGIN.y;
  const dist = Math.hypot(dx, dy) || 1;
  const outward = 38;

  if (Math.abs(dx) < 12) {
    return { x: x + 30, y: y + 4, anchor: "start" as const };
  }

  return {
    x: x + (dx / dist) * outward,
    y: y + (dy / dist) * outward,
    anchor: (dx < 0 ? "end" : "start") as "end" | "start",
  };
}

export function TopologyGraph() {
  const nodeCount = FLOWS.length + 1;

  return (
    <div className="topo">
      <div className="topo-stage">
        <svg
          className="topo-svg absolute inset-0 size-full"
          viewBox="0 0 1080 620"
          fill="none"
          strokeWidth={1}
          role="img"
          aria-labelledby="topo-title"
        >
          <title id="topo-title">DSLab research topology: six connected research areas</title>
          <g className="topo-guide">
            {GUIDE_ARCS.map((d) => (
              <path key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
            {GUIDE_RAYS.map((d) => (
              <path key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
            <path d="M 0 540 H 1080" vectorEffect="non-scaling-stroke" />
          </g>
          {FLOWS.map((flow) => {
            const d = `M ${flow.x} ${flow.y} L ${ORIGIN.x} ${ORIGIN.y}`;
            return (
              <g key={`flow-${flow.id}`}>
                <path className="topo-flow-track" d={d} vectorEffect="non-scaling-stroke" />
                <path
                  className="topo-flow"
                  d={d}
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    ["--topo-dur" as string]: flow.dur,
                    ["--topo-delay" as string]: flow.delay,
                  } as CSSProperties}
                />
              </g>
            );
          })}
          {FLOWS.map((flow, index) => {
            const label = labelLayout(flow.x, flow.y);
            return (
              <g
                key={`node-${flow.id}`}
                className="topo-node"
                style={{ ["--delay" as string]: `${index * 90 + 180}ms` } as CSSProperties}
                transform={`translate(${flow.x} ${flow.y})`}
              >
                <circle className="topo-node-ring" r="16" />
                <circle className="topo-node-core" r="5" />
                <text
                  className="topo-node-label"
                  x={label.x - flow.x}
                  y={label.y - flow.y}
                  dy="0.35em"
                  textAnchor={label.anchor}
                >
                  {flow.id}
                </text>
              </g>
            );
          })}
          <g
            className="topo-node topo-node-hub"
            style={{ ["--delay" as string]: `${FLOWS.length * 90 + 180}ms` } as CSSProperties}
            transform={`translate(${ORIGIN.x} ${ORIGIN.y})`}
          >
            <circle className="topo-node-ring" r="22" />
            <circle className="topo-node-core" r="6.5" />
            <text className="topo-node-label" x="0" y="36" textAnchor="middle">
              {HUB_SHORT}
            </text>
          </g>
        </svg>
      </div>
      <p className="topo-caption">
        <span dir="ltr" className="t-mono">{nodeCount}</span>
        {" "}
        research nodes, a partially connected graph
      </p>
    </div>
  );
}
