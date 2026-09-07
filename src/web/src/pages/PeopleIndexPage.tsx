import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks } from "@/components/EntityPage";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { memberPath } from "@/lib/members";
import { enterDelay } from "@/lib/motion";
import { Link } from "@/lib/router";
import { peopleIndexGraph } from "@/lib/schema";
import { PATHS, peopleIndexMeta } from "@/lib/site";
import type { Member } from "@/types";

function NameRow({ member, index }: { member: Member; index: number }) {
  return (
    <li className="enter" style={enterDelay(index, "dense")}>
      <Link to={memberPath(member.name)}>{member.name}</Link>
      <span>{member.role}</span>
    </li>
  );
}

export function PeopleIndexPage() {
  const { members } = useLab();
  const director = members.filter((member) => member.leadership === "director");
  const leads = members.filter((member) => member.leadership === "lead");
  const regular = members.filter((member) => !["director", "lead", "researcher", "alumni"].includes(String(member.leadership)));
  const researchers = members.filter((member) => member.leadership === "researcher");
  const alumni = members.filter((member) => member.leadership === "alumni");
  const meta = peopleIndexMeta();

  return (
    <>
      <Seo meta={meta} jsonLd={peopleIndexGraph(members)} />
      <Header />
      <main>
        <header className="entity-hero">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: "People" },
            ]} />
            <span className="eyebrow"><span className="pulse-dot" /> {members.length} named people</span>
            <h1>People of {LAB.name}</h1>
            <p className="entity-lead">
              Researchers, students and alumni of the {" "}
              <Link to={PATHS.lab}>{LAB.fullName}</Link>
              {" at "}
              <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>
              {", directed by "}
              {director[0]
                ? <Link to={memberPath(director[0].name)}>{director[0].name}</Link>
                : LAB.director}
              . Each name has its own profile page.
            </p>
          </div>
        </header>

        <div className="section-shell entity-body">
          {director.length ? (
            <section>
              <h2 className="enter">Director</h2>
              <ul className="entity-name-list">{director.map((member, index) => <NameRow key={member.name} member={member} index={index} />)}</ul>
            </section>
          ) : null}
          {leads.length ? (
            <section>
              <h2 className="enter">Core leads</h2>
              <ul className="entity-name-list">{leads.map((member, index) => <NameRow key={member.name} member={member} index={index} />)}</ul>
            </section>
          ) : null}
          {regular.length ? (
            <section>
              <h2 className="enter">Members</h2>
              <ul className="entity-name-list">{regular.map((member, index) => <NameRow key={member.name} member={member} index={index} />)}</ul>
            </section>
          ) : null}
          {researchers.length ? (
            <section>
              <h2 className="enter">Current researchers</h2>
              <ul className="entity-name-list">{researchers.map((member, index) => <NameRow key={member.name} member={member} index={index} />)}</ul>
            </section>
          ) : null}
          {alumni.length ? (
            <section>
              <h2 className="enter">Alumni</h2>
              <ul className="entity-name-list">{alumni.map((member, index) => <NameRow key={member.name} member={member} index={index} />)}</ul>
            </section>
          ) : null}
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
