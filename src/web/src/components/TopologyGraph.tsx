import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RESEARCH } from "@/config";
import { attachTopologyGraph } from "@/lib/topology-graph";

const HERO_BLEED_MQ = "(min-width: 981px)";

export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [bleed, setBleed] = useState(false);
  const nodeCount = RESEARCH.length;

  useLayoutEffect(() => {
    const mq = window.matchMedia(HERO_BLEED_MQ);
    const sync = () => setBleed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    setHero(stageRef.current?.closest<HTMLElement>(".hero") ?? null);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    return attachTopologyGraph(canvas, stage);
  }, [bleed, hero]);

  const canvas = (
    <canvas
      ref={canvasRef}
      className="topo-canvas"
      role="img"
      aria-label="DSLab research topology: DSRL at the center, connected to six research areas that are also linked to each other. Drag to rotate, or drag a node to nudge it."
    />
  );

  const portalHost = bleed ? hero : null;

  return (
    <div className="topo">
      <div className="topo-frame">
        {portalHost ? createPortal(canvas, portalHost) : canvas}
        <div ref={stageRef} className="topo-stage" aria-hidden="true" />
      </div>
      <p className="topo-caption">
        <span dir="ltr" className="t-mono">{nodeCount}</span>
        {" "}
        research nodes around DSRL
      </p>
    </div>
  );
}
