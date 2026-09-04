import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Seo } from "@/components/Seo";
import { EntityLinks } from "@/components/EntityPage";
import { LAB } from "@/config";
import { Link } from "@/lib/router";
import { PATHS, notFoundMeta } from "@/lib/site";

export function NotFoundPage() {
  return (
    <>
      <Seo meta={notFoundMeta()} jsonLd={{ "@context": "https://schema.org", "@type": "WebPage", name: "Not found" }} />
      <Header />
      <main className="section-shell entity-body">
        <span className="section-kicker">404</span>
        <h1>This path is not in {LAB.name}.</h1>
        <p className="entity-lead">The lab, university and people pages are listed below.</p>
        <div className="entity-actions">
          <Link className="button button-primary" to={PATHS.home}>Home</Link>
          <Link className="button button-soft" to={PATHS.people}>People</Link>
        </div>
        <EntityLinks />
      </main>
      <Footer />
    </>
  );
}
