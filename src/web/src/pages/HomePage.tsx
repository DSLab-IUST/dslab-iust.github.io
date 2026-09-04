import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { People } from "@/components/People";
import { Presentations } from "@/components/Presentations";
import { Research } from "@/components/Research";
import { Seo } from "@/components/Seo";
import { FaqList } from "@/components/EntityPage";
import { NowBuilding, Projects } from "@/components/Work";
import { useLab } from "@/context/LabContext";
import { homeFaqs, homeGraph } from "@/lib/schema";
import { homeMeta } from "@/lib/site";

export function HomePage() {
  const { members } = useLab();
  const meta = homeMeta();

  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, []);

  return (
    <>
      <Seo meta={meta} jsonLd={homeGraph(members)} />
      <Header />
      <div className="chrome-band">
        <Hero />
      </div>
      <main>
        <Research />
        <People />
        <NowBuilding />
        <Presentations />
        <Projects />
        <Manifesto />
        <section className="section-shell entity-home-faq">
          <FaqList items={homeFaqs()} />
        </section>
      </main>
      <Footer />
    </>
  );
}
