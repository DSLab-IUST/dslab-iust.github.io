import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks } from "@/components/EntityPage";
import { Projects } from "@/components/Work";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { publicationsGraph } from "@/lib/schema";
import { PATHS, publicationsMeta } from "@/lib/site";

export function PublicationsPage() {
  const { members, labWork } = useLab();
  const meta = publicationsMeta();
  const projects = labWork.projects ?? [];

  return (
    <>
      <Seo meta={meta} jsonLd={publicationsGraph(members, projects)} />
      <Header />
      <main>
        <header className="entity-hero">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: "Publications" },
            ]} />
            <span className="eyebrow"><span className="pulse-dot" /> Papers · {LAB.universityShort}</span>
            <h1>Publications</h1>
            <p className="entity-lead">
              Selected journal and conference papers from the {LAB.fullName}, with DOIs when they are available.
            </p>
          </div>
        </header>
        <Projects />
        <div className="section-shell entity-body">
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
