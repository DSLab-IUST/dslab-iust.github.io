import { Icon } from "@/components/icons";
import { TopologyGraph } from "@/components/TopologyGraph";
import { LAB, RESEARCH } from "@/config";
import { useLab } from "@/context/LabContext";
import { formatNumber } from "@/lib/format";
import { memberPath } from "@/lib/members";
import { enterDelay } from "@/lib/motion";
import { Link } from "@/lib/router";

function StatsRibbon() {
  const { githubStats, members } = useLab();
  const students = members.filter((member) => member.leadership !== "director").length;
  const commits = Number(githubStats?.totalCommits || 0);
  const projects = Number(githubStats?.repoCount || 0);

  return (
    <div className="stats-ribbon">
      <article className="stat-card enter" style={enterDelay(0, "dense")}>
        <strong dir="ltr">{members.length ? formatNumber(students) : "—"}</strong>
        <span>Students</span>
      </article>
      <article className="stat-card enter" style={enterDelay(1, "dense")}>
        <strong dir="ltr">{formatNumber(RESEARCH.length)}</strong>
        <span>Research areas</span>
      </article>
      <article className="stat-card enter" style={enterDelay(2, "dense")}>
        <strong dir="ltr">{githubStats ? formatNumber(projects) : "—"}</strong>
        <span>Projects</span>
      </article>
      <article className="stat-card enter" style={enterDelay(3, "dense")}>
        <strong dir="ltr">{githubStats ? formatNumber(commits) : "—"}</strong>
        <span>Commits</span>
      </article>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero section-shell">
      <div className="hero-grid">
        <TopologyGraph />
        <div className="hero-copy">
          <h1>{LAB.fullName}</h1>
          <p className="hero-quote">
            “{LAB.quote}”
          </p>
          <p className="hero-description">
            The lab engineers system software for distributed computing, wireless sensor-actor networks, cloud environments, and computer security — with special focus on distributed operating systems and high-performance computing, at the{" "}
            <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/#research">
              View research <Icon name="arrow-down-right" />
            </a>
            <a className="button button-soft" href={LAB.github} target="_blank" rel="noreferrer">
              GitHub <Icon name="github" />
            </a>
          </div>
          <div className="micro-line">
            <span>
              Directed by{" "}
              <Link to={memberPath(LAB.director)}><strong>{LAB.director}</strong></Link>
              {" "}
              {/* <a className="button button-soft button-inline" href={LAB.homepage} target="_blank" rel="noreferrer">
                Faculty page <Icon name="external-link" />
              </a> */}
            </span>
            {/* <span>
              <a href={LAB.schoolUrl} target="_blank" rel="noreferrer">
                {LAB.school}, {LAB.universityShort}
              </a>
            </span> */}
          </div>
        </div>
      </div>
      <StatsRibbon />
    </section>
  );
}
