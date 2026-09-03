import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";

export function Footer() {
  const { orgHref } = useLab();

  return (
    <footer className="site-footer">
      <div className="footer section-shell">
        <div className="footer-brand">
          <span className="brand-mark">DS</span>
          <div className="brand-copy">
            <strong>{LAB.name}</strong>
            <small>{LAB.fullName}, IUST</small>
          </div>
        </div>
        <address className="footer-contact">
          {LAB.address.map((line) => <span key={line}>{line}</span>)}
          <span>Postal code: {LAB.postalCode}</span>
        </address>
        <div className="footer-right">
          <a href={`mailto:${LAB.email}`}>{LAB.email}</a>
          <span dir="ltr">Tel/Fax: {LAB.phone}</span>
          <span>Directed by {LAB.director}</span>
          <a href={LAB.homepage} target="_blank" rel="noreferrer">Faculty page</a>
          <a href={orgHref} target="_blank" rel="noreferrer">GitHub</a>
          <span>© {new Date().getFullYear()} {LAB.name}</span>
        </div>
      </div>
    </footer>
  );
}
