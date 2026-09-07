import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks, FaqList } from "@/components/EntityPage";
import { LAB, RESEARCH } from "@/config";
import { useLab } from "@/context/LabContext";
import { memberPath } from "@/lib/members";
import { Link } from "@/lib/router";
import { labFaqs, labGraph } from "@/lib/schema";
import { PATHS, labMeta } from "@/lib/site";

export function LabPage() {
  const { members } = useLab();
  const director = members.find((member) => member.leadership === "director");
  const meta = labMeta();

  return (
    <>
      <Seo meta={meta} jsonLd={labGraph(members)} />
      <Header />
      <main>
        <header className="entity-hero">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: LAB.fullName },
            ]} />
            <span className="eyebrow"><span className="pulse-dot" /> Research laboratory · {LAB.universityShort}</span>
            <h1>{LAB.fullName}</h1>
            <p className="entity-lead">
              <strong>{LAB.name}</strong>
              {" is the Distributed Systems Research Laboratory at the "}
              <a href={LAB.schoolUrl} target="_blank" rel="noreferrer">{LAB.school}</a>
              {", "}
              <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>
              {". Directed by "}
              {director
                ? <Link to={memberPath(director.name)}>{director.name}</Link>
                : LAB.director}
              {` since ${LAB.foundingYear}.`}
            </p>
          </div>
        </header>

        <div className="section-shell entity-body">
          <dl className="entity-facts">
            <div>
              <dt>Official names</dt>
              <dd>{LAB.fullName}; {LAB.name}</dd>
            </div>
            <div>
              <dt>Director</dt>
              <dd>
                {director
                  ? <Link to={memberPath(director.name)}>{director.name}</Link>
                  : LAB.director}
              </dd>
            </div>
            <div>
              <dt>Home university</dt>
              <dd>
                <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>
                {" · "}
                {LAB.universityShort}
              </dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{LAB.address.join(", ")}. Postal code {LAB.postalCode}.</dd>
            </div>
          </dl>

          <section>
            <div className="subheading-row">
              <h2>What the lab studies</h2>
              <span>Six connected problem spaces.</span>
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
            <Link className="button button-soft" to={PATHS.research}>
              Full research page <Icon name="arrow-up-right" />
            </Link>
          </section>

          <section>
            <div className="subheading-row">
              <h2>People</h2>
              <span>{members.length} named researchers on this site.</span>
            </div>
            <ul className="entity-name-list">
              {members.map((member) => (
                <li key={member.name}>
                  <Link to={memberPath(member.name)}>{member.name}</Link>
                  <span>{member.role}</span>
                </li>
              ))}
            </ul>
            <Link className="button button-soft" to={PATHS.people}>
              Full directory <Icon name="arrow-up-right" />
            </Link>
          </section>

          <div className="entity-actions">
            <a className="button button-primary" href={LAB.dslabPage} target="_blank" rel="noreferrer">
              Faculty lab page <Icon name="external-link" />
            </a>
            <a className="button button-soft" href={LAB.github} target="_blank" rel="noreferrer">
              GitHub <Icon name="github" />
            </a>
            <a className="button button-soft" href={`mailto:${LAB.email}`}>
              Email <Icon name="mail" />
            </a>
          </div>

          <FaqList items={labFaqs()} />
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
