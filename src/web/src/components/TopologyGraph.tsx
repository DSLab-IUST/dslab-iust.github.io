import { useEffect, useRef } from "react";
import { RESEARCH } from "@/config";
import { attachTopologyGraph } from "@/lib/topology-graph";

export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeCount = RESEARCH.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return attachTopologyGraph(canvas);
  }, []);

  return (
    <div className="topo">
      <div className="topo-stage">
        <canvas
          ref={canvasRef}
          className="topo-canvas absolute inset-0 size-full"
          role="img"
          aria-label="DSLab research topology: DSRL at the center, connected to six research areas that are also linked to each other. Drag to rotate, or drag a node to nudge it."
        />
      </div>
      <p className="topo-caption">
        <span dir="ltr" className="t-mono">{nodeCount}</span>
        {" "}
        research nodes around DSRL
      </p>
    </div>
  );
}
