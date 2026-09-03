import { Icon } from "@/components/icons";
import { useLab } from "@/context/LabContext";
import { useTheme } from "@/hooks/useTheme";

const NAV = [
  { href: "#research", label: "Research" },
  { href: "#people", label: "People" },
  { href: "#activity", label: "Activity" },
  { href: "#presentations", label: "Presentations" },
  { href: "#projects", label: "Publications" },
];

export function Header() {
  const { orgHref } = useLab();
  const { isLight, toggleTheme } = useTheme();

  return (
    <header className="site-header" id="top">
      <div className="site-header-inner">
        <a className="brand" href="#top" aria-label="DSLab IUST home">
          <span className="brand-mark">DS</span>
          <span className="brand-copy">
            <strong>DSLab IUST</strong>
            <small>Distributed systems research</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            aria-pressed={isLight}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-icons" aria-hidden="true">
              <Icon name="sun" className="theme-icon theme-icon-sun" />
              <Icon name="moon" className="theme-icon theme-icon-moon" />
            </span>
            <span className="theme-toggle-label">{isLight ? "Dark" : "Light"}</span>
          </button>
          <a className="button button-ghost" href={orgHref} target="_blank" rel="noreferrer">
            <Icon name="github" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
