import { DegreeBadge } from "@/components/DegreeBadge";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { MemberPhoto } from "@/components/MemberPhoto";
import { ProfileLinks } from "@/components/ProfileLinks";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, EntityLinks, FaqList } from "@/components/EntityPage";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { findMemberBySlug, memberBio, profileFor } from "@/lib/members";
import { Link } from "@/lib/router";
import { memberFaqs, memberGraph } from "@/lib/schema";
import { PATHS, memberAffiliation, memberAnswer, memberMeta } from "@/lib/site";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function MemberPage({ slug }: { slug: string }) {
  const { members, githubStats, loading } = useLab();
  const member = findMemberBySlug(members, slug);

  if (!loading && members.length && !member) {
    return <NotFoundPage />;
  }

  if (!member) {
    return (
      <>
        <Header />
        <main className="section-shell entity-body">
          <p className="entity-lead">Loading profile…</p>
        </main>
        <Footer />
      </>
    );
  }

  const profile = profileFor(member, githubStats);
  const body = memberBio(member, githubStats);
  const meta = memberMeta(member);

  return (
    <>
      <Seo meta={meta} jsonLd={memberGraph(member, members)} />
      <Header />
      <main>
        <header className="entity-hero chrome-band">
          <div className="section-shell">
            <Breadcrumbs items={[
              { label: LAB.name, href: PATHS.home },
              { label: "People", href: PATHS.people },
              { label: member.name },
            ]} />
            <div className="member-page-hero">
              <MemberPhoto member={member} className="member-page-photo" />
              <div>
                <span className="eyebrow">
                  <span className="pulse-dot" />
                  {member.role}
                </span>
                <h1>{member.name}</h1>
                <p className="entity-lead">{memberAnswer(member)}</p>
                <div className="member-page-meta">
                  <DegreeBadge member={member} />
                  <span>{memberAffiliation(member)}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="section-shell entity-body">
          <dl className="entity-facts">
            <div>
              <dt>Laboratory</dt>
              <dd><Link to={PATHS.lab}>{LAB.fullName} ({LAB.name})</Link></dd>
            </div>
            <div>
              <dt>University</dt>
              <dd><Link to={PATHS.university}>{LAB.university}</Link></dd>
            </div>
            {member.years ? (
              <div>
                <dt>Years</dt>
                <dd dir="ltr">{member.years}</dd>
              </div>
            ) : null}
            {member.thesis ? (
              <div>
                <dt>Thesis</dt>
                <dd>{member.thesis}</dd>
              </div>
            ) : null}
            {profile.company ? (
              <div>
                <dt>Affiliation note</dt>
                <dd>{profile.company}</dd>
              </div>
            ) : null}
          </dl>

          <section>
            <h2>About {member.name}</h2>
            <p>{body}</p>
            {(member.focus || []).length ? (
              <div className="focus-chips">
                {(member.focus || []).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
          </section>

          <ProfileLinks member={member} className="profile-links member-page-links" />

          <div className="entity-actions">
            {member.homepage ? (
              <a className="button button-primary" target="_blank" rel="noreferrer" href={member.homepage}>
                <Icon name="globe" /> Faculty page
              </a>
            ) : null}
            {member.email ? (
              <a className={member.homepage ? "button button-soft" : "button button-primary"} href={`mailto:${member.email}`}>
                <Icon name="mail" /> Email
              </a>
            ) : null}
            <Link className="button button-soft" to={PATHS.people}>
              All people <Icon name="users" />
            </Link>
          </div>

          <FaqList items={memberFaqs(member)} />
          <EntityLinks />
        </div>
      </main>
      <Footer />
    </>
  );
}
