import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Research } from "@/components/Research";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks } from "@/components/EntityPage";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { researchGraph } from "@/lib/schema";
import { PATHS, researchMeta } from "@/lib/site";

export function ResearchPage() {
  const { members } = useLab();
  const meta = researchMeta();

  return (
    <>
      <Seo meta={meta} jsonLd={researchGraph(members)} />
      <Header />
      <main>
        <header className="entity-hero">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: "Research" },
            ]} />
            <span className="eyebrow"><span className="pulse-dot" /> Research areas · {LAB.universityShort}</span>
            <h1>Research</h1>
            <p className="entity-lead">
              Six connected problem spaces at the {LAB.fullName}. All areas are pursued as distributed systems work.
            </p>
          </div>
        </header>
        <Research />
        <div className="section-shell entity-body">
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
