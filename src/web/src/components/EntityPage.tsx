import { useId, useState } from "react";
import { LAB } from "@/config";
import { enterDelay } from "@/lib/motion";
import { Link } from "@/lib/router";
import { PATHS } from "@/lib/site";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="entity-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href && index < items.length - 1
              ? <Link to={item.href}>{item.label}</Link>
              : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FaqItem({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`faq-item enter${open ? " is-open" : ""}`} style={enterDelay(index, "rows")}>
      <dt>
        <button
          type="button"
          className="faq-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{item.question}</span>
          <span className="faq-marker" aria-hidden="true" />
        </button>
      </dt>
      <dd id={panelId} inert={!open}>
        <div className="faq-answer">
          <p className="faq-answer-body">{item.answer}</p>
        </div>
      </dd>
    </div>
  );
}

export function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="entity-faq" aria-labelledby="faq-heading">
      <div className="subheading-row enter">
        <h2 id="faq-heading">Questions people ask</h2>
        <span>Short answers for search and assistants.</span>
      </div>
      <dl>
        {items.map((item, index) => (
          <FaqItem key={item.question} item={item} index={index} />
        ))}
      </dl>
    </section>
  );
}

export function EntityLinks() {
  return (
    <div className="entity-related">
      <Link to={PATHS.lab}>{LAB.fullName}</Link>
      <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>
      <Link to={PATHS.research}>Research</Link>
      <Link to={PATHS.publications}>Publications</Link>
      <Link to={PATHS.people}>People directory</Link>
    </div>
  );
}
