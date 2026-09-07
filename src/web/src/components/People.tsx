import { useEffect, useRef } from "react";
import { AffiliationLine } from "@/components/AffiliationLine";
import { DegreeBadge } from "@/components/DegreeBadge";
import { Icon } from "@/components/icons";
import { MemberPhoto } from "@/components/MemberPhoto";
import { ProfileLinks } from "@/components/ProfileLinks";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { cardFooterLabel, memberBio, memberNowLine, memberPath, profileFor } from "@/lib/members";
import { Link, navigate } from "@/lib/router";
import { PATHS } from "@/lib/site";
import type { AlumniGroup, Member } from "@/types";

const ALUMNI_GROUPS: Array<{ id: AlumniGroup; heading: string; note: string }> = [
  { id: "phd", heading: "PhD students", note: "Completed doctoral theses." },
  { id: "master", heading: "Master students", note: "Completed master's theses." },
  { id: "undergraduate", heading: "Undergraduate students", note: "Completed undergraduate projects." },
];

function DirectorCard({ member }: { member: Member }) {
  const { githubStats } = useLab();
  const bio = memberBio(member, githubStats, "");
  const href = memberPath(member.name);
  const openProfile = () => navigate(href);

  return (
    <article
      className="director-card"
      tabIndex={0}
      role="link"
      aria-label={`Open profile for ${member.name}`}
      onClick={openProfile}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProfile();
        }
      }}
    >
      <MemberPhoto member={member} className="portrait" />
      <div className="director-info">
        <span className="member-role">Lab director</span>
        <h3>
          <Link to={href} onClick={(event) => event.stopPropagation()}>
            {member.name}
          </Link>
        </h3>
        <p>{bio}</p>
        <div className="focus-chips">
          {(member.focus || []).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <ProfileLinks member={member} className="profile-links" />
    </article>
  );
}

function AlumniCard({ member }: { member: Member }) {
  const { openMember } = useLab();
  const footerLabel = cardFooterLabel(member);

  return (
    <article
      className="member-card alumni-card"
      tabIndex={0}
      role="button"
      aria-label={`Open profile for ${member.name}`}
      onClick={() => openMember(member)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMember(member);
        }
      }}
    >
      <div className="member-inner">
        <div className="member-head">
          <MemberPhoto member={member} />
          <div>
            <div className="member-name">
              <Link to={memberPath(member.name)} onClick={(event) => event.stopPropagation()}>
                {member.name}
              </Link>
            </div>
            <div className="member-title">{member.role}</div>
            <AffiliationLine member={member} />
          </div>
        </div>
        {member.thesis ? (
          <p className="member-card-thesis">{member.thesis}</p>
        ) : null}
        <div className="member-tags">
          {(member.focus || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="member-footer">
          <div className="member-footer-left">
            <small>{footerLabel}</small>
            <DegreeBadge member={member} />
          </div>
          <ProfileLinks member={member} mini />
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member, isLead = false }: { member: Member; isLead?: boolean }) {
  const { openMember } = useLab();
  const footerLabel = cardFooterLabel(member);

  return (
    <article
      className={`member-card ${isLead ? "lead" : ""}`}
      tabIndex={0}
      role="button"
      aria-label={`Open profile for ${member.name}`}
      onClick={() => openMember(member)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMember(member);
        }
      }}
    >
      {isLead ? <span className="lead-badge">Lead</span> : null}
      <div className="member-inner">
        <div className="member-head">
          <MemberPhoto member={member} />
          <div>
            <div className="member-name">
              <Link to={memberPath(member.name)} onClick={(event) => event.stopPropagation()}>
                {member.name}
              </Link>
            </div>
            <div className="member-title">{member.role}</div>
          </div>
        </div>
        {member.thesis ? (
          <p className="member-card-thesis">{member.thesis}</p>
        ) : null}
        <div className="member-tags">
          {(member.focus || []).slice(0, 1).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="member-footer">
          <div className="member-footer-left">
            <small>{footerLabel}</small>
            <DegreeBadge member={member} />
          </div>
          <ProfileLinks member={member} mini />
        </div>
      </div>
    </article>
  );
}

