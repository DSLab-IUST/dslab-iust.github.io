import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { RESEARCH } from "@/config";
import { enterDelay } from "@/lib/motion";
import { Link } from "@/lib/router";
import { PATHS } from "@/lib/site";

const PREVIEW_COUNT = 3;
const EXPAND_LIMIT = 6;

type ResearchItem = (typeof RESEARCH)[number];

function ResearchRow({
  item,
  index,
  enter = false,
  style,
}: {
  item: ResearchItem;
  index: number;
  enter?: boolean;
  style?: CSSProperties;
}) {
  return (
    <article
      className={enter ? "research-row enter" : "research-row"}
      style={enter ? enterDelay(index, "rows") : style}
    >
      <span className="research-code" dir="ltr">{item.short}</span>
      <div>
        <h3>{item.name}</h3>
        <p>{item.text}</p>
      </div>
    </article>
  );
}

export function Research({ preview = false }: { preview?: boolean }) {
  const extraId = useId();
  const extraInnerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [extraHeight, setExtraHeight] = useState(0);
  const visible = preview ? RESEARCH.slice(0, PREVIEW_COUNT) : RESEARCH;
  const extra = preview ? RESEARCH.slice(PREVIEW_COUNT, EXPAND_LIMIT) : [];
  const canExpand = extra.length > 0;

  useLayoutEffect(() => {
    const el = extraInnerRef.current;
    if (!el) return;

    const measure = () => setExtraHeight(el.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [canExpand]);

  return (
    <section className="research section-shell" id="research">
      <div className="section-heading enter">
        <div>
          <span className="section-kicker">Research</span>
          <h2>Six connected problem spaces.</h2>
        </div>
        <p>All areas are pursued as distributed systems work: how to engineer system software that meets the requirements of such systems.</p>
      </div>
      <div className="research-list">
        {visible.map((item, index) => (
          <ResearchRow key={item.short} item={item} index={index} enter />
        ))}
        {canExpand ? (
          <div
            className={`research-extra${expanded ? " is-open" : ""}`}
            id={extraId}
            role="region"
            aria-label="More research areas"
            aria-hidden={!expanded}
            inert={!expanded}
            style={{ "--research-extra-height": `${extraHeight}px` } as CSSProperties}
          >
            <div className="research-extra-inner" ref={extraInnerRef}>
              {extra.map((item, index) => (
                <ResearchRow
                  key={item.short}
                  item={item}
                  index={PREVIEW_COUNT + index}
                  style={{ "--research-stagger": `${80 + index * 110}ms` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {canExpand ? (
        <div className="research-more">
          <button
            type="button"
            className="button button-soft research-toggle"
            aria-expanded={expanded}
            aria-controls={extraId}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Collapse" : "More"}
            <Icon name="chevron-down" />
          </button>
          {expanded ? (
            <Link className="button button-soft research-full-detail" to={PATHS.research}>
              Full detail <Icon name="arrow-up-right" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
