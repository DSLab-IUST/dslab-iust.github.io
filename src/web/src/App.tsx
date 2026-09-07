import { MemberModal } from "@/components/People";
import { LabProvider } from "@/context/LabContext";
import { useEnterOnScroll } from "@/hooks/useEnterOnScroll";
import { Router, useRoute } from "@/lib/router";
import { HomePage } from "@/pages/HomePage";
import { LabPage } from "@/pages/LabPage";
import { MemberPage } from "@/pages/MemberPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PeopleIndexPage } from "@/pages/PeopleIndexPage";
import { PublicationsPage } from "@/pages/PublicationsPage";
import { ResearchPage } from "@/pages/ResearchPage";

function Routes() {
  const { route } = useRoute();

  if (route.name === "lab") return <LabPage />;
  if (route.name === "research") return <ResearchPage />;
  if (route.name === "publications") return <PublicationsPage />;
  if (route.name === "people") return <PeopleIndexPage />;
  if (route.name === "member") return <MemberPage slug={route.slug} />;
  if (route.name === "notfound") return <NotFoundPage />;
  return <HomePage />;
}

function AppShell() {
  useEnterOnScroll();

  return (
    <>
      <Routes />
      <MemberModal />
    </>
  );
}

export default function App() {
  return (
    <LabProvider>
      <Router>
        <AppShell />
      </Router>
    </LabProvider>
  );
}
