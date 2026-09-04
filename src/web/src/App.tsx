import { MemberModal } from "@/components/People";
import { LabProvider } from "@/context/LabContext";
import { Router, useRoute } from "@/lib/router";
import { HomePage } from "@/pages/HomePage";
import { LabPage } from "@/pages/LabPage";
import { MemberPage } from "@/pages/MemberPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PeopleIndexPage } from "@/pages/PeopleIndexPage";
import { UniversityPage } from "@/pages/UniversityPage";

function Routes() {
  const { route } = useRoute();

  if (route.name === "lab") return <LabPage />;
  if (route.name === "university") return <UniversityPage />;
  if (route.name === "people") return <PeopleIndexPage />;
  if (route.name === "member") return <MemberPage slug={route.slug} />;
  if (route.name === "notfound") return <NotFoundPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <LabProvider>
      <Router>
        <Routes />
        <MemberModal />
      </Router>
    </LabProvider>
  );
}
