import { useEffect, useRef } from "react";
import { DegreeBadge } from "@/components/DegreeBadge";
import { Icon } from "@/components/icons";
import { MemberPhoto } from "@/components/MemberPhoto";
import { ProfileLinks } from "@/components/ProfileLinks";
import { useLab } from "@/context/LabContext";
import { cardFooterLabel, memberBio, profileFor } from "@/lib/members";
import type { AlumniGroup, Member } from "@/types";

const ALUMNI_GROUPS: Array<{ id: AlumniGroup; heading: string; note: string }> = [
  { id: "phd", heading: "PhD students", note: "Completed doctoral theses." },
  { id: "master", heading: "Master students", note: "Completed master's theses." },
  { id: "undergraduate", heading: "Undergraduate students", note: "Completed undergraduate projects." },
];

function DirectorCard({ member }: { member: Member }) {
  const { githubStats } = useLab();
  const bio = memberBio(member, githubStats, "");

  return (
    <article className="director-card">
      <MemberPhoto member={member} className="portrait" />
      <div className="director-info">
        <span className="member-role">Lab director</span>
        <h3>{member.name}</h3>
        <p>{bio}</p>
        <div className="focus-chips">
          {(member.focus || []).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <ProfileLinks member={member} className="profile-links" />
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
            <div className="member-name">{member.name}</div>
            <div className="member-title">{member.role}</div>
          </div>
        </div>
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

function RosterRow({ member }: { member: Member }) {
  const { openMember } = useLab();
  const detail = member.thesis || member.bio;

  return (
    <article
      className="roster-row"
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
      <div className="roster-identity">
        <strong>{member.name}</strong>
        <span>{member.role}</span>
      </div>
      <p>{detail}</p>
      <div className="roster-meta">
        <span dir="ltr">{member.years || member.cardFooter}</span>
        {(member.focus || []).slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
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
              <span className="t-mono" style={{ color: "var(--muted)" }}>
                {member.years || profile.company || "DSLab IUST"}
              </span>
            </div>
          </div>
          {member.thesis ? <p className="member-thesis">{member.thesis}</p> : null}
          <p>{body}</p>
          <div className="member-tags">
            {(member.focus || []).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="modal-actions">
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
            {member.github ? (
              <a className="button button-soft" target="_blank" rel="noreferrer" href={`https://github.com/${encodeURIComponent(member.github)}`}>
                <Icon name="github" /> GitHub
              </a>
            ) : null}
            {member.scholar ? (
              <a className="button button-soft" target="_blank" rel="noreferrer" href={member.scholar}>
                <Icon name="scholar" /> Scholar
              </a>
            ) : null}
            {member.linkedin ? (
              <a className="button button-soft" target="_blank" rel="noreferrer" href={member.linkedin}>
                <Icon name="linkedin" /> LinkedIn
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
      <div className="section-heading">
        <div>
          <span className="section-kicker">People</span>
          <h2>The research group.</h2>
        </div>
        <p>Director, current members and alumni of the Distributed Systems Lab at Iran University of Science and Technology.</p>
      </div>

      <div className="director-stage">
        {director ? <DirectorCard member={director} /> : null}
      </div>

      <div className="subheading-row">
        <h3>Core leads</h3>
        <span>Lab-wide research leadership.</span>
      </div>
      <div className="lead-grid">
        {leads.length
          ? leads.map((member) => <MemberCard key={member.name} member={member} isLead />)
          : <div className="panel">Add lead members in data/members.json</div>}
      </div>

      <div className="subheading-row">
        <h3>Members</h3>
        <span>Open a profile for focus areas and links.</span>
      </div>
      <div className="member-grid">
        {regular.length
          ? regular.map((member) => <MemberCard key={member.name} member={member} />)
          : <div className="panel">Add members in data/members.json</div>}
      </div>

      {researchers.length ? (
        <>
          <div className="subheading-row">
            <h3>Current members</h3>
            <span>As listed on the official DSLab page.</span>
          </div>
          <div className="roster-list">
            {researchers.map((member) => <RosterRow key={member.name} member={member} />)}
          </div>
        </>
      ) : null}

      {alumni.length ? (
        <>
          <div className="subheading-row">
            <h3>Alumni</h3>
            <span>PhD, master’s and undergraduate graduates.</span>
          </div>
          {ALUMNI_GROUPS.map((group) => {
            const groupMembers = alumni.filter((member) => member.alumniGroup === group.id);
            if (!groupMembers.length) return null;
            return (
              <div key={group.id} className="alumni-group">
                <div className="alumni-group-heading">
                  <h4>{group.heading}</h4>
                  <span>{group.note}</span>
                </div>
                <div className="roster-list">
                  {groupMembers.map((member) => <RosterRow key={member.name} member={member} />)}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </section>
  );
}
