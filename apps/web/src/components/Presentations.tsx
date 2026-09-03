import { GoogleMeetIcon, Icon } from "@/components/icons";
import { MemberPhoto } from "@/components/MemberPhoto";
import { useLab } from "@/context/LabContext";
import { safeUrl } from "@/lib/format";
import { resolveMember } from "@/lib/members";
import type { Member } from "@/types";

function Speaker({ member, fallbackName }: { member: Member | null; fallbackName?: string }) {
  const { openMember } = useLab();
  const display = member ?? {
    name: fallbackName || "Add member name",
    role: "Member not found",
    photo: "",
  };

  return (
    <button
      className="presentation-speaker"
      type="button"
      disabled={!member}
      onClick={() => member && openMember(member)}
    >
      <span className="presentation-speaker-copy">
        <strong>{display.name}</strong>
        <small>{display.role || "DSLab IUST"}</small>
      </span>
      <MemberPhoto member={display} className="presentation-avatar" />
      {member ? <Icon name="arrow-up-right" /> : null}
    </button>
  );
}

function Meta({ icon, label, value, fallback, mono = false }: {
  icon: string;
  label: string;
  value?: string;
  fallback: string;
  mono?: boolean;
}) {
  return (
    <div className="presentation-meta-item">
      <span className="presentation-meta-icon"><Icon name={icon} /></span>
      <span>
        <small>{label}</small>
        <strong dir={mono ? "ltr" : undefined} className={mono ? "t-mono" : undefined}>
          {value || fallback}
        </strong>
      </span>
    </div>
  );
}

export function Presentations() {
  const { members, presentations, loading } = useLab();
  const items = presentations.presentations ?? [];

  return (
    <section className="presentations section-shell" id="presentations">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Talks</span>
          <h2>Upcoming lab presentations.</h2>
        </div>
        <p>People, ideas and conversations shaping what DSLab builds next. Upcoming talks will appear here when scheduled.</p>
      </div>
      <div className="presentation-list">
        {loading ? (
          <>
            <div className="presentation-loading-card" />
            <div className="presentation-loading-card" />
          </>
        ) : items.length ? items.map((item, index) => {
          const member = resolveMember(members, item.member);
          if (!member) {
            console.warn(`[DSLab] Presentation member "${item.member || ""}" was not found in data/members.json.`);
          }
          const href = safeUrl(item.link);

          return (
            <article
              key={`${item.member}-${item.title}-${index}`}
              className="presentation-card"
            >
              <span className="presentation-card-number" dir="ltr">{String(index + 1).padStart(2, "0")}</span>
              <div className="presentation-card-body">
                <div className="presentation-card-topline">
                  <span>Lab presentation</span>
                  <span>{item.series || "Next session"}</span>
                </div>
                <div className="presentation-card-grid">
                  <div className="presentation-topic">
                    <small>Title</small>
                    <h3>{item.title || "Add the presentation title"}</h3>
                  </div>
                  <Speaker member={member} fallbackName={item.member} />
                  <div className="presentation-schedule">
                    <Meta icon="calendar-days" label="Date" value={item.date} fallback="Add date" mono />
                    <Meta icon="clock-3" label="Time" value={item.time} fallback="Add time" mono />
                    <Meta icon="map-pin" label="Location" value={item.location} fallback="DSLab IUST / Online" />
                  </div>
                  <div className="presentation-action">
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        <GoogleMeetIcon />
                        <span>{item.linkLabel || "Join on Meet"}</span>
                      </a>
                    ) : (
                      <span className="presentation-link-pending">
                        <GoogleMeetIcon />
                        <span>Meet link soon</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        }) : (
          <article className="empty-work-card presentation-empty">
            <Icon name="presentation" />
            <div>
              <strong>Add next week's presentations</strong>
              <span>Edit <code>data/presentations.json</code>; member details and photos are matched automatically.</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
