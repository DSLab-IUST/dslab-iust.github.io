import { RESEARCH } from "@/config";

export function Research() {
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
        {RESEARCH.map((item) => (
          <article key={item.short} className="research-row">
            <span className="research-code" dir="ltr">{item.short}</span>
            <div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
