import { Icon } from "@/components/icons";
import { WorkTags, WorkTeam } from "@/components/WorkTeam";
import { useLab } from "@/context/LabContext";
import { safeUrl, statusKind } from "@/lib/format";

export function NowBuilding() {
  const { labWork, loading } = useLab();
  const items = labWork.currentWork ?? [];

  return (
    <section className="activity-section section-shell" id="activity">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Now building</span>
          <h2>Active research threads.</h2>
        </div>
        <p>Directions the lab is pursuing, drawn from the official DSLab research agenda: kernelware, ExaScale middleware, distributed CEP, and cloud virtualization.</p>
      </div>
      <div className="now-building-grid">
        {loading ? (
          <>
            <div className="work-loading-card" />
            <div className="work-loading-card" />
          </>
        ) : items.length ? items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="now-card">
            <div className="work-card-top">
              <span className={`work-status status-${statusKind(item.status)}`}>{item.status || "In progress"}</span>
              <span className="work-index" dir="ltr">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="now-card-main">
              <h3>{item.title || "Untitled research thread"}</h3>
              <p>{item.description || "Add a short description in data/current-work.json."}</p>
              <WorkTags tags={item.tags} limit={5} />
            </div>
            <WorkTeam memberRefs={item.members} />
          </article>
        )) : (
          <article className="empty-work-card">
            <Icon name="sparkles" />
            <div>
              <strong>Add what DSLab is building now</strong>
              <span>Edit <code>data/current-work.json</code> and add work items to the list.</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export function Projects() {
  const { labWork, loading } = useLab();
  const items = labWork.projects ?? [];

  return (
    <section className="projects section-shell" id="projects">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Publications</span>
          <h2>Selected papers from the lab.</h2>
        </div>
        <p>Recent journal and conference papers listed on Prof. Sharifi’s faculty page, with DOIs when they are available.</p>
      </div>
      <div className="project-grid">
        {loading ? (
          <>
            <div className="work-loading-card" />
            <div className="work-loading-card" />
            <div className="work-loading-card" />
          </>
        ) : items.length ? items.map((item, index) => {
          const links = (item.links ?? [])
            .map((link) => ({ ...link, href: safeUrl(link.url) }))
            .filter((link) => link.href);

          return (
            <article key={`${item.title}-${index}`} className="project-card curated-project">
              <div className="work-card-top">
                <span className="project-type">{item.type || "Research project"}</span>
                <span className="work-index" dir="ltr">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="project-title-row">
                <h3>{item.title || "Untitled project"}</h3>
                <span className={`project-status status-${statusKind(item.status)}`}>{item.status || "In progress"}</span>
              </div>
              <p>{item.description || "Add a project description in data/projects.json."}</p>
              <WorkTags tags={item.tags} />
              <div className="project-bottom">
                <WorkTeam memberRefs={item.members} compact />
                {links.length ? (
                  <div className="project-links">
                    {links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        <Icon name={link.icon || "external-link"} />
                        {link.label || "Open"}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        }) : (
          <article className="empty-work-card">
            <Icon name="folder-kanban" />
            <div>
              <strong>Add selected DSLab projects</strong>
              <span>Edit <code>data/projects.json</code> and add project entries to the list.</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
