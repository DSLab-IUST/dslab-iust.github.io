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

export function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="entity-faq" aria-labelledby="faq-heading">
      <div className="subheading-row enter">
        <h2 id="faq-heading">Questions people ask</h2>
        <span>Short answers for search and assistants.</span>
      </div>
      <dl>
        {items.map((item, index) => (
          <div key={item.question} className="faq-item enter" style={enterDelay(index, "rows")}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
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
