import { BrandLogo } from "@/components/BrandLogo";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { memberPath } from "@/lib/members";
import { Link } from "@/lib/router";
import { PATHS } from "@/lib/site";

export function Footer() {
  const { orgHref, members } = useLab();
  const director = members.find((member) => member.leadership === "director");

  return (
    <footer className="site-footer">
      <div className="footer section-shell">
        <div className="footer-brand">
          <BrandLogo className="brand-logo footer-logo" on="dark" />
        </div>
        <address className="footer-contact">
          {LAB.address.map((line) => <span key={line}>{line}</span>)}
          <span>Postal code: {LAB.postalCode}</span>
        </address>
        <div className="footer-right">
          <Link to={PATHS.lab}>{LAB.fullName}</Link>
          <a href={LAB.universityUrl} target="_blank" rel="noreferrer">{LAB.universityShort}</a>
          <Link to={PATHS.research}>Research</Link>
          <Link to={PATHS.publications}>Publications</Link>
          <Link to={PATHS.people}>People</Link>
          {director ? <Link to={memberPath(director.name)}>{director.name}</Link> : null}
          <a href={`mailto:${LAB.email}`}>{LAB.email}</a>
          <span dir="ltr">Tel/Fax: {LAB.phone}</span>
          <a href={LAB.homepage} target="_blank" rel="noreferrer">Faculty page</a>
          <a href={orgHref} target="_blank" rel="noreferrer">GitHub</a>
          <span>© {new Date().getFullYear()} {LAB.name}</span>
        </div>
      </div>
    </footer>
  );
}