export function MemberModal() {
  const { selectedMember, closeMember, githubStats } = useLab();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (selectedMember && !node.open) node.showModal();
    if (!selectedMember && node.open) node.close();
  }, [selectedMember]);

  const member = selectedMember;
  const profile = profileFor(member, githubStats);
  const body = memberBio(member, githubStats);

  return (
    <dialog
      className="member-modal"
      ref={dialogRef}
      onClose={closeMember}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeMember();
      }}
    >
      <button className="modal-close" type="button" aria-label="Close" onClick={closeMember}>
        <Icon name="x" />
      </button>
      {member ? (
        <div className="modal-body">
          <div className="modal-profile">
            <MemberPhoto member={member} />
            <div>
              <span className="member-role">{member.role}</span>
              <h3>{member.name}</h3>
              <AffiliationLine member={member} />
              {member.years ? (
                <span className="t-mono" style={{ color: "var(--muted)" }}>{member.years}</span>
              ) : !memberNowLine(member) ? (
                <span className="t-mono" style={{ color: "var(--muted)" }}>
                  {profile.company || LAB.name}
                </span>
              ) : null}
            </div>
          </div>
          {member.thesis ? <p className="member-thesis">{member.thesis}</p> : null}
          <p>{body}</p>
          <div className="member-tags">
            {(member.focus || []).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <ProfileLinks member={member} labeled />
          <div className="modal-actions">
            <Link className="button button-primary" to={memberPath(member.name)} onClick={closeMember}>
              <Icon name="arrow-up-right" /> Full profile
            </Link>
            {member.homepage ? (
              <a className="button button-soft" target="_blank" rel="noreferrer" href={member.homepage}>
                <Icon name="globe" /> Faculty page
              </a>
            ) : null}
            {member.email ? (
              <a className="button button-soft" href={`mailto:${member.email}`}>
                <Icon name="mail" /> Email
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

export function People() {
  const { members } = useLab();
  const director = members.find((member) => member.leadership === "director");
  const leads = members.filter((member) => member.leadership === "lead");
  const regular = members.filter((member) => !["director", "lead", "researcher", "alumni"].includes(String(member.leadership)));
  const researchers = members.filter((member) => member.leadership === "researcher");
  const alumni = members.filter((member) => member.leadership === "alumni");

  return (
    <section className="people section-shell" id="people">
      <div className="section-heading enter">
        <div>
          <span className="section-kicker">People</span>
          <h2>The research group.</h2>
        </div>
        <p>
          Director, members and alumni of the {" "}
          <Link to={PATHS.lab}>{LAB.fullName}</Link>
          {" at "}
          <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.university}</a>
          . Open a card for a quick view, or follow a name to the dedicated profile.
        </p>
      </div>

      <div className="director-stage enter">
        {director ? <DirectorCard member={director} /> : null}
      </div>

      <div className="subheading-row enter">
        <h3>Core leads</h3>
        <span>Lab-wide research leadership.</span>
      </div>
      <div className="lead-grid enter">
        {leads.length
          ? leads.map((member) => <MemberCard key={member.name} member={member} isLead />)
          : <div className="panel">Add lead members in data/members.json</div>}
      </div>

      <div className="subheading-row enter">
        <h3>Members</h3>
        <span>Open a profile for focus areas and links.</span>
      </div>
      <div className="member-grid enter">
        {regular.length
          ? regular.map((member) => <MemberCard key={member.name} member={member} />)
          : <div className="panel">Add members in data/members.json</div>}
      </div>

      {researchers.length ? (
        <>
          <div className="subheading-row enter">
            <h3>Current members</h3>
            <span>As listed on the official DSLab page.</span>
          </div>
          <div className="member-grid enter">
            {researchers.map((member) => <MemberCard key={member.name} member={member} />)}
          </div>
        </>
      ) : null}

      {alumni.length ? (
        <>
          <div className="subheading-row enter">
            <h3>Alumni</h3>
            <span>PhD, master’s and undergraduate graduates.</span>
          </div>
          {ALUMNI_GROUPS.map((group) => {
            const groupMembers = alumni.filter((member) => member.alumniGroup === group.id);
            if (!groupMembers.length) return null;
            return (
              <div key={group.id} className="alumni-group">
                <div className="alumni-group-heading enter">
                  <h4>{group.heading}</h4>
                  <span>{group.note}</span>
                </div>
                <div className="member-grid enter">
                  {groupMembers.map((member) => <AlumniCard key={member.name} member={member} />)}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </section>
  );
}
