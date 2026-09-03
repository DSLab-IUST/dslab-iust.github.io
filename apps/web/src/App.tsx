import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { MemberModal, People } from "@/components/People";
import { Presentations } from "@/components/Presentations";
import { Research } from "@/components/Research";
import { NowBuilding, Projects } from "@/components/Work";
import { LabProvider } from "@/context/LabContext";

function Shell() {
  return (
    <>
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
      </main>
      <Footer />
      <MemberModal />
    </>
  );
}

export default function App() {
  return (
    <LabProvider>
      <Shell />
    </LabProvider>
  );
}
