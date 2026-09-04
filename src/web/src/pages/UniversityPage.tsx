import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks, FaqList } from "@/components/EntityPage";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { memberPath } from "@/lib/members";
import { Link } from "@/lib/router";
import { universityFaqs, universityGraph } from "@/lib/schema";
import { PATHS, universityMeta } from "@/lib/site";

export function UniversityPage() {
  const { members } = useLab();
  const director = members.find((member) => member.leadership === "director");
  const meta = universityMeta();

  return (
    <>
      <Seo meta={meta} jsonLd={universityGraph(members)} />
      <Header />
      <main>
        <header className="entity-hero chrome-band">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: LAB.university },
            ]} />
            <span className="eyebrow"><span className="pulse-dot" /> Public research university · Tehran</span>
            <h1>{LAB.university}</h1>
            <p className="entity-lead">
              <strong>{LAB.universityShort}</strong>
              {" — "}
              {LAB.universityFa}
              {" — hosts "}
              <Link to={PATHS.lab}>{LAB.fullName} ({LAB.name})</Link>
              {" in the "}
              {LAB.school}
              {" ("}
              {LAB.schoolFa}
              {"). The lab is directed by "}
              {director
                ? <Link to={memberPath(director.name)}>{director.name}</Link>
                : LAB.director}
              .
            </p>
          </div>
        </header>

        <div className="section-shell entity-body">
          <dl className="entity-facts">
            <div>
              <dt>English name</dt>
              <dd>{LAB.university} ({LAB.universityShort})</dd>
            </div>
            <div>
              <dt>Persian name</dt>
              <dd lang="fa">{LAB.universityFa}</dd>
            </div>
            <div>
              <dt>School</dt>
              <dd>{LAB.school} · {LAB.schoolFa}</dd>
            </div>
            <div>
              <dt>On-campus lab</dt>
              <dd>
                <Link to={PATHS.lab}>{LAB.fullName}</Link>
                {" / "}
                {LAB.nameFa}
              </dd>
            </div>
            <div>
              <dt>Campus</dt>
              <dd>{LAB.address.slice(1).join(", ")}</dd>
            </div>
          </dl>

          <section>
            <h2>Why this page exists</h2>
            <p>
              Search and answer engines often look up {LAB.university}, {LAB.universityFa},
              and {LAB.universityShort} separately from the lab. This page states the
              relationship in plain language: {LAB.name} is the {LAB.fullName} inside the
              {" "}{LAB.school} at {LAB.university}, directed by {LAB.director}.
            </p>
          </section>

          <div className="entity-actions">
            <a className="button button-primary" href={LAB.universityUrl} target="_blank" rel="noreferrer">
              IUST website <Icon name="external-link" />
            </a>
            <a className="button button-soft" href={LAB.schoolUrl} target="_blank" rel="noreferrer">
              Computer Engineering <Icon name="external-link" />
            </a>
            <Link className="button button-soft" to={PATHS.lab}>
              {LAB.name} <Icon name="arrow-up-right" />
            </Link>
          </div>

          <FaqList items={universityFaqs()} />
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
