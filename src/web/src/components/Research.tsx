import { Icon } from "@/components/icons";
import { RESEARCH } from "@/config";
import { Link } from "@/lib/router";
import { PATHS } from "@/lib/site";

const PREVIEW_COUNT = 3;

export function Research({ preview = false }: { preview?: boolean }) {
  const items = preview ? RESEARCH.slice(0, PREVIEW_COUNT) : RESEARCH;

  return (
    <section className="research section-shell" id="research">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Research</span>
          <h2>Six connected problem spaces.</h2>
        </div>
        <p>All areas are pursued as distributed systems work: how to engineer system software that meets the requirements of such systems.</p>
      </div>
      <div className="research-list">
        {items.map((item) => (
          <article key={item.short} className="research-row">
            <span className="research-code" dir="ltr">{item.short}</span>
            <div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
      {preview ? (
        <div className="research-more">
          <Link className="button button-soft" to={PATHS.research}>
            More <Icon name="arrow-up-right" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
