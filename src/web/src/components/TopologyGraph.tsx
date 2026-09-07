import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RESEARCH } from "@/config";
import { attachTopologyGraph } from "@/lib/topology-graph";

export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const nodeCount = RESEARCH.length;

  useLayoutEffect(() => {
    setHero(stageRef.current?.closest<HTMLElement>(".hero") ?? null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    return attachTopologyGraph(canvas, stage);
  }, [hero]);

  const canvas = (
    <canvas
      ref={canvasRef}
      className="topo-canvas"
      role="img"
      aria-label="DSLab research topology: DSRL at the center, connected to six research areas that are also linked to each other. Drag to rotate, or drag a node to nudge it."
    />
  );

  return (
    <div className="topo">
      {hero ? createPortal(canvas, hero) : canvas}
      <div ref={stageRef} className="topo-stage" aria-hidden="true" />
      <p className="topo-caption">
        <span dir="ltr" className="t-mono">{nodeCount}</span>
        {" "}
        research nodes around DSRL
      </p>
    </div>
  );
}
