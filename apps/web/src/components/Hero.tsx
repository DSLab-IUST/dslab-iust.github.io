import { Icon } from "@/components/icons";
import { TopologyGraph } from "@/components/TopologyGraph";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { formatDate, formatNumber } from "@/lib/format";
import { coffeeStats } from "@/lib/stats";

function StatsRibbon() {
  const { githubStats } = useLab();
  const commits = Number(githubStats?.totalCommits || 0);
  const { coffees, coffeeRate, toNextCoffee } = coffeeStats(commits);

  return (
    <div className="stats-ribbon">
      <article className="stat-card">
        <strong dir="ltr">{githubStats ? formatNumber(commits) : "—"}</strong>
        <span>Total commits</span>
      </article>
      <article className="stat-card">
        <strong dir="ltr">{githubStats ? formatNumber(Number(githubStats.repoCount || 0)) : "—"}</strong>
        <span>Projects</span>
      </article>
      <article className="stat-card">
        <strong dir="ltr">{githubStats ? formatNumber(coffees) : "—"}</strong>
        <span>Research coffees</span>
        <em>{commits ? `${toNextCoffee} commits to the next coffee` : `1 coffee / ${coffeeRate} commits`}</em>
      </article>
      <article className="stat-card stat-card-wide">
        <strong className="stat-snapshot">
          {!githubStats
            ? "Waiting for data"
            : githubStats.snapshot === "last-known-good"
              ? "Last known snapshot"
              : formatDate(githubStats.generatedAt)}
        </strong>
        <span>GitHub activity</span>
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
          <div className="eyebrow">
            <span className="pulse-dot" />
            Distributed Systems Lab · IUST
          </div>
          <h1>Distributed by nature, at the kernel.</h1>
          <p className="hero-description">
            <strong>DSLab IUST</strong>
            {" "}
            is led by {LAB.director}. The lab engineers system software for distributed computing, wireless sensor-actor networks, cloud environments, and computer security — with special focus on distributed operating systems and high-performance computing.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#research">
              View research <Icon name="arrow-down-right" />
            </a>
            <a className="button button-soft" href={LAB.homepage} target="_blank" rel="noreferrer">
              Faculty page <Icon name="external-link" />
            </a>
          </div>
          <div className="micro-line">
            <span>Directed by <strong>{LAB.director}</strong></span>
            <span>{LAB.school}, IUST</span>
          </div>
        </div>
      </div>
      <StatsRibbon />
    </section>
  );
}
